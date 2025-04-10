
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in progress" | "completed" | "blocked";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  dueDate: string;
  companyId: string;
  assignee: {
    id: string;
    name: string;
    avatar?: string;
  };
  reporter: {
    id: string;
    name: string;
    avatar?: string;
  };
  todos: Todo[];
  comments: Comment[];
  attachments: Attachment[];
}

export interface Todo {
  id: string;
  content: string;
  completed: boolean;
  taskId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  taskId: string;
  uploadedBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}
