import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button, Tag } from "antd";

import openNotification from "../../../hooks/useNotification";

export default function AuditList() {
  const [dataSource, setDataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));
  const auditList = ["未审核", "审核中", "已审核", "未通过"];
  const colorList = ["black", "orange", "green", "red"];
  useEffect(() => {
    axios
      .get(
        `/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
      )
      .then((res) => {
        console.log(res);
        setDataSource(res.data);
      });
  }, [username]);
  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      render(title, item) {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>;
      },
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render(category) {
        return <div>{category.title}</div>;
      },
    },
    {
      title: "审核状态",
      dataIndex: "auditState",
      render: (auditState) => {
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>;
      },
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          {item.auditState === 1 && (
            <Button onClick={() => handleRervert(item)}>撤销</Button>
          )}
          {item.auditState === 2 && <Button danger>发布</Button>}
          {item.auditState === 3 && <Button type="primary">更新</Button>}
        </div>
      ),
    },
  ];
  const handleRervert = (item) => {
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios.patch(`/news/${item.id}`, { auditState: 0 }).then((res) => {
      openNotification(null, 0);
    });
  };
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
