
export interface User {
  id?: number,
  name: string,
  email: string,
  password: string,
  role?: "contributor" | "maintainer",
  created_at?: string,
  updated_at?: string
} 


export interface LoginBody {
  email: string,
  password: string
} 

