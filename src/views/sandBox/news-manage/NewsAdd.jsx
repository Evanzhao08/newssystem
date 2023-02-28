import style from "./News.module.css";
import React, { useEffect, useState, useRef } from "react";
import { Button, PageHeader, Steps, Form, Input, Select } from "antd";
import axios from "axios";
const description = "新闻标题,新闻分类";

export default function NewsAdd() {
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList] = useState([]);

  const handleNext = () => {
    if (current === 0) {
      NewsForm.current
        .validateFields()
        .then((res) => {
          console.log(res);
          setCurrent(current + 1);
        })
        .catch((error) => {
          console.log("err", error);
        });
    } else {
    }
  };
  const handlePrevious = () => {
    setCurrent(current - 1);
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const NewsForm = useRef(null);
  useEffect(() => {
    axios.get("/categories").then((res) => {
      console.log(res.data);
      setCategoryList(res.data);
    });
  }, []);

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
        subTitle="This is a subtitle"
      />
      <Steps
        current={current}
        items={[
          {
            title: "基本信息",
            description,
          },
          {
            title: "新闻内容",
            description: "新闻主要内容",
            // subTitle: "新闻主要内容",
          },
          {
            title: "新闻提交",
            description: "保存草稿或提交审核",
          },
        ]}
      />
      <div style={{ marginTop: "50px" }}>
        <div className={current === 0 ? "" : style.active}>
          <Form
            name="basic"
            ref={NewsForm}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: "Please input your category",
                },
              ]}
            >
              <Select onChange={handleChange} options={categoryList} />
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? "" : style.active}>22222</div>
        <div className={current === 2 ? "" : style.active}>22222</div>
      </div>
      <div style={{ marginTop: "50px" }}>
        {current === 2 && (
          <span>
            <Button type="primary">保存草稿箱</Button>
            <Button danger>提交审核</Button>
          </span>
        )}
        {current < 2 && (
          <Button type="primary" onClick={handleNext}>
            下一步
          </Button>
        )}
        {current > 0 && <Button onClick={handlePrevious}>上一步</Button>}
      </div>
    </div>
  );
}
