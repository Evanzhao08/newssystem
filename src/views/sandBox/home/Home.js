import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Row, List, Avatar, Drawer } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import * as echarts from "echarts";
import _ from "lodash";
import axios from "axios";

const { Meta } = Card;

export default function Home() {
  const [viewList, setViewList] = useState([]);
  const [starList, setStarList] = useState([]);
  const [allList, setAllList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [pieChat, setPieChat] = useState(null);
  const barChart = useRef();
  const pieChart = useRef();
  useEffect(() => {
    axios
      .get(
        `/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`,
      )
      .then((res) => {
        // console.log(res.data);
        setViewList(res.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`,
      )
      .then((res) => {
        // console.log(res.data);
        setStarList(res.data);
      });
    return () => {
      window.onresize = null;
    };
  }, []);
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then((res) => {
      // console.log(res.data);
      setAllList(res.data);
      console.log(_.groupBy(res.data, (item) => item.category.title));
      renderCharFun(_.groupBy(res.data, (item) => item.category.title));
    });
  }, []);

  const renderCharFun = (obj) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(barChart.current);
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: "新闻分类图示",
      },
      tooltip: {},
      legend: {
        data: ["数量"],

      },
      xAxis: {
        data: Object.keys(obj),
      },
      yAxis: { interval: 1 },
      series: [
        {
          name: "数量",
          type: "bar",
          barMaxWidth:50,
          data: Object.keys(obj).map((item) => item.length),
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.onresize = () => {
      myChart.resize();
    };
  };

  const renderPieCharFun = (obj) => {
    var currentList = allList.filter((item) => item.author === username);
    var groupObj = _.groupBy(currentList, (item) => item.category.title);
    // console.log(groupObj);

    var list = [];
    for (var i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length,
      });
    }
    console.log("list", list);
    // 基于准备好的dom，初始化echarts实例
    var myPieChart;
    if (!pieChat) {
      myPieChart = echarts.init(pieChart.current);
      setPieChat(myPieChart);
    } else {
      myPieChart = pieChart;
    }
    var option;
    option = {
      title: {
        text: "当前用户新闻分类图示",
        subtext: "Fake Data",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "发布数量",
          type: "pie",
          radius: "50%",
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    option && myPieChart.setOption(option);
  };

  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem("token"));

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最长浏览" bordered>
            <List
              size="small"
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered>
            <List
              size="small"
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Card title" bordered>
            <Card
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <SettingOutlined
                  key="setting"
                  onClick={() => {
                    setTimeout(() => {
                      setVisible(true);
                      renderPieCharFun();
                    }, 0);
                  }}
                />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://joesch.moe/api/v1/random" />}
                title={username}
                description={
                  <div>
                    <b>{region ? region : "全球"}</b>
                    {roleName}
                  </div>
                }
              />
            </Card>
          </Card>
        </Col>
      </Row>
      <Drawer
        width="500px"
        title=" 个人新闻分类"
        placement="right"
        onClose={() => {
          setVisible(false);
        }}
        open={visible}
      >
        <div ref={pieChart} style={{ width: "100%", height: "400px" }}></div>
      </Drawer>
      <div ref={barChart} style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
}
