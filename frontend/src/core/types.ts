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
