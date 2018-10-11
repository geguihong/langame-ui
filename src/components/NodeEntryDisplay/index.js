import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Button, Table } from 'antd';
import { Languages } from '@/services/enums';

import { getByNode } from '@/services/api/lang_entry';

@connect(({ project }) => ({
    currentProject: project.currentProject
}))
class NodeEntryDisplay extends Component {

    state = {
        node: null,
        languages: [],
        entryMap: {},
        loading: false
    };

    columns = [
        {
            title: '语言',
            key: 'language',
            render: v => v.name,
            width: 150
        },
        {
            title: '文案',
            key: 'entry',
            render: v => {
                const entry = this.state.entryMap[v.key];
                return entry ? entry.content : null;
            }
        }
    ];

    componentDidUpdate() {
        const { node } = this.props;
        if (node && this.state.node) return;
        if (!node && !this.state.node) return;

        this.setState({ node }, () => {
            if (node) {
                this.load(node);
            }
        });
    }

    load = (node) => {
        const { currentProject } = this.props;
        const temp = currentProject.languages.split(",").reduce((map, s) => { map[s] = true; return map; }, {});
        const languages = Object.keys(Languages).filter(s => !!temp[s]).map(s => Languages[s]);
        this.setState({ languages, loading: true }, () => {
            getByNode(node).then(({ code, data }) => {
                if (code === 0) {
                    const entryMap = data.entries[node.id];
                    this.setState({ entryMap, loading: false });
                }
            })
        });
    }

    handleCancel = () => {
        this.props.handleCancel();
    }

    render() {
        const { node, languages, loading } = this.state;

        return (
            <Modal title="查看文案"
                visible={node !== null}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="submit" type="primary" onClick={this.handleCancel}>确定</Button>,
                ]}
                width={800}>

                <Table columns={this.columns}
                    dataSource={languages}
                    loading={loading}
                    pagination={false} />
            </Modal>
        );
    }
}

export default NodeEntryDisplay;
