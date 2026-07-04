/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClassItem, Student, Subject, Grade, TeacherComment, User } from './types';

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'math', name: 'Toán học' },
  { id: 'literature', name: 'Ngữ văn' },
  { id: 'english', name: 'Tiếng Anh' },
  { id: 'physics', name: 'Vật lý' },
  { id: 'chemistry', name: 'Hóa học' },
  { id: 'biology', name: 'Sinh học' },
  { id: 'history', name: 'Lịch sử' },
  { id: 'geography', name: 'Địa lý' },
];

export const INITIAL_CLASSES: ClassItem[] = [
  { id: 'class-10a1', name: 'Lớp 10A1', gradeLevel: 'Lớp 10', schoolYear: '2025-2026', description: 'Lớp chọn tự nhiên ban A' },
  { id: 'class-11b2', name: 'Lớp 11B2', gradeLevel: 'Lớp 11', schoolYear: '2025-2026', description: 'Lớp chuyên chuyên văn xã hội' },
  { id: 'class-12c3', name: 'Lớp 12C3', gradeLevel: 'Lớp 12', schoolYear: '2025-2026', description: 'Lớp luyện thi chất lượng cao' },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stud-1',
    studentCode: 'HS25001',
    name: 'Trần Minh Quân',
    gender: 'Nam',
    dob: '2010-05-15',
    parentName: 'Trần Văn Hùng',
    parentEmail: 'hung.tran@gmail.com',
    parentPhone: '0912345678',
    classIds: ['class-10a1', 'class-11b2'], // Enrolled in two classes for testing purposes
  },
  {
    id: 'stud-2',
    studentCode: 'HS25002',
    name: 'Nguyễn Linh Đan',
    gender: 'Nữ',
    dob: '2010-08-22',
    parentName: 'Nguyễn Hoàng Nam',
    parentEmail: 'nam.nguyen@gmail.com',
    parentPhone: '0987654321',
    classIds: ['class-10a1'],
  },
  {
    id: 'stud-3',
    studentCode: 'HS25003',
    name: 'Trần Mỹ Lệ',
    gender: 'Nữ',
    dob: '2009-11-03',
    parentName: 'Trần Văn Hùng',
    parentEmail: 'hung.tran@gmail.com',
    parentPhone: '0912345678',
    classIds: ['class-11b2'],
  },
  {
    id: 'stud-4',
    studentCode: 'HS25004',
    name: 'Lê Hoàng Bách',
    gender: 'Nam',
    dob: '2008-01-30',
    parentName: 'Lê Quốc Khánh',
    parentEmail: 'khanh.le@gmail.com',
    parentPhone: '0905112233',
    classIds: ['class-12c3'],
  },
  {
    id: 'stud-5',
    studentCode: 'HS25005',
    name: 'Phạm Thảo Chi',
    gender: 'Nữ',
    dob: '2008-04-12',
    parentName: 'Phạm Văn Minh',
    parentEmail: 'minh.pham@gmail.com',
    parentPhone: '0944556677',
    classIds: ['class-12c3'],
  },
];

export const INITIAL_GRADES: Grade[] = [
  // Student 1 (Trần Minh Quân) - Math
  { id: 'g-1', studentId: 'stud-1', classId: 'class-10a1', subjectId: 'math', type: 'mouth_15m', score: 9.0, date: '2026-06-05', note: 'Phát biểu tốt' },
  { id: 'g-2', studentId: 'stud-1', classId: 'class-10a1', subjectId: 'math', type: 'mouth_15m', score: 8.5, date: '2026-06-12', note: 'Kiểm tra bài cũ đạt' },
  { id: 'g-3', studentId: 'stud-1', classId: 'class-10a1', subjectId: 'math', type: 'midterm', score: 8.0, date: '2026-06-25', note: 'Làm tốt phần trắc nghiệm' },
  { id: 'g-4', studentId: 'stud-1', classId: 'class-10a1', subjectId: 'math', type: 'final', score: 8.5, date: '2026-07-02', note: 'Trình bày rõ ràng' },
  
  // Student 1 (Trần Minh Quân) - English
  { id: 'g-5', studentId: 'stud-1', classId: 'class-10a1', subjectId: 'english', type: 'mouth_15m', score: 8.0, date: '2026-06-08' },
  { id: 'g-6', studentId: 'stud-1', classId: 'class-10a1', subjectId: 'english', type: 'midterm', score: 7.5, date: '2026-06-24' },
  { id: 'g-7', studentId: 'stud-1', classId: 'class-10a1', subjectId: 'english', type: 'final', score: 9.0, date: '2026-07-01' },

  // Student 2 (Nguyễn Linh Đan) - Math
  { id: 'g-8', studentId: 'stud-2', classId: 'class-10a1', subjectId: 'math', type: 'mouth_15m', score: 7.0, date: '2026-06-05', note: 'Còn thiếu tập trung' },
  { id: 'g-9', studentId: 'stud-2', classId: 'class-10a1', subjectId: 'math', type: 'midterm', score: 7.5, date: '2026-06-25' },
  { id: 'g-10', studentId: 'stud-2', classId: 'class-10a1', subjectId: 'math', type: 'final', score: 8.0, date: '2026-07-02' },

  // Student 2 (Nguyễn Linh Đan) - English
  { id: 'g-11', studentId: 'stud-2', classId: 'class-10a1', subjectId: 'english', type: 'mouth_15m', score: 9.5, date: '2026-06-08', note: 'Phát âm rất tốt' },
  { id: 'g-12', studentId: 'stud-2', classId: 'class-10a1', subjectId: 'english', type: 'midterm', score: 9.0, date: '2026-06-24' },
  { id: 'g-13', studentId: 'stud-2', classId: 'class-10a1', subjectId: 'english', type: 'final', score: 9.5, date: '2026-07-01' },

  // Student 3 (Trần Mỹ Lệ) - Literature in Class 11B2
  { id: 'g-14', studentId: 'stud-3', classId: 'class-11b2', subjectId: 'literature', type: 'mouth_15m', score: 8.5, date: '2026-06-10', note: 'Bài viết giàu cảm xúc' },
  { id: 'g-15', studentId: 'stud-3', classId: 'class-11b2', subjectId: 'literature', type: 'midterm', score: 8.0, date: '2026-06-26' },
  { id: 'g-16', studentId: 'stud-3', classId: 'class-11b2', subjectId: 'literature', type: 'final', score: 8.5, date: '2026-07-03' },

  // Student 4 (Lê Hoàng Bách) - Physics in Class 12C3
  { id: 'g-17', studentId: 'stud-4', classId: 'class-12c3', subjectId: 'physics', type: 'mouth_15m', score: 10.0, date: '2026-06-15', note: 'Giải bài tập cực nhanh' },
  { id: 'g-18', studentId: 'stud-4', classId: 'class-12c3', subjectId: 'physics', type: 'midterm', score: 9.5, date: '2026-06-28' },
  { id: 'g-19', studentId: 'stud-4', classId: 'class-12c3', subjectId: 'physics', type: 'final', score: 9.8, date: '2026-07-03' },
];

export const INITIAL_COMMENTS: TeacherComment[] = [
  {
    id: 'c-1',
    studentId: 'stud-1',
    classId: 'class-10a1',
    teacherId: 't-1',
    teacherName: 'Cô Nguyễn Thị Mai',
    content: 'Em Minh Quân học tập rất nghiêm túc, luôn làm bài đầy đủ và hăng hái phát biểu xây dựng bài trong lớp Toán.',
    date: '2026-07-03',
  },
  {
    id: 'c-2',
    studentId: 'stud-2',
    classId: 'class-10a1',
    teacherId: 't-1',
    teacherName: 'Cô Nguyễn Thị Mai',
    content: 'Em Linh Đan tiếp thu tốt môn Tiếng Anh nhưng trong môn Toán cần chú ý rèn luyện thêm bài tập ở nhà.',
    date: '2026-07-03',
  }
];

// Helper to load or initialize LocalStorage
export function getStoredData<T>(key: string, initialValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(`Error loading key "${key}" from localStorage`, error);
    return initialValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving key "${key}" to localStorage`, error);
  }
}

// Vietnamese Grade Type Translations
export const GRADE_TYPE_LABELS: Record<string, { label: string; weight: number }> = {
  mouth_15m: { label: 'Miệng / 15 phút (hệ số 1)', weight: 1 },
  midterm: { label: 'Thi Giữa kỳ (hệ số 2)', weight: 2 },
  final: { label: 'Thi Cuối kỳ (hệ số 3)', weight: 3 },
};

// Calculate weighted average score (GPA)
export function calculateGPA(studentId: string, classId: string, subjectId: string, grades: Grade[]): number | null {
  const filteredGrades = grades.filter(
    (g) => g.studentId === studentId && g.classId === classId && g.subjectId === subjectId
  );

  if (filteredGrades.length === 0) return null;

  let totalWeight = 0;
  let totalPoints = 0;

  filteredGrades.forEach((g) => {
    const config = GRADE_TYPE_LABELS[g.type];
    if (config) {
      totalWeight += config.weight;
      totalPoints += g.score * config.weight;
    }
  });

  if (totalWeight === 0) return null;
  return Math.round((totalPoints / totalWeight) * 10) / 10;
}

// Calculate general GPA across all subjects in a class
export function calculateGeneralGPA(studentId: string, classId: string, grades: Grade[], subjects: Subject[]): number | null {
  let totalScore = 0;
  let subjectCount = 0;

  subjects.forEach((sub) => {
    const subjectGpa = calculateGPA(studentId, classId, sub.id, grades);
    if (subjectGpa !== null) {
      totalScore += subjectGpa;
      subjectCount++;
    }
  });

  if (subjectCount === 0) return null;
  return Math.round((totalScore / subjectCount) * 10) / 10;
}

// Determine Academic Performance Rating based on GPA
export function getPerformanceRating(gpa: number | null): { label: string; color: string } {
  if (gpa === null) return { label: 'Chưa xếp loại', color: 'text-neutral-400 bg-neutral-100 dark:bg-neutral-800' };
  if (gpa >= 8.0) return { label: 'Giỏi', color: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900' };
  if (gpa >= 6.5) return { label: 'Khá', color: 'text-indigo-700 bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900' };
  if (gpa >= 5.0) return { label: 'Trung bình', color: 'text-amber-700 bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900' };
  return { label: 'Yếu', color: 'text-rose-700 bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900' };
}
