/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, Plus, Edit, Trash2, Award, FileSpreadsheet, 
  TrendingUp, MessageSquare, ChevronRight, UserPlus, 
  BookOpen, Calendar, CheckCircle, Search, AlertCircle, X, Check
} from 'lucide-react';
import { 
  ClassItem, Student, Subject, Grade, TeacherComment, GradeType, User 
} from '../types';
import { 
  calculateGPA, GRADE_TYPE_LABELS, getPerformanceRating, calculateGeneralGPA 
} from '../initialData';

interface TeacherDashboardProps {
  currentUser: User;
  classes: ClassItem[];
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
  comments: TeacherComment[];
  onUpdateClasses: (updated: ClassItem[]) => void;
  onUpdateStudents: (updated: Student[]) => void;
  onUpdateGrades: (updated: Grade[]) => void;
  onUpdateComments: (updated: TeacherComment[]) => void;
}

export default function TeacherDashboard({
  currentUser,
  classes,
  students,
  subjects,
  grades,
  comments,
  onUpdateClasses,
  onUpdateStudents,
  onUpdateGrades,
  onUpdateComments,
}: TeacherDashboardProps) {
  // Navigation tabs inside teacher panel
  const [activeTab, setActiveTab] = useState<'classes' | 'gradebook' | 'stats'>('classes');
  
  // Selected state
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');

  // Search filter
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  // Modals / Forms States
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [classNameInput, setClassNameInput] = useState('');
  const [classGradeInput, setClassGradeInput] = useState('Lớp 10');
  const [classYearInput, setClassYearInput] = useState('2025-2026');
  const [classDescInput, setClassDescInput] = useState('');

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentNameInput, setStudentNameInput] = useState('');
  const [studentCodeInput, setStudentCodeInput] = useState('');
  const [studentGenderInput, setStudentGenderInput] = useState<'Nam' | 'Nữ'>('Nam');
  const [studentDobInput, setStudentDobInput] = useState('2010-01-01');
  const [studentParentNameInput, setStudentParentNameInput] = useState('');
  const [studentParentEmailInput, setStudentParentEmailInput] = useState('');
  const [studentParentPhoneInput, setStudentParentPhoneInput] = useState('');
  const [studentClassesInput, setStudentClassesInput] = useState<string[]>([]);

  // Grade addition modal
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeStudentId, setGradeStudentId] = useState('');
  const [gradeType, setGradeType] = useState<GradeType>('mouth_15m');
  const [gradeScore, setGradeScore] = useState<string>('8.0');
  const [gradeNote, setGradeNote] = useState('');

  // Comment input state
  const [commentingStudentId, setCommentingStudentId] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');

  // General Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ----------------------------------------------------
  // CLASS ACTIONS
  // ----------------------------------------------------
  const handleOpenCreateClass = () => {
    setEditingClass(null);
    setClassNameInput('');
    setClassGradeInput('Lớp 10');
    setClassYearInput('2025-2026');
    setClassDescInput('');
    setShowClassModal(true);
  };

  const handleOpenEditClass = (cls: ClassItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingClass(cls);
    setClassNameInput(cls.name);
    setClassGradeInput(cls.gradeLevel);
    setClassYearInput(cls.schoolYear);
    setClassDescInput(cls.description || '');
    setShowClassModal(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classNameInput.trim()) {
      triggerToast('Tên lớp không được để trống.', 'error');
      return;
    }

    if (editingClass) {
      // Edit class name & details
      const updated = classes.map((c) =>
        c.id === editingClass.id
          ? { ...c, name: classNameInput.trim(), gradeLevel: classGradeInput, schoolYear: classYearInput, description: classDescInput.trim() }
          : c
      );
      onUpdateClasses(updated);
      triggerToast(`Đã cập nhật lớp ${classNameInput}`);
    } else {
      // Create new class
      const newClass: ClassItem = {
        id: `class-${Date.now()}`,
        name: classNameInput.trim(),
        gradeLevel: classGradeInput,
        schoolYear: classYearInput,
        description: classDescInput.trim(),
      };
      onUpdateClasses([...classes, newClass]);
      if (!selectedClassId) {
        setSelectedClassId(newClass.id);
      }
      triggerToast(`Đã tạo lớp ${classNameInput} thành công!`);
    }
    setShowClassModal(false);
  };

  const handleDeleteClass = (clsId: string, className: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc chắn muốn xóa lớp ${className}? Học sinh thuộc lớp này sẽ bị rút bớt liên kết lớp.`)) {
      // Delete Class
      const updatedClasses = classes.filter((c) => c.id !== clsId);
      onUpdateClasses(updatedClasses);

      // Remove this class from students
      const updatedStudents = students.map((s) => ({
        ...s,
        classIds: s.classIds.filter((id) => id !== clsId),
      }));
      onUpdateStudents(updatedStudents);

      // Reset selected class if deleted
      if (selectedClassId === clsId) {
        setSelectedClassId(updatedClasses[0]?.id || '');
      }
      triggerToast(`Đã xóa lớp học ${className}`);
    }
  };

  // ----------------------------------------------------
  // STUDENT ACTIONS
  // ----------------------------------------------------
  const handleOpenCreateStudent = () => {
    setEditingStudent(null);
    setStudentNameInput('');
    // Auto generate code
    const nextNum = students.length + 1;
    setStudentCodeInput(`HS${String(Date.now()).slice(-5)}`);
    setStudentGenderInput('Nam');
    setDobInputForDefault();
    setStudentParentNameInput('');
    setStudentParentEmailInput('');
    setStudentParentPhoneInput('');
    // Prefill with currently viewed class
    setStudentClassesInput(selectedClassId ? [selectedClassId] : []);
    setShowStudentModal(true);
  };

  const setDobInputForDefault = () => {
    if (selectedClassId) {
      const cls = classes.find(c => c.id === selectedClassId);
      if (cls?.gradeLevel.includes('10')) setStudentDobInput('2010-04-15');
      else if (cls?.gradeLevel.includes('11')) setStudentDobInput('2009-04-15');
      else if (cls?.gradeLevel.includes('12')) setStudentDobInput('2008-04-15');
      else setStudentDobInput('2010-01-01');
    } else {
      setStudentDobInput('2010-01-01');
    }
  };

  const handleOpenEditStudent = (stud: Student) => {
    setEditingStudent(stud);
    setStudentNameInput(stud.name);
    setStudentCodeInput(stud.studentCode);
    setStudentGenderInput(stud.gender);
    setStudentDobInput(stud.dob);
    setStudentParentNameInput(stud.parentName);
    setStudentParentEmailInput(stud.parentEmail);
    setStudentParentPhoneInput(stud.parentPhone);
    setStudentClassesInput(stud.classIds);
    setShowStudentModal(true);
  };

  const handleToggleClassInput = (clsId: string) => {
    if (studentClassesInput.includes(clsId)) {
      setStudentClassesInput(studentClassesInput.filter((id) => id !== clsId));
    } else {
      setStudentClassesInput([...studentClassesInput, clsId]);
    }
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNameInput.trim() || !studentCodeInput.trim() || !studentParentEmailInput.trim()) {
      triggerToast('Vui lòng điền đủ Họ tên, Mã học sinh và Email phụ huynh.', 'error');
      return;
    }

    if (editingStudent) {
      // Edit student
      const updated = students.map((s) =>
        s.id === editingStudent.id
          ? {
              ...s,
              name: studentNameInput.trim(),
              studentCode: studentCodeInput.trim(),
              gender: studentGenderInput,
              dob: studentDobInput,
              parentName: studentParentNameInput.trim(),
              parentEmail: studentParentEmailInput.trim().toLowerCase(),
              parentPhone: studentParentPhoneInput.trim(),
              classIds: studentClassesInput,
            }
          : s
      );
      onUpdateStudents(updated);
      triggerToast(`Đã cập nhật thông tin học sinh: ${studentNameInput}`);
    } else {
      // Create new student
      const newStudent: Student = {
        id: `student-${Date.now()}`,
        studentCode: studentCodeInput.trim(),
        name: studentNameInput.trim(),
        gender: studentGenderInput,
        dob: studentDobInput,
        parentName: studentParentNameInput.trim(),
        parentEmail: studentParentEmailInput.trim().toLowerCase(),
        parentPhone: studentParentPhoneInput.trim(),
        classIds: studentClassesInput,
      };
      onUpdateStudents([...students, newStudent]);
      triggerToast(`Đã thêm học sinh ${studentNameInput} thành công!`);
    }
    setShowStudentModal(false);
  };

  const handleDeleteStudent = (studId: string, studentName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa học sinh ${studentName} khỏi toàn hệ thống? Việc này sẽ xóa toàn bộ điểm số liên quan.`)) {
      onUpdateStudents(students.filter((s) => s.id !== studId));
      onUpdateGrades(grades.filter((g) => g.studentId !== studId));
      onUpdateComments(comments.filter((c) => c.studentId !== studId));
      triggerToast(`Đã xóa học sinh ${studentName}`);
    }
  };

  // ----------------------------------------------------
  // GRADE ACTIONS
  // ----------------------------------------------------
  const handleOpenAddGrade = (studId: string) => {
    setGradeStudentId(studId);
    setGradeType('mouth_15m');
    setGradeScore('8.0');
    setGradeNote('');
    setShowGradeModal(true);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const scoreVal = parseFloat(gradeScore);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 10) {
      triggerToast('Điểm số phải là số từ 0 đến 10.', 'error');
      return;
    }

    const newGrade: Grade = {
      id: `grade-${Date.now()}`,
      studentId: gradeStudentId,
      classId: selectedClassId,
      subjectId: selectedSubjectId,
      type: gradeType,
      score: scoreVal,
      date: new Date().toISOString().split('T')[0],
      note: gradeNote.trim() || undefined,
    };

    onUpdateGrades([...grades, newGrade]);
    setShowGradeModal(false);
    
    const student = students.find((s) => s.id === gradeStudentId);
    triggerToast(`Đã thêm điểm cho em ${student?.name || ''}`);
  };

  const handleDeleteGradeItem = (gradeId: string) => {
    if (window.confirm('Xóa điểm số này?')) {
      onUpdateGrades(grades.filter((g) => g.id !== gradeId));
      triggerToast('Đã xóa điểm số');
    }
  };

  // ----------------------------------------------------
  // COMMENT ACTIONS
  // ----------------------------------------------------
  const handleOpenComment = (studId: string) => {
    setCommentingStudentId(studId);
    const existing = comments.find((c) => c.studentId === studId && c.classId === selectedClassId);
    setCommentContent(existing ? existing.content : '');
  };

  const handleSaveComment = (studId: string) => {
    if (!commentContent.trim()) {
      triggerToast('Nhận xét không được trống.', 'error');
      return;
    }

    const existingIndex = comments.findIndex((c) => c.studentId === studId && c.classId === selectedClassId);
    let updatedComments: TeacherComment[];

    if (existingIndex > -1) {
      updatedComments = comments.map((c, i) => 
        i === existingIndex 
          ? { ...c, content: commentContent.trim(), date: new Date().toISOString().split('T')[0], teacherName: currentUser.name }
          : c
      );
    } else {
      const newComment: TeacherComment = {
        id: `comment-${Date.now()}`,
        studentId: studId,
        classId: selectedClassId,
        teacherId: currentUser.id,
        teacherName: currentUser.name,
        content: commentContent.trim(),
        date: new Date().toISOString().split('T')[0],
      };
      updatedComments = [...comments, newComment];
    }

    onUpdateComments(updatedComments);
    setCommentingStudentId(null);
    triggerToast('Đã lưu nhận xét giáo viên.');
  };

  // ----------------------------------------------------
  // DATA FILTERING & SELECTORS
  // ----------------------------------------------------
  const activeClass = classes.find((c) => c.id === selectedClassId);
  
  // Filter students based on currently selected class
  const classStudents = students.filter((s) => s.classIds.includes(selectedClassId));
  
  // Search filtering in list
  const filteredClassStudents = classStudents.filter((s) => {
    const term = studentSearchQuery.toLowerCase();
    return s.name.toLowerCase().includes(term) || s.studentCode.toLowerCase().includes(term);
  });

  // Calculate statistics for the selected class
  const classGPAs = classStudents.map(s => {
    return {
      studentId: s.id,
      name: s.name,
      code: s.studentCode,
      gpa: calculateGeneralGPA(s.id, selectedClassId, grades, subjects)
    };
  });

  const ratingCounts = { Gioi: 0, Kha: 0, TB: 0, Yeu: 0, ChuaXL: 0 };
  let gpaSum = 0;
  let gpaCount = 0;

  classGPAs.forEach(item => {
    if (item.gpa !== null) {
      gpaSum += item.gpa;
      gpaCount++;
      if (item.gpa >= 8.0) ratingCounts.Gioi++;
      else if (item.gpa >= 6.5) ratingCounts.Kha++;
      else if (item.gpa >= 5.0) ratingCounts.TB++;
      else ratingCounts.Yeu++;
    } else {
      ratingCounts.ChuaXL++;
    }
  });

  const classAverageGPA = gpaCount > 0 ? Math.round((gpaSum / gpaCount) * 100) / 100 : null;

  return (
    <div id="teacher-dashboard-view" className="space-y-6">
      
      {/* Dynamic Toast Alert */}
      {toastMessage && (
        <div 
          id="teacher-toast-alert" 
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3.5 shadow-lg border text-sm text-white ${
            toastMessage.type === 'success' 
              ? 'bg-slate-900 border-slate-800' 
              : 'bg-rose-600 border-rose-500'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-200 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Hero Welcome banner */}
      <div id="teacher-welcome-banner" className="relative overflow-hidden rounded-2xl bg-indigo-900 px-6 py-8 text-white shadow-md sm:px-8">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center rounded-md bg-indigo-500/30 px-2.5 py-0.5 text-xs font-semibold text-indigo-100 ring-1 ring-inset ring-indigo-400/20">
            Học kỳ II • Năm học {activeClass?.schoolYear || '2025-2026'}
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Xin chào, {currentUser.name}!</h2>
          <p className="mt-2 text-sm text-indigo-100/90">
            Chào mừng bạn đến với trang quản trị lớp học. Tại đây, bạn có thể phân chia lớp học, cập nhật thông tin học sinh và nhập điểm thi cho từng môn.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-xl"></div>
        <div className="absolute right-1/4 -top-10 h-32 w-32 rounded-full bg-pink-500/15 blur-2xl"></div>
      </div>

      {/* Internal Tabs Navigator */}
      <div id="teacher-main-tabs" className="border-b border-slate-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('classes')}
            className={`flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-semibold transition-all ${
              activeTab === 'classes'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            <Users className="h-5 w-5" />
            Lớp học & Học sinh ({classes.length})
          </button>
          <button
            onClick={() => setActiveTab('gradebook')}
            className={`flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-semibold transition-all ${
              activeTab === 'gradebook'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            <FileSpreadsheet className="h-5 w-5" />
            Sổ điểm học tập
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-semibold transition-all ${
              activeTab === 'stats'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            Báo cáo thống kê
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------
          TAB 1: CLASSES & STUDENTS MANAGEMENT
         ---------------------------------------------------- */}
      {activeTab === 'classes' && (
        <div id="classes-tab-view" className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* LEFT COLUMN: CLASSES LIST */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-600" />
                Danh sách lớp học
              </h3>
              <button
                onClick={handleOpenCreateClass}
                className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                <Plus className="h-3 w-3" />
                Thêm lớp
              </button>
            </div>

            <div id="classes-list-container" className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {classes.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                  Chưa có lớp học nào được tạo.
                </div>
              ) : (
                classes.map((cls) => {
                  const studentCount = students.filter((s) => s.classIds.includes(cls.id)).length;
                  const isSelected = selectedClassId === cls.id;
                  return (
                    <div
                      key={cls.id}
                      onClick={() => setSelectedClassId(cls.id)}
                      className={`group relative flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1 pr-10">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {cls.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xxs font-medium text-slate-500">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5">{cls.gradeLevel}</span>
                          <span>•</span>
                          <span>{cls.schoolYear}</span>
                        </div>
                        {cls.description && (
                          <p className="text-xxs text-slate-400 line-clamp-1">{cls.description}</p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-indigo-700 font-semibold pt-1">
                          <Users className="h-3 w-3" />
                          <span>{studentCount} Học sinh</span>
                        </div>
                      </div>

                      {/* Floating actions on hover or always on select */}
                      <div className="absolute right-3 top-3 flex items-center space-x-1 opacity-85 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleOpenEditClass(cls, e)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                          title="Sửa thông tin lớp"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClass(cls.id, cls.name, e)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                          title="Xóa lớp học"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: STUDENTS LIST OF SELECTED CLASS */}
          <div className="lg:col-span-8 space-y-4">
            {activeClass ? (
              <div id="class-detail-card" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                
                {/* Class Detail Header */}
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{activeClass.name}</h3>
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                        {activeClass.schoolYear}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {activeClass.description || 'Chưa cấu hình mô tả cho lớp học này.'}
                    </p>
                  </div>

                  <button
                    onClick={handleOpenCreateStudent}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors shrink-0"
                  >
                    <UserPlus className="h-4 w-4" />
                    Thêm học sinh mới
                  </button>
                </div>

                {/* Sub-bar: Search and Info */}
                <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative flex-1 max-w-sm">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Search className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Tìm theo tên học sinh, mã HS..."
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="text-xs text-slate-500">
                    Sĩ số: <span className="font-bold text-indigo-600">{classStudents.length} học sinh</span> trong lớp này
                  </div>
                </div>

                {/* Roster Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-slate-500 sm:pl-6">Mã HS</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500">Họ và tên</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500">Giới tính</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500">Ngày sinh</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500">Phụ huynh & SĐT</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500">Lớp liên kết</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Hành động</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredClassStudents.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-sm text-slate-400">
                            {studentSearchQuery ? 'Không tìm thấy học sinh nào khớp.' : 'Lớp chưa gán học sinh. Nhấn nút "Thêm học sinh" để bổ sung.'}
                          </td>
                        </tr>
                      ) : (
                        filteredClassStudents.map((stud) => (
                          <tr key={stud.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-bold text-indigo-600 sm:pl-6">{stud.studentCode}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-slate-900">{stud.name}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-xs text-slate-500">
                              <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xxs font-semibold ${
                                stud.gender === 'Nam' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                              }`}>
                                {stud.gender}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-xs text-slate-500">{stud.dob}</td>
                            <td className="px-3 py-4 text-xs text-slate-500">
                              <div className="font-semibold text-slate-800">{stud.parentName}</div>
                              <div className="text-slate-400">{stud.parentPhone}</div>
                              <div className="text-slate-400 font-mono text-3xs">{stud.parentEmail}</div>
                            </td>
                            <td className="px-3 py-4 text-xs">
                              <div className="flex flex-wrap gap-1 max-w-[150px]">
                                {stud.classIds.map((cId) => {
                                  const cName = classes.find((c) => c.id === cId)?.name || cId;
                                  return (
                                    <span key={cId} className="rounded bg-slate-100 px-1 py-0.5 font-medium text-slate-600 text-3xs">
                                      {cName}
                                    </span>
                                  );
                                })}
                              </div>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-1">
                              <button
                                onClick={() => handleOpenEditStudent(stud)}
                                className="text-slate-400 hover:text-indigo-600 p-1 rounded hover:bg-slate-100 inline-block"
                                title="Sửa"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(stud.id, stud.name)}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 inline-block"
                                title="Xóa hoàn toàn"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Direct quick guide */}
                <div className="mt-6 rounded-xl bg-slate-50 p-4 border border-slate-100 flex items-start gap-2.5">
                  <AlertCircle className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-indigo-700">Mẹo quản lý lớp học kép:</span> Trong hệ thống này, một học sinh có thể tham gia học ở nhiều lớp học khác nhau (Ví dụ: Lớp văn hóa chính khóa và Lớp ôn thi chuyên đề). Khi ấn Sửa thông tin, hãy tích chọn các lớp học tương ứng để gán học sinh vào.
                  </div>
                </div>

              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 bg-white">
                Vui lòng tạo hoặc chọn một lớp học ở danh sách bên trái để quản lý danh sách học sinh.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: GRADEBOOK INTERFACE
         ---------------------------------------------------- */}
      {activeTab === 'gradebook' && (
        <div id="gradebook-tab-view" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          
          {/* Gradebook Header with dropdown select selectors */}
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Bảng Nhập Điểm Học Sinh</h3>
              <p className="text-xs text-slate-500">
                Hãy lựa chọn Lớp học và Môn học tương ứng để nạp bảng điểm học tập.
              </p>
            </div>

            {/* Select Selectors */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div>
                <label htmlFor="select-class-gradebook" className="sr-only">Chọn lớp</label>
                <select
                  id="select-class-gradebook"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="" disabled>-- Chọn Lớp học --</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="select-subject-gradebook" className="sr-only">Chọn môn</label>
                <select
                  id="select-subject-gradebook"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="" disabled>-- Chọn Môn học --</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Gradebook Table Sheet */}
          {!selectedClassId || !selectedSubjectId ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Vui lòng chọn đầy đủ cả Lớp học và Môn học để hiển thị sổ điểm.
            </div>
          ) : (
            <div className="mt-4 space-y-6">
              
              {/* Header Info badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-indigo-50/50 p-4 border border-indigo-50 text-xs">
                <div className="flex items-center gap-2 font-medium text-slate-700">
                  <span className="rounded bg-indigo-100 px-2.5 py-1 text-indigo-700 font-bold">
                    {classes.find(c => c.id === selectedClassId)?.name}
                  </span>
                  <span>Môn:</span>
                  <span className="text-indigo-900 font-semibold">
                    {subjects.find(s => s.id === selectedSubjectId)?.name}
                  </span>
                </div>
                <div className="text-slate-500">
                  Cách tính ĐTB môn: <span className="font-semibold text-slate-700">Miệng/15p (Hệ số 1) • Giữa kỳ (Hệ số 2) • Cuối kỳ (Hệ số 3)</span>
                </div>
              </div>

              {/* Table sheet */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead>
                    <tr className="bg-slate-50/30">
                      <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-slate-500">Học sinh</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-slate-500 min-w-[200px]">Miệng / 15 phút (Hệ số 1)</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-slate-500 min-w-[110px]">Giữa kỳ (Hệ số 2)</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-slate-500 min-w-[110px]">Cuối kỳ (Hệ số 3)</th>
                      <th scope="col" className="px-3 py-3 text-center text-xs font-bold text-indigo-600 bg-indigo-50/20">ĐTB môn</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-slate-500 min-w-[250px]">Nhận xét của giáo viên</th>
                      <th scope="col" className="relative py-3 pl-3 pr-4 text-right">
                        <span className="sr-only">Hành động</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {classStudents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-sm text-slate-400">
                          Không có học sinh trong lớp học này để chấm điểm.
                        </td>
                      </tr>
                    ) : (
                      classStudents.map((stud) => {
                        // Filter grades for this student, class and subject
                        const studentSubjectGrades = grades.filter(
                          (g) => g.studentId === stud.id && g.classId === selectedClassId && g.subjectId === selectedSubjectId
                        );

                        const oralGrades = studentSubjectGrades.filter((g) => g.type === 'mouth_15m');
                        const midtermGrades = studentSubjectGrades.filter((g) => g.type === 'midterm');
                        const finalGrades = studentSubjectGrades.filter((g) => g.type === 'final');

                        const gpaVal = calculateGPA(stud.id, selectedClassId, selectedSubjectId, grades);
                        const rating = getPerformanceRating(gpaVal);

                        const currentComment = comments.find((c) => c.studentId === stud.id && c.classId === selectedClassId);

                        return (
                          <tr key={stud.id} className="hover:bg-slate-50/20 align-top">
                            {/* Student Profile Info */}
                            <td className="whitespace-nowrap py-4 px-4">
                              <div className="font-semibold text-slate-900">{stud.name}</div>
                              <div className="text-xxs text-slate-400 font-mono">{stud.studentCode}</div>
                            </td>

                            {/* Oral/15m Grades list */}
                            <td className="px-3 py-4">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {oralGrades.map((g) => (
                                  <span 
                                    key={g.id} 
                                    className="group relative inline-flex items-center rounded-lg bg-slate-50 border border-slate-100 pl-2 pr-1 py-1 text-xs font-bold text-slate-800"
                                    title={g.note || 'Không có ghi chú'}
                                  >
                                    <span>{g.score.toFixed(1)}</span>
                                    <button
                                      onClick={() => handleDeleteGradeItem(g.id)}
                                      className="ml-1 rounded-full p-0.5 text-slate-300 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                                    >
                                      <X className="h-2.5 w-2.5" />
                                    </button>
                                  </span>
                                ))}
                                <button
                                  onClick={() => handleOpenAddGrade(stud.id)}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-400 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                                  title="Thêm điểm"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>

                            {/* Midterm Grade item */}
                            <td className="px-3 py-4">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {midtermGrades.length > 0 ? (
                                  midtermGrades.map((g) => (
                                    <span 
                                      key={g.id} 
                                      className="inline-flex items-center rounded-lg bg-orange-50 border border-orange-100 pl-2 pr-1 py-1 text-xs font-bold text-orange-800"
                                    >
                                      <span>{g.score.toFixed(1)}</span>
                                      <button
                                        onClick={() => handleDeleteGradeItem(g.id)}
                                        className="ml-1 rounded-full p-0.5 text-orange-200 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                                      >
                                        <X className="h-2.5 w-2.5" />
                                      </button>
                                    </span>
                                  ))
                                ) : (
                                  <button
                                    onClick={() => {
                                      setGradeStudentId(stud.id);
                                      setGradeType('midterm');
                                      setGradeScore('8.0');
                                      setGradeNote('');
                                      setShowGradeModal(true);
                                    }}
                                    className="text-xxs font-medium text-slate-400 hover:text-indigo-600"
                                  >
                                    + Nhập điểm
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* Final Grade item */}
                            <td className="px-3 py-4">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {finalGrades.length > 0 ? (
                                  finalGrades.map((g) => (
                                    <span 
                                      key={g.id} 
                                      className="inline-flex items-center rounded-lg bg-red-50 border border-red-100 pl-2 pr-1 py-1 text-xs font-bold text-red-800"
                                    >
                                      <span>{g.score.toFixed(1)}</span>
                                      <button
                                        onClick={() => handleDeleteGradeItem(g.id)}
                                        className="ml-1 rounded-full p-0.5 text-red-200 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                                      >
                                        <X className="h-2.5 w-2.5" />
                                      </button>
                                    </span>
                                  ))
                                ) : (
                                  <button
                                    onClick={() => {
                                      setGradeStudentId(stud.id);
                                      setGradeType('final');
                                      setGradeScore('8.0');
                                      setGradeNote('');
                                      setShowGradeModal(true);
                                    }}
                                    className="text-xxs font-medium text-slate-400 hover:text-indigo-600"
                                  >
                                    + Nhập điểm
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* Dynamically calculated GPA with color rating badges */}
                            <td className="px-3 py-4 text-center bg-indigo-50/10 font-bold text-indigo-950">
                              {gpaVal !== null ? (
                                <div className="space-y-1">
                                  <div className="text-sm">{gpaVal.toFixed(1)}</div>
                                  <div className="inline-flex items-center rounded-full px-1.5 py-0.5 text-3xs font-semibold uppercase tracking-wider leading-none scale-90 border">
                                    <span className={rating.color.split(' ')[0]}>{rating.label}</span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-300 font-normal text-xs italic">Chưa đủ cột</span>
                              )}
                            </td>

                            {/* Teacher Comments */}
                            <td className="px-3 py-4 text-xs">
                              {commentingStudentId === stud.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    className="block w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                                    rows={2}
                                    placeholder="Viết nhận xét cho phụ huynh nắm bắt..."
                                    value={commentContent}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                  />
                                  <div className="flex gap-1.5 justify-end">
                                    <button
                                      onClick={() => setCommentingStudentId(null)}
                                      className="rounded bg-slate-100 px-2 py-1 text-2xs text-slate-600 font-medium hover:bg-slate-200"
                                    >
                                      Hủy
                                    </button>
                                    <button
                                      onClick={() => handleSaveComment(stud.id)}
                                      className="rounded bg-indigo-600 px-2 py-1 text-2xs text-white font-medium hover:bg-indigo-700"
                                    >
                                      Lưu
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="group relative">
                                  {currentComment ? (
                                    <p className="text-slate-600 leading-relaxed pr-6 italic">
                                      "{currentComment.content}"
                                      <span className="block text-4xs text-slate-400 mt-1 font-sans font-normal">
                                        Cập nhật: {currentComment.date}
                                      </span>
                                    </p>
                                  ) : (
                                    <p className="text-slate-300 italic">Chưa có nhận xét học tập nào.</p>
                                  )}
                                  <button
                                    onClick={() => handleOpenComment(stud.id)}
                                    className="absolute right-0 top-0 rounded p-1 text-slate-300 hover:bg-slate-50 hover:text-indigo-600 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Sửa nhận xét"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* Direct add general float */}
                            <td className="py-4 pr-3 pl-1 text-right whitespace-nowrap">
                              <button
                                onClick={() => handleOpenAddGrade(stud.id)}
                                className="inline-flex items-center gap-1 rounded bg-slate-100 hover:bg-indigo-50 px-2 py-1.5 text-3xs font-bold text-slate-700 hover:text-indigo-700 transition-all border border-slate-200/50"
                              >
                                <Plus className="h-2.5 w-2.5" />
                                Điểm
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ----------------------------------------------------
          TAB 3: REPORTS & STATISTICS
         ---------------------------------------------------- */}
      {activeTab === 'stats' && (
        <div id="statistics-tab-view" className="space-y-6">
          
          {/* Class Select Header for Stats */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900">Báo Cáo Thống Kê Học Tập</h3>
              <p className="text-xs text-slate-500">
                Hiển thị số liệu trực quan cho từng lớp học dựa trên các đầu điểm đã nhập.
              </p>
            </div>
            <div>
              <label htmlFor="select-class-stats" className="sr-only">Chọn lớp xem thống kê</label>
              <select
                id="select-class-stats"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
          </div>

          {classStudents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 bg-white shadow-sm">
              Lớp này chưa có học sinh để kết xuất thống kê.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              
              {/* Card 1: Key Metrics Bento */}
              <div id="stats-card-metrics" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Các chỉ số cốt lõi</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-indigo-50/50 p-4 border border-indigo-50">
                    <span className="block text-xxs font-medium text-slate-500">Sĩ số lớp</span>
                    <span className="block text-2xl font-black text-indigo-700 mt-1">{classStudents.length}</span>
                    <span className="block text-3xs text-slate-400 mt-0.5">học sinh</span>
                  </div>

                  <div className="rounded-xl bg-emerald-50/50 p-4 border border-emerald-50">
                    <span className="block text-xxs font-medium text-slate-500">ĐTB toàn lớp</span>
                    <span className="block text-2xl font-black text-emerald-700 mt-1">
                      {classAverageGPA !== null ? classAverageGPA.toFixed(1) : 'N/A'}
                    </span>
                    <span className="block text-3xs text-slate-400 mt-0.5">Thang điểm 10</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="block text-xs font-semibold text-slate-600 mb-2">Đánh giá chung về lớp:</span>
                  <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 rounded-lg p-3">
                    {classAverageGPA === null ? (
                      'Chưa đủ dữ liệu điểm để đánh giá học tập.'
                    ) : classAverageGPA >= 8.0 ? (
                      'Lớp học có phong trào học tập vượt trội. Tỉ lệ học sinh khá giỏi cao, nắm bắt kiến thức sâu sắc.'
                    ) : classAverageGPA >= 6.5 ? (
                      'Lớp học đạt yêu cầu chung. Đa phần các em đạt mức khá, cần đẩy mạnh kèm cặp các em trung bình yếu.'
                    ) : (
                      'Lực học trung bình thấp. Giáo viên cần tổ chức các buổi bổ trợ ngoài giờ và tăng cường bài tập tự luyện.'
                    )}
                  </p>
                </div>
              </div>

              {/* Card 2: Academic Performance Distribution (SVG Pie/Bar) */}
              <div id="stats-card-distribution" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Xếp loại học lực chung</h4>
                
                {/* SVG Visual Progress Bars */}
                <div className="space-y-3.5 pt-2">
                  {[
                    { label: 'Giỏi (>= 8.0)', count: ratingCounts.Gioi, color: 'bg-emerald-500', barColor: 'bg-emerald-500', txtColor: 'text-emerald-700' },
                    { label: 'Khá (6.5 - 7.9)', count: ratingCounts.Kha, color: 'bg-indigo-500', barColor: 'bg-indigo-500', txtColor: 'text-indigo-700' },
                    { label: 'Trung bình (5.0 - 6.4)', count: ratingCounts.TB, color: 'bg-amber-500', barColor: 'bg-amber-500', txtColor: 'text-amber-700' },
                    { label: 'Yếu (< 5.0)', count: ratingCounts.Yeu, color: 'bg-rose-500', barColor: 'bg-rose-500', txtColor: 'text-rose-700' },
                  ].map((row, i) => {
                    const percentage = gpaCount > 0 ? Math.round((row.count / classStudents.length) * 100) : 0;
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-600">{row.label}</span>
                          <span className={row.txtColor}>{row.count} học sinh ({percentage}%)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div className={`h-full rounded-full ${row.barColor}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {ratingCounts.ChuaXL > 0 && (
                    <div className="text-3xs text-slate-400 italic pt-1 text-center">
                      * Còn {ratingCounts.ChuaXL} học sinh chưa có điểm hoặc chưa đủ cột xếp loại
                    </div>
                  )}
                </div>
              </div>

              {/* Card 3: Top Students Honors List */}
              <div id="stats-card-honors" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Award className="h-4 w-4 text-amber-500" />
                  Học sinh tiêu biểu của lớp
                </h4>

                <div id="honors-list" className="space-y-3 pt-2">
                  {classGPAs
                    .filter((item) => item.gpa !== null)
                    .sort((a, b) => (b.gpa || 0) - (a.gpa || 0))
                    .slice(0, 4)
                    .map((stud, index) => {
                      const medalColors = [
                        'bg-amber-100 text-amber-700 ring-amber-300',
                        'bg-slate-200 text-slate-800 ring-slate-300',
                        'bg-amber-50 text-amber-600 ring-amber-200',
                        'bg-slate-50 text-slate-500 ring-slate-200',
                      ];
                      return (
                        <div key={stud.studentId} className="flex items-center justify-between rounded-xl border border-slate-100 p-2.5 bg-slate-50/30">
                          <div className="flex items-center space-x-2.5">
                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ring-1 ${medalColors[index] || medalColors[3]}`}>
                              {index + 1}
                            </span>
                            <div>
                              <span className="block text-xs font-bold text-slate-800">{stud.name}</span>
                              <span className="block text-xxs text-slate-400">{stud.code}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-xs font-extrabold text-indigo-700">{stud.gpa?.toFixed(1)}</span>
                            <span className="block text-4xs text-slate-400 uppercase font-semibold">ĐIỂM ĐTB</span>
                          </div>
                        </div>
                      );
                    })}

                  {classGPAs.filter((i) => i.gpa !== null).length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-6">Không có dữ liệu điểm để vinh danh.</p>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ----------------------------------------------------
          CLASS MODAL (ADD & EDIT)
         ---------------------------------------------------- */}
      {showClassModal && (
        <div id="class-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingClass ? `Sửa thông tin: ${editingClass.name}` : 'Tạo lớp học mới'}
              </h3>
              <button onClick={() => setShowClassModal(false)} className="rounded p-1 hover:bg-slate-100 text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="mt-4 space-y-4">
              <div>
                <label htmlFor="modal-class-name-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Tên lớp <span className="text-rose-500">*</span>
                </label>
                <input
                  id="modal-class-name-input"
                  type="text"
                  required
                  className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  placeholder="Ví dụ: Lớp 10A2, Lớp 11A3..."
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-class-grade-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Khối lớp
                  </label>
                  <select
                    id="modal-class-grade-input"
                    value={classGradeInput}
                    onChange={(e) => setClassGradeInput(e.target.value)}
                    className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  >
                    <option value="Lớp 10">Lớp 10</option>
                    <option value="Lớp 11">Lớp 11</option>
                    <option value="Lớp 12">Lớp 12</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="modal-class-year-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Niên khóa
                  </label>
                  <input
                    id="modal-class-year-input"
                    type="text"
                    required
                    className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    placeholder="2025-2026"
                    value={classYearInput}
                    onChange={(e) => setClassYearInput(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="modal-class-desc-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Mô tả chi tiết
                </label>
                <textarea
                  id="modal-class-desc-input"
                  className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  rows={3}
                  placeholder="Lớp chuyên, lớp đại trà hoặc thông tin ghi chú khác..."
                  value={classDescInput}
                  onChange={(e) => setClassDescInput(e.target.value)}
                />
              </div>

              <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-5 py-2.5 text-sm font-semibold border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors uppercase tracking-wider"
                >
                  Lưu lớp học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          STUDENT MODAL (ADD & EDIT)
         ---------------------------------------------------- */}
      {showStudentModal && (
        <div id="student-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-scaleUp my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingStudent ? `Sửa hồ sơ học sinh: ${editingStudent.name}` : 'Thêm học sinh mới vào hệ thống'}
              </h3>
              <button onClick={() => setShowStudentModal(false)} className="rounded p-1 hover:bg-slate-100 text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-student-name" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Họ và tên học sinh <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="modal-student-name"
                    type="text"
                    required
                    className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    placeholder="Ví dụ: Nguyễn Văn Hải"
                    value={studentNameInput}
                    onChange={(e) => setStudentNameInput(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="modal-student-code" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Mã học sinh (duy nhất) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="modal-student-code"
                    type="text"
                    required
                    className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-semibold text-indigo-600"
                    placeholder="HSXXXX"
                    value={studentCodeInput}
                    onChange={(e) => setStudentCodeInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-student-gender" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Giới tính
                  </label>
                  <select
                    id="modal-student-gender"
                    value={studentGenderInput}
                    onChange={(e) => setStudentGenderInput(e.target.value as 'Nam' | 'Nữ')}
                    className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="modal-student-dob" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Ngày sinh
                  </label>
                  <input
                    id="modal-student-dob"
                    type="date"
                    required
                    className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    value={studentDobInput}
                    onChange={(e) => setStudentDobInput(e.target.value)}
                  />
                </div>
              </div>

              {/* Parent Details section */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-3">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-indigo-700">Thông tin phụ huynh liên lạc</span>
                
                <div>
                  <label htmlFor="modal-parent-name" className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Tên phụ huynh
                  </label>
                  <input
                    id="modal-parent-name"
                    type="text"
                    required
                    className="block w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Ví dụ: Nguyễn Hoàng Nam"
                    value={studentParentNameInput}
                    onChange={(e) => setStudentParentNameInput(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="modal-parent-email" className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      Email phụ huynh (để đồng bộ) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="modal-parent-email"
                      type="email"
                      required
                      className="block w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                      placeholder="phuhuynh@gmail.com"
                      value={studentParentEmailInput}
                      onChange={(e) => setStudentParentEmailInput(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="modal-parent-phone" className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      Số điện thoại phụ huynh
                    </label>
                    <input
                      id="modal-parent-phone"
                      type="tel"
                      className="block w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="09xxxxxxxx"
                      value={studentParentPhoneInput}
                      onChange={(e) => setStudentParentPhoneInput(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Assigned Classes Multi Checkboxes */}
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Gán vào lớp học: <span className="text-indigo-600 font-semibold">(Có thể chọn nhiều lớp)</span>
                </span>
                <div id="modal-classes-grid" className="grid grid-cols-2 gap-2.5 max-h-[120px] overflow-y-auto border border-slate-200 rounded-lg p-3 bg-slate-50">
                  {classes.map((cls) => {
                    const isChecked = studentClassesInput.includes(cls.id);
                    return (
                      <label 
                        key={cls.id} 
                        className={`flex items-center space-x-2 rounded-lg border px-3 py-2 text-xs font-semibold cursor-pointer select-none transition-all ${
                          isChecked 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="accent-indigo-600"
                          checked={isChecked}
                          onChange={() => handleToggleClassInput(cls.id)}
                        />
                        <span className="truncate">{cls.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-5 py-2.5 text-sm font-semibold border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors uppercase tracking-wider"
                >
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          GRADE ADDITION MODAL
         ---------------------------------------------------- */}
      {showGradeModal && (
        <div id="grade-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
                Thêm điểm số mới
              </h3>
              <button onClick={() => setShowGradeModal(false)} className="rounded p-1 hover:bg-slate-100 text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="mt-4 space-y-4">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs text-slate-600">
                Học sinh: <span className="font-bold text-indigo-700">{students.find((s) => s.id === gradeStudentId)?.name}</span><br />
                Môn học: <span className="font-semibold text-indigo-700">{subjects.find((s) => s.id === selectedSubjectId)?.name}</span>
              </div>

              <div>
                <label htmlFor="modal-grade-type" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Cột điểm
                </label>
                <select
                  id="modal-grade-type"
                  value={gradeType}
                  onChange={(e) => setGradeType(e.target.value as GradeType)}
                  className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                >
                  <option value="mouth_15m">Miệng / Kiểm tra 15 phút (Hệ số 1)</option>
                  <option value="midterm">Thi Giữa kỳ (Hệ số 2)</option>
                  <option value="final">Thi Cuối kỳ (Hệ số 3)</option>
                </select>
              </div>

              <div>
                <label htmlFor="modal-grade-score" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Điểm số (Thang điểm 10) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="modal-grade-score"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-base font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  placeholder="Nhập từ 0 đến 10, ví dụ: 8.5"
                  value={gradeScore}
                  onChange={(e) => setGradeScore(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="modal-grade-note" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Ghi chú bài kiểm tra
                </label>
                <input
                  id="modal-grade-note"
                  type="text"
                  className="block w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  placeholder="Bài kiểm tra số 1, Phát biểu bài..."
                  value={gradeNote}
                  onChange={(e) => setGradeNote(e.target.value)}
                />
              </div>

              <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowGradeModal(false)}
                  className="px-5 py-2.5 text-sm font-semibold border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors uppercase tracking-wider"
                >
                  Xác nhận lưu điểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
