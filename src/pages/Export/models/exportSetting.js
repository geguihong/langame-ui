import { listSettings } from '@/services/api/export'

export default {
    namespace: 'exportSetting',

    state: {
        settings: [{}],
    },

    effects: {
        *loadSettings(_, { select, call, put }) {
            const currentProject = yield select(state => state.project.currentProject);

            const response = yield call(listSettings, currentProject.id);
            if (response.code === 0) {
                const { settings } = response.data;

                yield put({
                    type: 'saveSettings',
                    payload: settings,
                });
            }
        }
    },

    reducers: {
        saveSettings(state, { payload }) {
            return {
                ...state,
                settings: payload,
            }
        },
    }
}