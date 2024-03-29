import { Error } from 'tslint/lib/error';
import CONFIG from '../config/config.js';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type OmitId<T extends { id: string }> = Omit<T, 'id'>;

export interface TodoList {
  id: string;
  userId: number;
  name: string;
  tasks: string;
  done: string;
  immutable: boolean;
  lastAction: string;
}

export interface SerializedTodoList {
  listId: string;
  itemsDone: string[];
  itemsTodo: string[];
  lastAction: string;
  previousAction: string;
  taskToAdd?: string;
  listData?: TodoList;
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
  listId: string;
  listName: string;
}

export interface ListNameOnly {
  listName: string;
}

export const getNewTodoListEntity = (listName: string): OmitId<TodoList> => {
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
