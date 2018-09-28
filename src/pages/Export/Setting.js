import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Tag, Button, Alert, Input, Row, Col, Select, Modal } from 'antd'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ExportSettingForm from '@/components/ExportSettingForm';
import styles from './Setting.less';

@connect(({ project, exportSetting }) => ({
    currentProject: project.currentProject,
    exportSetting
}))
class Export extends Component {

    state = {
        handleType: null,
        handlingExportSetting: null
    }

    columns = [
        {
            title: '配置名称',
            dataIndex: 'name'
        },
        {
            title: '配置类型',
            dataIndex: 'export_type'
        },
        {
            title: '更多配置',
            key: 'other',
            render: exportSetting => <a onClick={() => this.handleExportSetting('show', exportSetting)}>查看详细</a>
        },
        {
            title: '操作',
            key: 'operation',
            render: exportSetting => <div>
                <Button onClick={() => this.handleExportSetting('edit', exportSetting)}>修改</Button>
                <Button type="danger" onClick={() => this.deleteHandle(exportSetting)} style={{ marginLeft: 5 }}>删除</Button>
            </div>
        },
    ]

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'exportSetting/fetch'
        });
    }

    handleExportSetting = (handleType, exportSetting) => {
        this.setState({
            handlingExportSetting: exportSetting, handleType
        })
    }

    cancelHandle = () => {
        this.setState({ handlingExportSetting: null, handleType: null });
    }

    createHandle = (fields) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'exportSetting/create',
            payload: fields
        });
        this.cancelHandle();
    }

    updateHandle = (fields) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'exportSetting/update',
            payload: {
                ...fields,
                id: this.state.handlingExportSetting.id
            }
        });
        this.cancelHandle();
    }

    deleteHandle = (exportSetting) => {
        const self = this;
        Modal.confirm({
            title: '操作确认',
            content: '确认删除改配置？',
            onOk() {
                const { dispatch } = self.props;
                dispatch({
                    type: 'exportSetting/delete',
                    payload: exportSetting
                });
            },
        });
    }

    render() {
        const {
            currentProject,
            exportSetting: { settings }
        } = this.props;

        const {
            handleType,
            handlingExportSetting
        } = this.state;

        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <div className={styles.tableListOperator}>
                        <Button icon="plus" type="primary" onClick={() => this.handleExportSetting('create')}>
                            新建
                        </Button>
                    </div>
                    <Table rowKey={o => `${o.id}`}
                        dataSource={settings}
                        columns={this.columns}
                        pagination={false} />
                </Card>

                <ExportSettingForm
                    languages={currentProject.languages}
                    exportSetting={handlingExportSetting}
                    handleType={handleType}
                    cancelHandle={this.cancelHandle}
                    createHandle={this.createHandle}
                    updateHandle={this.updateHandle} />
            </PageHeaderWrapper>
        );
    }
}

export default Export;
