export interface TodoList {
  _id?: string;
  name: string;
  tasks: string;
  done: string;
  immutable: boolean;
  lastAction: string;
}

export interface ListCreds {
  listId: string;
  name: string;
}

export interface ListTransferData {
  listId: string;
  task: string;
}

export interface ListMoveData {
  fromListId: string;
  task: string;
  listName: string;
  move: boolean;
}

export interface TodoListUpdate {
  name?: string;
  tasks: string;
  lastAction: string;
}

export const NewTodoListEntity = (name: string): TodoList => {
  return {
    lastAction: new Date().toISOString(),
    name,
    tasks: '[]',
    done: '[]',
    immutable: false,
  };
};
