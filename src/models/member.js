import { getMembers, addMember } from '@/services/api/member'

export default {
    namespace: 'member',

    state: {
        loading: false,
        members: []
    },

    effects: {
        *fetch({ payload }, { select, call, put }) {
            yield put({ type: 'setLoading' });

            const currentProject = yield select(state => state.project.currentProject);
            const response = yield call(getMembers, currentProject.id);
            if (response.code === 0) {
                const { list } = response.data;
                yield put({
                    type: 'saveMembers',
                    payload: list,
                });
            }
        },

        *add({ payload }, { select, call, put }) {
            const currentProject = yield select(state => state.project.currentProject);
            const response = yield call(addMember, currentProject.id, payload.username);
            if (response.code === 0) {
                yield put({ type: 'fetch' });
                return { success: true };
            }
            else {
                return { success: false, error: response.error };
            }
        }
    },

    reducers: {
        setLoading(state, _) {
            return {
                ...state,
                members: [],
                loading: true,
            };
        },

        saveMembers(state, action) {
            return {
                ...state,
                members: action.payload,
                loading: false
            }
        },
    }
}