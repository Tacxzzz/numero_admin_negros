export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  uplineId: string | null;
  level: number;
}