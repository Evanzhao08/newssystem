import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Switch, Table } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import axios from "axios";
import UserForms from "../../../components/sandBox/user-manage/UserForms";
const { confirm } = Modal;

export default function UserList() {
  const [dataSource, setDataSource] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpOpen, setIsUpOpen] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [regiosList, setRegiosList] = useState([]);
  const [isUpdateDisable, setIsUpdateDisable] = useState(false);
  const addFormref = useRef(null);
  const updateFormref = useRef(null);
  const [current, setCurrent] = useState(null);

  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );

  useEffect(() => {
    const roleObj = {
      1: "superAdmin",
      2: "admin",
      3: "editor",
    };

    axios.get("/users?_expand=role").then((res) => {
      const list = res.data;
      setDataSource(
        roleObj[roleId] === "superAdmin"
          ? list
          : [
              ...list.filter((item) => item.username === username),
              ...list.filter(
                (item) =>
                  item.region === region && roleObj[item.roleId] === "editor"
              ),
            ]
      );
    });
  }, [username, roleId, region]);
  useEffect(() => {
    axios.get("/regions").then((res) => {
      const list = res.data;
      setRegiosList(list);
    });
  }, []);
  useEffect(() => {
    axios.get("/roles").then((res) => {
      const list = res.data;
      setRoleList(list);
    });
  }, []);

  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      filters: [
        ...regiosList.map((item) => {
          return {
            text: item.title,
            value: item.value,
          };
        }),
        {
          text: "全球",
          value: "全球",
        },
      ],
      onFilter: (value, item) => {
        if (value === "全球") {
          return item.region === "";
        }
        return item.region === value;
      },
      render(region) {
        return <b>{region === "" ? "全球" : region}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render(role) {
        return role?.roleName;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      dataIndex: "roleState",
      render(roleState, item) {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={() => {
              handleChange(item);
            }}
          ></Switch>
        );
      },
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          <Button
            onClick={() => confirmMethod(item)}
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            disabled={item.default}
          />

          <Button
            danger
            shape="circle"
            icon={<EditOutlined />}
            disabled={item.default}
            onClick={() => {
              handleUpChange(item);
            }}
          />
        </div>
      ),
    },
  ];
  const handleUpChange = (item) => {
    setTimeout(() => {
      setIsUpOpen(true);
      if (item.roleId === 1) {
        setIsUpdateDisable(true);
      } else {
        setIsUpdateDisable(false);
      }
      updateFormref.current?.setFieldsValue(item);
    }, 0);
    setCurrent(item);
  };

  const handleChange = (item) => {
    item.roleState = !item.roleState;
    setDataSource([...dataSource]);
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState,
    });
  };

  const confirmMethod = (item) => {
    confirm({
      title: "你确定要删除?",
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        //   console.log('OK');
        deleteMethod(item);
      },
      onCancel() {
        //   console.log('Cancel');
      },
    });
  };
  //删除
  const deleteMethod = (item) => {
    // console.log(item)
    // 当前页面同步状态 + 后端同步

    setDataSource(dataSource.filter((data) => data.id !== item.id));

    axios.delete(`/users/${item.id}`);
  };
  const addFormOK = () => {
    addFormref.current
      .validateFields()
      .then((value) => {
        setIsOpen(false);
        addFormref.current.resetFields();
        axios
          .post("/users", {
            ...value,
            roleState: true,
            default: false,
          })
          .then((res) => {
            console.log("addData==>", res.data);
            setDataSource([
              ...dataSource,
              {
                ...res.data,
                role: roleList.filter((item) => item.id === value.roleId)[0],
              },
            ]);
          });
      })
      .catch((err) => console.log(err));
  };

  const updateFormOK = () => {
    updateFormref.current.validateFields().then((value) => {
      setIsUpOpen(false);

      setDataSource(
        dataSource.map((item) => {
          if (item.id === current.id) {
            return {
              ...item,
              ...value,
              role: roleList.filter((data) => data.id === value.roleId)[0],
            };
          }
          return item;
        })
      );

      axios.patch(`/users/${current.id}`, value).then((res) => {
        console.log("addData111==>", res.data);
      });
    });
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsOpen(true)}>
        添加用户
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />

      <Modal
        open={isOpen}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsOpen(false);
        }}
        onOk={addFormOK}
      >
        <UserForms
          roleList={roleList}
          regiosList={regiosList}
          ref={addFormref}
        />
      </Modal>
      <Modal
        open={isUpOpen}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpOpen(false);
        }}
        onOk={updateFormOK}
      >
        <UserForms
          roleList={roleList}
          regiosList={regiosList}
          ref={updateFormref}
          isUpdateDisable={isUpdateDisable}
          isUpdate
        />
      </Modal>
    </div>
  );
}
