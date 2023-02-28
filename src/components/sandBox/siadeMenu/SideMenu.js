import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import axios from "axios";
import { withRouter } from "react-router-dom";
// import {
//   UploadOutlined,
//   UserOutlined,
//   VideoCameraOutlined,
//   AppstoreOutlined,
//   SettingOutlined,
//   ApiFilled,
//   BackwardFilled,
//   CalendarOutlined,
// } from "@ant-design/icons";

import "./index.css";

// const iconList = {
//   "/home": <UserOutlined />,
//   "/user-manage": <UploadOutlined />,
//   "/user-manage/list": <VideoCameraOutlined />,
//   "/right-manage": <AppstoreOutlined />,
//   "/right-manage/role/list": <SettingOutlined />,
//   "/right-manage/right/list": <ApiFilled />,
//   //.......
// };

const { Sider } = Layout;

const {
  role: { rights },
} = JSON.parse(localStorage.getItem("token"));

function SideMenu(props) {
  const [collapsed] = useState(false);
  const [menuList, SetmenuList] = useState([]);

  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      SetmenuList(res.data);
    });
  }, []);

  const checkPagepermisson = (item) => {
    return item.pagepermisson === 1 && rights.includes(item.key);
  };

  const processData = (dataList) => {
    return dataList.map((i) => {
      var dataListItem;
      if (checkPagepermisson(i)) {
        dataListItem =
          i.children?.length > 0
            ? getItem(
                i.title,
                i.key,
                rights[i.key],
                processData(i.children),
                i.type
              )
            : getItem(i.title, i.key, rights[i.key], undefined, i.type);
      }
      return dataListItem;
    });
  };

  const onClick = (e) => {
    //  console.log("click ", e);
    props.history.push(e.key);
  };

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const items = [
    ...menuList.map((item) => {
      const { key, children, title, type } = item;
      var checkItem;
      if (checkPagepermisson(item)) {
        checkItem =
          children?.length > 0
            ? getItem(title, key, rights[item.key], processData(children), type)
            : getItem(title, key, rights[item.key], undefined, type);
      }
      return checkItem;
    }),
  ];

  const selectKey = props.location.pathname;
  const openKey = ["/" + props.location.pathname?.split("/")[1]];
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className="logo">全球新闻发布管理</div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            onClick={onClick}
            style={{
              width: "100%",
            }}
            theme="dark"
            selectedKeys={selectKey}
            defaultOpenKeys={openKey}
            mode="inline"
            items={items}
          />
        </div>
      </div>
    </Sider>
  );
}

export default withRouter(SideMenu);
