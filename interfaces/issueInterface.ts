// Import Prisma generated types
import { IssueStatus as PrismaIssueStatus, IssuePriority as PrismaIssuePriority } from "@/generated/prisma";

export interface IssueInterface {
  id: string;
  description: string | null;
  title: string;
  order: number;
  status: PrismaIssueStatus;
  priority: PrismaIssuePriority;
  sprintId: string | null;
  assigneeId: string | null;
  reporterId: string | null;
  projectId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  reporter?: {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    clerkUserId: string;
  } | null;
  assignee?: {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    clerkUserId: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

// Re-export Prisma enums for convenience
export const IssueStatus = PrismaIssueStatus;
export const IssuePriority = PrismaIssuePriority;

export type IssueStatus = PrismaIssueStatus;
export type IssuePriority = PrismaIssuePriority;

export interface CreateIssueData {
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  assigneeId?: string;
  sprintId?: string;
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
