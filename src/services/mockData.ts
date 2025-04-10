import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { Company } from "@/types/company";

// Mock companies
export const mockCompanies: Company[] = [
  {
    id: "company1",
    name: "Acme Inc.",
    logo: "",
    address: "123 Main St, City",
    phone: "+1 (555) 123-4567",
    email: "info@acme.com",
    website: "https://acme.com",
    createdAt: "2023-01-15T09:30:00Z",
    employeeCount: 25,
    status: "active",
  },
  {
    id: "company2",
    name: "TechGiant Corp",
    logo: "",
    address: "456 Tech Blvd, Town",
    phone: "+1 (555) 987-6543",
    email: "info@techgiant.com",
    website: "https://techgiant.com",
    createdAt: "2023-02-20T14:45:00Z",
    employeeCount: 120,
    status: "active",
  },
  {
    id: "company3",
    name: "StartupBoost LLC",
    logo: "",
    address: "789 Innovation Way",
    phone: "+1 (555) 456-7890",
    email: "hello@startupboost.com",
    website: "https://startupboost.com",
    createdAt: "2023-03-10T11:15:00Z",
    employeeCount: 8,
    status: "active",
  },
];

// Mock tasks
export const mockTasks: Task[] = [
  {
    id: "task1",
    title: "Implement dashboard analytics",
    description: "Create charts and statistics for the main dashboard view. Include task completion rates and team performance metrics.",
    status: "in progress",
    priority: "high",
    createdAt: "2023-04-05T08:00:00Z",
    dueDate: "2023-04-15",
    companyId: "company1",
    assignee: {
      id: "3",
      name: "Regular User",
      avatar: "",
    },
    reporter: {
      id: "2",
      name: "Company Admin",
      avatar: "",
    },
    todos: [
      {
        id: "todo1",
        content: "Design chart components",
        completed: true,
        taskId: "task1",
        createdAt: "2023-04-05T09:00:00Z",
      },
      {
        id: "todo2",
        content: "Implement data fetching",
        completed: false,
        taskId: "task1",
        createdAt: "2023-04-05T09:05:00Z",
      },
      {
        id: "todo3",
        content: "Add filtering options",
        completed: false,
        taskId: "task1",
        createdAt: "2023-04-05T09:10:00Z",
      },
    ],
    comments: [
      {
        id: "comment1",
        content: "Let's prioritize the completion rate chart first.",
        taskId: "task1",
        user: {
          id: "2",
          name: "Company Admin",
          avatar: "",
        },
        createdAt: "2023-04-06T10:30:00Z",
      },
    ],
    attachments: [
      {
        id: "attachment1",
        name: "dashboard_design.pdf",
        url: "",
        type: "application/pdf",
        size: 2457600,
        taskId: "task1",
        uploadedBy: {
          id: "2",
          name: "Company Admin",
        },
        createdAt: "2023-04-05T11:30:00Z",
      },
    ],
  },
  {
    id: "task2",
    title: "Fix user authentication bug",
    description: "Users are occasionally getting logged out when navigating between pages. Investigate and resolve the issue.",
    status: "todo",
    priority: "urgent",
    createdAt: "2023-04-06T09:00:00Z",
    dueDate: "2023-04-08",
    companyId: "company1",
    assignee: {
      id: "3",
      name: "Regular User",
      avatar: "",
    },
    reporter: {
      id: "2",
      name: "Company Admin",
      avatar: "",
    },
    todos: [
      {
        id: "todo4",
        content: "Check token expiration logic",
        completed: false,
        taskId: "task2",
        createdAt: "2023-04-06T09:30:00Z",
      },
      {
        id: "todo5",
        content: "Test authentication flow",
        completed: false,
        taskId: "task2",
        createdAt: "2023-04-06T09:35:00Z",
      },
    ],
    comments: [],
    attachments: [],
  },
  {
    id: "task3",
    title: "Update user documentation",
    description: "Add sections for new features and improve existing guides for better clarity.",
    status: "completed",
    priority: "low",
    createdAt: "2023-04-02T14:00:00Z",
    dueDate: "2023-04-07",
    companyId: "company1",
    assignee: {
      id: "3",
      name: "Regular User",
      avatar: "",
    },
    reporter: {
      id: "2",
      name: "Company Admin",
      avatar: "",
    },
    todos: [
      {
        id: "todo6",
        content: "Update installation guide",
        completed: true,
        taskId: "task3",
        createdAt: "2023-04-02T14:30:00Z",
      },
      {
        id: "todo7",
        content: "Add FAQ section",
        completed: true,
        taskId: "task3",
        createdAt: "2023-04-02T14:35:00Z",
      },
      {
        id: "todo8",
        content: "Proofread entire document",
        completed: true,
        taskId: "task3",
        createdAt: "2023-04-02T14:40:00Z",
      },
    ],
    comments: [
      {
        id: "comment2",
        content: "Documentation looks great! Thanks for the thorough update.",
        taskId: "task3",
        user: {
          id: "2",
          name: "Company Admin",
          avatar: "",
        },
        createdAt: "2023-04-07T11:00:00Z",
      },
    ],
    attachments: [
      {
        id: "attachment2",
        name: "user_guide_v2.docx",
        url: "",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 1548800,
        taskId: "task3",
        uploadedBy: {
          id: "3",
          name: "Regular User",
        },
        createdAt: "2023-04-07T10:30:00Z",
      },
    ],
  },
  {
    id: "task4",
    title: "Design new landing page",
    description: "Create a modern, responsive landing page design that highlights our key features and benefits.",
    status: "in progress",
    priority: "medium",
    createdAt: "2023-04-04T10:00:00Z",
    dueDate: "2023-04-14",
    companyId: "company2",
    assignee: {
      id: "4",
      name: "Jane Designer",
      avatar: "",
    },
    reporter: {
      id: "5",
      name: "Tech Manager",
      avatar: "",
    },
    todos: [
      {
        id: "todo9",
        content: "Create wireframes",
        completed: true,
        taskId: "task4",
        createdAt: "2023-04-04T10:30:00Z",
      },
      {
        id: "todo10",
        content: "Design hero section",
        completed: true,
        taskId: "task4",
        createdAt: "2023-04-04T10:35:00Z",
      },
      {
        id: "todo11",
        content: "Design feature sections",
        completed: false,
        taskId: "task4",
        createdAt: "2023-04-04T10:40:00Z",
      },
    ],
    comments: [],
    attachments: [],
  },
  {
    id: "task5",
    title: "Research competitor pricing",
    description: "Analyze competitor pricing strategies and prepare a report with recommendations for our pricing model.",
    status: "todo",
    priority: "medium",
    createdAt: "2023-04-07T09:00:00Z",
    dueDate: "2023-04-21",
    companyId: "company3",
    assignee: {
      id: "6",
      name: "Marketing Specialist",
      avatar: "",
    },
    reporter: {
      id: "7",
      name: "Startup CEO",
      avatar: "",
    },
    todos: [
      {
        id: "todo12",
        content: "Identify main competitors",
        completed: false,
        taskId: "task5",
        createdAt: "2023-04-07T09:30:00Z",
      },
      {
        id: "todo13",
        content: "Gather pricing information",
        completed: false,
        taskId: "task5",
        createdAt: "2023-04-07T09:35:00Z",
      },
      {
        id: "todo14",
        content: "Create comparison spreadsheet",
        completed: false,
        taskId: "task5",
        createdAt: "2023-04-07T09:40:00Z",
      },
    ],
    comments: [],
    attachments: [],
  },
];

// Mock activities for the activity feed
export const mockActivities = [
  {
    id: "activity1",
    user: {
      name: "Company Admin",
    },
    action: "created a new task",
    target: "Implement dashboard analytics",
    timestamp: "1 hour ago",
    type: "task" as const,
  },
  {
    id: "activity2",
    user: {
      name: "Regular User",
    },
    action: "completed a todo item",
    target: "Design chart components",
    timestamp: "3 hours ago",
    type: "todo" as const,
  },
  {
    id: "activity3",
    user: {
      name: "Company Admin",
    },
    action: "added a comment on",
    target: "Implement dashboard analytics",
    timestamp: "5 hours ago",
    type: "comment" as const,
  },
  {
    id: "activity4",
    user: {
      name: "Regular User",
    },
    action: "marked task as completed",
    target: "Update user documentation",
    timestamp: "1 day ago",
    type: "status" as const,
  },
  {
    id: "activity5",
    user: {
      name: "Company Admin",
    },
    action: "assigned a task to",
    target: "Regular User",
    timestamp: "2 days ago",
    type: "task" as const,
  },
];

// Get tasks for a specific company
export const getCompanyTasks = (companyId: string): Task[] => {
  return mockTasks.filter((task) => task.companyId === companyId);
};

// Get task summary data for charts
export const getTaskSummaryData = (companyId?: string) => {
  let filteredTasks = mockTasks;
  
  if (companyId) {
    filteredTasks = filteredTasks.filter((task) => task.companyId === companyId);
  }
  
  const statusSummary = filteredTasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    {} as Record<TaskStatus, number>
  );
  
  const prioritySummary = filteredTasks.reduce(
    (acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    },
    {} as Record<TaskPriority, number>
  );
  
  const statusData = [
    {
      name: "To Do",
      value: statusSummary.todo || 0,
      color: "#94a3b8",
    },
    {
      name: "In Progress",
      value: statusSummary["in progress"] || 0,
      color: "#3b82f6",
    },
    {
      name: "Completed",
      value: statusSummary.completed || 0,
      color: "#22c55e",
    },
    {
      name: "Blocked",
      value: statusSummary.blocked || 0,
      color: "#ef4444",
    },
  ];
  
  const priorityData = [
    {
      name: "Low",
      value: prioritySummary.low || 0,
      color: "#4ADE80",
    },
    {
      name: "Medium",
      value: prioritySummary.medium || 0,
      color: "#FACC15",
    },
    {
      name: "High",
      value: prioritySummary.high || 0,
      color: "#F97316",
    },
    {
      name: "Urgent",
      value: prioritySummary.urgent || 0,
      color: "#EF4444",
    },
  ];
  
  return {
    statusData,
    priorityData,
    total: filteredTasks.length,
  };
};
