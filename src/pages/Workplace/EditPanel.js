import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Tag, Divider, Alert, Input, Row, Col, Select } from 'antd'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './EditPanel.less';

const TextArea = Input.TextArea;

const Languages = {
    'zh-CN': { key: 'zh-CN', name: '中文' },
    'en-US': { key: 'en-US', name: '英文' },
    'kr-KR': { key: 'kr-KR', name: '韩语' },
    'fr-FR': { key: 'fr-FR', name: '法语' },
    'ja-JP': { key: 'ja-JP', name: '日文' },
};
const LanguagesKeys = Object.keys(Languages);

@connect(({ editor }) => ({
    editor
}))
class EditPanel extends Component {

    state = {
        referenceLanuage: "",
        editLanuage: LanguagesKeys[1],
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
        const { referenceLanuage, editLanuage } = this.state;
        const languages = [];
        if (referenceLanuage) {
            languages.push(referenceLanuage);
        }
        if (editLanuage) {
            languages.push(editLanuage);
        }
        return languages;
    }

    getColumns = (languages) => {
        const columns = [{
            key: 'info',
            colSpan: 0,
            render: (node) => {
                return {
                    children: <Row>
                        <Col span={12}>
                            <span>{node.complete_path}</span>
                            {
                                node.description ? <span>（<span>{node.description}</span>）</span> : null
                            }
                        </Col>
                        <Col span={12} style={{ textAlign: "right" }}>
                            <Tag>标签一</Tag>
                            <Tag>标签二</Tag>
                        </Col>
                    </Row>,
                    props: {
                        colSpan: languages.length
                    }
                }
            }
        }];

        languages.forEach((element, k) => {
            const isreference = languages.length > 1 && k === 0;
            columns.push({
                title: `${isreference ? "参考语言" : "编辑语言"}：${Languages[element].name}`,
                key: element,
                render() { return { props: { colSpan: 0 } } }
            });
        });

        return columns;
    }

    getExpandedRowRender = (languages) => {
        return (node) => {
            return <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                {
                    languages.map((v, k) => {
                        const isreference = languages.length > 1 && k === 0;
                        return <Col key={k} span={24 / languages.length}>
                            <TextArea rows={3} value={node.name} disabled={isreference} />
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
            overview
        } = this.props.editor;
        const {
            referenceLanuage,
            editLanuage,
        } = this.state;
        const languages = this.getLanguages();
        const columns = this.getColumns(languages);
        const expandedRowRender = this.getExpandedRowRender(languages);

        const pageHeaderContent =
            <Row className={styles.pageHeaderContent}>
                <Col span={4}>
                    <span>参考语言：</span>
                    <Select value={referenceLanuage} style={{ width: 120 }} onChange={value => this.setState({ referenceLanuage: value })} >
                        <Select.Option value="">无</Select.Option>
                        {
                            LanguagesKeys.map((v, k) => {
                                return <Select.Option key={k} value={v}>{Languages[v].name}</Select.Option>
                            })
                        }
                    </Select>
                </Col>
                <Col span={4}>
                    <span>编辑语言：</span>
                    <Select value={editLanuage} style={{ width: 120 }} onChange={value => this.setState({ editLanuage: value })} >
                        {
                            LanguagesKeys.map((v, k) => {
                                return <Select.Option key={k} value={v}>{Languages[v].name}</Select.Option>
                            })
                        }
                    </Select>
                </Col>
            </Row>;

        return (
            <PageHeaderWrapper
                loading={loading}
                content={pageHeaderContent}>

                <div className={styles.contentOverview}>
                    <Alert
                        message={`当前编辑内容：${overview.description}`}
                        type="info"
                        showIcon
                    />
                </div>

                <Table rowKey={(v) => `${v.id}`}
                    columns={columns}
                    loading={loading}
                    expandedRowRender={expandedRowRender}
                    expandRowByClick={true}
                    expandedRowKeys={nodes.map((v) => `${v.id}`)}
                    dataSource={nodes}
                    pagination={false} />
            </PageHeaderWrapper>
        );
    }
}

export default EditPanel;
