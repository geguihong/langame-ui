import { getProjectRootNode, queryPathNode, createNode, updateNode, deleteNode } from '@/services/api/pathnode'

export default {
    namespace: 'node_manager',

    state: {
        pathStack: [],
        currentNode: { id: 1, name: "Root", parent: 0, type: "path" },
        nodes: {
            list: [],
            pagination: {}
        },
        loading: false
    },

    effects: {
        *loadRoot({ payload }, { call, put }) {
            const response = yield call(getProjectRootNode, payload.id);
            if (response.code === 0) {
                const node = response.data.node;
                yield put({
                    type: 'fetch',
                    payload: payload.action?payload.action:{ node }
                });
            }
        },

        *fetch({ payload }, { select, call, put }) {
            yield put({ type: 'setLoading' });

            let { node, condition, currentPage, pageSize } = payload ? payload : {};
            if (!node) {
                node = yield select(state => state.node_manager.currentNode);
            }
            condition = condition ? condition : {};
            const conditionParam = { ...condition, parent: node.id };

            const response = yield call(queryPathNode, conditionParam, currentPage, pageSize);
            if (response.code === 0) {
                const { list, total_size, page_number, page_size } = response.data;
                yield put({
                    type: 'setNodes',
                    payload: {
                        nodes: {
                            list,
                            pagination: {
                                current: page_number,
                                total: total_size,
                                pageSize: page_size,
                            }
                        },
                        currentNode: node,
                    },
                });
            }
        },

        *create({ payload }, { select, call, put }) {
            const currentNode = yield select(state => state.node_manager.currentNode);
            const response = yield call(createNode, { ...payload, parent: currentNode.id });
            if (response.code === 0) {
                yield put({ type: 'fetch', payload: { node: currentNode } });
            }
        },

        *update({ payload }, { select, call, put }) {
            const currentNode = yield select(state => state.node_manager.currentNode);
            const response = yield call(updateNode, payload);
            if (response.code === 0) {
                yield put({ type: 'fetch', payload: { node: currentNode } });
                return { success: true };
            }
            else {
                return { success: false, error: response.error };
            }
        },

        *delete({ payload }, { select, call, put }) {
            const currentNode = yield select(state => state.node_manager.currentNode);
            const response = yield call(deleteNode, payload);
            if (response.code === 0) {
                yield put({ type: 'fetch', payload: { node: currentNode } });
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
            const { nodes, currentNode } = action.payload;
            const pathStack = currentNode.parent === 0 ? [] : state.pathStack;
            for (let i = 0; i < pathStack.length; i++) {
                if (pathStack[i].id === currentNode.id) {
                    pathStack.splice(i, pathStack.length - i);
                    break;
                }
            }
            pathStack.push(currentNode);

            return {
                ...state,
                nodes,
                currentNode,
                pathStack,
                loading: false,
            };
        },
    },
}