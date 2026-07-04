/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'teacher' | 'parent';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  phoneNumber?: string;
}

export interface ClassItem {
  id: string;
  name: string;
  gradeLevel: string; // e.g., "Lớp 10", "Lớp 11", "Lớp 12"
  schoolYear: string; // e.g., "2025-2026"
  description?: string;
}

export interface Student {
  id: string;
  studentCode: string; // e.g., "HS001"
  name: string;
  gender: 'Nam' | 'Nữ';
  dob: string; // Date of birth
  parentName: string;
  parentEmail: string; // Used to link with Parent accounts
  parentPhone: string;
  classIds: string[]; // Linked classes (student can belong to multiple classes)
}

export interface Subject {
  id: string;
  name: string;
}

export type GradeType = 'mouth_15m' | 'midterm' | 'final';

export interface Grade {
  id: string;
  studentId: string;
  classId: string;
  subjectId: string;
  type: GradeType;
  score: number; // 0 to 10 scale
  date: string;
  note?: string;
}

export interface TeacherComment {
  id: string;
  studentId: string;
  classId: string;
  teacherId: string;
  teacherName: string;
  content: string;
  date: string;
}
