import { AxiosInstance } from 'axios';
import { OmitId, TodoList } from '../../../store/types';

const listsUrl = 'lists';

const ListsServiceFactory = ({ HTTPBase }: { HTTPBase: AxiosInstance }) => {
  return {
    apiGetListOfList: (): Promise<TodoList[]> => HTTPBase.get(listsUrl).then((res) => res.data),
    apiGetAList: (listId: string): Promise<TodoList> => HTTPBase.get(`${listsUrl}/${listId}`).then((res) => res.data),
    apiCreateAList: (aList: OmitId<TodoList>): Promise<TodoList> => HTTPBase.post(listsUrl, aList).then((res) => res.data),
    apiUpdateAList: (aList: TodoList): Promise<TodoList> =>
      HTTPBase.put(`${listsUrl}/${aList._id}`, aList).then((res) => res.data),
    apiDeleteAList: (listId: string): Promise<any> =>
      HTTPBase.delete(`${listsUrl}/${listId}`).then((res) => res.data),
  };
};

export default ListsServiceFactory;
