import { queryPathNode, getNode } from '@/services/api/pathnode'

export default {
    namespace: 'editor',

    state: {
        overview: {
            description: null
        },
        loading: false,
        nodes: []
    },

    effects: {
        *fetch({ payload }, { select, call, put }) {
            yield put({ type: 'setLoading' });

            const { type, node, recursion } = payload;
            const conditionParam = {
                id: type === 'entry' ? node : null,
                parent: type === 'path' ? node : null,
                recursion,
                type: 'entry'
            };

            // 获取编辑内容概述
            if (node > 0) {
                const response = yield call(getNode, node);
                if (response.code === 0) {
                    const node = response.data.node;
                    const isPath = node.type === 'path';
                    const description = `【${isPath ? '目录' : '词条'}】${node.complete_path} ${isPath && recursion ? '（包含子目录）' : ''}`;
                    yield put({
                        type: 'setOverview',
                        payload: { description }
                    });
                }
            }

            // 获取词条
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
        },

        setOverview(state, action) {
            return {
                ...state,
                overview: action.payload
            }
        }
    }
}