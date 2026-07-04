/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, Award, MessageSquare, BookOpen, Calendar, Mail, Phone, Search, 
  ChevronRight, ArrowLeft, ShieldAlert, Star, Activity, Download
} from 'lucide-react';
import { 
  ClassItem, Student, Subject, Grade, TeacherComment, User as UserType 
} from '../types';
import { 
  calculateGPA, calculateGeneralGPA, getPerformanceRating, GRADE_TYPE_LABELS 
} from '../initialData';

interface ParentDashboardProps {
  currentUser: UserType | null; // Can be null if using unauthenticated lookup
  classes: ClassItem[];
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
  comments: TeacherComment[];
  onBackToLogin?: () => void;
}

export default function ParentDashboard({
  currentUser,
  classes,
  students,
  subjects,
  grades,
  comments,
  onBackToLogin,
}: ParentDashboardProps) {
  // Find students linked to this parent (by matching email)
  const linkedStudents = currentUser 
    ? students.filter((s) => s.parentEmail.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  // Active states
  const [activeStudentId, setActiveStudentId] = useState<string>(linkedStudents[0]?.id || '');
  const [activeClassId, setActiveClassId] = useState<string>('');
  
  // Unauthenticated lookup state
  const [lookupCode, setLookupCode] = useState('');
  const [lookupResultStudent, setLookupResultStudent] = useState<Student | null>(null);
  const [lookupError, setLookupError] = useState('');

  // ----------------------------------------------------
  // STUDENT SELECTION & INITIALIZATION
  // ----------------------------------------------------
  // Pick active student (either linked or looked up)
  const activeStudent = currentUser 
    ? students.find((s) => s.id === activeStudentId)
    : lookupResultStudent;

  // Sync active class when student changes
  React.useEffect(() => {
    if (activeStudent) {
      if (activeStudent.classIds.length > 0) {
        // If the current activeClassId is not valid for this student, reset it
        if (!activeStudent.classIds.includes(activeClassId)) {
          setActiveClassId(activeStudent.classIds[0]);
        }
      } else {
        setActiveClassId('');
      }
    }
  }, [activeStudentId, activeStudent, activeClassId]);

  // ----------------------------------------------------
  // LOOKUP HANDLER
  // ----------------------------------------------------
  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    setLookupResultStudent(null);

    if (!lookupCode.trim()) {
      setLookupError('Vui lòng nhập Mã học sinh cần tra cứu.');
      return;
    }

    const found = students.find(
      (s) => s.studentCode.trim().toLowerCase() === lookupCode.trim().toLowerCase()
    );

    if (!found) {
      setLookupError('Không tìm thấy học sinh nào khớp với mã số đã nhập. Vui lòng kiểm tra lại.');
      return;
    }

    setLookupResultStudent(found);
    if (found.classIds.length > 0) {
      setActiveClassId(found.classIds[0]);
    }
  };

  const handleClearLookup = () => {
    setLookupResultStudent(null);
    setLookupCode('');
    setLookupError('');
  };

  // ----------------------------------------------------
  // DATA PARSING
  // ----------------------------------------------------
  const activeClass = classes.find((c) => c.id === activeClassId);

  // General GPA across all subjects
  const generalGPA = activeStudent && activeClassId
    ? calculateGeneralGPA(activeStudent.id, activeClassId, grades, subjects)
    : null;

  const rating = getPerformanceRating(generalGPA);

  // Best subject detection
  let bestSubjectName = 'N/A';
  let bestSubjectGPA = -1;

  if (activeStudent && activeClassId) {
    subjects.forEach((sub) => {
      const gpa = calculateGPA(activeStudent.id, activeClassId, sub.id, grades);
      if (gpa !== null && gpa > bestSubjectGPA) {
        bestSubjectGPA = gpa;
        bestSubjectName = sub.name;
      }
    });
  }

  return (
    <div id="parent-dashboard-view" className="space-y-6">
      
      {/* ----------------------------------------------------
          CASE A: UNAUTHENTICATED LOOKUP PORTAL (Not Logged In)
         ---------------------------------------------------- */}
      {!currentUser && !lookupResultStudent && (
        <div id="lookup-entry-view" className="mx-auto max-w-xl py-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg text-center space-y-6">
            
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Search className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Tra Cứu Điểm Học Tập Nhanh</h2>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Phụ huynh có thể tra cứu học lực và nhận xét của con bằng cách nhập chính xác Mã học sinh (Ví dụ: <code className="bg-slate-100 px-1 rounded font-mono font-bold">HS25001</code>).
              </p>
            </div>

            {lookupError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-xs text-rose-800 border border-rose-100 text-left">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <p>{lookupError}</p>
              </div>
            )}

            <form onSubmit={handleLookup} className="space-y-3">
              <div>
                <label htmlFor="lookup-code-input" className="sr-only">Mã học sinh</label>
                <input
                  id="lookup-code-input"
                  type="text"
                  required
                  className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-base font-extrabold tracking-wide uppercase text-slate-950 placeholder:text-slate-400 placeholder:font-normal focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Ví dụ: HS25001"
                  value={lookupCode}
                  onChange={(e) => setLookupCode(e.target.value)}
                />
              </div>

              <button
                id="submit-lookup-btn"
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors"
              >
                <Search className="h-4 w-4" />
                Tra cứu kết quả ngay
              </button>
            </form>

            <div className="border-t border-slate-100 pt-5 flex items-center justify-between text-xs text-slate-500">
              <span>Bạn có tài khoản phụ huynh?</span>
              <button 
                onClick={onBackToLogin}
                className="font-bold text-indigo-600 hover:text-indigo-500"
              >
                Đăng nhập tại đây →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          CASE B: AUTHENTICATED OR LOOKED-UP STUDENT VIEW
         ---------------------------------------------------- */}
      {(currentUser || lookupResultStudent) && (
        <div id="parent-dashboard-roster" className="space-y-6">
          
          {/* Header Bar for Parent View */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                {!currentUser && (
                  <button
                    onClick={handleClearLookup}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 mr-2"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Quay lại tra cứu
                  </button>
                )}
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {currentUser ? 'Cổng Thông Tin Phụ Huynh' : 'Kết Quả Tra Cứu Học Sinh'}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {currentUser 
                  ? `Xin chào phụ huynh ${currentUser.name}. Xem kết quả học tập thời gian thực từ giáo viên.` 
                  : `Báo cáo kết quả của học sinh ${activeStudent?.name} - Chế độ tra cứu nhanh.`
                }
              </p>
            </div>

            {/* Quick Email sync details */}
            {currentUser && linkedStudents.length > 0 && (
              <div className="text-xs font-medium text-slate-500">
                Tìm thấy <span className="text-indigo-600 font-extrabold">{linkedStudents.length} con em</span> liên kết với email <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-800">{currentUser.email}</code>
              </div>
            )}
          </div>

          {/* Warning state if parent account has no linked children */}
          {currentUser && linkedStudents.length === 0 ? (
            <div id="no-children-warning" className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-slate-800 space-y-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 text-sm">Chưa phát hiện tài khoản con em liên kết!</h4>
                  <p className="text-xs text-amber-800 leading-relaxed mt-1">
                    Hệ thống tự động liên kết học sinh dựa trên địa chỉ Email phụ huynh bạn đã đăng ký (<span className="font-mono font-bold">{currentUser.email}</span>). 
                    Hiện tại hòm thư này chưa được ghi nhận trong danh sách học sinh của nhà trường.
                  </p>
                </div>
              </div>
              
              <div className="border-t border-amber-200/50 pt-4 text-xs space-y-2">
                <span className="font-semibold block text-amber-900">Cách xử lý để đồng bộ ngay lập tức:</span>
                <ul className="list-disc pl-5 space-y-1 text-amber-800">
                  <li>Bạn hãy đăng xuất và đăng ký lại bằng địa chỉ Email: <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono font-bold">hung.tran@gmail.com</code> hoặc <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono font-bold">nam.nguyen@gmail.com</code> (các email mẫu của trường).</li>
                  <li>Hoặc liên hệ với Giáo viên chủ nhiệm để họ bổ sung/sửa đổi Email phụ huynh của học sinh thành <code className="bg-amber-200 px-1 rounded font-mono">{currentUser.email}</code> trong danh sách lớp.</li>
                </ul>
              </div>
            </div>
          ) : (
            /* ACTIVE STUDENT CORNER */
            activeStudent && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                
                {/* LEFT SIDEBAR: Children selector & Student Bio */}
                <div className="lg:col-span-4 space-y-4">
                  
                  {/* Children Switcher (Only if more than 1 linked children) */}
                  {currentUser && linkedStudents.length > 1 && (
                    <div className="space-y-2">
                      <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400">Chọn con em:</label>
                      <div id="child-switcher" className="grid grid-cols-2 gap-2">
                        {linkedStudents.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => setActiveStudentId(child.id)}
                            className={`flex items-center justify-center px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                              activeStudentId === child.id
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600 shadow-sm'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {child.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Student bio card */}
                  <div id="student-bio-card" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{activeStudent.name}</h4>
                        <span className="block text-xxs font-mono font-bold text-indigo-600">{activeStudent.studentCode}</span>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100 text-xs">
                      <div className="flex justify-between py-2.5">
                        <span className="text-slate-400">Giới tính:</span>
                        <span className="font-semibold text-slate-800">{activeStudent.gender}</span>
                      </div>
                      <div className="flex justify-between py-2.5">
                        <span className="text-slate-400">Ngày sinh:</span>
                        <span className="font-semibold text-slate-800">{activeStudent.dob}</span>
                      </div>
                      <div className="flex justify-between py-2.5">
                        <span className="text-slate-400">Phụ huynh bảo hộ:</span>
                        <span className="font-semibold text-slate-800">{activeStudent.parentName}</span>
                      </div>
                      <div className="flex justify-between py-2.5">
                        <span className="text-slate-400">SĐT phụ huynh:</span>
                        <span className="font-semibold text-slate-800 font-mono">{activeStudent.parentPhone}</span>
                      </div>
                    </div>

                    {/* Class Selector for student classes (as they can participate in multiple classes!) */}
                    <div className="border-t border-slate-100 pt-4 space-y-2">
                      <label htmlFor="select-class-parent" className="block text-xxs font-bold uppercase tracking-wider text-slate-400">
                        Lớp học đang theo dõi:
                      </label>
                      {activeStudent.classIds.length === 0 ? (
                        <p className="text-xs text-rose-500 italic">Học sinh chưa được gán vào lớp học nào.</p>
                      ) : (
                        <div id="select-class-parent" className="space-y-1.5">
                          {activeStudent.classIds.map((cId) => {
                            const cls = classes.find((c) => c.id === cId);
                            const isSelected = activeClassId === cId;
                            if (!cls) return null;
                            return (
                              <button
                                key={cId}
                                onClick={() => setActiveClassId(cId)}
                                className={`w-full flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs text-left font-semibold transition-all ${
                                  isSelected
                                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-800 shadow-sm'
                                    : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <span>{cls.name}</span>
                                <span className="text-xxs font-medium text-slate-400">{cls.schoolYear}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Summary Bento Stats card */}
                  {activeClassId && (
                    <div id="gpa-summary-card" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Báo cáo tóm tắt học lực</h4>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="block text-3xs text-slate-400 font-medium uppercase">ĐTB Chung học kỳ</span>
                          <span className="block text-3xl font-black text-indigo-700">
                            {generalGPA !== null ? generalGPA.toFixed(1) : 'Chưa xếp loại'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block text-3xs text-slate-400 font-medium uppercase">Xếp loại</span>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${rating.color}`}>
                            {rating.label}
                          </span>
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100 text-xs pt-2">
                        <div className="flex justify-between py-2">
                          <span className="text-slate-400">Môn học xuất sắc nhất:</span>
                          <span className="font-bold text-indigo-700">{bestSubjectName} ({bestSubjectGPA > -1 ? bestSubjectGPA.toFixed(1) : 'N/A'})</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-slate-400">Trạng thái rèn luyện:</span>
                          <span className="font-bold text-emerald-600">Đạt yêu cầu</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* RIGHT AREA: Report Card Details Sheet */}
                <div className="lg:col-span-8 space-y-6">
                  {activeClassId ? (
                    <div id="grades-report-card" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                      
                      {/* Report card header */}
                      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4 text-indigo-600" />
                            Bảng Điểm Chi Tiết - {activeClass?.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Niên khóa: {activeClass?.schoolYear} • Ban giám hiệu duyệt
                          </p>
                        </div>
                        
                        <button
                          onClick={() => window.print()}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 self-start sm:self-auto"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Xuất file PDF / In bảng điểm
                        </button>
                      </div>

                      {/* Grades Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                          <thead>
                            <tr className="bg-slate-50/50">
                              <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-slate-500">Môn học</th>
                              <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-slate-500">Điểm Miệng / 15 phút</th>
                              <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-slate-500">Điểm Giữa kỳ (hệ số 2)</th>
                              <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-slate-500">Điểm Cuối kỳ (hệ số 3)</th>
                              <th scope="col" className="px-3 py-3 text-center text-xs font-bold text-indigo-600 bg-indigo-50/20">Trung bình môn</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {subjects.map((sub) => {
                              // Filter grades
                              const subGrades = grades.filter(
                                (g) => g.studentId === activeStudent.id && g.classId === activeClassId && g.subjectId === sub.id
                              );

                              const oral = subGrades.filter((g) => g.type === 'mouth_15m');
                              const midterm = subGrades.filter((g) => g.type === 'midterm');
                              const final = subGrades.filter((g) => g.type === 'final');

                              const subjectGpa = calculateGPA(activeStudent.id, activeClassId, sub.id, grades);

                              return (
                                <tr key={sub.id} className="hover:bg-slate-50/20">
                                  {/* Subject Name */}
                                  <td className="whitespace-nowrap py-3.5 px-4 text-xs font-bold text-slate-800">
                                    {sub.name}
                                  </td>

                                  {/* Oral/15m scores list */}
                                  <td className="px-3 py-3.5 text-xs text-slate-700">
                                    <div className="flex flex-wrap gap-1">
                                      {oral.length > 0 ? (
                                        oral.map((g) => (
                                          <span 
                                            key={g.id} 
                                            className="inline-block rounded-md bg-slate-50 border border-slate-100 px-1.5 py-0.5 font-bold"
                                            title={g.note}
                                          >
                                            {g.score.toFixed(1)}
                                          </span>
                                        ))
                                      ) : (
                                        <span className="text-slate-300 italic">Chưa có đầu điểm</span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Midterm score */}
                                  <td className="px-3 py-3.5 text-xs">
                                    {midterm.length > 0 ? (
                                      midterm.map((g) => (
                                        <span key={g.id} className="inline-block rounded-md bg-orange-50 border border-orange-100 px-1.5 py-0.5 font-bold text-orange-700">
                                          {g.score.toFixed(1)}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-slate-300 italic">Chưa thi</span>
                                    )}
                                  </td>

                                  {/* Final score */}
                                  <td className="px-3 py-3.5 text-xs">
                                    {final.length > 0 ? (
                                      final.map((g) => (
                                        <span key={g.id} className="inline-block rounded-md bg-red-50 border border-red-100 px-1.5 py-0.5 font-bold text-red-700">
                                          {g.score.toFixed(1)}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-slate-300 italic">Chưa thi</span>
                                    )}
                                  </td>

                                  {/* Subject Average Score */}
                                  <td className="px-3 py-3.5 text-center bg-indigo-50/10 font-bold text-indigo-950 text-xs">
                                    {subjectGpa !== null ? (
                                      <div className="flex flex-col items-center">
                                        <span>{subjectGpa.toFixed(1)}</span>
                                        <span className="text-4xs text-slate-400 font-normal mt-0.5">
                                          {subjectGpa >= 8.0 ? 'Giỏi' : subjectGpa >= 6.5 ? 'Khá' : subjectGpa >= 5.0 ? 'TB' : 'Yếu'}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-slate-300 font-normal italic">Chưa xếp loại</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Direct comments and feedback corner */}
                      <div className="border-t border-slate-100 pt-5 space-y-3.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-indigo-500" />
                          Nhận xét, đánh giá của giáo viên chủ nhiệm
                        </h4>

                        <div id="comments-box" className="space-y-3">
                          {comments
                            .filter((c) => c.studentId === activeStudent.id && c.classId === activeClassId)
                            .map((comm) => (
                              <div key={comm.id} className="rounded-xl border border-indigo-50 bg-indigo-50/20 p-4">
                                <div className="flex items-center justify-between text-xxs font-bold text-indigo-900 mb-1.5">
                                  <span className="uppercase">{comm.teacherName}</span>
                                  <span className="font-normal text-slate-400">{comm.date}</span>
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed italic">
                                  "{comm.content}"
                                </p>
                              </div>
                            ))}

                          {comments.filter((c) => c.studentId === activeStudent.id && c.classId === activeClassId).length === 0 && (
                            <p className="text-xs text-slate-400 italic bg-slate-50/50 rounded-xl p-4 text-center">
                              Chưa có nhận xét tổng quát nào cho học kỳ này từ giáo viên.
                            </p>
                          )}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 bg-white shadow-sm">
                      Vui lòng chọn Lớp học ở thanh bên trái để kết xuất học bạ.
                    </div>
                  )}
                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}
