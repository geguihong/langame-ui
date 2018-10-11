import { queryPathNode, getNode } from '@/services/api/pathnode'
import { getNodeEntries, updateNodeEntries } from '@/services/api/lang_entry'

export default {
    namespace: 'editor',

    state: {
        overview: {
            description: null
        },
        loading: false,
        nodes: [],

        entryStore: {},
        loadedLanguages: {},
        changedEntries: {}
    },

    effects: {
        *fetch({ payload }, { select, call, put }) {
            yield put({ type: 'setLoading' });

            console.log(payload);

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
                console.log('b2 ', Date.parse(new Date()));
            }
        },

        *loadEntry({ payload }, { select, call, put }) {
            const language = payload;
            const loadedLanguages = yield select(state => state.editor.loadedLanguages);
            if (!loadedLanguages[language]) {
                const nodes = yield select(state => state.editor.nodes);

                console.log('c ', Date.parse(new Date()));
                const response = yield call(getNodeEntries, nodes, language);
                console.log('c1 ', Date.parse(new Date()));
                if (response.code === 0) {
                    const { entries } = response.data;
                    yield put({
                        type: 'saveLanguageEntries',
                        payload: {
                            entries,
                            language
                        },
                    });

                    console.log('c2 ', Date.parse(new Date()));
                }
            }
        },

        *submitChangedEntries({ payload }, { select, call, put }) {
            const changedEntries = yield select(state => state.editor.changedEntries);
            const entries = Object.keys(changedEntries).map(k => changedEntries[k]);
            if (entries.length) {
                const response = yield call(updateNodeEntries, entries);
                if (response.code === 0) {
                    yield put({ type: 'resetChangedEntries' });
                }
            }
        }

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
                loading: false,
                entryStore: {},
                loadedLanguages: {},
                changedEntries: {}
            }
        },

        setOverview(state, action) {
            return {
                ...state,
                overview: action.payload
            }
        },

        saveLanguageEntries(state, { payload }) {
            const { entries, language } = payload;
            const { loadedLanguages, entryStore } = state;
            loadedLanguages[language] = true;

            for (let i in entries) {
                const map = entries[i];
                for (let j in map) {
                    const entry = map[j];
                    if (!entryStore[i]) {
                        entryStore[i] = {};
                    }
                    entry.originContent = entry.content;
                    entryStore[i][j] = entry;
                }
            }

            return {
                ...state,
                loading: false,
                loadedLanguages,
                entryStore
            }
        },

        updateNodeEntry(state, { payload }) {
            const { nodeId, language, content } = payload;
            const { entryStore, changedEntries } = state;
            const map = entryStore[`${nodeId}`] ? entryStore[`${nodeId}`] : (entryStore[`${nodeId}`] = {});
            const entry = map[language] ? map[language] : (map[language] = {
                node: nodeId,
                language,
                originContent: ''
            });
            entry.content = content;

            const changedKey = `${nodeId}_${language}`;
            const changed = entry.content !== entry.originContent;
            if (changed) {
                changedEntries[changedKey] = entry;
            }
            else {
                delete changedEntries[changedKey];
            }

            return { ...state, entryStore, changedEntries }
        },

        resetChangedEntries(state, action) {
            const { changedEntries } = state;
            Object.keys(changedEntries).forEach(k => {
                const entry = changedEntries[k];
                entry.originContent = entry.content;
            });
            return { ...state, changedEntries: {} }
        }
    }
}