import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Form, Input, Button, Avatar, Tag, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Member.less';

const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
    const { form, handleAdd } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            handleAdd(fieldsValue);
        });
    };
    return (
        <Form layout="inline">
            <FormItem label="用户邮箱">
                {form.getFieldDecorator('username')(<Input placeholder="输入用户的注册邮箱" style={{ width: 300 }} />)}
            </FormItem>
            <FormItem>
                <Button onClick={okHandle}>添加</Button>
            </FormItem>
        </Form>
    );
});

@connect(({ project, member }) => ({
    currentProject: project.currentProject,
    member
}))
class Member extends PureComponent {

    componentDidMount() {
        this.loadMembers();
    }

    loadMembers = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'member/fetch'
        });
    }

    handleAdd = (fields) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'member/add',
            payload: fields
        }).then(({ success, error }) => {
            if (success) {
                message.success('添加成功');
            }
            else {
                message.error(error);
            }
        });
    }

    render() {
        const {
            member: { loading, members }
        } = this.props;

        const columns = [
            {
                title: '成员信息',
                key: 'index',
                render: (member) => (<div>
                    <Avatar className={styles.memberAvatar} src={member.user.avatar} icon="user" />
                    <div className={styles.memberInfo}>
                        <span className={styles.memberNickname}>{member.user.nickname ? member.user.nickname : member.user.username}</span>
                        {
                            member.role === 'owner' ? <Tag color="blue">创建者</Tag> : null
                        }
                        <br />
                        <span>{member.user.username}</span>
                    </div>
                </div>)
            }
        ];

        return (
            <PageHeaderWrapper>
                <Card title="添加成员" bordered={false} style={{ width: '100%' }}>
                    <CreateForm handleAdd={this.handleAdd} />
                </Card>

                <Card title="项目成员" bordered={false} style={{ width: '100%', marginTop: 15 }}>
                    <Table rowKey={o => o.user.id}
                        loading={loading}
                        columns={columns}
                        dataSource={members}
                        pagination={false} />
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default Member;
