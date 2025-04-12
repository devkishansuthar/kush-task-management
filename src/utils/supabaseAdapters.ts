
import { supabase } from "@/integrations/supabase/client";
import { Todo, Task, Comment, Attachment, TaskPriority, TaskStatus } from "@/types/task";
import { Company } from "@/types/company";

// Task adapters
export const mapDbTaskToTask = (dbTask: any, todos: Todo[] = [], comments: Comment[] = [], attachments: Attachment[] = []): Task => {
  return {
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description || "",
    status: dbTask.status as TaskStatus,
    priority: dbTask.priority as TaskPriority,
    createdAt: dbTask.created_at,
    dueDate: dbTask.due_date || new Date().toISOString(),
    companyId: dbTask.company_id || "",
    assignee: {
      id: dbTask.assignee_id || "",
      name: dbTask.assignee_name || "Unassigned",
      avatar: dbTask.assignee_avatar
    },
    reporter: {
      id: dbTask.reporter_id || "",
      name: dbTask.reporter_name || "System",
      avatar: dbTask.reporter_avatar
    },
    todos: todos,
    comments: comments,
    attachments: attachments
  };
};

export const mapTaskToDbTask = (task: Task) => {
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    due_date: task.dueDate,
    company_id: task.companyId,
    assignee_id: task.assignee.id,
    reporter_id: task.reporter.id
  };
};

// Todo adapters
export const mapDbTodoToTodo = (dbTodo: any): Todo => {
  return {
    id: dbTodo.id,
    content: dbTodo.content,
    completed: dbTodo.completed || false,
    taskId: dbTodo.task_id,
    createdAt: dbTodo.created_at
  };
};

export const mapTodoToDbTodo = (todo: Todo) => {
  return {
    content: todo.content,
    completed: todo.completed,
    task_id: todo.taskId
  };
};

// Company adapters
export const mapDbCompanyToCompany = (dbCompany: any): Company => {
  return {
    id: dbCompany.id,
    name: dbCompany.name,
    logo: dbCompany.logo,
    address: dbCompany.address,
    phone: dbCompany.phone,
    email: dbCompany.email,
    website: dbCompany.website,
    createdAt: dbCompany.created_at,
    employeeCount: dbCompany.employee_count || 0,
    status: dbCompany.status as "active" | "inactive" | "suspended"
  };
};

export const mapCompanyToDbCompany = (company: Company) => {
  return {
    name: company.name,
    logo: company.logo,
    address: company.address,
    phone: company.phone,
    email: company.email,
    website: company.website,
    employee_count: company.employeeCount,
    status: company.status
  };
};
