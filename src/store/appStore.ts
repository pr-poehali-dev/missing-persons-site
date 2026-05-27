import { useState, useCallback } from 'react';
import { User, MissingRequest, LogEntry, Role, RequestStatus, RequestComment } from '@/types';

const DEMO_USERS: User[] = [
  {
    id: 'u1',
    fullName: 'Смирнов Александр Петрович',
    login: 'admin',
    password: 'admin123',
    role: 'admin',
    department: 'БРНС Орловской области',
    createdAt: '2024-01-15T08:00:00Z',
    isActive: true,
  },
  {
    id: 'u2',
    fullName: 'Козлова Марина Ивановна',
    login: 'inspector1',
    password: 'insp123',
    role: 'inspector',
    department: 'БРНС Орловской области',
    rank: 'Старший инспектор',
    createdAt: '2024-02-10T08:00:00Z',
    isActive: true,
  },
  {
    id: 'u3',
    fullName: 'Петров Дмитрий Сергеевич',
    login: 'officer1',
    password: 'off123',
    role: 'officer',
    department: 'МВД России по Орловской области',
    rank: 'Майор полиции',
    createdAt: '2024-03-05T08:00:00Z',
    isActive: true,
  },
  {
    id: 'u4',
    fullName: 'Васильева Ольга Николаевна',
    login: 'inspector2',
    password: 'insp456',
    role: 'inspector',
    department: 'БРНС Орловской области',
    rank: 'Инспектор',
    createdAt: '2024-03-20T08:00:00Z',
    isActive: true,
  },
  {
    id: 'u5',
    fullName: 'Новиков Игорь Александрович',
    login: 'officer2',
    password: 'off456',
    role: 'officer',
    department: 'Следственный комитет РФ по Орловской области',
    rank: 'Капитан юстиции',
    createdAt: '2024-04-01T08:00:00Z',
    isActive: true,
  },
];

const DEMO_REQUESTS: MissingRequest[] = [
  {
    id: 'r1',
    type: 'medical',
    status: 'done',
    createdAt: '2025-05-10T09:30:00Z',
    updatedAt: '2025-05-12T14:00:00Z',
    authorId: 'u3',
    authorName: 'Петров Дмитрий Сергеевич',
    authorDepartment: 'МВД России по Орловской области',
    lastName: 'Иванов',
    firstName: 'Николай',
    middleName: 'Владимирович',
    birthDate: '1985-03-12',
    gender: 'male',
    lastKnownAddress: 'г. Орёл, ул. Ленина, 45, кв. 12',
    disappearanceDate: '2025-05-08',
    circumstances: 'Ушёл из дома утром, на связь не выходит, телефон не отвечает',
    medicalNotes: 'Страдает хроническим заболеванием, требует медикаментов',
    comments: [
      {
        id: 'c1',
        status: 'in_progress',
        text: 'Направлен запрос в медицинские учреждения области',
        createdAt: '2025-05-10T11:00:00Z',
        authorId: 'u2',
        authorName: 'Козлова Марина Ивановна',
      },
      {
        id: 'c2',
        status: 'done',
        text: 'Гражданин установлен',
        extendedText: 'Иванов Николай Владимирович был доставлен в ОГБУЗ "Орловская областная клиническая больница" 09.05.2025 в 03:40 в состоянии алкогольного опьянения. Находился в терапевтическом отделении, палата №214. Выписан 11.05.2025. О местонахождении уведомлены родственники.',
        createdAt: '2025-05-12T14:00:00Z',
        authorId: 'u2',
        authorName: 'Козлова Марина Ивановна',
      },
    ],
    assignedInspectorId: 'u2',
    assignedInspectorName: 'Козлова Марина Ивановна',
  },
  {
    id: 'r2',
    type: 'military',
    status: 'in_progress',
    createdAt: '2025-05-20T10:00:00Z',
    updatedAt: '2025-05-21T09:00:00Z',
    authorId: 'u3',
    authorName: 'Петров Дмитрий Сергеевич',
    authorDepartment: 'МВД России по Орловской области',
    lastName: 'Сидоров',
    firstName: 'Антон',
    middleName: 'Геннадьевич',
    birthDate: '1998-07-22',
    gender: 'male',
    lastKnownAddress: 'г. Орёл, ул. Комсомольская, 18',
    disappearanceDate: '2025-04-15',
    circumstances: 'Призван на военную службу, связь прекратилась 2 месяца назад',
    militaryUnit: 'В/ч 45612',
    militaryRank: 'Рядовой',
    serviceType: 'Срочная служба',
    comments: [
      {
        id: 'c3',
        status: 'in_progress',
        text: 'Направлен запрос в Министерство обороны РФ. Ожидается ответ.',
        createdAt: '2025-05-21T09:00:00Z',
        authorId: 'u4',
        authorName: 'Васильева Ольга Николаевна',
      },
    ],
    assignedInspectorId: 'u4',
    assignedInspectorName: 'Васильева Ольга Николаевна',
  },
  {
    id: 'r3',
    type: 'medical',
    status: 'new',
    createdAt: '2025-05-26T16:45:00Z',
    updatedAt: '2025-05-26T16:45:00Z',
    authorId: 'u5',
    authorName: 'Новиков Игорь Александрович',
    authorDepartment: 'Следственный комитет РФ по Орловской области',
    lastName: 'Морозова',
    firstName: 'Елена',
    middleName: 'Сергеевна',
    birthDate: '1972-11-03',
    gender: 'female',
    lastKnownAddress: 'Орловский район, с. Богодухово, ул. Садовая, 7',
    disappearanceDate: '2025-05-24',
    circumstances: 'Пенсионерка ушла в магазин и не вернулась, дезориентация не исключена',
    comments: [],
  },
];

const DEMO_LOGS: LogEntry[] = [
  {
    id: 'l1',
    userId: 'u2',
    userName: 'Козлова Марина Ивановна',
    action: 'Обновление статуса заявки',
    details: 'Заявка #r1: статус изменён на "Выполнено"',
    createdAt: '2025-05-12T14:00:00Z',
  },
  {
    id: 'l2',
    userId: 'u3',
    userName: 'Петров Дмитрий Сергеевич',
    action: 'Создание заявки',
    details: 'Создана заявка #r2 (военнослужащий, Сидоров А.Г.)',
    createdAt: '2025-05-20T10:00:00Z',
  },
  {
    id: 'l3',
    userId: 'u4',
    userName: 'Васильева Ольга Николаевна',
    action: 'Принятие заявки в работу',
    details: 'Заявка #r2: статус изменён на "В работе"',
    createdAt: '2025-05-21T09:00:00Z',
  },
  {
    id: 'l4',
    userId: 'u5',
    userName: 'Новиков Игорь Александрович',
    action: 'Создание заявки',
    details: 'Создана заявка #r3 (медицинское учреждение, Морозова Е.С.)',
    createdAt: '2025-05-26T16:45:00Z',
  },
];

export function useAppStore() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [requests, setRequests] = useState<MissingRequest[]>(DEMO_REQUESTS);
  const [logs, setLogs] = useState<LogEntry[]>(DEMO_LOGS);

  const login = useCallback((login: string, password: string): { success: boolean; error?: string } => {
    const user = users.find(u => u.login === login && u.password === password);
    if (!user) return { success: false, error: 'Неверный логин или пароль' };
    if (!user.isActive) return { success: false, error: 'Учётная запись заблокирована' };
    setCurrentUser(user);
    addLog(user, 'Вход в систему', `Пользователь вошёл в систему`);
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    if (currentUser) {
      addLog(currentUser, 'Выход из системы', 'Пользователь вышел из системы');
    }
    setCurrentUser(null);
  }, [currentUser]);

  const addLog = useCallback((user: User, action: string, details: string) => {
    const entry: LogEntry = {
      id: `l${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      action,
      details,
      createdAt: new Date().toISOString(),
    };
    setLogs(prev => [entry, ...prev]);
  }, []);

  const createRequest = useCallback((data: Omit<MissingRequest, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'status'>) => {
    const req: MissingRequest = {
      ...data,
      id: `r${Date.now()}`,
      status: 'new',
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRequests(prev => [req, ...prev]);
    if (currentUser) {
      addLog(currentUser, 'Создание заявки', `Создана заявка на ${data.type === 'medical' ? 'поиск в медучреждении' : 'статус военнослужащего'}: ${data.lastName} ${data.firstName}`);
    }
    return req;
  }, [currentUser, addLog]);

  const updateRequestStatus = useCallback((
    requestId: string,
    status: RequestStatus,
    comment: string,
    extendedText?: string
  ) => {
    if (!currentUser) return;
    const newComment: RequestComment = {
      id: `c${Date.now()}`,
      status,
      text: comment,
      extendedText,
      createdAt: new Date().toISOString(),
      authorId: currentUser.id,
      authorName: currentUser.fullName,
    };
    setRequests(prev => prev.map(r => {
      if (r.id !== requestId) return r;
      const updated = {
        ...r,
        status,
        updatedAt: new Date().toISOString(),
        comments: [...r.comments, newComment],
        assignedInspectorId: status === 'in_progress' ? currentUser.id : r.assignedInspectorId,
        assignedInspectorName: status === 'in_progress' ? currentUser.fullName : r.assignedInspectorName,
      };
      return updated;
    }));
    addLog(currentUser, 'Обновление статуса заявки', `Заявка #${requestId}: статус изменён на "${status}"`);
  }, [currentUser, addLog]);

  const addUser = useCallback((userData: Omit<User, 'id' | 'createdAt'>) => {
    const user: User = {
      ...userData,
      id: `u${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, user]);
    if (currentUser) {
      addLog(currentUser, 'Создание пользователя', `Создан пользователь: ${user.fullName}`);
    }
    return user;
  }, [currentUser, addLog]);

  const toggleUserActive = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
    if (currentUser) {
      const target = users.find(u => u.id === userId);
      addLog(currentUser, 'Изменение статуса пользователя', `Пользователь ${target?.fullName}: статус изменён`);
    }
  }, [currentUser, users, addLog]);

  const deleteUser = useCallback((userId: string) => {
    const target = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (currentUser && target) {
      addLog(currentUser, 'Удаление пользователя', `Удалён пользователь: ${target.fullName}`);
    }
  }, [currentUser, users, addLog]);

  return {
    currentUser,
    users,
    requests,
    logs,
    login,
    logout,
    createRequest,
    updateRequestStatus,
    addUser,
    toggleUserActive,
    deleteUser,
  };
}
