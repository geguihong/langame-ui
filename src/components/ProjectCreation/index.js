import React, { Component } from 'react';
import { connect } from 'dva';
import {
    Button,
    Dropdown,
    Icon,
    Menu,
    Form,
    Modal,
    Input,
    Select,
    message,
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const Languages = {
    'zh-CN': { key: 'zh-CN', name: '中文' },
    'en-US': { key: 'en-US', name: '英文' },
    'kr-KR': { key: 'kr-KR', name: '韩语' },
    'fr-FR': { key: 'fr-FR', name: '法语' },
    'ja-JP': { key: 'ja-JP', name: '日文' },
};
const LanguageKeys = Object.keys(Languages);

const CreateForm = Form.create()(props => {
    const { modalVisible, form, handleAdd, handleModalVisible } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            handleAdd(fieldsValue);
        });
    };
    return (
        <Modal
            destroyOnClose
            title="创建项目"
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="项目名称">
                {form.getFieldDecorator('name', {
                    rules: [{ required: true, message: '项目名称不能为空！', min: 1 }],
                })(<Input placeholder="请输入" />)}
            </FormItem>

            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="默认语言">
                {form.getFieldDecorator('default_language', {
                    initialValue: LanguageKeys[0],
                })(<Select style={{ width: "100%" }}>
                    {
                        LanguageKeys.map((v, k) => {
                            return <Option key={k} value={v}>{Languages[v].name}</Option>
                        })
                    }
                </Select>)}

            </FormItem>
        </Modal>
    );
});

class ProjectCreation extends Component {

    state = {
        modalVisible: false
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'project/fetch'
        });
    }

    handleModalVisible = flag => {
        this.setState({
            modalVisible: !!flag,
        });
    };

    handleCreation = (fields) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'project/create',
            payload: fields
        }).then(() => {
            message.success('创建项目成功');
            this.handleModalVisible();
        });
    }

    handleMenuClick = ({ key }) => {
        const { dispatch, projects, currentProject } = this.props;

        if (projects[key].id !== currentProject.id) {
            dispatch({
                type: 'project/switch',
                payload: projects[key]
            });
        }
    }

    render() {
        const {
            projects,
            currentProject
        } = this.props;

        const menu = (
            <Menu onClick={this.handleMenuClick}>
                {
                    projects.map((v, k) => <Menu.Item key={k}><span>{v.name}</span></Menu.Item>)
                }
            </Menu>
        );

        return (
            <div style={{ display: 'inline-block' }}>
                <Button type="primary" size="small" shape="circle" icon="plus"
                    onClick={() => this.handleModalVisible(true)}
                    style={{ marginRight: 5 }} />
                {
                    projects && projects.length
                        ? <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link" href="#">
                                {currentProject.name} <Icon type="down" />
                            </a>
                        </Dropdown>
                        : <a onClick={() => this.handleModalVisible(true)}>创建项目</a>
                }

                <CreateForm modalVisible={this.state.modalVisible}
                    handleModalVisible={this.handleModalVisible}
                    handleAdd={this.handleCreation} />
            </div>
        );
    }
}

export default connect(({ project }) => ({
    projects: project.projects,
    currentProject: project.currentProject
}))(ProjectCreation);

// export default ProjectCreation;
