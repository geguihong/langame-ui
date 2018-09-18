import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { signin } from '@/services/api/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { setToken } from '@/services/user';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(signin, payload);
      const status = response.code === 0 ? 'ok' : 'error';
      yield put({
        type: 'changeLoginStatus',
        payload: { status },
      });

      // Login successfully
      if (response.code === 0) {
        yield put({
          type: 'onLoginSuccess',
          payload: response.data,
        });
      }
    },

    *onLoginSuccess({ payload }, { call, put }) {
      const { token } = payload;

      setToken(token);
      reloadAuthorized();

      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params;
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.startsWith('/#')) {
            redirect = redirect.substr(2);
          }
        } else {
          window.location.href = redirect;
          return;
        }
      }
      yield put(routerRedux.replace(redirect || '/'));
    },

    *logout(_, { put }) {
      setToken(null);

      yield put({ type: 'user/reset' });
      yield put({ type: 'project/reset' });

      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });

      reloadAuthorized();

      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
