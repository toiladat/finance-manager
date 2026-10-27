import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Transaction, Category } from '../types';

interface LocketFinanceDB extends DBSchema {
  transactions: {
    key: string;
    value: Transaction;
    indexes: { 'by-date': string; 'by-type': string };
  };
  categories: {
    key: string;
    value: Category;
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'locket-finance-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<LocketFinanceDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<LocketFinanceDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Transactions store
        if (!db.objectStoreNames.contains('transactions')) {
          const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
          txStore.createIndex('by-date', 'date');
          txStore.createIndex('by-type', 'type');
        }
        // Categories store
        if (!db.objectStoreNames.contains('categories')) {
          db.createObjectStore('categories', { keyPath: 'id' });
        }
        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
}

// Client-side image compressor to WebP <= 150KB
export async function compressImageToWebP(file: File | Blob, maxWidth = 1080, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Try WebP first, fallback to jpeg
        let result = canvas.toDataURL('image/webp', quality);
        if (!result.startsWith('data:image/webp')) {
          result = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(result);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

// Transaction operations
export async function getAllTransactions(): Promise<Transaction[]> {
  const db = await getDB();
  return db.getAll('transactions');
}

export async function addTransaction(tx: Transaction): Promise<void> {
  const db = await getDB();
  await db.put('transactions', tx);
}

export async function deleteTransaction(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('transactions', id);
}

// Category operations
export async function getAllCategories(): Promise<Category[]> {
  const db = await getDB();
  return db.getAll('categories');
}

export async function saveCategory(cat: Category): Promise<void> {
  const db = await getDB();
  await db.put('categories', cat);
}

export async function deleteCategoryAndUnbind(categoryId: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['categories', 'transactions'], 'readwrite');
  
  // 1. Delete category
  await tx.objectStore('categories').delete(categoryId);

  // 2. Cascade unbind: update transactions to categoryId = null (Unknown)
  const txStore = tx.objectStore('transactions');
  const allTxs = await txStore.getAll();
  for (const item of allTxs) {
    if (item.categoryId === categoryId) {
      item.categoryId = null;
      await txStore.put(item);
    }
  }

  await tx.done;
}

// Backup & Restore
export async function exportAllData(): Promise<string> {
  const db = await getDB();
  const transactions = await db.getAll('transactions');
  const categories = await db.getAll('categories');
  const exportPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    transactions,
    categories,
  };
  return JSON.stringify(exportPayload);
}

export async function importAllData(jsonString: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonString);
    if (!data.transactions || !data.categories) return false;
    const db = await getDB();
    const tx = db.transaction(['transactions', 'categories'], 'readwrite');
    
    await tx.objectStore('transactions').clear();
    for (const item of data.transactions) {
      await tx.objectStore('transactions').put(item);
    }

    await tx.objectStore('categories').clear();
    for (const item of data.categories) {
      await tx.objectStore('categories').put(item);
    }

    await tx.done;
    return true;
  } catch (e) {
    console.error('Import failed', e);
    return false;
  }
}

export async function clearAllData(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['transactions', 'categories'], 'readwrite');
  await tx.objectStore('transactions').clear();
  await tx.objectStore('categories').clear();
  await tx.done;
}
