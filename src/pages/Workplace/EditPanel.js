import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Tag, Divider, Alert, Input, Row, Col, Card } from 'antd'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './EditPanel.less';

const TextArea = Input.TextArea;

@connect(({ editor }) => ({
    editor
}))
class EditPanel extends Component {

    state = {
        refrenceLanuage: 'zh-CN',
        editLanuage: 'en-US',
    }

    componentDidMount() {
        const { type, node, recursion } = this.props.location.query;
        this.loadNodes({ type, node, recursion });
    }

    loadNodes = (params) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'editor/fetch',
            payload: params
        });
    }

    getLanguages = () => {
        const { refrenceLanuage, editLanuage } = this.state;
        const langauges = [];
        if (refrenceLanuage) {
            langauges.push(refrenceLanuage);
        }
        if (editLanuage) {
            langauges.push(editLanuage);
        }
        return langauges;
    }

    getColumns = (langauges) => {
        const columns = [{
            key: 'info',
            colSpan: 0,
            render: (node) => {
                return {
                    children: <Row>
                        <Col span={12}>
                            <span>{node.name}</span>
                            （<span>{node.description}</span>）
                        </Col>
                        <Col span={12} style={{ textAlign: "right" }}>
                            <Tag>标签一</Tag>
                            <Tag>标签二</Tag>
                        </Col>
                    </Row>,
                    props: {
                        colSpan: langauges.length
                    }
                }
            }
        }];

        langauges.forEach((element, k) => {
            const isRefrence = langauges.length > 0 && k === 0;
            columns.push({
                title: `${isRefrence ? "参考语言" : "编辑语言"}：${element}`,
                key: element,
                render() { return { props: { colSpan: 0 } } }
            });
        });

        return columns;
    }

    getExpandedRowRender = (langauges) => {
        return (node) => {
            return <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                {
                    langauges.map((v, k) => {
                        const isRefrence = langauges.length > 0 && k === 0;
                        return <Col key={k} span={24 / langauges.length}>
                            <TextArea rows={3} value={node.name} disabled={isRefrence} />
                        </Col>
                    })
                }
            </Row>
        };
    }

    render() {
        const {
            loading,
            nodes,
        } = this.props.editor;
        const langauges = this.getLanguages();
        const columns = this.getColumns(langauges);
        const expandedRowRender = this.getExpandedRowRender(langauges);

        return (
            <PageHeaderWrapper>
                <div className={styles.contentOverview}>
                    <Alert
                        message="当前编辑内容：/Root/user/project"
                        type="info"
                        showIcon
                    />
                </div>

                <Table rowKey="id"
                    columns={columns}
                    loading={loading}
                    expandedRowRender={expandedRowRender}
                    defaultExpandedRowKeys={nodes.map((_, k) => k)}
                    dataSource={nodes}
                    pagination={false} />
            </PageHeaderWrapper>
        );
    }
}

export default EditPanel;
