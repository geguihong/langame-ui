import React, { Component } from 'react';
import { Table, Button, Input, Col, Icon } from 'antd';

import styles from './EditPanel.less';

const isArrayStr = str => {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object' && obj && Array.isArray(obj)) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  return false;
};

class EditArea extends Component {
  state = {
    isArray: false,
    isArrayNode: false
  };

  componentDidMount() {
    let { isArray,isArrayNode } = this.state;
    const { entry } = this.props;
    isArray = entry && entry.originContent ? isArrayStr(entry.originContent):false;
    isArrayNode = isArray;
    this.setState({ isArray,isArrayNode });
  }

  getJsonNode = (value, id, val, isreference) => {
    const { handleEntryChange } = this.props;
    let data = JSON.parse(value);
    if (data.length > 0) {
      let keys = [];
      let columns = [];
      const dataSource = data;
      const filterDropdownStyle = {
        padding: '8px',
        borderRadius: '6px',
        background: '#fff',
        boxShadow: '0 1px 6px rgba(0, 0, 0, .2)',
      };
      const nodeDataChange = (v, k, i) => {
        if (i !== undefined) {
          data[i][k] = v;
        } else {
          data[k] = v;
        }
        handleEntryChange(id, val, JSON.stringify(data));
      };
      const lineUp = index => {
        const cope = data[index];
        data[index] = data[index - 1];
        data[index - 1] = cope;
        handleEntryChange(id, val, JSON.stringify(data));
      };
      const lineDown = index => {
        const cope = data[index];
        data[index] = data[index + 1];
        data[index + 1] = cope;
        handleEntryChange(id, val, JSON.stringify(data));
      };
      const lineDel = index => {
        data.splice(index, 1);
        handleEntryChange(id, val, JSON.stringify(data));
      };

      let newkey = '';
      let oldKey = '';
      const keyChange = (o, n) => {
        oldKey = o;
        newkey = n;
      };
      const keyChangeOk = () => {
        const newData = [];
        data.forEach((v, i) => {
          const newValue = {};
          Object.keys(v).forEach(k => {
            if (k !== oldKey) {
              newValue[k] = v[k];
            } else {
              newValue[newkey] = v[oldKey];
            }
          });
          newData[i] = newValue;
        });
        data = newData;
        handleEntryChange(id, val, JSON.stringify(data));
      };
      const addKey = () => {
        data.forEach((v, i) => {
          data[i][`key${keys.length + 1}`] = '';
        });
        handleEntryChange(id, val, JSON.stringify(data));
      };
      const delKey = key => {
        const newData = [];
        data.forEach((v, i) => {
          const newValue = {};
          Object.keys(v).forEach(k => {
            if (k !== key) {
              newValue[k] = v[k];
            }
          });
          newData[i] = newValue;
        });
        data = newData;
        handleEntryChange(id, val, JSON.stringify(data));
      };
      if (data.length > 0) {
        keys = Object.keys(data[0]);
      }
      columns = keys.map((key) => 
        ({
          title: key,
          dataIndex: key,
          key,
          render: (text, record, index) => 
            (
              <Input.TextArea
                rows={1}
                value={text}
                disabled={isreference}
                onChange={e => nodeDataChange(e.target.value, key, index)}
              />
            )
          ,
          filterDropdown: !isreference
            ? ({ clearFilters }) => (
              <div style={filterDropdownStyle} key={key}>
                <Input
                  defaultValue={key}
                  style={{
                    marginBottom: '8px',
                  }}
                  size="small"
                  onChange={e => {
                    keyChange(key, e.target.value);
                  }}
                />
                <Button
                  type="primary"
                  style={{
                    marginRight: '8px',
                  }}
                  size="small"
                  onClick={keyChangeOk}
                >
                  确定
                </Button>
                <Button
                  size="small"
                  style={{
                    marginRight: '8px',
                  }}
                  onClick={() => {
                    clearFilters();
                  }}
                >
                  取消
                </Button>
                <Button
                  size="small"
                  type="danger"
                  onClick={() => {
                    delKey(key);
                  }}
                >
                  删除
                </Button>
              </div>
              )
            : null,
          filterIcon: () => <Icon key={key} type="edit" theme="outlined" />,
        })
      );
      if (!isreference) {
        columns.push({
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: 160,
          render: (text, record, index) => {
            return (
              <div>
                <Button
                  onClick={() => {
                    lineUp(index);
                  }}
                >
                  <Icon type="arrow-up" theme="outlined" />
                </Button>
                <Button
                  onClick={() => {
                    lineDown(index);
                  }}
                >
                  <Icon type="arrow-down" theme="outlined" />
                </Button>
                <Button
                  onClick={() => {
                    lineDel(index);
                  }}
                >
                  <Icon type="delete" theme="outlined" />
                </Button>
              </div>
            );
          },
        });
      }
      return (
        <div>
          <div>
            <Button
              size="small"
              onClick={addKey}
              disabled={isreference}
              style={{ marginBottom: '8px' }}
            >
              添加一列
            </Button>
          </div>
          <Table columns={columns} dataSource={dataSource} pagination={false} size="small" />
        </div>
      );
    }
    return null;
  };

  render() {
    const {
      entry,isreference,node,language,col,handleEntryChange
    } = this.props;
    const { isArrayNode } = this.state;
    let { isArray } = this.state;

    const content = entry ? entry.content : null;
    const originContent = entry ? entry.originContent : null;
    const changed = content !== originContent;
    const value = isreference ? originContent : content;
    if (isArray) {
      return (
        <Col span={col}>
          {this.getJsonNode(value, node.id, language, isreference)}
          <div className={styles.editItemActions}>
            <a
              onClick={() => {
                isArray = false;
                this.setState({ isArray });
              }}
            >
              取消格式化
            </a>
            {!isreference && changed ? (
              <a
                onClick={() => handleEntryChange(node.id, language, originContent)}
                style={{ marginLeft: '10px' }}
              >
                取消编辑
              </a>
            ) : null}
          </div>
        </Col>
      );
    }
    return (
      <Col span={col}>
        <Input.TextArea
          rows={3}
          disabled={isreference}
          value={value}
          onChange={e => handleEntryChange(node.id, language, e.target.value)}
        />
        <div className={styles.editItemActions}>
          {isArrayNode ? (
            <a
              onClick={() => {
                isArray = true;
                this.setState({ isArray });
              }}
            >
              格式化JSON
            </a>
          ) : null}
          {!isreference && changed ? (
            <a onClick={() => handleEntryChange(node.id, language, originContent)}>
              取消编辑
            </a>
          ) : null}
        </div>
      </Col>
    );
  }
}

export default EditArea;
