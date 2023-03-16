import React, { useEffect, useState } from "react";
import { Descriptions, PageHeader } from "antd";
import { HeartTwoTone } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

export default function Detail(props) {
  const [newsInfo, setNewsInfo] = useState({});
  useEffect(() => {
    // console.log(props.match.params.id);
    axios
      .get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
      .then((res) => {
        setNewsInfo({
          ...res.data,
          view: res.data.view + 1,
        });
        return res.data;
      })
      .then((res) => {
        axios.patch(`/news/${props.match.params.id}`, {
          view: res.view + 1,
        });
      });
  }, [props.match.params.id]);

  const colorList = ["black", "orange", "green", "red"];

  const renderContent = (column = 3) => (
    <Descriptions size="small" column={column}>
      <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>

      <Descriptions.Item label="发布时间">
        {newsInfo.publishTime
          ? moment(newsInfo.publishTime).format("YYYY-MM-DD HH:mm:ss")
          : "-"}
      </Descriptions.Item>
      <Descriptions.Item label="区域">{newsInfo?.region}</Descriptions.Item>

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
  const handleStar = () => {
    setNewsInfo({
      ...newsInfo,
      star: newsInfo.star + 1,
    });

    axios.patch(`/news/${props.match.params.id}`, {
      star: newsInfo.star + 1,
    });
  };

  return (
    <div>
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={newsInfo?.title}
        subTitle={
          <div>
            {newsInfo?.category?.title}
            <HeartTwoTone twoToneColor="#eb2f96" onClick={() => handleStar()} />
          </div>
        }
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
