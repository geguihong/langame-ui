import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Tag, Button, Alert, Row, Col, Select } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EditArea from './editArea';
import { Languages } from '@/services/enums';

import styles from './EditPanel.less';

@connect(({ editor, project }) => ({
  editor,
  currentProject: project.currentProject,
}))
class EditPanel extends Component {
  state = {
    languageKeys: [],
    referenceLanuage: '',
    editLanuage: '',
  };

  componentDidMount() {
    const { currentProject } = this.props;
    const temp = currentProject.languages.split(',').reduce((map, s) => {
      const m = map;
      m[s] = true;
      return m;
    }, {});
    const languageKeys = Object.keys(Languages).filter(s => !!temp[s]);

    this.setState({ languageKeys }, () => {
      const { location:{query:{type, node, recursion}} } = this.props;
      this.loadNodes({
        type,
        node: node ? parseInt(node,10) : null,
        recursion,
      });
    });
  }

  switchLanguage = (key, language) => {
    if (key === 'reference') {
      this.setState({ referenceLanuage: language });
    } else {
      this.setState({ editLanuage: language });
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'editor/loadEntry',
      payload: language,
    });
  };

  loadNodes = params => {
    const { dispatch } = this.props;
    const { languageKeys } = this.state;
    dispatch({
      type: 'editor/fetch',
      payload: params,
    }).then(() => {
      this.switchLanguage('edit', languageKeys[0]);
    });
  };

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
  };

  getColumns = languages => {
    const columns = [
      {
        key: 'info',
        colSpan: 0,
        render: node => (
          {
            children: (
              <Row>
                <Col span={12}>
                  <span>{node.complete_path}</span>
                  {node.description ? (
                    <span>
                      （<span>{node.description}</span>）
                    </span>
                  ) : null}
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Tag>标签一</Tag>
                  <Tag>标签二</Tag>
                </Col>
              </Row>
            ),
            props: {
              colSpan: languages.length,
            },
          }
        ),
      },
    ];

    languages.forEach((element, k) => {
      const isreference = languages.length > 1 && k === 0;
      columns.push({
        title: `${isreference ? '参考语言' : '编辑语言'}：${Languages[element].name}`,
        key: isreference ? 'reference' : 'edit',
        render() {
          return { props: { colSpan: 0 } };
        },
      });
    });

    return columns;
  };

  getExpandedRowRender = languages => (
    node => {
      const {
        editor: { entryStore }
      } = this.props;
      const nodeLanguages = entryStore[`${node.id}`];
      return (
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {languages.map((v, k, i) => {
            const isreference = languages.length > 1 && k === 0;
            const entry = nodeLanguages ? nodeLanguages[v] : null;
            if(entry !== null){
              return <EditArea key={i} entry={entry} isreference={isreference} node={node} language={v} col={24 / languages.length} handleEntryChange={this.handleEntryChange} />
            }
            return null
          })}
        </Row>
      );
    }
  );

  handleEntryChange = (nodeId, language, content) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'editor/updateNodeEntry',
      payload: { nodeId, language, content },
    });
  };

  saveEntries = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'editor/submitChangedEntries',
    });
  };

  render() {
    const { editor:{loading, nodes, overview, changedEntries} } = this.props;
    const { referenceLanuage, editLanuage, languageKeys } = this.state;
    const languages = this.getLanguages();
    const columns = this.getColumns(languages);
    const expandedRowRender = this.getExpandedRowRender(languages);
    const entriesChanged = !!Object.keys(changedEntries).length;

    const pageHeaderContent = (
      <Row className={styles.pageHeaderContent}>
        <Col span={4}>
          <span>参考语言：</span>
          <Select
            value={referenceLanuage}
            style={{ width: 120 }}
            onChange={value => this.switchLanguage('reference', value)}
          >
            <Select.Option value="">无</Select.Option>
            {languageKeys.map((v, k) => {
              return (
                <Select.Option key={k} value={v}>
                  {Languages[v].name}
                </Select.Option>
              );
            })}
          </Select>
        </Col>
        <Col span={4}>
          <span>编辑语言：</span>
          <Select
            value={editLanuage}
            style={{ width: 120 }}
            disabled={entriesChanged}
            onChange={value => this.switchLanguage('edit', value)}
          >
            {languageKeys.map((v, k) => {
              return (
                <Select.Option key={k} value={v}>
                  {Languages[v].name}
                </Select.Option>
              );
            })}
          </Select>
        </Col>
        <Col className={styles.editActions} span={16}>
          {entriesChanged ? (
            <Button type="primary" onClick={this.saveEntries}>
              保存文案
            </Button>
          ) : null}
        </Col>
      </Row>
    );

    return (
      <PageHeaderWrapper loading={loading} content={pageHeaderContent}>
        <div className={styles.contentOverview}>
          <Alert message={`当前编辑内容：${overview.description}`} type="info" showIcon />
        </div>

        <Table
          rowKey={v => `${v.id}`}
          columns={columns}
          loading={loading}
          expandedRowRender={expandedRowRender}
          expandRowByClick={true}
          expandedRowKeys={nodes.map(v => `${v.id}`)}
          dataSource={nodes}
          pagination={{
            position: 'both',
            showSizeChanger: true,
            defaultPageSize: 30,
            pageSizeOptions: ['30', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default EditPanel;
