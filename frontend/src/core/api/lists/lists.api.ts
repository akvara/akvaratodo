import { AxiosInstance } from 'axios';
import { OmitId, TodoList } from '../../../store/types';

const listsUrl = 'lists';

const ListsServiceFactory = ({ HTTPBase }: { HTTPBase: AxiosInstance }) => {
  return {
    callGetListOfList: (): Promise<TodoList[]> => HTTPBase.get(listsUrl).then((res) => res.data),
    callGetAList: (listId: string): Promise<TodoList> => HTTPBase.get(`${listsUrl}/${listId}`).then((res) => res.data),
    callCreateAList: (aList: OmitId<TodoList>): Promise<TodoList> => HTTPBase.post(listsUrl, aList).then((res) => res.data),
    callUpdateAList: (aList: TodoList): Promise<TodoList> =>
      HTTPBase.put(`${listsUrl}/${aList._id}`, aList).then((res) => res.data),
    callDeleteAList: (listId: string): Promise<any> =>
      HTTPBase.delete(`${listsUrl}/${listId}`).then((res) => res.data),
  };
};

export default ListsServiceFactory;
