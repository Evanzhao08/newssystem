import { Table, Button, Modal, Tree } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  UnorderedListOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

const { confirm } = Modal;
export default function RoleList() {
  const [dataSource, setDataSource] = useState([]);
  const [rightList, setRightList] = useState([]);
  const [currentRights, setCurrentRights] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    axios.get("/roles").then((res) => {
      console.log(res);
      setDataSource(res.data);
    });
  }, []);
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      setRightList(res.data);
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
      title: "角色名称",
      dataIndex: "roleName",
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button
              onClick={() => confimMethod(item)}
              danger
              shape="circle"
              icon={<DeleteOutlined />}
            />

            <Button
              type="primary"
              shape="circle"
              icon={<UnorderedListOutlined />}
              onClick={() => {
                setModalOpen(!isModalOpen);
                setCurrentRights(item.rights);
                setCurrentId(item.id);
              }}
            />
          </div>
        );
      },
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
    axios.delete(`/roles/${item.id}`).then((res) => {
      if (res.status === 200) {
        setDataSource(dataSource.filter((data) => data.id !== item.id));
      }
    });
  };
  const handleOk = () => {
    setModalOpen(false);
    setDataSource(
      dataSource.map((item) => {
        if (item.id === currentId) {
          return {
            ...item,
            rights: currentRights,
          };
        }
        return item;
      })
    );
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights,
    });
  };
  const handleCancel = () => {
    setModalOpen(false);
  };
  const onCheck = (checkedKeys) => {
    setCurrentRights(checkedKeys.checked);
  };
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
      ></Table>
      <Modal
        title="权限分配"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          // defaultCheckedKeys={currentRights}
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly={true}
          treeData={rightList}
        />
      </Modal>
    </div>
  );
}
