import { query as queryUsers, queryCurrent } from '@/services/user';
import { getUser } from '@/services/api/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(getUser);
      if (response.code === 0) {
        const user = response.data.user;
        user.name = user.email;
        user.avatar = 'https://static.insta360.com/assets/www/favicons/favicon-96x96.png';
        yield put({
          type: 'saveCurrentUser',
          payload: user,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    reset(state, action) {
      return {
        ...state,
        currentUser: {}
      }
    }
  },
};
