import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Tag, Button, Alert, Input, Row, Col, Select } from 'antd'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ExportTaskForm from '@/components/ExportTaskForm';
import { RangeTypes, Languages, ExportTaskStates } from '@/services/enums';
import styles from './Setting.less';

@connect(({ project, exportTask, exportSetting }) => ({
    currentProject: project.currentProject,
    exportTask,
    exportSetting
}))
class Task extends Component {

    state = {
        handlingExportTask: null,
        handleType: null
    }

    columns = [
        {
            title: '任务ID',
            dataIndex: 'id'
        },
        {
            title: '任务配置',
            key: 'setting',
            render: (task) => {
                const ref = this.getSettingRef(task);
                return <span>{ref ? ref.name : '-'}</span>
            }
        },
        {
            title: '导出范围',
            key: 'export_range',
            render: (task) => {
                return <span>{RangeTypes[task.export_range.type].text}</span>
            }
        },
        {
            title: '语言',
            key: 'languages',
            render: (task) => {
                return <div>
                    {
                        task.languages.map((v, k) => {
                            return <Tag key={k}>{Languages[v].name}</Tag>
                        })
                    }
                </div>
            }
        },
        {
            title: '任务状态',
            key: 'status',
            render: (task) => {
                const state = ExportTaskStates[task.state];
                return <Tag color={state.color}>{state.text}</Tag>
            }
        },
        {
            title: '操作',
            key: 'operation',
            render: (task) => <div>
                {task.state === 'success' ? <a onClick={() => this.handleExportTask('show', task)}>下载导出文件</a> : null}
            </div>
        },
    ]

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'exportSetting/fetch'
        });

        this.loadTasks(true);
        this.fetchInterval = setInterval(this.loadTasks, 1000);
    }

    componentWillUnmount() {
        if (this.fetchInterval) {
            clearInterval(this.fetchInterval);
            this.fetchInterval = null;
        }
    }

    loadTasks = (force) => {
        const { dispatch, exportTask: { tasks } } = this.props;

        if (!force) {
            const arr = tasks.filter(task => task.state === 'wait' || task.state === 'running');
            if (arr.length === 0) {
                return;
            }
        }

        dispatch({
            type: 'exportTask/fetch'
        });
    }

    getSettingRef = (task) => {
        const { exportSetting: { settings } } = this.props;
        const arr = settings.filter(o => o.id === task.export_setting);
        return arr && arr.length ? arr[0] : null;
    }

    handleExportTask = (handleType, exportTask) => {
        this.setState({
            handlingExportTask: exportTask, handleType
        });
    }

    cancelHandle = () => {
        this.setState({ handlingExportTask: null, handleType: null });
    }

    createHandle = (fields) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'exportTask/create',
            payload: fields
        });
        this.cancelHandle();
    }

    render() {
        const {
            currentProject,
            exportTask: { tasks },
            exportSetting: { settings },
        } = this.props;

        const {
            handlingExportTask,
            handleType
        } = this.state;

        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <div className={styles.tableListOperator}>
                        <Button icon="plus" type="primary" onClick={() => this.handleExportTask('create', null)}>
                            创建任务
                        </Button>
                    </div>
                    <Table rowKey={o => o.id}
                        dataSource={tasks}
                        columns={this.columns}
                        pagination={{
                            pageSize: 10
                        }} />
                </Card>

                <ExportTaskForm
                    currentProject={currentProject}
                    settings={settings}
                    exportTask={handlingExportTask}
                    handleType={handleType}
                    cancelHandle={this.cancelHandle}
                    createHandle={this.createHandle} />
            </PageHeaderWrapper>
        );
    }
}

export default Task;
