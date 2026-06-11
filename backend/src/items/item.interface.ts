export interface Item {
  id: number;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
  createdUser: string; // email of the user who created it
}
