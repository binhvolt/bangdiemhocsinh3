/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Shield, User, Search, Award, BookOpen, 
  Smile, Star, MessageSquare, ArrowRight, ShieldCheck, HelpCircle 
} from 'lucide-react';

import { User as UserType, ClassItem, Student, Grade, TeacherComment } from './types';
import { 
  INITIAL_SUBJECTS, INITIAL_CLASSES, INITIAL_STUDENTS, INITIAL_GRADES, 
  INITIAL_COMMENTS, getStoredData, setStoredData 
} from './initialData';

import Navbar from './components/Navbar';
import LoginRegister from './components/LoginRegister';
import TeacherDashboard from './components/TeacherDashboard';
import ParentDashboard from './components/ParentDashboard';

export default function App() {
  // ----------------------------------------------------
  // INITIAL LOADERS (LocalStorage)
  // ----------------------------------------------------
  const [registeredUsers, setRegisteredUsers] = useState<UserType[]>(() => {
    const defaultUsers: UserType[] = [
      {
        id: 'user-teacher-default',
        username: 'giao_vien',
        name: 'Cô Nguyễn Thị Mai',
        role: 'teacher',
        email: 'giao_vien@school.edu.vn',
      },
      {
        id: 'user-parent-default',
        username: 'phu_huynh',
        name: 'Trần Văn Hùng',
        role: 'parent',
        email: 'hung.tran@gmail.com',
      }
    ];
    return getStoredData<UserType[]>('app_users', defaultUsers);
  });

  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    return getStoredData<UserType | null>('current_user', null);
  });

  const [classes, setClasses] = useState<ClassItem[]>(() => {
    return getStoredData<ClassItem[]>('classes_data', INITIAL_CLASSES);
  });

  const [students, setStudents] = useState<Student[]>(() => {
    return getStoredData<Student[]>('students_data', INITIAL_STUDENTS);
  });

  const [grades, setGrades] = useState<Grade[]>(() => {
    return getStoredData<Grade[]>('grades_data', INITIAL_GRADES);
  });

  const [comments, setComments] = useState<TeacherComment[]>(() => {
    return getStoredData<TeacherComment[]>('comments_data', INITIAL_COMMENTS);
  });

  // Navigation: 'home' | 'login' | 'classes' | 'grades' | 'stats' | 'lookup' | 'parent-dashboard'
  const [currentView, setCurrentView] = useState<string>('home');

  // ----------------------------------------------------
  // PERSISTENCE ACTIONS
  // ----------------------------------------------------
  useEffect(() => {
    setStoredData('app_users', registeredUsers);
  }, [registeredUsers]);

  useEffect(() => {
    setStoredData('current_user', currentUser);
    if (currentUser) {
      if (currentUser.role === 'teacher') {
        setCurrentView('classes');
      } else if (currentUser.role === 'parent') {
        setCurrentView('parent-dashboard');
      }
    } else {
      // If we logout, clear view and return to home
      if (currentView !== 'lookup') {
        setCurrentView('home');
      }
    }
  }, [currentUser]);

  useEffect(() => {
    setStoredData('classes_data', classes);
  }, [classes]);

  useEffect(() => {
    setStoredData('students_data', students);
  }, [students]);

  useEffect(() => {
    setStoredData('grades_data', grades);
  }, [grades]);

  useEffect(() => {
    setStoredData('comments_data', comments);
  }, [comments]);

  // ----------------------------------------------------
  // NAVIGATION & HANDLERS
  // ----------------------------------------------------
  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleLoginSuccess = (user: UserType) => {
    setCurrentUser(user);
  };

  const handleRegisterUser = (newUser: UserType) => {
    setRegisteredUsers((prev) => [...prev, newUser]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Navbar Component */}
      <Navbar 
        currentUser={currentUser} 
        onLogout={handleLogout} 
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      {/* Main body area */}
      <main id="app-main-content" className="flex-grow mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* ----------------------------------------------------
            VIEW: HOME LANDING PAGE
           ---------------------------------------------------- */}
        {currentView === 'home' && !currentUser && (
          <div id="home-landing-view" className="space-y-12 py-6 sm:py-10">
            
            {/* Header Hero Section */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 shadow-sm border border-indigo-200">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl font-display">
                Sổ Điểm Điện Tử <br />
                <span className="text-indigo-600 bg-clip-text">Kết Nối Nhà Trường & Gia Đình</span>
              </h1>
              <p className="text-base text-slate-600 leading-relaxed max-w-xl mx-auto sm:text-lg">
                Hệ thống số hóa sổ liên lạc, giúp Giáo viên quản lý lớp học, nhập điểm thi dễ dàng và hỗ trợ Phụ huynh bám sát tiến độ học tập của các con tức thì.
              </p>
            </div>

            {/* Core Roles 3-Card layout */}
            <div id="landing-roles-grid" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-6">
              
              {/* Card 1: Teacher Gate */}
              <div 
                id="landing-card-teacher"
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-100/50 hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Shield className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Cổng dành cho Giáo viên</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Đăng nhập tài khoản sư phạm để thành lập lớp học mới, thêm học sinh vào danh sách, ghi nhận nhận xét rèn luyện và tiến hành nhập điểm kiểm tra miệng, 15 phút, giữa kỳ, cuối kỳ.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50">
                  <button
                    onClick={() => handleNavigate('login')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:text-indigo-500 hover:underline"
                  >
                    Vào đăng nhập sư phạm
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Card 2: Parent Gate */}
              <div 
                id="landing-card-parent"
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-100/50 hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <User className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Cổng dành cho Phụ huynh</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Đăng ký bằng email để đồng bộ hóa và tra cứu học bạ điện tử tổng hợp của các con. Xem trực quan các biểu đồ điểm trung bình và đọc nhận xét chi tiết của giáo viên bộ môn.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50">
                  <button
                    onClick={() => handleNavigate('login')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:text-emerald-500 hover:underline"
                  >
                    Đăng ký & Xem học bạ con em
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Card 3: Quick Lookup Gate */}
              <div 
                id="landing-card-lookup"
                className="group relative flex flex-col justify-between rounded-2xl border border-indigo-100 bg-indigo-50/20 p-6 shadow-md shadow-indigo-100/10 hover:border-indigo-500 hover:bg-indigo-50/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow shadow-indigo-200">
                    <Search className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Tra cứu nhanh không cần tài khoản</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Chế độ tra cứu siêu tốc dành cho phụ huynh chưa có tài khoản. Chỉ cần cung cấp Mã học sinh (ví dụ: <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-bold text-indigo-700">HS25001</code>) để trích xuất báo cáo học tập.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-indigo-100/50">
                  <button
                    onClick={() => handleNavigate('lookup')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:text-indigo-500 hover:underline"
                  >
                    Sử dụng công cụ Tra cứu nhanh
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Informational stats banner */}
            <div id="landing-benefits" className="rounded-2xl border border-slate-200/60 bg-white px-6 py-8 shadow-sm">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                <div className="flex gap-4 items-start sm:px-4">
                  <ShieldCheck className="h-6 w-6 text-indigo-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Lưu Trữ Bền Vững</h4>
                    <p className="text-xxs text-slate-500 mt-1 leading-relaxed">
                      Thông tin lớp học, hồ sơ học sinh và các cột điểm thi được lưu trữ tự động trên thiết bị của bạn, bảo toàn dữ liệu khi tải lại.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start pt-6 sm:pt-0 sm:px-6">
                  <Smile className="h-6 w-6 text-indigo-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Đồng bộ tự động</h4>
                    <p className="text-xxs text-slate-500 mt-1 leading-relaxed">
                      Phụ huynh chỉ cần đăng ký đúng Email là hệ thống sẽ liên kết hồ sơ của con ngay lập tức mà không cần bất cứ thao tác gán thủ công nào.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start pt-6 sm:pt-0 sm:pl-6">
                  <HelpCircle className="h-6 w-6 text-indigo-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Trợ giúp học tập</h4>
                    <p className="text-xxs text-slate-500 mt-1 leading-relaxed">
                      Bảng xếp hạng thông minh, tính điểm ĐTB (GPA) chính xác theo đúng thang điểm thông tư của Bộ Giáo dục Việt Nam.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            VIEW: AUTHENTICATION (Login / Register)
           ---------------------------------------------------- */}
        {currentView === 'login' && !currentUser && (
          <LoginRegister 
            onLoginSuccess={handleLoginSuccess}
            registeredUsers={registeredUsers}
            onRegisterUser={handleRegisterUser}
          />
        )}

        {/* ----------------------------------------------------
            VIEW: TEACHER DASHBOARD
           ---------------------------------------------------- */}
        {currentUser && currentUser.role === 'teacher' && (
          <TeacherDashboard 
            currentUser={currentUser}
            classes={classes}
            students={students}
            subjects={INITIAL_SUBJECTS}
            grades={grades}
            comments={comments}
            onUpdateClasses={setClasses}
            onUpdateStudents={setStudents}
            onUpdateGrades={setGrades}
            onUpdateComments={setComments}
          />
        )}

        {/* ----------------------------------------------------
            VIEW: PARENT PORTAL / LOOKUP PORTAL
           ---------------------------------------------------- */}
        {(currentUser?.role === 'parent' || currentView === 'lookup') && (
          <ParentDashboard 
            currentUser={currentUser}
            classes={classes}
            students={students}
            subjects={INITIAL_SUBJECTS}
            grades={grades}
            comments={comments}
            onBackToLogin={() => setCurrentView('login')}
          />
        )}

      </main>

      {/* Aesthetic human footer - architectural honesty */}
      <footer id="app-footer" className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Sổ Điểm Điện Tử. Hệ thống liên lạc nhà trường và gia đình số hóa.</p>
          <p className="mt-1 text-4xs uppercase tracking-widest font-semibold text-slate-300">Trường Trung học Phổ thông Chuyên Sư Phạm</p>
        </div>
      </footer>

    </div>
  );
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Shield, User, Search, Award, BookOpen, 
  Smile, Star, MessageSquare, ArrowRight, ShieldCheck, HelpCircle 
} from 'lucide-react';

import { User as UserType, ClassItem, Student, Grade, TeacherComment } from './types';
import { 
  INITIAL_SUBJECTS, INITIAL_CLASSES, INITIAL_STUDENTS, INITIAL_GRADES, 
  INITIAL_COMMENTS, getStoredData, setStoredData 
} from './initialData';

import Navbar from './components/Navbar';
import LoginRegister from './components/LoginRegister';
import TeacherDashboard from './components/TeacherDashboard';
import ParentDashboard from './components/ParentDashboard';

export default function App() {
  // ----------------------------------------------------
  // INITIAL LOADERS (LocalStorage)
  // ----------------------------------------------------
  const [registeredUsers, setRegisteredUsers] = useState<UserType[]>(() => {
    const defaultUsers: UserType[] = [
      {
        id: 'user-teacher-default',
        username: 'giao_vien',
        name: 'Cô Nguyễn Thị Mai',
        role: 'teacher',
        email: 'giao_vien@school.edu.vn',
      },
      {
        id: 'user-parent-default',
        username: 'phu_huynh',
        name: 'Trần Văn Hùng',
        role: 'parent',
        email: 'hung.tran@gmail.com',
      }
    ];
    return getStoredData<UserType[]>('app_users', defaultUsers);
  });

  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    return getStoredData<UserType | null>('current_user', null);
  });

  const [classes, setClasses] = useState<ClassItem[]>(() => {
    return getStoredData<ClassItem[]>('classes_data', INITIAL_CLASSES);
  });

  const [students, setStudents] = useState<Student[]>(() => {
    return getStoredData<Student[]>('students_data', INITIAL_STUDENTS);
  });

  const [grades, setGrades] = useState<Grade[]>(() => {
    return getStoredData<Grade[]>('grades_data', INITIAL_GRADES);
  });

  const [comments, setComments] = useState<TeacherComment[]>(() => {
    return getStoredData<TeacherComment[]>('comments_data', INITIAL_COMMENTS);
  });

  // Navigation: 'home' | 'login' | 'classes' | 'grades' | 'stats' | 'lookup' | 'parent-dashboard'
  const [currentView, setCurrentView] = useState<string>('home');

  // ----------------------------------------------------
  // PERSISTENCE ACTIONS
  // ----------------------------------------------------
  useEffect(() => {
    setStoredData('app_users', registeredUsers);
  }, [registeredUsers]);

  useEffect(() => {
    setStoredData('current_user', currentUser);
    if (currentUser) {
      if (currentUser.role === 'teacher') {
        setCurrentView('classes');
      } else if (currentUser.role === 'parent') {
        setCurrentView('parent-dashboard');
      }
    } else {
      // If we logout, clear view and return to home
      if (currentView !== 'lookup') {
        setCurrentView('home');
      }
    }
  }, [currentUser]);

  useEffect(() => {
    setStoredData('classes_data', classes);
  }, [classes]);

  useEffect(() => {
    setStoredData('students_data', students);
  }, [students]);

  useEffect(() => {
    setStoredData('grades_data', grades);
  }, [grades]);

  useEffect(() => {
    setStoredData('comments_data', comments);
  }, [comments]);

  // ----------------------------------------------------
  // NAVIGATION & HANDLERS
  // ----------------------------------------------------
  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleLoginSuccess = (user: UserType) => {
    setCurrentUser(user);
  };

  const handleRegisterUser = (newUser: UserType) => {
    setRegisteredUsers((prev) => [...prev, newUser]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Navbar Component */}
      <Navbar 
        currentUser={currentUser} 
        onLogout={handleLogout} 
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      {/* Main body area */}
      <main id="app-main-content" className="flex-grow mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* ----------------------------------------------------
            VIEW: HOME LANDING PAGE
           ---------------------------------------------------- */}
        {currentView === 'home' && !currentUser && (
          <div id="home-landing-view" className="space-y-12 py-6 sm:py-10">
            
            {/* Header Hero Section */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 shadow-sm border border-indigo-200">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl font-display">
                Sổ Điểm Điện Tử <br />
                <span className="text-indigo-600 bg-clip-text">Kết Nối Nhà Trường & Gia Đình</span>
              </h1>
              <p className="text-base text-slate-600 leading-relaxed max-w-xl mx-auto sm:text-lg">
                Hệ thống số hóa sổ liên lạc, giúp Giáo viên quản lý lớp học, nhập điểm thi dễ dàng và hỗ trợ Phụ huynh bám sát tiến độ học tập của các con tức thì.
              </p>
            </div>

            {/* Core Roles 3-Card layout */}
            <div id="landing-roles-grid" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-6">
              
              {/* Card 1: Teacher Gate */}
              <div 
                id="landing-card-teacher"
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-100/50 hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Shield className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Cổng dành cho Giáo viên</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Đăng nhập tài khoản sư phạm để thành lập lớp học mới, thêm học sinh vào danh sách, ghi nhận nhận xét rèn luyện và tiến hành nhập điểm kiểm tra miệng, 15 phút, giữa kỳ, cuối kỳ.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50">
                  <button
                    onClick={() => handleNavigate('login')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:text-indigo-500 hover:underline"
                  >
                    Vào đăng nhập sư phạm
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Card 2: Parent Gate */}
              <div 
                id="landing-card-parent"
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-100/50 hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <User className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Cổng dành cho Phụ huynh</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Đăng ký bằng email để đồng bộ hóa và tra cứu học bạ điện tử tổng hợp của các con. Xem trực quan các biểu đồ điểm trung bình và đọc nhận xét chi tiết của giáo viên bộ môn.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50">
                  <button
                    onClick={() => handleNavigate('login')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:text-emerald-500 hover:underline"
                  >
                    Đăng ký & Xem học bạ con em
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Card 3: Quick Lookup Gate */}
              <div 
                id="landing-card-lookup"
                className="group relative flex flex-col justify-between rounded-2xl border border-indigo-100 bg-indigo-50/20 p-6 shadow-md shadow-indigo-100/10 hover:border-indigo-500 hover:bg-indigo-50/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow shadow-indigo-200">
                    <Search className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Tra cứu nhanh không cần tài khoản</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Chế độ tra cứu siêu tốc dành cho phụ huynh chưa có tài khoản. Chỉ cần cung cấp Mã học sinh (ví dụ: <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-bold text-indigo-700">HS25001</code>) để trích xuất báo cáo học tập.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-indigo-100/50">
                  <button
                    onClick={() => handleNavigate('lookup')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:text-indigo-500 hover:underline"
                  >
                    Sử dụng công cụ Tra cứu nhanh
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Informational stats banner */}
            <div id="landing-benefits" className="rounded-2xl border border-slate-200/60 bg-white px-6 py-8 shadow-sm">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                <div className="flex gap-4 items-start sm:px-4">
                  <ShieldCheck className="h-6 w-6 text-indigo-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Lưu Trữ Bền Vững</h4>
                    <p className="text-xxs text-slate-500 mt-1 leading-relaxed">
                      Thông tin lớp học, hồ sơ học sinh và các cột điểm thi được lưu trữ tự động trên thiết bị của bạn, bảo toàn dữ liệu khi tải lại.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start pt-6 sm:pt-0 sm:px-6">
                  <Smile className="h-6 w-6 text-indigo-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Đồng bộ tự động</h4>
                    <p className="text-xxs text-slate-500 mt-1 leading-relaxed">
                      Phụ huynh chỉ cần đăng ký đúng Email là hệ thống sẽ liên kết hồ sơ của con ngay lập tức mà không cần bất cứ thao tác gán thủ công nào.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start pt-6 sm:pt-0 sm:pl-6">
                  <HelpCircle className="h-6 w-6 text-indigo-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Trợ giúp học tập</h4>
                    <p className="text-xxs text-slate-500 mt-1 leading-relaxed">
                      Bảng xếp hạng thông minh, tính điểm ĐTB (GPA) chính xác theo đúng thang điểm thông tư của Bộ Giáo dục Việt Nam.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            VIEW: AUTHENTICATION (Login / Register)
           ---------------------------------------------------- */}
        {currentView === 'login' && !currentUser && (
          <LoginRegister 
            onLoginSuccess={handleLoginSuccess}
            registeredUsers={registeredUsers}
            onRegisterUser={handleRegisterUser}
          />
        )}

        {/* ----------------------------------------------------
            VIEW: TEACHER DASHBOARD
           ---------------------------------------------------- */}
        {currentUser && currentUser.role === 'teacher' && (
          <TeacherDashboard 
            currentUser={currentUser}
            classes={classes}
            students={students}
            subjects={INITIAL_SUBJECTS}
            grades={grades}
            comments={comments}
            onUpdateClasses={setClasses}
            onUpdateStudents={setStudents}
            onUpdateGrades={setGrades}
            onUpdateComments={setComments}
          />
        )}

        {/* ----------------------------------------------------
            VIEW: PARENT PORTAL / LOOKUP PORTAL
           ---------------------------------------------------- */}
        {(currentUser?.role === 'parent' || currentView === 'lookup') && (
          <ParentDashboard 
            currentUser={currentUser}
            classes={classes}
            students={students}
            subjects={INITIAL_SUBJECTS}
            grades={grades}
            comments={comments}
            onBackToLogin={() => setCurrentView('login')}
          />
        )}

      </main>

      {/* Aesthetic human footer - architectural honesty */}
      <footer id="app-footer" className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Sổ Điểm Điện Tử. Hệ thống liên lạc nhà trường và gia đình số hóa.</p>
          <p className="mt-1 text-4xs uppercase tracking-widest font-semibold text-slate-300">Trường Trung học Phổ thông Chuyên Sư Phạm</p>
        </div>
      </footer>

    </div>
  );
}
