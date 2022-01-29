import { all, fork } from "redux-saga/effects";
import userSaga from './user/user.sagas';
import pluginSaga from './plugins/plugin.sagas';
import settingSaga from './settings/setting.sagas';
import sidebarSaga from './sidebar/sidebar.sagas';

const sagaIndex = function* () {
    yield all([
        fork(userSaga),
        fork(settingSaga),
        fork(sidebarSaga),
        fork(pluginSaga),
        // fork(poupupLoginSaga),
    ]);
}

export default sagaIndex