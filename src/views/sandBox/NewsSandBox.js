import React, { useEffect } from "react";
import NProgress from "nprogress";
import SideMenu from "../../components/sandBox/siadeMenu/SideMenu";
import TopHeader from "../../components/sandBox/TopHeader";
import NewRouter from "../../components/sandBox/siadeMenu/NewRouter";

import { Layout } from "antd";
import "nprogress/nprogress.css";
import "./NewsSandBox.css";

const { Content } = Layout;

export default function NewsSandBox() {
  NProgress.start();
  useEffect(() => {
    NProgress.done();
  });
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          <NewRouter></NewRouter>
        </Content>
      </Layout>
    </Layout>
  );
}
