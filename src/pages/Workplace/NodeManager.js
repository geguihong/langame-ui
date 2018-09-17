import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    Dropdown,
    Menu,
    InputNumber,
    DatePicker,
    Modal,
    message,
    Badge,
    Divider,
    Steps,
    Radio,
    Breadcrumb,
    Alert
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './NodeManager.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(',');

const typesMap = {
    path: { text: "目录" },
    entry: { text: "词条" },
}

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
            title="新建节点"
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="节点名称">
                {form.getFieldDecorator('name', {
                    rules: [{ required: true, message: '节点名称不能为空！', min: 1 }],
                })(<Input placeholder="建议仅使用小写英文字母和下划线" />)}
            </FormItem>

            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="节点类型">
                {form.getFieldDecorator('type', {
                    initialValue: "entry",
                })(<Select style={{ width: "100%" }}>
                    {
                        Object.keys(typesMap).map((v, k) => {
                            return <Option key={k} value={v}>{typesMap[v].text}</Option>
                        })
                    }
                </Select>)}

            </FormItem>
        </Modal>
    );
});

@Form.create()
class UpdateForm extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            formVals: {
                id: props.values.id,
                name: props.values.name,
                description: props.values.description,
            },
        };

        this.formLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 13 },
        };
    }

    handleNext = () => {
        const { form, handleUpdate } = this.props;
        const { formVals: oldValue } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const formVals = { ...oldValue, ...fieldsValue };
            handleUpdate(formVals);
        });
    };

    renderFooter = () => {
        const { handleUpdateModalVisible } = this.props;
        return (
            [
                <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
                    取消
                </Button>,
                <Button key="submit" type="primary" onClick={() => this.handleNext()}>
                    完成
                </Button>
            ]
        );
    };

    render() {
        const { updateModalVisible, handleUpdateModalVisible, form } = this.props;
        const { formVals } = this.state;

        return (
            <Modal
                width={640}
                bodyStyle={{ padding: '32px 40px 48px' }}
                destroyOnClose
                title="编辑节点信息"
                visible={updateModalVisible}
                footer={this.renderFooter()}
                onCancel={() => handleUpdateModalVisible()}
            >
                <FormItem key="name" {...this.formLayout} label="节点名称">
                    {form.getFieldDecorator('name', {
                        rules: [{ required: true, message: '节点名称不能为空！' }],
                        initialValue: formVals.name,
                    })(<Input placeholder="请输入" />)}
                </FormItem>,
                        <FormItem key="desc" {...this.formLayout} label="节点描述">
                    {form.getFieldDecorator('description', {
                        initialValue: formVals.description,
                    })(<TextArea rows={4} placeholder="请输入" />)}
                </FormItem>
            </Modal>
        );
    }
}

/* eslint react/no-multi-comp:0 */
@connect(({ node_manager }) => ({
    node_manager
}))
@Form.create()
class NodeManager extends PureComponent {
    state = {
        modalVisible: false,
        updateModalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        stepFormValues: {},
    };

    columns = [
        {
            title: '节点名称',
            dataIndex: 'name',
            render: (val, node) => {
                return node.type === 'path'
                    ? <a onClick={this.openDir.bind(this, node)}><Icon type="folder" theme="outlined" /> {val}</a>
                    : <span><Icon type="file-text" theme="outlined" /> {val}</span>
            }
        },
        {
            title: '描述',
            dataIndex: 'description',
        },
        {
            title: '创建时间',
            dataIndex: 'updatedAt',
            sorter: true,
            render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        {
            title: '操作',
            render: (text, node) => (
                <Fragment>
                    <a onClick={() => this.handleUpdateModalVisible(true, node)}>修改</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.goEdit(node)}>编辑文案</a>
                </Fragment>
            ),
        },
    ];

    componentDidMount() {
        this.openDir(null);
    }

    openDir = (node) => {
        const { formValues } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'node_manager/fetch',
            payload: { node, condition: formValues }
        });
    }

    goEdit = (node, recursion) => {
        router.push({
            pathname: '/workplace/edit',
            query: {
                type: node.type,
                node: node.id,
                recursion
            },
        });
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { formValues } = this.state;

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});

        const params = {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
            ...formValues,
            ...filters,
        };
        if (sorter.field) {
            params.sorter = `${sorter.field}_${sorter.order}`;
        }

        dispatch({
            type: 'node_manager/fetch',
            payload: params,
        });
    };

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'rule/fetch',
            payload: {},
        });
    };

    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };

    handleMenuClick = e => {
        const { dispatch } = this.props;
        const { selectedRows } = this.state;

        if (!selectedRows) return;
        switch (e.key) {
            case 'remove':
                dispatch({
                    type: 'node_manager/delete',
                    payload: selectedRows.map(row => row.id)
                }).then(() => {
                    this.setState({
                        selectedRows: [],
                    });
                });
                break;
            default:
                break;
        }
    };

    handleEditActionMenuClick = e => {
        const {
            node_manager: { currentNode }
        } = this.props;

        switch (e.key) {
            case 'normal':
                this.goEdit(currentNode, false);
                break;
            case 'recursion':
                this.goEdit(currentNode, true);
                break;
            default:
                break;
        }
    }

    handleSelectRows = rows => {
        this.setState({
            selectedRows: rows,
        });
    };

    handleSearch = e => {
        e.preventDefault();

        const { dispatch, form } = this.props;

        form.validateFields((err, fieldsValue) => {
            if (err) return;

            const values = {
                ...fieldsValue,
                updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
            };

            this.setState({
                formValues: values,
            }, () => {
                this.openDir(null);
            });

            // dispatch({
            //     type: 'node_manager/fetch',
            //     payload: { condition: values },
            // });
        });
    };

    handleModalVisible = flag => {
        this.setState({
            modalVisible: !!flag,
        });
    };

    handleUpdateModalVisible = (flag, record) => {
        this.setState({
            updateModalVisible: !!flag,
            stepFormValues: record || {},
        });
    };

    handleAdd = fields => {
        const { dispatch } = this.props;
        dispatch({
            type: 'node_manager/create',
            payload: fields,
        });

        message.success('添加成功');
        this.handleModalVisible();
    };

    handleUpdate = fields => {
        const { dispatch } = this.props;
        dispatch({
            type: 'node_manager/update',
            payload: fields
        }).then(({ success, error }) => {
            if (success) {
                message.success('修改成功');
                this.handleUpdateModalVisible();
            }
            else {
                message.error(error);
            }
        });
    };

    renderSimpleForm() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="名称匹配">
                            {getFieldDecorator('match_value')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="节点类型">
                            {getFieldDecorator('type', { initialValue: "" })(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="">全部</Option>
                                    {
                                        Object.keys(typesMap).map((v, k) => {
                                            return <Option key={k} value={v}>{typesMap[v].text}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">
                                查询
              </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                重置
              </Button>
                            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                                展开 <Icon type="down" />
                            </a>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderAdvancedForm() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="名称匹配">
                            {getFieldDecorator('match_value')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="节点类型">
                            {getFieldDecorator('type')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    {
                                        Object.keys(typesMap).map((v, k) => {
                                            return <Option key={k} value={v}>{typesMap[v]}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="调用次数">
                            {getFieldDecorator('number')(<InputNumber style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="更新日期">
                            {getFieldDecorator('date')(
                                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="使用状态">
                            {getFieldDecorator('status3')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="0">关闭</Option>
                                    <Option value="1">运行中</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="使用状态">
                            {getFieldDecorator('status4')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="0">关闭</Option>
                                    <Option value="1">运行中</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <div style={{ overflow: 'hidden' }}>
                    <div style={{ float: 'right', marginBottom: 24 }}>
                        <Button type="primary" htmlType="submit">
                            查询
            </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                            重置
            </Button>
                        <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                            收起 <Icon type="up" />
                        </a>
                    </div>
                </div>
            </Form>
        );
    }

    renderForm() {
        const { expandForm } = this.state;
        return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }

    renderNodePath() {
        const {
            node_manager: { pathStack },
        } = this.props;
        return (
            <Alert message={
                <Fragment>
                    <Breadcrumb separator=">">
                        {
                            pathStack.map((node, k) => {
                                return <Breadcrumb.Item key={k}>
                                    {
                                        (k === pathStack.length - 1)
                                            ? <span>{node.name}</span>
                                            : <a onClick={this.openDir.bind(this, node)}>{node.name}</a>
                                    }
                                </Breadcrumb.Item>
                            })
                        }
                    </Breadcrumb>
                </Fragment>
            } type="success" />
        );
    }

    render() {
        const {
            node_manager: { currentNode, nodes, loading }
        } = this.props;

        const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
        const menu = (
            <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
                <Menu.Item key="remove">删除</Menu.Item>
                <Menu.Item key="approval">批量审批</Menu.Item>
            </Menu>
        );

        const editActionMenu = (
            <Menu onClick={this.handleEditActionMenuClick} selectedKeys={[]}>
                <Menu.Item key="normal">仅当前目录</Menu.Item>
                <Menu.Item key="recursion">包含所有子目录</Menu.Item>
            </Menu>
        );

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
        };
        const updateMethods = {
            handleUpdateModalVisible: this.handleUpdateModalVisible,
            handleUpdate: this.handleUpdate,
        };

        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableDirPath}>{this.renderNodePath()}</div>
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                                新建
                            </Button>
                            <Dropdown overlay={editActionMenu}>
                                <Button>
                                    编辑文案 <Icon type="down" />
                                </Button>
                            </Dropdown>
                            {selectedRows.length > 0 && (
                                <span>
                                    <Dropdown overlay={menu}>
                                        <Button>
                                            更多操作 <Icon type="down" />
                                        </Button>
                                    </Dropdown>
                                </span>
                            )}
                        </div>

                        <StandardTable
                            rowKey="id"
                            selectedRows={selectedRows}
                            loading={loading}
                            data={nodes}
                            columns={this.columns}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
                <CreateForm {...parentMethods} modalVisible={modalVisible} />
                {stepFormValues && Object.keys(stepFormValues).length ? (
                    <UpdateForm
                        {...updateMethods}
                        updateModalVisible={updateModalVisible}
                        values={stepFormValues}
                    />
                ) : null}
            </PageHeaderWrapper>
        );
    }
}

export default NodeManager;
