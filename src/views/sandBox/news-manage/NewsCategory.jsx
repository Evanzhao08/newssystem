import React, { useEffect, useState } from "react";

import { Table, Button, Modal } from "antd";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";

import axios from "axios";

const { confirm } = Modal;

export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    axios.get("/categories").then((res) => {
      setDataSource(res.data);
    });
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render(id) {
        return <b>{id}</b>;
      },
    },
    {
      title: "栏目名称",
      dataIndex: "title",
    },

    {
      title: "操作",
      render: (item) => (
        <div>
          <Button
            onClick={() => confimMethod(item)}
            danger
            shape="circle"
            icon={<DeleteOutlined />}
          />
        </div>
      ),
    },
  ];

  const confimMethod = (item) => {
    confirm({
      title: "你确认要删除?",
      icon: <ExclamationCircleFilled />,
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
    axios.delete(`/categories/${item.id}`).then((res) => {});
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
