
// import { update as updatePopupRequireLogin } from "reducers/requireLogin";
import { call, fork, put, takeEvery } from "redux-saga/effects";
import userService, { IUser } from 'services/userService';
import { getAccessToken, login, logout, updateAccessToken } from "./user.reducers";

function* checkInfo() {
    const accessToken = getAccessToken();
    if (accessToken) {

        const info: IUser = yield call(userService.getInfo);

        if (info.user) {

            yield put({
                type: login().type,
                payload: { ...info.user }
            });

        } else {

            if (info.error) {
                yield put({
                    type: logout().type,
                });
            } else {

                // yield put({
                //     type: updatePopupRequireLogin().type,
                //     payload: { open: true, updateUser: false }
                // });

                // yield put({
                //     type: updateInfo().type,
                //     payload: { ...info }
                // });

            }
        }

    } else {

        yield put({
            type: logout().type,
        });

    }

}

export default function* userSaga() {
    yield fork(checkInfo);
    yield takeEvery(updateAccessToken().type, checkInfo);
}