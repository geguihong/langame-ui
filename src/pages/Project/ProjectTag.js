import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, List, Tag, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { TagColors } from '@/services/enums';

@connect(({ project, tag }) => ({
    currentProject: project.currentProject,
    tag
}))
class ProjectTag extends PureComponent {

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'tag/fetch'
        });
    }


    render() {
        const {
            tag: { loading, tags }
        } = this.props;

        return (
            <PageHeaderWrapper>
                <Card title={<Button type="primary">创建标签</Button>} bordered={false} style={{ width: '100%', marginTop: 15 }}>
                    <List
                        header={<div>项目标签</div>}
                        bordered
                        loading={loading}
                        dataSource={tags}
                        renderItem={item => {
                            const colorObj = TagColors[item.color];
                            return <List.Item actions={[<a>修改标签</a>, <a>查看关联</a>]}>
                                <Tag color={colorObj ? colorObj.color : null}>{item.name}</Tag>
                                <span>{item.description}</span>
                            </List.Item>
                        }}
                    />
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default ProjectTag;
