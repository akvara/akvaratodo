export interface TodoList {
  _id: string;
  name: string;
  tasks: string;
  immutable: boolean;
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
