import appSagas from './list-sagas';

export default function* RootSaga() {
    yield [
        appSagas()
    ];
}
