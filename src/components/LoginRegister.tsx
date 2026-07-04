/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, User, Lock, Mail, Phone, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import { User as UserType, UserRole } from '../types';

interface LoginRegisterProps {
  onLoginSuccess: (user: UserType) => void;
  registeredUsers: UserType[];
  onRegisterUser: (newUser: UserType & { password?: string }) => void;
}

export default function LoginRegister({ onLoginSuccess, registeredUsers, onRegisterUser }: LoginRegisterProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('teacher');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login Form States
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginUsername || !loginPassword) {
      setError('Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    // Check in local registered users (and back up hardcoded mock users)
    const normalizedUsername = loginUsername.trim().toLowerCase();
    
    // Find user
    const foundUser = registeredUsers.find(
      (u) => u.username.toLowerCase() === normalizedUsername
    );

    if (!foundUser) {
      setError('Tên đăng nhập không tồn tại.');
      return;
    }

    // Verify password (for simplicity of mock local state, we check if matching or password is '123456')
    // In our system, newly registered users store their passwords in local storage alongside, or we assume a standard check.
    const storedPasswordKey = `pwd_${foundUser.username.toLowerCase()}`;
    const storedPassword = localStorage.getItem(storedPasswordKey) || '123456'; // fallback to 123456 for initial seed

    if (loginPassword !== storedPassword) {
      setError('Mật khẩu không chính xác.');
      return;
    }

    onLoginSuccess(foundUser);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Field validation
    if (!regName || !regUsername || !regEmail || !regPassword || !regConfirmPassword) {
      setError('Vui lòng nhập đầy đủ các thông tin bắt buộc (*).');
      return;
    }

    if (regUsername.length < 4) {
      setError('Tên đăng nhập phải chứa ít nhất 4 ký tự.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    // Username check
    const usernameExists = registeredUsers.some(
      (u) => u.username.toLowerCase() === regUsername.trim().toLowerCase()
    );

    if (usernameExists) {
      setError('Tên đăng nhập này đã có người sử dụng.');
      return;
    }

    // Create user object
    const newUser: UserType = {
      id: `user-${Date.now()}`,
      username: regUsername.trim().toLowerCase(),
      name: regName.trim(),
      role: role,
      email: regEmail.trim().toLowerCase(),
      phoneNumber: regPhone.trim(),
    };

    // Save password
    localStorage.setItem(`pwd_${newUser.username}`, regPassword);
    
    // Pass to parent
    onRegisterUser(newUser);

    setSuccess('Đăng ký tài khoản thành công! Đang chuyển sang màn hình Đăng nhập...');
    
    // Reset fields
    setTimeout(() => {
      setIsLogin(true);
      setLoginUsername(newUser.username);
      setLoginPassword(regPassword);
      setSuccess('');
    }, 2000);
  };

  // Quick log in utility for demonstration/testing
  const handleQuickLogin = (userRole: UserRole) => {
    if (userRole === 'teacher') {
      const teacher = registeredUsers.find(u => u.role === 'teacher') || {
        id: 'user-teacher-default',
        username: 'giao_vien',
        name: 'Cô Nguyễn Thị Mai',
        role: 'teacher',
        email: 'giao_vien@school.edu.vn',
      };
      onLoginSuccess(teacher);
    } else {
      const parent = registeredUsers.find(u => u.role === 'parent') || {
        id: 'user-parent-default',
        username: 'phu_huynh',
        name: 'Trần Văn Hùng',
        role: 'parent',
        email: 'hung.tran@gmail.com',
      };
      onLoginSuccess(parent);
    }
  };

  return (
    <div id="auth-container" className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div id="auth-card" className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100">
        
        {/* Toggle tabs */}
        <div id="auth-tabs" className="flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 rounded-lg py-2.5 text-center text-sm font-semibold transition-all ${
              isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 rounded-lg py-2.5 text-center text-sm font-semibold transition-all ${
              !isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tạo tài khoản mới
          </button>
        </div>

        <div>
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            {isLogin ? 'Chào mừng trở lại!' : 'Đăng ký tài khoản mới'}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            {isLogin 
              ? 'Nhập tài khoản để quản lý lớp hoặc theo dõi con em của bạn.' 
              : 'Chọn vai trò của bạn để bắt đầu tham gia hệ thống.'
            }
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div id="auth-error-alert" className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-sm text-rose-800 border border-rose-100 animate-shake">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div id="auth-success-alert" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-100">
            <p>{success}</p>
          </div>
        )}

        {isLogin ? (
          /* LOGIN FORM */
          <form id="login-form" className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4 rounded-md">
              <div>
                <label htmlFor="login-username-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="h-5 w-5" />
                  </span>
                  <input
                    id="login-username-input"
                    type="text"
                    required
                    className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all pl-10"
                    placeholder="Ví dụ: giao_vien, phu_huynh"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    id="login-password-input"
                    type="password"
                    required
                    className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all pl-10"
                    placeholder="Nhập mật khẩu (mặc định: 123456)"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                id="submit-login-btn"
                type="submit"
                className="w-full py-4 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors uppercase tracking-wider"
              >
                XÁC NHẬN ĐĂNG NHẬP
              </button>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form id="register-form" className="mt-8 space-y-4" onSubmit={handleRegister}>
            {/* Role Selection */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Tôi là: <span className="text-red-500">*</span>
              </span>
              <div id="role-selector" className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-semibold transition-all ${
                    role === 'teacher'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Shield className="h-5 w-5 shrink-0" />
                  Giáo viên
                </button>
                <button
                  type="button"
                  onClick={() => setRole('parent')}
                  className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-semibold transition-all ${
                    role === 'parent'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <User className="h-5 w-5 shrink-0" />
                  Phụ huynh
                </button>
              </div>
            </div>

            {/* General Info */}
            <div className="space-y-3">
              <div>
                <label htmlFor="reg-name-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-name-input"
                  type="text"
                  required
                  className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-username-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Tên đăng nhập <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-username-input"
                    type="text"
                    required
                    className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    placeholder="Tên viết liền, không dấu"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="reg-phone-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Phone className="h-4 w-4" />
                    </span>
                    <input
                      id="reg-phone-input"
                      type="tel"
                      className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all pl-9"
                      placeholder="09xx..."
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="reg-email-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Địa chỉ Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    id="reg-email-input"
                    type="email"
                    required
                    className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all pl-9"
                    placeholder="Để đồng bộ thông tin của học sinh"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
                {role === 'parent' && (
                  <p className="mt-1 text-2xs text-indigo-600 font-medium">
                    * Mẹo: Dùng email <span className="underline font-bold">hung.tran@gmail.com</span> hoặc <span className="underline font-bold">nam.nguyen@gmail.com</span> để tự động kết nối với học sinh mẫu đã tạo sẵn!
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-pwd-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-pwd-input"
                    type="password"
                    required
                    className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    placeholder="Mật khẩu (>5 kí tự)"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="reg-confirm-pwd-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Nhập lại mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-confirm-pwd-input"
                    type="password"
                    required
                    className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    placeholder="Trùng khớp mật khẩu"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="submit-register-btn"
                type="submit"
                className="w-full py-4 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors uppercase tracking-wider"
              >
                ĐĂNG KÝ TÀI KHOẢN
              </button>
            </div>
          </form>
        )}

        {/* Quick Testing Panel */}
        <div id="quick-login-panel" className="relative mt-8 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
          <div className="absolute -top-3 left-4 bg-white px-2 text-xxs font-bold text-indigo-600 uppercase tracking-widest border border-indigo-100 rounded">
            Tính năng Đăng nhập nhanh
          </div>
          <p className="text-xs text-slate-600 text-center mb-3 mt-1">
            Nhấn các nút bên dưới để thử nghiệm nhanh hai vai trò trong hệ thống:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('teacher')}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-all"
            >
              <Shield className="h-3.5 w-3.5" />
              Giáo viên (Mẫu)
            </button>
            <button
              onClick={() => handleQuickLogin('parent')}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all"
            >
              <User className="h-3.5 w-3.5" />
              Phụ huynh (Mẫu)
            </button>
          </div>
          <div className="mt-2 text-center text-3xs text-slate-400">
            Tài khoản giáo viên: <code className="bg-slate-100 px-1 rounded">giao_vien</code> | Phụ huynh: <code className="bg-slate-100 px-1 rounded">phu_huynh</code> (Mật khẩu: <code className="bg-slate-100 px-1 rounded">123456</code>)
          </div>
        </div>

      </div>
    </div>
  );
}
