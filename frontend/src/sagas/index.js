import appSagas from './app-sagas';
import testSagas from './test-sagas';

export default function* RootSaga() {
    yield [
        appSagas(),
        testSagas()
    ];
}
