import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Card, List, Avatar } from 'antd';

import { Radar } from '@/components/Charts';
import EditableLinkGroup from '@/components/EditableLinkGroup';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ActionRecordDisplay from '@/components/ActionRecordDisplay';
import styles from './Dashboard.less';

const links = [
  {
    title: '中文',
    href: '',
  },
  {
    title: '英文',
    href: '',
  },
  {
    title: '葡萄牙语',
    href: '',
  },
  {
    title: '韩语',
    href: '',
  },
  {
    title: '日语',
    href: '',
  },
  {
    title: '阿拉伯语',
    href: '',
  },
];

@connect(({ user, project, member, actions, activities, chart, loading }) => ({
  currentProject: project.currentProject,
  currentUser: user.currentUser,
  project,
  member,
  actions,
  activities,
  chart,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  projectLoading: loading.effects['project/fetchNotice'],
  activitiesLoading: loading.effects['activities/fetchList'],
}))
class Workplace extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'member/fetch',
    });
    dispatch({
      type: 'actions/fetchList',
    });
    dispatch({
      type: 'activities/fetchList',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  renderActivities() {
    const {
      actions: { list },
    } = this.props;
    return list.map(item => {
      return (
        <ActionRecordDisplay key={item.id} item={item} />
        // <List.Item key={item.id}>
        //   <List.Item.Meta
        //     avatar={<Avatar src={item.subject.avatar} icon="user" />}
        //     title={
        //       <span>
        //         <a className={styles.username}>{item.subject.nickname}</a>
        //         &nbsp;
        //         <span className={styles.event}>
        //           {renderActionRecord(item)}
        //         </span>
        //       </span>
        //     }
        //     description={
        //       <span className={styles.datetime} title={item.create_time}>
        //         {moment(item.create_time).fromNow()}
        //       </span>
        //     }
        //   />
        // </List.Item>
      );
    });
  }

  render() {
    const {
      currentProject,
      currentUser,
      currentUserLoading,
      project: { notice },
      member: { members },
      actions: { loading: activitiesLoading },
      projectLoading,
    } = this.props;

    const pageHeaderContent =
      currentUser && Object.keys(currentUser).length ? (
        <div className={styles.pageHeaderContent}>
          <div className={styles.avatar}>
            <Avatar size="large" src="https://static.insta360.com/assets/www/favicons/favicon-96x96.png" />
          </div>
          <div className={styles.content}>
            <div className={styles.contentTitle}>
              {currentProject ? currentProject.name : null}
            </div>
            <div>
              Chase Adventure
            </div>
          </div>
        </div>
      ) : null;

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>词条数</p>
          <p>56</p>
        </div>
        <div className={styles.statItem}>
          <p>翻译完成率</p>
          <p>34.5%</p>
        </div>
      </div>
    );

    return (
      <PageHeaderWrapper
        loading={currentUserLoading}
        content={pageHeaderContent}
        extraContent={extraContent}
      >
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              bodyStyle={{ padding: 0 }}
              bordered={false}
              className={styles.activeCard}
              title="动态"
              extra={<a href="#">更多</a>}
              loading={activitiesLoading}
            >
              <List loading={activitiesLoading} size="large">
                <div className={styles.activitiesList}>{this.renderActivities()}</div>
              </List>
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{ marginBottom: 24 }}
              title="支持语言"
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <EditableLinkGroup onAdd={() => { }} links={links} linkElement={Link} />
            </Card>
            <Card
              bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
              bordered={false}
              title="成员"
              loading={projectLoading}
            >
              <div className={styles.members}>
                <Row gutter={48}>
                  {members.map((member, k) => (
                    <Col span={12} key={k}>
                      <Link to="">
                        <Avatar src={member.user.avatar} icon="user" size="small" />
                        <span className={styles.member}>{member.user.nickname ? member.user.nickname : member.user.username}</span>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Workplace;
