import React from "react";
import { Layout, Dropdown, Avatar } from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

function TopHeader(props) {
  console.log("TopHeader", props);
  // const [collapsed, setCollapsed] = useState(false);

  const changeCollapsed = () => {
    props.changeCollapsed();
  };
  const {
    role: { roleName },
    username,
  } = JSON.parse(localStorage.getItem("token"));
  const items = [
    {
      key: "1",
      label: roleName,
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
      {props.isCollapsed ? (
        <MenuUnfoldOutlined onClick={changeCollapsed} />
      ) : (
        <MenuFoldOutlined onClick={changeCollapsed} />
      )}
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

const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed,
  };
};

const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: "change_collapsed",
    };
  },
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TopHeader));
