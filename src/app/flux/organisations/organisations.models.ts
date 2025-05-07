export interface Contact {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string;
  notes: string;
  company: number;
}

export interface Application {
  id: number;
  title: string;
  company: Company;
  status: {
    id: number;
    user_id: string;
    created_at: string;
    updated_at: string;
    name: string;
    order: number;
    color: string;
  };
  application_date: string;
  remote: boolean;
  location: string;
}

export interface Company {
  id: number;
  name: string;
  website?: string;
  description?: string;
  industry?: string;
  created_at: string;
  updated_at: string;
  contacts?: Contact[];
  applications?: Application[];
}
  