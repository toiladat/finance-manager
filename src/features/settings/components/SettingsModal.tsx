import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Download, Upload, Camera, User, Tag, HardDrive } from 'lucide-react';
import type { Category, UserProfile, Transaction } from '../../../types';
import { compressImageToWebP } from '../../../services/db';
import { CategorySettingsTab } from './CategorySettingsTab';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  transactions?: Transaction[];
  onAddCategory: (cat: Omit<Category, 'id'>) => Promise<void>;
  onUpdateCategory?: (cat: Category) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onExportData: () => Promise<void>;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onResetSampleData: () => Promise<void>;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  categories,
  transactions = [],
  onAddCategory,
  onUpdateCategory = async () => {},
  onDeleteCategory,
  onExportData,
  onImportData,
  onResetSampleData,
  userProfile,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'profile' | 'backup'>('categories');
  const [editName, setEditName] = useState(userProfile.name);
  const [editAvatar, setEditAvatar] = useState(userProfile.avatarUrl);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedBase64 = await compressImageToWebP(file, 400, 0.85);
      setEditAvatar(compressedBase64);
    } catch (err) {
      console.error('Lỗi nén ảnh avatar:', err);
    }
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) return;
    onUpdateProfile({ name: editName.trim(), avatarUrl: editAvatar });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xl"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-[#121216] border border-white/[0.08] rounded-[28px] p-5 flex flex-col gap-4 z-10 max-h-[88vh] overflow-hidden"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.07]">
            <span className="text-[16px] font-bold text-white tracking-tight">Cài Đặt</span>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex p-1 bg-[#18181D] rounded-full border border-white/[0.07]">
            {[
              { id: 'categories' as const, label: 'Danh mục', icon: Tag },
              { id: 'profile' as const, label: 'Cá nhân', icon: User },
              { id: 'backup' as const, label: 'Dữ liệu', icon: HardDrive },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-1.5 rounded-full text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === tab.id ? 'bg-[#2C2C34] text-white' : 'text-[#8E8E93] hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="overflow-y-auto no-scrollbar space-y-4">
            {activeTab === 'categories' && (
              <CategorySettingsTab
                categories={categories}
                transactions={transactions}
                onAddCategory={onAddCategory}
                onUpdateCategory={onUpdateCategory}
                onDeleteCategory={onDeleteCategory}
              />
            )}

            {activeTab === 'profile' && (
              <div className="py-2 flex flex-col items-center space-y-4">
                <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 p-0.5 bg-black/40">
                    <img src={editAvatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#0A84FF] text-white border-2 border-[#121216] flex items-center justify-center">
                    <Camera className="w-4 h-4 stroke-[2]" />
                  </div>
                </div>
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nhập tên của bạn"
                  className="w-full bg-transparent text-center text-[19px] font-bold text-white outline-none placeholder:text-white/30 py-1"
                />
                <button
                  onClick={handleSaveProfile}
                  className="w-full py-3.5 rounded-full bg-white text-black font-bold text-[14px] flex items-center justify-center active:scale-96 transition-all"
                >
                  Lưu thay đổi
                </button>
              </div>
            )}

            {activeTab === 'backup' && (
              <div className="rounded-[20px] bg-[#18181D] border border-white/[0.07] overflow-hidden divide-y divide-white/[0.06]">
                <button
                  onClick={onExportData}
                  className="w-full px-4 py-3.5 text-left text-[14px] font-medium text-white flex items-center justify-between hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors"
                >
                  <span>Sao lưu dữ liệu</span>
                  <Download className="w-4 h-4 text-[#8E8E93]" />
                </button>

                <label className="w-full px-4 py-3.5 text-left text-[14px] font-medium text-white flex items-center justify-between hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors cursor-pointer">
                  <span>Khôi phục dữ liệu</span>
                  <Upload className="w-4 h-4 text-[#8E8E93]" />
                  <input type="file" accept=".json" onChange={onImportData} className="hidden" />
                </label>

                <button
                  onClick={() => {
                    if (confirm('Xóa toàn bộ dữ liệu?')) {
                      onResetSampleData();
                      onClose();
                    }
                  }}
                  className="w-full px-4 py-3.5 text-left text-[14px] font-medium text-[#FF453A] flex items-center justify-between hover:bg-[#FF453A]/[0.06] active:bg-[#FF453A]/[0.12] transition-colors cursor-pointer"
                >
                  <span>Xóa toàn bộ dữ liệu</span>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
