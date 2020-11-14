import api from './index';
import { NewTodoListEntity, TodoList } from '../../store/types';

export const apiGetListOfLists = (): Promise<TodoList[]> => api.lists.callGetListOfList();
export const apiGetAList = (listId: string): Promise<TodoList> => api.lists.callGetAList(listId);
export const apiCreateAList = (listName: string): Promise<TodoList> =>
  api.lists.callCreateAList(NewTodoListEntity(listName));
export const apiUpdateAList = (listId: string, data): Promise<TodoList> =>
  api.lists.callUpdateAList({ id: listId, ...data } as TodoList);
export const apiDeleteAList = (listId: string): Promise<TodoList> => api.lists.callDeleteAList(listId);
