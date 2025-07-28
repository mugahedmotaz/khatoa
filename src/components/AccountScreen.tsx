import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Bell, 
  Palette, 
  Crown,
  Edit3,
  Save,
  X,
  Camera,
  LogOut,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/utils/authService';
import { subscriptionManager } from '@/utils/subscriptionManager';
import { User as UserType, ChangePasswordData } from '@/types/auth';

interface AccountScreenProps {
  onBack: () => void;
  onLogout: () => void;
  onUpgrade: () => void;
  onNavigate: (screen: string) => void;
  onUpdateUser?: (user: UserType) => void;
}

const AccountScreen: React.FC<AccountScreenProps> = ({
  onBack,
  onLogout,
  onUpgrade,
  onUpdateUser,
  onNavigate
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  // const [activeTab, setActiveTab] = useState('profile'); // لم نعد نحتاجها
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // بيانات التعديل
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    gender: ''
  });

  // تغيير كلمة المرور
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setEditData({
        name: currentUser.name,
        phone: currentUser.phone || '',
        dateOfBirth: currentUser.dateOfBirth || '',
        gender: currentUser.gender || ''
      });
    }
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.updateUser({
        ...user,
        name: editData.name,
        phone: editData.phone,
        dateOfBirth: editData.dateOfBirth,
        gender: editData.gender as 'male' | 'female'
      });

      if (response.success && response.user) {
        setUser(response.user);
        if (onUpdateUser) onUpdateUser(response.user);
        setSuccess('تم تحديث البيانات بنجاح');
        setIsEditing(false);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('حدث خطأ أثناء التحديث');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('جميع حقول كلمة المرور مطلوبة');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('كلمة المرور الجديدة غير متطابقة');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.changePassword(passwordData);
      
      if (response.success) {
        setSuccess('تم تغيير كلمة المرور بنجاح');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('حدث خطأ أثناء تغيير كلمة المرور');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      onLogout();
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
      onLogout(); // تسجيل الخروج حتى لو فشل الطلب
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* صورة الملف الشخصي */}
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>
          <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors">
            <Camera className="w-4 h-4 text-white" />
          </button>
        </div>
        <h2 className="text-xl font-bold text-white">{user?.name}</h2>
        <p className="text-blue-200">{user?.email}</p>
      </div>

      {/* معلومات الحساب */}
      <div className="bg-white/5 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">المعلومات الشخصية</h3>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="ghost"
            size="sm"
            className="text-blue-300 hover:text-white"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </Button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium">الاسم</label>
              <Input
                value={editData.name}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white/10 border-white/20 text-white mt-1"
              />
            </div>
            
            <div>
              <label className="text-white text-sm font-medium">رقم الهاتف</label>
              <Input
                value={editData.phone}
                onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-white/10 border-white/20 text-white mt-1"
                placeholder="اختياري"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium">تاريخ الميلاد</label>
              <Input
                type="date"
                value={editData.dateOfBirth}
                onChange={(e) => setEditData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                className="bg-white/10 border-white/20 text-white mt-1"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium">الجنس</label>
              <select
                value={editData.gender}
                onChange={(e) => setEditData(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full mt-1 bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2"
              >
                <option value="" className="bg-gray-800">اختر الجنس</option>
                <option value="male" className="bg-gray-800">ذكر</option>
                <option value="female" className="bg-gray-800">أنثى</option>
              </select>
            </div>

            <Button
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              حفظ التغييرات
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-3 space-x-reverse">
              <User className="w-5 h-5 text-blue-300" />
              <div>
                <p className="text-blue-200 text-sm">الاسم</p>
                <p className="text-white">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 space-x-reverse">
              <Mail className="w-5 h-5 text-blue-300" />
              <div>
                <p className="text-blue-200 text-sm">البريد الإلكتروني</p>
                <p className="text-white">{user?.email}</p>
                {user?.isEmailVerified ? (
                  <span className="text-green-400 text-xs">✓ محقق</span>
                ) : (
                  <span className="text-orange-400 text-xs">غير محقق</span>
                )}
              </div>
            </div>

            {user?.phone && (
              <div className="flex items-center space-x-3 space-x-reverse">
                <Phone className="w-5 h-5 text-blue-300" />
                <div>
                  <p className="text-blue-200 text-sm">رقم الهاتف</p>
                  <p className="text-white">{user.phone}</p>
                </div>
              </div>
            )}

            {user?.dateOfBirth && (
              <div className="flex items-center space-x-3 space-x-reverse">
                <Calendar className="w-5 h-5 text-blue-300" />
                <div>
                  <p className="text-blue-200 text-sm">تاريخ الميلاد</p>
                  <p className="text-white">{new Date(user.dateOfBirth).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* معلومات الاشتراك */}
      <div className="bg-white/5 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">حالة الاشتراك</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Crown className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-white font-medium">
                {user?.subscription.isActive ? user.subscription.planName : 'الخطة المجانية'}
              </p>
              <p className="text-blue-200 text-sm">
                {user?.subscription.isActive 
                  ? `ينتهي في ${user.subscription.endDate ? new Date(user.subscription.endDate).toLocaleDateString('ar-SA') : 'غير محدد'}`
                  : 'ترقية للحصول على ميزات إضافية'
                }
              </p>
            </div>
          </div>
          {!user?.subscription.isActive && (
            <Button
              onClick={onUpgrade}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              ترقية
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">الأمان وكلمة المرور</h3>

      {/* تغيير كلمة المرور */}
      <div className="bg-white/5 rounded-2xl p-6">
        <h4 className="text-white font-medium mb-4">تغيير كلمة المرور</h4>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium">كلمة المرور الحالية</label>
            <div className="relative mt-1">
              <Input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="bg-white/10 border-white/20 text-white pr-12"
                placeholder="أدخل كلمة المرور الحالية"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300"
              >
                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-white text-sm font-medium">كلمة المرور الجديدة</label>
            <div className="relative mt-1">
              <Input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="bg-white/10 border-white/20 text-white pr-12"
                placeholder="أدخل كلمة المرور الجديدة"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300"
              >
                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-white text-sm font-medium">تأكيد كلمة المرور الجديدة</label>
            <div className="relative mt-1">
              <Input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="bg-white/10 border-white/20 text-white pr-12"
                placeholder="أعد إدخال كلمة المرور الجديدة"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300"
              >
                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Shield className="w-4 h-4 mr-2" />
            تغيير كلمة المرور
          </Button>
        </form>
      </div>

      {/* معلومات الأمان */}
      <div className="bg-white/5 rounded-2xl p-6">
        <h4 className="text-white font-medium mb-4">معلومات الأمان</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-blue-200">التحقق من البريد الإلكتروني</span>
            <span className={user?.isEmailVerified ? 'text-green-400' : 'text-orange-400'}>
              {user?.isEmailVerified ? '✓ محقق' : 'غير محقق'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-200">آخر تسجيل دخول</span>
            <span className="text-white">
              {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('ar-SA') : 'غير معروف'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-200">تاريخ إنشاء الحساب</span>
            <span className="text-white">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : 'غير معروف'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">الإعدادات</h3>

      {/* الإشعارات */}
      <div className="bg-white/5 rounded-2xl p-6">
        <h4 className="text-white font-medium mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          الإشعارات
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-blue-200">إشعارات البريد الإلكتروني</span>
            <input
              type="checkbox"
              checked={user?.preferences.notifications.email}
              className="w-4 h-4 text-blue-600 rounded"
              readOnly
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-200">إشعارات العادات</span>
            <input
              type="checkbox"
              checked={user?.preferences.notifications.habits}
              className="w-4 h-4 text-blue-600 rounded"
              readOnly
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-200">إشعارات الإنجازات</span>
            <input
              type="checkbox"
              checked={user?.preferences.notifications.achievements}
              className="w-4 h-4 text-blue-600 rounded"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* المظهر */}
      <div className="bg-white/5 rounded-2xl p-6">
        <h4 className="text-white font-medium mb-4 flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          المظهر
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-blue-200">المظهر</span>
            <span className="text-white">{user?.preferences.theme === 'auto' ? 'تلقائي' : user?.preferences.theme === 'dark' ? 'داكن' : 'فاتح'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-200">اللغة</span>
            <span className="text-white">{user?.preferences.language === 'ar' ? 'العربية' : 'English'}</span>
          </div>
        </div>
      </div>

      {/* إجراءات خطيرة */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
        <h4 className="text-red-300 font-medium mb-4">إجراءات خطيرة</h4>
        <div className="space-y-3">
          <Button
            onClick={handleLogout}
            disabled={isLoading}
            variant="outline"
            className="w-full border-red-500/50 text-red-300 hover:bg-red-500/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            تسجيل الخروج
          </Button>
          
          <Button
            variant="outline"
            className="w-full border-red-500/50 text-red-300 hover:bg-red-500/20"
            disabled
          >
            <Trash2 className="w-4 h-4 mr-2" />
            حذف الحساب
          </Button>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* الهيدر */}
      <div className="gradient-primary text-primary-foreground p-6 rounded-b-3xl">
        <div className="flex items-center space-x-4 space-x-reverse mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold flex-1">إدارة الحساب</h1>
        </div>

        <div className="text-center">
          <div className="text-4xl mb-2">👤</div>
          <p className="opacity-90">إدارة معلوماتك الشخصية</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* رسائل النجاح والخطأ */}
        {success && (
          <div className="mb-4 bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-700">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-700">
            {error}
          </div>
        )}

        {/* معلومات الحساب */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 ml-2" />
              معلومات الحساب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* صورة الملف الشخصي */}
            <div className="flex flex-col items-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={editData.name}
                onChange={e => setEditData({ ...editData, name: e.target.value })}
                placeholder="الاسم الكامل"
                disabled={isLoading}
              />
              <Input
                value={editData.phone}
                onChange={e => setEditData({ ...editData, phone: e.target.value })}
                placeholder="رقم الجوال"
                disabled={isLoading}
              />
              <Input
                value={editData.dateOfBirth}
                onChange={e => setEditData({ ...editData, dateOfBirth: e.target.value })}
                placeholder="تاريخ الميلاد"
                type="date"
                disabled={isLoading}
              />
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={editData.gender}
                onChange={e => setEditData({ ...editData, gender: e.target.value })}
                disabled={isLoading}
              >
                <option value="">الجنس</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
            
            <Button
              onClick={handleSaveProfile}
              className="w-full"
              disabled={isLoading}
            >
              <Save className="w-4 h-4 ml-2" />
              حفظ التغييرات
            </Button>
          </CardContent>
        </Card>

        {/* تغيير كلمة المرور */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 ml-2" />
              تغيير كلمة المرور
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleChangePassword}>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="كلمة المرور الحالية"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswords(sp => ({ ...sp, current: !sp.current }))}
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="relative">
                  <Input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="كلمة المرور الجديدة"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswords(sp => ({ ...sp, new: !sp.new }))}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="relative">
                  <Input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="تأكيد كلمة المرور الجديدة"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswords(sp => ({ ...sp, confirm: !sp.confirm }))}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                <Save className="w-4 h-4 ml-2" />
                حفظ كلمة المرور
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* إعدادات الخصوصية */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 ml-2" />
              إعدادات الخصوصية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">إظهار الملف الشخصي للكل</span>
              <input 
                type="checkbox" 
                checked={user?.preferences?.privacy?.profileVisibility === 'public'} 
                readOnly 
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">عرض التقدم للآخرين</span>
              <input 
                type="checkbox" 
                checked={user?.preferences?.privacy?.showProgress} 
                readOnly 
                className="rounded"
              />
            </div>
          </CardContent>
        </Card>

        {/* تسجيل الخروج */}
        <Card className="shadow-card border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <LogOut className="w-5 h-5 ml-2" />
              تسجيل الخروج
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/70 mb-4">
              سيتم تسجيل خروجك من الحساب والعودة لشاشة تسجيل الدخول.
            </p>
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              variant="outline"
              className="w-full border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountScreen;
