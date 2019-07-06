import { AxiosInstance } from 'axios';

const ListsServiceFactory = ({ HTTPBase }: { HTTPBase: AxiosInstance }) => {
  return {
    fetchListOfList: (): Promise<any> => HTTPBase.get('lists').then((res) => res.data),
    // addLists: (data): Promise<any> => HTTPBase.post('farms', data).then((res) => res.data),
    // updateLists: (data): Promise<any> => HTTPBase.patch(`farms/${data.id}`, data).then((res) => res.data),
  };
};

export default ListsServiceFactory;
