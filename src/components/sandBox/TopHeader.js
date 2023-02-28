import React, { useState } from "react";
import { Layout, Dropdown, Avatar } from "antd";
import { withRouter } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SmileOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

function TopHeader(props) {
  const [collapsed, setCollapsed] = useState(false);

  const {
    role: { roleName },
    username,
  } = JSON.parse(localStorage.getItem("token"));
  const items = [
    {
      key: "1",
      label: roleName,
      icon: <SmileOutlined />,
      disabled: false,
    },

    {
      key: "2",
      danger: true,
      label: "退出",
    },
  ];
  const onClick = ({ key }) => {
    if (key === "2") {
      localStorage.removeItem("token");
      props.history.replace("/login");
    }
  };
  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: "trigger",
        onClick: () => setCollapsed(console.log(123)),
      })}
      <div style={{ float: "right" }}>
        <span>
          欢迎<span style={{ color: "#1890ff" }}>{username}</span>回来
        </span>

        <Dropdown menu={{ items, onClick }}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}

export default withRouter(TopHeader);
