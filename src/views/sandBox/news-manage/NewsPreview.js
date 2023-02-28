import React, { useEffect, useState } from "react";
import { Descriptions, PageHeader } from "antd";
import axios from "axios";

export default function NewsPreview(props) {
  const [newsInfo, setNewsInfo] = useState(null);
  useEffect(() => {
    console.log(props.match.params.id);
    axios
      .get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
      .then((res) => {
        setNewsInfo(res.data);
      });
  }, [props.match.params.id]);

  const renderContent = (column = 3) => (
    <Descriptions size="small" column={column}>
      <Descriptions.Item label="创建者">Lili Qu</Descriptions.Item>
      <Descriptions.Item label="创建时间">2023/02/28</Descriptions.Item>
      <Descriptions.Item label="发布时间">2017-01-10</Descriptions.Item>
      <Descriptions.Item label="区域">2017-10-10</Descriptions.Item>
      <Descriptions.Item label="审核状态">未审核</Descriptions.Item>
      <Descriptions.Item label="发布状态">未发布</Descriptions.Item>
      <Descriptions.Item label="访问数量">10</Descriptions.Item>
      <Descriptions.Item label="点赞数量">1</Descriptions.Item>
      <Descriptions.Item label="评论数量">0</Descriptions.Item>
    </Descriptions>
  );

  const Content = ({ children, extra }) => (
    <div className="content">
      <div className="main">{children}</div>
      <div className="extra">{extra}</div>
    </div>
  );
  return (
    <div>
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={newsInfo?.title}
        subTitle={newsInfo.category.title}
      >
        <Content>{newsInfo && renderContent()}</Content>
      </PageHeader>
    </div>
  );
}
