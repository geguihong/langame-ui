import { listSettings, createSetting, updateSetting, deleteSetting } from '@/services/api/export'

export default {
    namespace: 'exportSetting',

    state: {
        settings: [{}],
    },

    effects: {
        *fetch(_, { select, call, put }) {
            const currentProject = yield select(state => state.project.currentProject);

            const response = yield call(listSettings, currentProject.id);
            if (response.code === 0) {
                const { settings } = response.data;
                settings.forEach(setting => {
                    if (setting.filename_mapping) {
                        setting.filename_mapping = JSON.parse(setting.filename_mapping);
                    }
                });

                yield put({
                    type: 'saveSettings',
                    payload: settings,
                });
            }
        },

        *create({ payload }, { select, call, put }) {
            const currentProject = yield select(state => state.project.currentProject);

            const response = yield call(createSetting, { ...payload, project_id: currentProject.id });
            if (response.code === 0) {
                yield put({ type: 'fetch' });
            }
        },

        *update({ payload }, { call, put }) {
            const response = yield call(updateSetting, { ...payload });
            if (response.code === 0) {
                yield put({ type: 'fetch' });
            }
        },

        *delete({ payload }, { call, put }) {
            const response = yield call(deleteSetting, { ...payload });
            if (response.code === 0) {
                yield put({ type: 'fetch' });
            }
        },
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