import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(data: { email: string; password: string }): Promise<User> {
    const user: User = {
      id: this.users.length + 1,
      ...data,
    };
    this.users.push(user);
    return Promise.resolve(user); // Keep Promise interface
  }

  findByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(
      this.users.find((user: User) => user.email === email),
    );
  }

  findById(id: number): Promise<User | undefined> {
    return Promise.resolve(this.users.find((user: User) => user?.id === id));
  }
}
