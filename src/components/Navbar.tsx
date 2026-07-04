/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GraduationCap, LogOut, Shield, User } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  currentUser: UserType | null;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

export default function Navbar({ currentUser, onLogout, onNavigate, currentView }: NavbarProps) {
  return (
    <header id="app-header" className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Brand */}
        <div 
          id="navbar-brand"
          className="flex cursor-pointer items-center gap-3" 
          onClick={() => onNavigate('home')}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <div className="w-5 h-5 border-2 border-white rotate-45"></div>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl font-display">EduTrack<span className="text-indigo-600">VN</span></span>
          </div>
        </div>

        {/* User Info & Actions */}
        <div id="navbar-actions" className="flex items-center space-x-4">
          {currentUser ? (
            <>
              {/* Profile Chip */}
              <div id="user-profile-chip" className="hidden items-center space-x-3 rounded-xl border border-slate-200 bg-white py-1.5 pl-3 pr-4 sm:flex">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs">
                  {currentUser.role === 'teacher' ? 'GV' : 'PH'}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-xxs text-slate-400 font-bold uppercase tracking-wider leading-tight">
                    {currentUser.role === 'teacher' ? 'Giáo viên' : 'Phụ huynh'}
                  </div>
                </div>
              </div>

              {/* Mobile Role indicator */}
              <span id="mobile-role-badge" className="inline-flex items-center rounded bg-indigo-50 px-2 py-0.5 text-xxs font-bold uppercase tracking-wider text-indigo-700 ring-1 ring-inset ring-indigo-700/10 sm:hidden">
                {currentUser.role === 'teacher' ? 'GV' : 'PH'}
              </span>

              {/* Navigation Menu for Logged In */}
              {currentUser.role === 'teacher' && (
                <div id="teacher-menu-nav" className="hidden items-center gap-6 text-xxs font-bold text-slate-500 uppercase tracking-widest md:flex">
                  <button
                    onClick={() => onNavigate('classes')}
                    className={`pb-1 border-b-2 transition-all ${
                      currentView === 'classes' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Lớp học
                  </button>
                  <button
                    onClick={() => onNavigate('grades')}
                    className={`pb-1 border-b-2 transition-all ${
                      currentView === 'grades' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Sổ điểm
                  </button>
                  <button
                    onClick={() => onNavigate('stats')}
                    className={`pb-1 border-b-2 transition-all ${
                      currentView === 'stats' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Thống kê
                  </button>
                </div>
              )}

              {/* Logout button */}
              <button
                id="logout-btn"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-slate-500"
                title="Đăng xuất"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </>
          ) : (
            <div id="no-auth-actions" className="flex items-center space-x-2">
              <button
                onClick={() => onNavigate('lookup')}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                Tra cứu nhanh
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Đăng nhập
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
