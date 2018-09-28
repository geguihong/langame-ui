import React, { Component, PureComponent } from 'react';
import Link from 'umi/link';
import { Modal, Form, Tabs, Row, Col, Select, List, Checkbox, Badge } from 'antd';
import { RangeTypes, Languages } from '@/services/enums';
import { getExportResule } from '@/services/api/export';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

class InnerForm extends PureComponent {

    state = {
        resultLoading: false,
        resultFiles: []
    }

    componentDidMount() {
        setTimeout(() => {
            const { exportTask, handleType } = this.props;
            if (handleType === 'show') {
                this.setState({ resultLoading: true });
                getExportResule(exportTask.id).then(response => {
                    if (response.code === 0) {
                        this.setState({
                            resultLoading: false,
                            resultFiles: response.data.files
                        });
                    }
                });
            }
        }, 100);
    }

    getLanguageOptions = () => {
        const { currentProject } = this.props;
        return currentProject.languages.split(',').map(key => ({ label: Languages[key].name, value: key }));
    }

    render() {
        const {
            form,
            exportTask,
            handleType,
            settings,
        } = this.props;

        const {
            resultFiles,
            resultLoading,
        } = this.state;

        const isEditable = handleType !== 'show';
        const values = exportTask ? { ...exportTask } : {};
        const languageOptions = this.getLanguageOptions();

        return (
            <Tabs defaultActiveKey={isEditable ? "setting" : "result"}>
                <TabPane tab="任务设置" key="setting">
                    <Row>
                        <Col span={8}>
                            <FormItem labelCol={{ span: 24 }} wrapperCol={{ span: 20 }} label="选择导出配置">
                                {form.getFieldDecorator('export_setting', {
                                    initialValue: values.export_setting ? `${values.export_setting}` : null,
                                    rules: [{ required: true, message: '导出配置不能为空！' }],
                                })(<Select disabled={!isEditable} style={{ width: "100%" }}>
                                    {
                                        settings.map((v, k) => {
                                            return <Option key={k} value={`${v.id}`}>{v.name}</Option>
                                        })
                                    }
                                </Select>)}
                                <Link to="./setting">创建导出配置</Link>
                            </FormItem>
                        </Col>

                        <Col span={16}>
                            <FormItem labelCol={{ span: 24 }} wrapperCol={{ span: 20 }} label="选择导出语言">
                                {form.getFieldDecorator('languages', {
                                    initialValue: values.languages,
                                    rules: [{
                                        type: 'array', required: true,
                                        validator: (rule, value, callback) => {
                                            if (!value || value.length === 0) {
                                                callback('导出语言不能为空！')
                                            }
                                            callback()
                                        }
                                    }],
                                })(<CheckboxGroup options={languageOptions} disabled={!isEditable} />)}
                            </FormItem>
                        </Col>

                        <Col span={24}>
                            <FormItem labelCol={{ span: 24 }} wrapperCol={{ span: 20 }} label="选择导出范围">
                                {form.getFieldDecorator('export_range_type', {
                                    initialValue: values.export_range ? values.export_range.type : 'project',
                                    rules: [{ required: true, message: '配置名称不能为空！', min: 1 }],
                                })(<Select disabled={!isEditable} style={{ width: "100%" }}>
                                    {
                                        Object.keys(RangeTypes).map((v, k) => <Option key={k} value={v}>{RangeTypes[v].text}</Option>)
                                    }
                                </Select>)}
                            </FormItem>
                        </Col>
                    </Row>
                </TabPane>

                {
                    !isEditable
                        ? <TabPane tab="任务结果" key="result">
                            <List
                                bordered
                                loading={resultLoading}
                                dataSource={resultFiles}
                                renderItem={(item, index) => (<List.Item>
                                    <Badge count={index + 1} style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset', marginRight: 15 }} />
                                    <a href={item.url} target="_blank">{item.name}</a>
                                </List.Item>)}
                            />
                        </TabPane>
                        : null
                }
            </Tabs>
        )
    }
}

@Form.create()
class ExportTaskForm extends Component {

    cancelHandle = () => {
        this.props.cancelHandle();
    }

    okHandle = () => {
        const { form, handleType, createHandle, updateHandle } = this.props;
        if (handleType !== 'show') {
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                form.resetFields();
                const result = this.formatFields(fieldsValue);
                const handleMethod = handleType === 'create' ? createHandle : updateHandle;
                handleMethod(result);
            });
        }
        else {
            this.cancelHandle();
        }
    }

    formatFields = (fieldsValue) => {
        const data = {
            export_range: {}
        };
        Object.keys(fieldsValue).forEach(key => {
            if (key.indexOf('export_range') >= 0) {
                const subKey = key.replace('export_range_', '').replace('_', '-');
                data.export_range[subKey] = fieldsValue[key];
            }
            else if (key === 'export_setting') {
                data[key] = parseInt(fieldsValue[key]);
            }
            else {
                data[key] = fieldsValue[key];
            }
        });
        return data;
    }

    getTitle = () => {
        const {
            handleType
        } = this.props;

        if (handleType === 'show') {
            return '查看任务';
        }
        else if (handleType === 'create') {
            return '创建任务';
        }
        return null;
    }

    render() {
        const {
            handleType
        } = this.props;

        return (
            <Modal
                destroyOnClose
                visible={handleType !== null}
                title={this.getTitle()}
                width={800}
                onOk={this.okHandle}
                onCancel={() => this.cancelHandle()}
            >
                <InnerForm {...this.state} {...this.props} />
            </Modal>
        );
    }
}

export default ExportTaskForm;
