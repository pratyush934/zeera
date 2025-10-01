export interface IssueInterface {
  id: string;
  description: string;
  title: string;
  order: number;
  status: string;
  priority: string;
  sprintId: string;
  assigneeId: string;
  reporterId: string;
}

export enum IssueStatus {
  TODO,
  IN_PROGRESS,
  IN_REVIEW,
  DONE,
}

/* 
 id          String  @id @default(cuid())
  title       String
  description String?

  status   IssueStatus
  order    Int
  priority IssuePriority

  reporter   User?    @relation("Reporter", fields: [reporterId], references: [id])
  reporterId String?
  assignee   User     @relation("Assignee", fields: [assigneeId], references: [id])
  assigneeId String
  Project    Project? @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId  String?
  Sprint     Sprint?  @relation(fields: [sprintId], references: [id], onDelete: Cascade)
  sprintId   String?

  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
*/
