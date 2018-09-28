import React, { Component } from 'react';
import { Form, Modal, Input, Row, Col, Select, Tabs, Tag } from 'antd';
import { Languages } from '@/services/enums';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

const ExportTypes = {
    json: { text: 'JSON格式' },
    android: { text: 'Android格式' },
    properties: { text: 'Properties格式' },
    custom: { text: '自定义格式' },
};

const InnerForm = (props => {

    const {
        form,
        exportSetting,
        handleType,
        languages
    } = props;

    const isEditable = handleType !== 'show';
    const isCustom = form.getFieldValue('export_type') === 'custom';
    const values = exportSetting ? { ...exportSetting } : {};
    const languageOptions = languages.split(',');

    return (
        <Tabs defaultActiveKey="1">
            <TabPane tab="基础配置" key="1">
                <Row>
                    <Col span={8}>
                        <FormItem labelCol={{ span: 24 }} wrapperCol={{ span: 20 }} label="配置名称">
                            {form.getFieldDecorator('name', {
                                initialValue: values.name,
                                rules: [{ required: true, message: '配置名称不能为空！', min: 1 }],
                            })(<Input disabled={!isEditable} />)}
                        </FormItem>
                    </Col>

                    <Col span={8}>
                        <FormItem labelCol={{ span: 24 }} wrapperCol={{ span: 20 }} label="配置类型">
                            {form.getFieldDecorator('export_type', {
                                initialValue: values.export_type,
                                rules: [{ required: true, message: '配置类型不能为空！', min: 1 }],
                            })(<Select style={{ width: "100%" }} disabled={!isEditable}>
                                {
                                    Object.keys(ExportTypes).map((v, k) => <Option key={k} value={v}>{ExportTypes[v].text}</Option>)
                                }
                            </Select>)}
                        </FormItem>
                    </Col>

                    <Col span={8}>
                        <FormItem labelCol={{ span: 24 }} wrapperCol={{ span: 20 }} label="节点连接符">
                            {form.getFieldDecorator('node_connector', {
                                initialValue: values.node_connector,
                                rules: [{ max: 1 }],
                            })(<Input maxLength={1} disabled={!isEditable} />)}
                        </FormItem>
                    </Col>

                    {
                        isCustom ? <Col span={24}>
                            <FormItem labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="自定义模板">
                                {form.getFieldDecorator('template', {
                                    rules: [{ required: true }],
                                })(<Input.TextArea rows={10} />)}
                            </FormItem>
                        </Col> : null
                    }
                </Row>
            </TabPane>

            <TabPane tab="目标文件" key="2">
                <Row>
                    <Col span={6}>
                        <FormItem labelCol={{ span: 24 }} wrapperCol={{ span: 20 }} label="文件扩展名">
                            {form.getFieldDecorator('filename_extension', {
                                initialValue: values.filename_extension
                            })(<Input disabled={!isEditable} />)}
                        </FormItem>
                    </Col>
                    <Col span={18}>
                        <FormItem labelCol={{ span: 24 }} wrapperCol={{ span: 20 }} label="目标文件名" style={{ marginBottom: 0 }} />
                        {
                            languageOptions.map((v, k) => {
                                return <FormItem key={k} style={{ margin: 0 }}>
                                    <Row>
                                        <Col span={4}><Tag>{Languages[v].name}</Tag></Col>
                                        <Col span={20}>
                                            {form.getFieldDecorator(`filename_mapping_${v.replace('-', '_')}`, {
                                                initialValue: values.filename_mapping ? values.filename_mapping[v] : null,
                                                validateTrigger: ['onChange', 'onBlur'],
                                            })(
                                                <Input placeholder={v} disabled={!isEditable} />
                                            )}
                                        </Col>
                                    </Row>
                                </FormItem>
                            })
                        }

                    </Col>
                </Row>
            </TabPane>
        </Tabs>
    )
});

@Form.create()
class ExportSettingForm extends Component {

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
            filename_mapping: {}
        };
        Object.keys(fieldsValue).forEach(key => {
            if (key.indexOf('filename_mapping') >= 0) {
                const subKey = key.replace('filename_mapping_', '').replace('_', '-');
                data.filename_mapping[subKey] = fieldsValue[key];
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
            return '查看配置';
        }
        else if (handleType === 'create') {
            return '创建配置';
        }
        else if (handleType === 'edit') {
            return '修改配置';
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

export default ExportSettingForm;
