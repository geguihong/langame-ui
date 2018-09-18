import { signup } from '@/services/api/user';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(signup, payload);

      const status = response.code === 0 ? 'ok' : 'error';
      yield put({
        type: 'registerHandle',
        payload: { status },
      });

      if (response.code === 0) {
        yield put({
          type: 'login/onLoginSuccess',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
