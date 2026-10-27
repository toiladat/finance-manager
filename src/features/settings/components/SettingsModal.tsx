import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Download, Upload, RotateCcw, Camera, User, Tag, HardDrive } from 'lucide-react';
import type { Category, UserProfile, Transaction } from '../../../types';
import { compressImageToWebP } from '../../../services/db';
import { CategoryListItem } from './CategoryListItem';

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
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#0A84FF');
  const [newCatBudget, setNewCatBudget] = useState('');
  const [activeTab, setActiveTab] = useState<'categories' | 'profile' | 'backup'>('categories');

  // Profile edit state
  const [editName, setEditName] = useState(userProfile.name);
  const [editAvatar, setEditAvatar] = useState(userProfile.avatarUrl);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const currentMonthKey = new Date().toISOString().slice(0, 7);
  const categorySpentMap = React.useMemo(() => {
    const map = new Map<string, number>();
    transactions
      .filter((t) => t.date.startsWith(currentMonthKey) && t.type === 'EXPENSE')
      .forEach((t) => {
        const k = t.categoryId || 'unknown';
        map.set(k, (map.get(k) || 0) + t.amount);
      });
    return map;
  }, [transactions, currentMonthKey]);

  if (!isOpen) return null;

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const parsedBudget = parseInt(newCatBudget.replace(/\D/g, '') || '0', 10);
    await onAddCategory({
      name: newCatName.trim(),
      type: 'EXPENSE',
      icon: 'Tag',
      color: newCatColor,
      monthlyBudget: parsedBudget > 0 ? parsedBudget : undefined,
    });
    setNewCatName('');
    setNewCatBudget('');
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImageToWebP(file, 400, 0.85);
        setEditAvatar(compressedBase64);
      } catch (err) {
        console.error('Lỗi nén ảnh avatar:', err);
      }
    }
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) return;
    onUpdateProfile({
      name: editName.trim(),
      avatarUrl: editAvatar,
    });
    onClose();
  };

  const PRESET_COLORS = ['#FF453A', '#FF9F0A', '#FFD60A', '#34C759', '#0A84FF', '#BF5AF2', '#AF52DE'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-[#16161C] border border-white/10 rounded-squircle-xl p-5 flex flex-col gap-4 z-10 max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <span className="text-[16px] font-bold text-white tracking-tight">Cài Đặt</span>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3-Tab Segmented Switcher */}
          <div className="flex p-1 bg-black/40 rounded-full border border-white/10">
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 py-1.5 rounded-full text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'categories'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Danh mục</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-1.5 rounded-full text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'profile'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Cá nhân</span>
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`flex-1 py-1.5 rounded-full text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'backup'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Dữ liệu</span>
            </button>
          </div>

          <div className="overflow-y-auto no-scrollbar space-y-4">
            {/* TAB 1: DANH MỤC */}
            {activeTab === 'categories' && (
              <>
                {/* Form thêm danh mục tinh gọn có hạn mức */}
                <form onSubmit={handleCreateCategory} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Tên danh mục..."
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="flex-1 min-w-0 bg-black/40 px-3.5 py-2 rounded-full text-[13px] text-white border border-white/10 outline-none placeholder:text-white/30 focus:border-white/25"
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Hạn mức/tháng..."
                      value={newCatBudget ? new Intl.NumberFormat('vi-VN').format(parseInt(newCatBudget.replace(/\D/g, '') || '0', 10)) + '₫' : ''}
                      onChange={(e) => setNewCatBudget(e.target.value.replace(/\D/g, ''))}
                      className="w-[125px] bg-black/40 px-3 py-2 rounded-full text-[12px] text-white border border-white/10 outline-none placeholder:text-white/30 focus:border-white/25 tabular-nums"
                    />
                    <button
                      type="submit"
                      disabled={!newCatName.trim()}
                      className="px-3.5 py-2 rounded-full bg-ios-blue text-white text-[12px] font-semibold flex items-center justify-center shadow-sm disabled:opacity-40 hover:bg-ios-blue/90 transition-all flex-shrink-0"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Preset budget pills & Preset colors */}
                  <div className="flex items-center justify-between gap-1 pt-0.5 text-[11px]">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      <span className="text-white/35 text-[10px]">Hạn mức:</span>
                      {['1000000', '2000000', '5000000'].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setNewCatBudget(amt)}
                          className="px-2 py-0.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white transition-colors text-[10px]"
                        >
                          {amt === '1000000' ? '1M' : amt === '2000000' ? '2M' : '5M'}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setNewCatColor(c)}
                          className={`w-4 h-4 rounded-full border-2 transition-transform ${
                            newCatColor === c ? 'scale-125 border-white shadow-sm' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </form>

                {/* Danh sách danh mục với thanh đo tiến độ hạn mức */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1 pb-0.5">
                    <span className="text-[12px] font-medium text-white/50">
                      Danh sách ({categories.length})
                    </span>
                  </div>
                  {categories.map((cat) => (
                    <CategoryListItem
                      key={cat.id}
                      category={cat}
                      monthSpent={categorySpentMap.get(cat.id) || 0}
                      onDelete={onDeleteCategory}
                      onUpdateCategory={onUpdateCategory}
                    />
                  ))}
                </div>
              </>
            )}

            {/* TAB 2: CÁ NHÂN (Sửa tên & Up ảnh cá nhân) */}
            {activeTab === 'profile' && (
              <div className="py-2 flex flex-col items-center space-y-4">
                {/* Avatar with Camera Trigger */}
                <div
                  className="relative group cursor-pointer"
                  onClick={() => avatarInputRef.current?.click()}
                  title="Chạm để đổi ảnh đại diện"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 p-0.5 bg-black/40 shadow-xl">
                    <img src={editAvatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-ios-blue text-white border-2 border-[#16161C] flex items-center justify-center shadow-lg">
                    <Camera className="w-4 h-4 stroke-[2]" />
                  </div>
                </div>

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />

                {/* Sửa tên hiển thị - Không viền, không label */}
                <div className="w-full pt-1 pb-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nhập tên của bạn"
                    className="w-full bg-transparent text-center text-[19px] font-bold text-white outline-none placeholder:text-white/30"
                  />
                </div>

                {/* Nút lưu thay đổi - Lưu & thoát ra trang chủ luôn */}
                <button
                  onClick={handleSaveProfile}
                  className="w-full py-3.5 rounded-full bg-white text-black font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg hover:bg-white/95 active:scale-98 transition-all"
                >
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            )}

            {/* TAB 3: DỮ LIỆU */}
            {activeTab === 'backup' && (
              <div className="space-y-3">
                {/* Export */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                  <span className="text-[13px] font-semibold text-white block">
                    Sao lưu dữ liệu
                  </span>
                  <button
                    onClick={onExportData}
                    className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-[13px] font-semibold flex items-center justify-center gap-2 border border-white/10 mt-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải file sao lưu (.json)</span>
                  </button>
                </div>

                {/* Import */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                  <span className="text-[13px] font-semibold text-white block">
                    Khôi phục dữ liệu
                  </span>
                  <label className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-[13px] font-semibold flex items-center justify-center gap-2 border border-white/10 mt-2 cursor-pointer transition-all">
                    <Upload className="w-4 h-4" />
                    <span>Chọn file khôi phục</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={onImportData}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Reset to clean start */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-ios-red">
                    <Trash2 className="w-4 h-4" />
                    <span className="text-[13px] font-semibold">Xóa sạch toàn bộ dữ liệu</span>
                  </div>
                  <p className="text-[12px] text-white/50 leading-relaxed">
                    Xóa toàn bộ các khoản chi tiêu và ảnh đã ghi để bắt đầu một cuốn nhật ký mới tinh 100%.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu để bắt đầu sổ mới?')) {
                        onResetSampleData();
                        onClose();
                      }
                    }}
                    className="w-full py-2.5 rounded-full bg-ios-red/15 text-ios-red text-[13px] font-semibold flex items-center justify-center gap-2 border border-ios-red/30 mt-2 hover:bg-ios-red/25 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Xóa sạch & Bắt đầu lại từ đầu</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
