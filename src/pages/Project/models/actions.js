import { getProjectActionRecords } from '@/services/api/action_record'

export default {
    namespace: 'actions',

    state: {
        loading: false,
        list: []
    },

    effects: {
        *fetchList({ payload }, { select, put, call }) {
            yield put({ type: 'setLoading' });

            const currentProject = yield select(state => state.project.currentProject);
            const response = yield call(getProjectActionRecords, currentProject.id);
            if (response.code === 0) {
                const { list } = response.data;
                yield put({
                    type: 'saveRecords',
                    payload: list,
                });
            }
        }
    },

    reducers: {
        setLoading(state, _) {
            return {
                ...state,
                list: [],
                loading: true,
            };
        },

        saveRecords(state, action) {
            return {
                ...state,
                list: action.payload,
                loading: false
            }
        },
    }
}