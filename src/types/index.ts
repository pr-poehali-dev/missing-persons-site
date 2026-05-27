export type Role = 'admin' | 'inspector' | 'officer';

export type RequestType = 'medical' | 'military';

export type RequestStatus = 'new' | 'in_progress' | 'done' | 'rejected';

export interface User {
  id: string;
  fullName: string;
  login: string;
  password: string;
  role: Role;
  department: string;
  rank?: string;
  createdAt: string;
  isActive: boolean;
}

export interface RequestComment {
  id: string;
  status: RequestStatus;
  text: string;
  extendedText?: string;
  createdAt: string;
  authorId: string;
  authorName: string;
}

export interface MissingRequest {
  id: string;
  type: RequestType;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  authorName: string;
  authorDepartment: string;

  // Данные о пропавшем
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  gender: 'male' | 'female';
  lastKnownAddress: string;
  disappearanceDate: string;
  circumstances: string;

  // Для медицинского запроса
  medicalNotes?: string;

  // Для военного запроса
  militaryUnit?: string;
  militaryRank?: string;
  serviceType?: string;

  comments: RequestComment[];
  assignedInspectorId?: string;
  assignedInspectorName?: string;
}

export interface LogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  createdAt: string;
}
