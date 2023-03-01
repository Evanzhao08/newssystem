import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import openNotification from "../../../hooks/useNotification";
const roleObj = {
  1: "superAdmin",
  2: "admin",
  3: "editor",
};
export default function Audit() {
  const [dataSource, setDataSource] = useState([]);

  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );
  useEffect(() => {
    axios.get(`/news?auditState=1&_expand=category`).then((res) => {
      const list = res.data;
      console.log("Audit", list);
      setDataSource(
        roleObj[roleId] === "superAdmin"
          ? list
          : [
              ...list.filter((item) => item.author === username),
              ...list.filter(
                (item) =>
                  item.region === region && roleObj[item.roleId] === "editor"
              ),
            ]
      );
    });
  }, [roleId, region, username]);

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
      title: "操作",
      render: (item) => (
        <div>
          <Button type="primary" onClick={() => handleAudit(item, 2, 1)}>
            通过
          </Button>
          <Button danger onClick={() => handleAudit(item, 3, 0)}>
            驳回
          </Button>
        </div>
      ),
    },
  ];
  const handleAudit = (item, auditState, publishState) => {
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios
      .patch(`/news/${item.id}`, {
        auditState,
        publishState,
      })
      .then((res) => {
        openNotification("bottomRight", auditState, "【审核管理/审核列表】");
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
