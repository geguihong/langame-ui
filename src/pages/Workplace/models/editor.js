import { queryPathNode } from '@/services/api/pathnode'

export default {
    namespace: 'editor',

    state: {
        loading: false,
        nodes: []
    },

    effects: {
        *fetch({ payload }, { select, call, put }) {
            yield put({ type: 'setLoading' });

            const { type, node, recursion } = payload;

            // let { node, condition, currentPage, pageSize } = payload ? payload : {};
            // if (!node) {
            //     node = yield select(state => state.node_manager.currentNode);
            // }
            // condition = condition ? condition : {};
            const conditionParam = {
                id: type === 'entry' ? node : null,
                parent: type === 'path' ? node : null,
                recursion,
                type: 'entry'
            };

            const response = yield call(queryPathNode, conditionParam, 1, 10000);
            if (response.code === 0) {
                const { list } = response.data;
                yield put({
                    type: 'setNodes',
                    payload: list,
                });
            }
        },

    },

    reducers: {
        setLoading(state, action) {
            return {
                ...state,
                loading: true
            };
        },

        setNodes(state, action) {
            return {
                ...state,
                nodes: action.payload,
                loading: false
            }
        }
    }
}