import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Item } from './item.interface';

@Injectable()
export class ItemsService {
  private readonly filePath = path.join(process.cwd(), 'data', 'items.json');

  constructor() {
    this.ensureDataFileExists();
  }

  private ensureDataFileExists() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  private readItems(): Item[] {
    const data = fs.readFileSync(this.filePath, 'utf8');
    return JSON.parse(data);
  }

  private writeItems(items: Item[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2));
  }

  async findAll(): Promise<Item[]> {
    return this.readItems();
  }

  async findOne(id: number): Promise<Item> {
    const items = this.readItems();
    const item = items.find((i) => i.id === id);
    if (!item) throw new NotFoundException(`Item with ID ${id} not found`);
    return item;
  }

  async create(
    title: string,
    status: Item['status'],
    userEmail: string,
  ): Promise<Item> {
    const items = this.readItems();
    const newItem: Item = {
      id: items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1,
      title,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdUser: userEmail,
    };

    items.push(newItem);
    this.writeItems(items);
    return newItem;
  }

  async update(
    id: number,
    title: string,
    status: Item['status'],
  ): Promise<Item> {
    const items = this.readItems();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1)
      throw new NotFoundException(`Item with ID ${id} not found`);

    items[index] = {
      ...items[index],
      title,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.writeItems(items);
    return items[index];
  }

  async remove(id: number): Promise<void> {
    const items = this.readItems();
    const filtered = items.filter((i) => i.id !== id);
    if (filtered.length === items.length)
      throw new NotFoundException(`Item with ID ${id} not found`);
    this.writeItems(filtered);
  }
}
