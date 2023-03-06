import style from "./News.module.css";
import React, { useEffect, useState, useRef } from "react";
import NewEditor from "../../../components/news-manage/NewEditor";
import openNotification from "../../../hooks/useNotification";
import { Button, PageHeader, Steps, Form, Input, Select, message } from "antd";
import axios from "axios";
const description = "新闻标题,新闻分类";
const { Option } = Select;

export default function NewsUpdate(props) {
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList] = useState([]);

  const [formInfo, setFormInfo] = useState({});
  const [content, setContent] = useState("");
  //   const User = JSON.parse(localStorage.getItem("token"));
  const handleNext = () => {
    if (current === 0) {
      NewsForm.current
        .validateFields()
        .then((res) => {
          setFormInfo(res);
          setCurrent(current + 1);
        })
        .catch((error) => {
          console.log("err", error);
        });
    } else {
      if (content === "" || content.trim() === "<p></p>") {
        message.error("新闻内容不能为空");
      } else {
        setCurrent(current + 1);
      }
    }
  };
  const handlePrevious = () => {
    setCurrent(current - 1);
  };

  useEffect(() => {
    axios
      .get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
      .then((res) => {
        const { title, categoryId, content } = res.data;
        NewsForm.current.setFieldsValue({
          title,
          categoryId,
        });
        setContent(content);
      });
  }, [props.match.params.id]);

  const NewsForm = useRef(null);
  useEffect(() => {
    axios.get("/categories").then((res) => {
      console.log("selectList=>", res.data);
      setCategoryList(res.data);
    });
  }, []);

  const handleSave = (auditState) => {
    axios
      .patch(`/news/${props.match.params.id}`, {
        ...formInfo,
        content: content,
        auditState: auditState,
      })
      .then((res) => {
        props.history.push(
          auditState === 0 ? "/news-manage/draft" : "audit-manage/list",
          openNotification("bottomRight", auditState)
        );
      });
  };

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="更新新闻"
        onBack={() => props.history.goBack()}
        // subTitle="This is a subtitle"
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
              {/* <Select onChange={handleChange} options={categoryList} /> */}
              <Select>
                {categoryList.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? "" : style.active}>
          <NewEditor
            getContent={(value) => {
              setContent(value);
            }}
            content={content}
          ></NewEditor>
        </div>
        <div className={current === 2 ? "" : style.active}>22222</div>
      </div>
      <div style={{ marginTop: "50px" }}>
        {current === 2 && (
          <span>
            <Button type="primary" onClick={() => handleSave(0)}>
              保存草稿箱
            </Button>
            <Button danger onClick={() => handleSave(1)}>
              提交审核
            </Button>
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