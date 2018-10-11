import React, { Component } from 'react';
import { List, Avatar, Tooltip } from 'antd';
import moment from 'moment';
import { Languages } from '@/services/enums';
import styles from './index.less';

const renderActionRecord = (record) => {
    if (!record.target){
        return '未知';
    }

    switch (record.action) {
        case 'CREATE_PROJECT':
            return <span>创建了项目 <a>{record.target.name}</a></span>;
        case 'MEMBER_JOIN':
            return <span>加入了项目 <a>{record.target.name}</a></span>;
        case 'CREATE_NODE':
            return <span>
                创建了{record.target.type === 'path' ? '目录' : '词条'}
                &nbsp;
                <Tooltip title={record.target.complete_path}>
                    <a>{record.target.name}</a>
                </Tooltip>
            </span>;
        case 'RENAME_NODE':
            return <span>
                重命名了{record.target.type === 'path' ? '目录' : '词条'}
                &nbsp;
                <Tooltip title={record.target.complete_path}>
                    <a>{record.target.name}</a>
                </Tooltip>
            </span>;
        case 'UPDATE_LANG_ENTRY':
            if (!record.target.node){
                return '更新了词条';
            }
            return <span>
                更新了词条
                &nbsp;
                <Tooltip title={record.target.node.complete_path}>
                    <a>{record.target.node.name}</a>
                </Tooltip>
                &nbsp;
                的【{Languages[record.target.language].name}】文案
            </span>;
        default:
            return null;
    }
};

class ActionRecordDisplay extends Component {

    render() {
        const { item } = this.props;

        return (
            <List.Item>
                <List.Item.Meta
                    avatar={<Avatar src={item.subject.avatar} icon="user" />}
                    title={
                        <span>
                            <a className={styles.username}>{item.subject.nickname}</a>
                            &nbsp;
                            <span className={styles.event}>
                                {renderActionRecord(item)}
                            </span>
                        </span>
                    }
                    description={
                        <span className={styles.datetime} title={item.create_time}>
                            {moment(item.create_time).fromNow()}
                        </span>
                    }
                />
            </List.Item>
        );
    }
}

export default ActionRecordDisplay;
