import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Tag, Button, Alert, Input, Row, Col, Select } from 'antd'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Languages } from '@/services/languages'
import styles from './Setting.less';

@connect(({ project, exportTask, exportSetting }) => ({
    currentProject: project.currentProject,
    exportTask,
    exportSetting
}))
class Export extends Component {

    columns = [
        {
            title: '任务ID',
            dataIndex: 'id'
        },
        {
            title: '任务配置',
            dataIndex: 'setting'
        },
        {
            title: '任务状态',
            key: 'status',
            render: () => <Tag color="green">导出中</Tag>
        },
        {
            title: '操作',
            key: 'operation',
            render: () => <div>
                <Button>修改</Button>
            </div>
        },
    ]

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'exprtTask/fetch'
        });
    }

    render() {
        const {
            exportTask: { tasks }
        } = this.props;

        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <div className={styles.tableListOperator}>
                        <Button icon="plus" type="primary">
                            创建任务
                        </Button>
                    </div>
                    <Table rowKey={o => o.id}
                        dataSource={tasks}
                        columns={this.columns}
                        pagination={false} />
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default Export;
