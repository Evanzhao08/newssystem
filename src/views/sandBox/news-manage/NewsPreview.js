import React, { useEffect, useState } from "react";
import { Descriptions, PageHeader } from "antd";
import axios from "axios";
import moment from "moment";

export default function NewsPreview(props) {
  const [newsInfo, setNewsInfo] = useState({});
  useEffect(() => {
    // console.log(props.match.params.id);
    axios
      .get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
      .then((res) => {
        setNewsInfo(res.data);
        return res.data;
      });
  }, [props.match.params.id]);
  const auditList = ["未审核", "审核中", "已审核", "未通过"];
  const colorList = ["black", "orange", "green", "red"];
  const publishList = ["未发布", "待发布", "已上线", "已下线"];
  const renderContent = (column = 3) => (
    <Descriptions size="small" column={column}>
      <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
      <Descriptions.Item label="创建时间">
        {moment(newsInfo.createTime).format("YYYY-MM-DD HH:mm:ss")}
      </Descriptions.Item>
      <Descriptions.Item label="发布时间">
        {newsInfo.publishTime
          ? moment(newsInfo.publishTime).format("YYYY-MM-DD HH:mm:ss")
          : "-"}
      </Descriptions.Item>
      <Descriptions.Item label="区域">{newsInfo?.region}</Descriptions.Item>
      <Descriptions.Item label="审核状态">
        <div style={{ color: colorList[newsInfo.auditState] }}>
          {auditList[newsInfo.auditState]}
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="发布状态">
        <div style={{ color: colorList[newsInfo.auditState] }}>
          {publishList[newsInfo.publishState]}
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="访问数量">
        <div style={{ color: colorList[newsInfo.auditState] }}>
          {newsInfo.view}
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="点赞数量">
        <div style={{ color: colorList[newsInfo.auditState] }}>
          {newsInfo.star}
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="评论数量">
        <div style={{ color: colorList[newsInfo.auditState] }}>
          {newsInfo.star}
        </div>
      </Descriptions.Item>
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
        subTitle={newsInfo?.category?.title}
      >
        <Content>{newsInfo && renderContent()}</Content>
      </PageHeader>
      <div
        dangerouslySetInnerHTML={{
          __html: newsInfo.content,
        }}
        style={{ border: "1px solid gray" }}
      ></div>
    </div>
  );
}
