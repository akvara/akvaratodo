import CONFIG from '../config/config.js';

export interface TodoList {
  id: string;
  userId: number;
  name: string;
  tasks: string;
  done: string;
  immutable: boolean;
  lastAction: string;
  updatedAt: string;
}

export interface SerializedTodoList {
  listId: string;
  previousAction: string;
  taskToAdd?: string;
  listData: Partial<TodoList>;
}

export interface TodoListImpEx {
  fromListId: string;
  toListId: string;
}

export interface TodoListMove {
  fromListId: string;
  toListId: string;
  task: string;
}

export interface TodoListMoveByName {
  fromListId: string;
  listName: string;
  task: string;
  move: boolean;
  backToOldList?: boolean;
}

export interface TodoListCopy {
  toListId: string;
  task: string;
}

export interface ListCreds {
  listId: string;
  name: string;
}

export interface HotKey {
  key: string;
  listId?: string;
  listName?: string;
}

export interface ListNameOnly {
  listName: string;
}

export const getNewTodoListEntity = (listName: string): Omit<TodoList, 'id' | 'updatedAt'> => {
  if (!listName) {
    throw new Error('Trying create list without name!');
  }
  return {
    userId: CONFIG.user.id,
    lastAction: new Date().toISOString(),
    name: listName,
    tasks: '[]',
    done: '[]',
    immutable: false,
  };
};
