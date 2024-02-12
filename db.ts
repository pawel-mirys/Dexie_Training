import Dexie, { Table } from 'dexie';

export type Todo = {
  id?: number;
  task: string;
  completed: boolean;
};

export class MySubClassedDexie extends Dexie {
  todos!: Table<Todo>;
  constructor() {
    super('MyDB');
    const todoFields = Object.keys({} as Todo).join(', ');
    this.version(1).stores({
      todos: `++id, ${todoFields}`,
    });
  }
}

export const db = new MySubClassedDexie();