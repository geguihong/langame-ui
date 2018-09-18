import { queryProjectNotice } from '@/services/api';
import { listUserProjects, createProject } from '@/services/api/project'
import { setLocalStorage, getLocalStorage, removeLocalStorage } from '@/utils/LocalStorage'

export default {
  namespace: 'project',

  state: {
    notice: [],
    projects: [],
    currentProject: null
  },

  effects: {
    *fetch(_, { call, put, select }) {
      const response = yield call(listUserProjects);
      if (response.code === 0) {
        const projects = response.data.projects;
        if (projects.length) {
          const currentProject = yield select(state => state.project.currentProject);
          if (currentProject === null) {
            const cacheProjectId = getLocalStorage('currentProject');
            const arr = projects.filter(o => o.id === cacheProjectId);
            const defaultProject = arr && arr.length ? arr[0] : projects[0];

            yield put({
              type: 'switch',
              payload: defaultProject
            });
          }
        }
        yield put({
          type: 'saveProjects',
          payload: projects
        });
      }
    },

    *create({ payload }, { call, put }) {
      const response = yield call(createProject, payload);
      if (response.code === 0) {
        yield put({ type: 'fetch' });
      }
    },

    *fetchNotice(_, { call, put }) {
      const response = yield call(queryProjectNotice);
      yield put({
        type: 'saveNotice',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    saveProjects(state, { payload }) {
      return {
        ...state,
        projects: payload
      }
    },

    saveNotice(state, action) {
      return {
        ...state,
        notice: action.payload,
      };
    },

    switch(state, action) {
      const project = action.payload;
      setLocalStorage('currentProject', project.id);

      return {
        ...state,
        currentProject: project
      }
    },

    reset(state, action) {
      removeLocalStorage('currentProject');

      return {
        ...state,
        projects: [],
        currentProject: null
      }
    }
  },
};
