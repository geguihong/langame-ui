import { listTasks, createTask } from '@/services/api/export'

export default {
    namespace: 'exportTask',

    state: {
        tasks: [],
    },

    effects: {
        *fetch(_, { select, call, put }) {
            const currentProject = yield select(state => state.project.currentProject);
            const response = yield call(listTasks, currentProject.id);
            if (response.code === 0) {
                const { tasks } = response.data;
                tasks.forEach(task => {
                    if (task.export_range) {
                        task.export_range = JSON.parse(task.export_range);
                        task.languages = task.languages.split(',');
                    }
                });

                yield put({
                    type: 'saveTasks',
                    payload: tasks,
                });
            }
        },

        *create({ payload }, { call, put }) {
            const response = yield call(createTask, { ...payload });
            if (response.code === 0) {
                yield put({ type: 'fetch' });
            }
        },
    },

    reducers: {
        saveTasks(state, { payload }) {
            return {
                ...state,
                tasks: payload,
            }
        },
    }
}