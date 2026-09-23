import { AxiosInstance } from 'axios';
import { TodoList } from '../../../store/types';

const listsUrl = 'lists/';
const aListUrl = 'list/';

const ListsServiceFactory = ({ HTTPBase }: { HTTPBase: AxiosInstance }) => {
  return {
    callGetListOfList: (): Promise<TodoList[]> => HTTPBase.get(listsUrl).then((res) => res.data),
    callGetAList: (listId: string): Promise<TodoList> => HTTPBase.get(`${aListUrl}${listId}`).then((res) => res.data),
    callCreateAList: (aList: Omit<TodoList, 'id' | 'updatedAt'>): Promise<TodoList> =>
      HTTPBase.post(listsUrl, aList).then((res) => res.data),
    callUpdateAList: (aList: TodoList): Promise<TodoList> =>
      HTTPBase.put(`${aListUrl}${aList.id}`, aList).then((res) => res.data),
    callDeleteAList: (listId: string): Promise<any> => HTTPBase.delete(`${aListUrl}${listId}`).then((res) => res.data),
  };
};

export default ListsServiceFactory;
