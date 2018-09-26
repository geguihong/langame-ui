import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Tag, Button, Alert, Input, Row, Col, Select } from 'antd'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Languages } from '@/services/languages'
import styles from './Setting.less';

@connect(({ project, exportSetting }) => ({
    currentProject: project.currentProject,
    exportSetting
}))
class Export extends Component {

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
            render: () => <a>查看详细</a>
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
            type: 'exportSetting/loadSettings'
        });
    }

    render() {
        const {
            exportSetting: { settings }
        } = this.props;

        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <div className={styles.tableListOperator}>
                        <Button icon="plus" type="primary">
                            新建
                        </Button>
                    </div>
                    <Table rowKey={o => o.id}
                        dataSource={settings}
                        columns={this.columns}
                        pagination={false} />
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default Export;
