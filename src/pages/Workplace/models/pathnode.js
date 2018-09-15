import { queryPathNode, createNode, updateNode } from '@/services/api/pathnode'

export default {
    namespace: 'pathnode',

    state: {
        pathStack: [],
        currentNode: { id: 1, name: "Root", parent: 0 },
        nodes: {
            list: [],
            pagination: {}
        },
        loading: false
    },

    effects: {
        *fetch({ payload }, { select, call, put }) {
            yield put({ type: 'setLoading' });

            let { node, condition, currentPage, pageSize } = payload ? payload : {};
            if (!node) {
                node = yield select(state => state.pathnode.currentNode);
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
            const currentNode = yield select(state => state.pathnode.currentNode);
            const response = yield call(createNode, { ...payload, parent: currentNode.id });
            if (response.code === 0) {
                yield put({ type: 'fetch', payload: { node: currentNode } });
            }
        },

        *update({ payload }, { select, call, put }) {
            const currentNode = yield select(state => state.pathnode.currentNode);
            const response = yield call(updateNode, payload);
            if (response.code === 0) {
                const node = response.data.node;

                yield put({
                    type: 'updateNode',
                    payload: node,
                });

                return { success: true };
            }
            else {
                return { success: false, error: response.error };
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
                loading: false
            };
        },

        updateNode(state, action) {
            const newNode = action.payload;
            const { list } = state.nodes;
            for (let i = 0; i < list.length; i++) {
                if (list[i].id === newNode.id) {
                    Object.keys(newNode).forEach(key => {
                        list[i][key] = newNode[key];
                    });
                    break;
                }
            }
            return { ...state };
        },
    },
}