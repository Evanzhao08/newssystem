import React, { useEffect, useState } from "react";

import { Table, Tag, Button, Modal, Popover, Switch } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

import axios from "axios";

const { confirm } = Modal;

export default function RightList() {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      const list = res.data;
      list.forEach((e) => {
        if (e.children.length === 0) {
          e.children = "";
        }
      });
      setDataSource(list);
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
      title: "权限名称",
      dataIndex: "title",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      render: (key) => <Tag color="volcano">{key}</Tag>,
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
          <Popover
            content={
              <div style={{ textAlign: "center" }}>
                <Switch
                  defaultChecked
                  checked={item.pagepermisson}
                  onChange={() => switchMethod(item)}
                />
              </div>
            }
            title="配置项"
            trigger={item.pagepermisson ? "click" : ""}
          >
            <Button
              danger
              shape="circle"
              icon={<EditOutlined />}
              disabled={!item.pagepermisson}
            />
          </Popover>
        </div>
      ),
    },
  ];
  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    if (item.grade === 1) {
      axios
        .patch(`/rights/${item.id}`, {
          pagepermisson: item.pagepermisson,
        })
        .then((res) => {
          if (res.status === 200) {
            setDataSource([...dataSource]);
          }
        });
    } else {
      axios
        .patch(`/children/${item.id}`, {
          pagepermisson: item.pagepermisson,
        })
        .then((res) => {
          if (res.status === 200) {
            setDataSource([...dataSource]);
          }
        });
    }
  };
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
    if (item.grade === 1) {
      axios.delete(`/rights/${item.id}`).then((res) => {
        if (res.status === 200) {
          setDataSource(dataSource.filter((data) => data.id !== item.id));
        }
      });
    } else {
      axios.delete(`/children/${item.id}`).then((res) => {
        if (res.status === 200) {
          let list = dataSource.filter((data) => data.id === item.rightId);
          list[0].children = list[0].children.filter(
            (data) => data.id !== item.id
          );
          setDataSource([...dataSource]);
        }
      });
    }
  };

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
