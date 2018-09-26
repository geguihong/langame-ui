import { listSettings } from '@/services/api/export'

export default {
    namespace: 'exportTask',

    state: {
        tasks: [],
    },

    effects: {
        *fetch(_, { select, call, put }) {
            // const currentProject = yield select(state => state.project.currentProject);

            // const response = yield call(listSettings, currentProject.id);
            // if (response.code === 0) {
            //     const { settings } = response.data;

                
            // }

            yield put({
                type: 'saveTasks',
                payload: settings,
            });
        }
    },

    reducers: {
        saveTasks(state, { payload }) {
            return {
                ...state,
                tasks: payload,
            }
        },
    }
}