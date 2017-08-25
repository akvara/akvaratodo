import listSagas from './list-sagas';

export default function* RootSaga() {
    yield [
        listSagas(),
    ];
}
