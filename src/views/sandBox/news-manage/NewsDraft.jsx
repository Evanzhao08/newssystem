import React, { useEffect, useState } from "react";

import { Table, Button, Modal } from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  UploadOutlined,
} from "@ant-design/icons";

import axios from "axios";

const { confirm } = Modal;

export default function NewsDraft() {
  const [dataSource, setDataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    axios
      .get(`/news?author=${username}&auditState=0&_expand=category`)
      .then((res) => {
        const list = res.data;
        console.log("draft=>", list);
        setDataSource(list);
      });
  }, [username]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render(id) {
        return <b>{id}</b>;
      },
    },
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
      title: "分类",
      dataIndex: "category",
      render(category) {
        return category.title;
      },
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          <Button
            onClick={() => confimMethod(item)}
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
          />
          <Button danger shape="circle" icon={<EditOutlined />} />
          <Button type="primary" shape="circle" icon={<UploadOutlined />} />
        </div>
      ),
    },
  ];
  const confimMethod = (item) => {
    confirm({
      title: "你确认要删除?",
      icon: <ExclamationCircleFilled />,
      // content: "Some descriptions",
      cancelText: "取消",
      okText: "确认",
      onOk() {
        console.log("OK");
        deleteMethod(item);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const deleteMethod = (item) => {
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`/news/${item.id}`).then((res) => {});
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
