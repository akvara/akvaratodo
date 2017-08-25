// import listSagas from './list-sagas';
import testSagas from './test-sagas';

export default function* RootSaga() {
    yield [
        // listSagas(),
        testSagas()
    ];
}
