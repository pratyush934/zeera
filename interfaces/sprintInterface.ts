export interface Sprint {
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface SprintWithId extends Sprint {
  id: string;
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED';
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}
