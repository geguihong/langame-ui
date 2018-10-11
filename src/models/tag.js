import { listTags } from '@/services/api/tag'

export default {
    namespace: 'tag',

    state: {
        loading: false,
        tags: []
    },

    effects: {
        *fetch(_, { select, put, call }) {
            yield put({ type: 'setLoading' });

            const currentProject = yield select(state => state.project.currentProject);
            const response = yield call(listTags, currentProject.id);
            if (response.code === 0) {
                const { list } = response.data;
                yield put({
                    type: 'saveTags',
                    payload: list,
                });
            }
        }
    },

    reducers: {
        setLoading(state, _) {
            return {
                ...state,
                tags: [],
                loading: true,
            };
        },

        saveTags(state, action) {
            return {
                ...state,
                tags: action.payload,
                loading: false
            }
        },
    }

}