import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import { Tooltip, Icon, Tag, Divider, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import NodeEntryDisplay from '@/components/NodeEntryDisplay';

let key = '';
let ctrlKey = false;
const keydown = e => {
  if (e.key === 'Meta' || e.ctrlKey) {
    ctrlKey = true;
    key = e.key;
  }
};
const keyup = e => {
  console.log(key);
  if (e.key === key) {
    ctrlKey = false;
    key = '';
  }
};

class PathNodeTable extends PureComponent {
  state = {
    selectedRows: [],
    showEntryNode: null,
    ctrlKey: false,
  };

  columns = [
    {
      title: '节点名称',
      key: 'name',
      render: node => {
        return node.type === 'path' ? (
          <a onClick={this.props.onDirClick.bind(this, node)}>
            <Icon type="folder" theme="outlined" /> {node.name}
          </a>
        ) : (
          <span>
            {/* {node.export_alias ? <Tag style={{ marginLeft: 10 }}>导出别名：{node.export_alias}</Tag> : null} */}
            <Tooltip title={node.key}>
              <Icon type="file-text" theme="outlined" />
              <span onClick={() => this.copyNodeKey(node)}>{node.name}</span>
            </Tooltip>
          </span>
        );
      },
    },
    {
      title: '描述',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: '创建时间',
      key: 'time',
      render: node => <span>{moment(node.create_time).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      key: 'operation',
      render: node => (
        <Fragment>
          {this.props.onUpdateClick ? (
            <span>
              <a onClick={() => this.props.onUpdateClick(true, node)}>修改</a>
              <Divider type="vertical" />
            </span>
          ) : null}
          <a onClick={() => this.goEdit(node)}>编辑文案</a>
          {node.type === 'entry' ? (
            <span>
              <Divider type="vertical" />
              <a onClick={() => this.showEntry(node)}>查看文案</a>
            </span>
          ) : null}
        </Fragment>
      ),
    },
  ];

  showEntry = node => {
    this.setState({ showEntryNode: node });
  };

  goEdit = node => {
    if (ctrlKey) {
      window.open(`/workplace/edit?type=${node.type}&node=${node.id}`);
    } else {
      router.push({
        pathname: '/workplace/edit',
        query: {
          type: node.type,
          node: node.id,
        },
      });
    }
  };

  copyNodeKey = node => {
    copy(node.key);
    message.success('已复制词条KEY到剪贴板');
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });

    const { onSelectRows } = this.props;
    onSelectRows && onSelectRows(rows);
  };

  clearSelectRows = () => {
    this.setState({
      selectedRows: [],
    });
  };

  getSelectRows = () => {
    return this.state.selectedRows;
  };

  componentDidMount() {
    window.addEventListener('keydown', keydown, false);
    window.addEventListener('keyup', keyup, false);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', keydown, false);
    window.removeEventListener('keyup', keyup, false);
  }

  render() {
    const { selectedRows, showEntryNode } = this.state;

    return (
      <div>
        <StandardTable
          {...this.props}
          rowKey="id"
          selectedRows={selectedRows}
          columns={this.columns}
          onSelectRow={this.handleSelectRows}
        />

        <NodeEntryDisplay
          node={showEntryNode}
          handleCancel={() => this.setState({ showEntryNode: null })}
        />
      </div>
    );
  }
}

export default PathNodeTable;
