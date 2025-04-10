
export interface Company {
  id: string;
  name: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  createdAt: string;
  employeeCount: number;
  status: "active" | "inactive" | "suspended";
}
