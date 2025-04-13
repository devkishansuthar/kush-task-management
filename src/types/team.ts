
export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  companyId: string;
  companyName: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
}
