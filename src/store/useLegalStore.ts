import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Client, Case, TimeEntry, Document, Task, CourtDate, TeamMember, Note } from '../types';

interface LegalStore {
  clients: Client[];
  cases: Case[];
  timeEntries: TimeEntry[];
  documents: Document[];
  tasks: Task[];
  courtDates: CourtDate[];
  teamMembers: TeamMember[];
  notes: Note[];

  // Client methods
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;

  // Case methods
  addCase: (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCase: (id: string, caseData: Partial<Case>) => void;
  deleteCase: (id: string) => void;
  getCaseById: (id: string) => Case | undefined;
  getCasesByClient: (clientId: string) => Case[];

  // Time entry methods
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  updateTimeEntry: (id: string, entry: Partial<TimeEntry>) => void;
  deleteTimeEntry: (id: string) => void;
  getTimeEntriesByCase: (caseId: string) => TimeEntry[];

  // Document methods
  addDocument: (doc: Omit<Document, 'id' | 'uploadedAt'>) => void;
  deleteDocument: (id: string) => void;
  getDocumentsByCase: (caseId: string) => Document[];

  // Task methods
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByCase: (caseId: string) => Task[];

  // Court date methods
  addCourtDate: (courtDate: Omit<CourtDate, 'id' | 'reminderSent'>) => void;
  updateCourtDate: (id: string, courtDate: Partial<CourtDate>) => void;
  deleteCourtDate: (id: string) => void;
  getCourtDatesByCase: (caseId: string) => CourtDate[];

  // Note methods
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  deleteNote: (id: string) => void;
  getNotesByCase: (caseId: string) => Note[];
}

export const useLegalStore = create<LegalStore>((set, get) => ({
  clients: [
    {
      id: '1',
      name: 'Acme Corporation',
      email: 'legal@acme.com',
      phone: '+1 (555) 123-4567',
      company: 'Acme Corporation',
      address: '123 Business St, New York, NY 10001',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1 (555) 987-6543',
      address: '456 Residential Ave, Los Angeles, CA 90001',
      createdAt: new Date('2024-02-20'),
    },
  ],
  cases: [
    {
      id: '1',
      clientId: '1',
      title: 'Contract Dispute - Vendor Agreement',
      caseNumber: 'CASE-2024-001',
      status: 'in-progress',
      priority: 'high',
      practiceArea: 'Contract Law',
      description: 'Dispute over vendor agreement terms and payment schedule',
      assignedTo: ['1', '2'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-03-10'),
      courtDate: new Date('2024-04-15'),
      estimatedValue: 250000,
    },
    {
      id: '2',
      clientId: '2',
      title: 'Personal Injury Claim',
      caseNumber: 'CASE-2024-002',
      status: 'open',
      priority: 'medium',
      practiceArea: 'Personal Injury',
      description: 'Slip and fall accident at commercial property',
      assignedTo: ['1'],
      createdAt: new Date('2024-02-25'),
      updatedAt: new Date('2024-03-05'),
      estimatedValue: 75000,
    },
  ],
  timeEntries: [
    {
      id: '1',
      caseId: '1',
      userId: '1',
      description: 'Initial client consultation and case review',
      hours: 2.5,
      date: new Date('2024-03-01'),
      billable: true,
      hourlyRate: 350,
      status: 'approved',
    },
    {
      id: '2',
      caseId: '1',
      userId: '2',
      description: 'Legal research on contract law precedents',
      hours: 4,
      date: new Date('2024-03-03'),
      billable: true,
      hourlyRate: 200,
      status: 'approved',
    },
  ],
  documents: [],
  tasks: [
    {
      id: '1',
      caseId: '1',
      title: 'Review vendor contract documents',
      description: 'Analyze all contract documents and identify breach points',
      assignedTo: '2',
      status: 'completed',
      priority: 'high',
      dueDate: new Date('2024-03-05'),
      createdAt: new Date('2024-03-01'),
    },
    {
      id: '2',
      caseId: '1',
      title: 'Prepare motion for discovery',
      description: 'Draft motion to compel discovery of financial records',
      assignedTo: '1',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date('2024-03-20'),
      createdAt: new Date('2024-03-10'),
    },
  ],
  courtDates: [
    {
      id: '1',
      caseId: '1',
      title: 'Preliminary Hearing',
      date: new Date('2024-04-15'),
      location: 'Superior Court, Room 304',
      judge: 'Hon. Michael Rodriguez',
      notes: 'Bring all contract documentation',
      reminderSent: false,
    },
  ],
  teamMembers: [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@lawfirm.com',
      role: 'attorney',
      hourlyRate: 350,
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@lawfirm.com',
      role: 'paralegal',
      hourlyRate: 200,
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily.davis@lawfirm.com',
      role: 'attorney',
      hourlyRate: 400,
    },
  ],
  notes: [],

  // Client methods
  addClient: (client) =>
    set((state) => ({
      clients: [...state.clients, { ...client, id: uuidv4(), createdAt: new Date() }],
    })),
  updateClient: (id, client) =>
    set((state) => ({
      clients: state.clients.map((c) => (c.id === id ? { ...c, ...client } : c)),
    })),
  deleteClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
    })),
  getClientById: (id) => get().clients.find((c) => c.id === id),

  // Case methods
  addCase: (caseData) =>
    set((state) => ({
      cases: [
        ...state.cases,
        {
          ...caseData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),
  updateCase: (id, caseData) =>
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === id ? { ...c, ...caseData, updatedAt: new Date() } : c
      ),
    })),
  deleteCase: (id) =>
    set((state) => ({
      cases: state.cases.filter((c) => c.id !== id),
    })),
  getCaseById: (id) => get().cases.find((c) => c.id === id),
  getCasesByClient: (clientId) => get().cases.filter((c) => c.clientId === clientId),

  // Time entry methods
  addTimeEntry: (entry) =>
    set((state) => ({
      timeEntries: [...state.timeEntries, { ...entry, id: uuidv4() }],
    })),
  updateTimeEntry: (id, entry) =>
    set((state) => ({
      timeEntries: state.timeEntries.map((e) => (e.id === id ? { ...e, ...entry } : e)),
    })),
  deleteTimeEntry: (id) =>
    set((state) => ({
      timeEntries: state.timeEntries.filter((e) => e.id !== id),
    })),
  getTimeEntriesByCase: (caseId) => get().timeEntries.filter((e) => e.caseId === caseId),

  // Document methods
  addDocument: (doc) =>
    set((state) => ({
      documents: [...state.documents, { ...doc, id: uuidv4(), uploadedAt: new Date() }],
    })),
  deleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
    })),
  getDocumentsByCase: (caseId) => get().documents.filter((d) => d.caseId === caseId),

  // Task methods
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, { ...task, id: uuidv4(), createdAt: new Date() }],
    })),
  updateTask: (id, task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...task } : t)),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
  getTasksByCase: (caseId) => get().tasks.filter((t) => t.caseId === caseId),

  // Court date methods
  addCourtDate: (courtDate) =>
    set((state) => ({
      courtDates: [...state.courtDates, { ...courtDate, id: uuidv4(), reminderSent: false }],
    })),
  updateCourtDate: (id, courtDate) =>
    set((state) => ({
      courtDates: state.courtDates.map((cd) => (cd.id === id ? { ...cd, ...courtDate } : cd)),
    })),
  deleteCourtDate: (id) =>
    set((state) => ({
      courtDates: state.courtDates.filter((cd) => cd.id !== id),
    })),
  getCourtDatesByCase: (caseId) => get().courtDates.filter((cd) => cd.caseId === caseId),

  // Note methods
  addNote: (note) =>
    set((state) => ({
      notes: [...state.notes, { ...note, id: uuidv4(), createdAt: new Date() }],
    })),
  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    })),
  getNotesByCase: (caseId) => get().notes.filter((n) => n.caseId === caseId),
}));
