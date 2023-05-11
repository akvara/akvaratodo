import api from './index';
import { getNewTodoListEntity, TodoList } from '../../store/types';

export const apiGetListOfLists = (): Promise<TodoList[]> => api.lists.callGetListOfList();
export const apiGetAList = (listId: string): Promise<TodoList> => api.lists.callGetAList(listId);
export const apiCreateAList = (listName: string): Promise<TodoList> =>
  api.lists.callCreateAList(getNewTodoListEntity(listName));
export const apiUpdateAList = (listId: string, data): Promise<TodoList> =>
  api.lists.callUpdateAList({ id: listId, ...data } as TodoList);
export const apiDeleteAList = (listId: string): Promise<TodoList> => api.lists.callDeleteAList(listId);
