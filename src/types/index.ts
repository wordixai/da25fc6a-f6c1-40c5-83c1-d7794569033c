export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  createdAt: Date;
  avatarUrl?: string;
}

export interface Case {
  id: string;
  clientId: string;
  title: string;
  caseNumber: string;
  status: 'open' | 'in-progress' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  practiceArea: string;
  description: string;
  assignedTo: string[];
  createdAt: Date;
  updatedAt: Date;
  courtDate?: Date;
  estimatedValue?: number;
}

export interface TimeEntry {
  id: string;
  caseId: string;
  userId: string;
  description: string;
  hours: number;
  date: Date;
  billable: boolean;
  hourlyRate?: number;
  status: 'draft' | 'submitted' | 'approved' | 'invoiced';
}

export interface Document {
  id: string;
  caseId: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  url: string;
  category: 'contract' | 'evidence' | 'correspondence' | 'filing' | 'other';
}

export interface Task {
  id: string;
  caseId: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
}

export interface CourtDate {
  id: string;
  caseId: string;
  title: string;
  date: Date;
  location: string;
  judge?: string;
  notes?: string;
  reminderSent: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'attorney' | 'paralegal' | 'admin';
  avatarUrl?: string;
  hourlyRate?: number;
}

export interface Note {
  id: string;
  caseId: string;
  content: string;
  createdBy: string;
  createdAt: Date;
}
