import React, { forwardRef, useEffect, useState } from "react";
import { Select, Form, Input } from "antd";

const UserForms = (props, ref) => {
  const [isDisable, setDisable] = useState(false);
  useEffect(() => {
    setDisable(props.isUpdateDisable);
  }, [props.isUpdateDisable]);

  const { roleId, region } = JSON.parse(localStorage.getItem("token"));
  const roleObj = {
    1: "superAdmin",
    2: "admin",
    3: "editor",
  };
  const checkRegionDisabled = (item) => {
    if (props.isUpdate) {
      if (roleObj[roleId] === "superAdmin") {
        return false;
      } else {
        return true;
      }
    } else {
      if (roleObj[roleId] === "superAdmin") {
        return false;
      } else {
        return item.region !== region;
      }
    }
  };

  const checkRoleDisabled = (item) => {
    if (props.isUpdate) {
      if (roleObj[roleId] === "superAdmin") {
        return false;
      } else {
        return true;
      }
    } else {
      if (roleObj[roleId] === "superAdmin") {
        return false;
      } else {
        return roleObj[item.id] !== "editor";
      }
    }
  };

  return (
    <Form ref={ref} layout="vertical">
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Input type="password" />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={
          isDisable
            ? []
            : [
                {
                  required: true,
                  message: "Please input the title of collection!",
                },
              ]
        }
      >
        <Select
          disabled={isDisable}
          options={props.regiosList.map((item) => {
            return {
              disabled: checkRegionDisabled(item),
              value: item.value,
              label: item.title,
            };
          })}
        />
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Select
          onChange={(value) => {
            if (value === 1) {
              setDisable(true);
              ref.current.setFieldsValue({
                region: "",
              });
            } else {
              setDisable(false);
            }
          }}
          options={props.roleList.map((item) => {
            return {
              disabled: checkRoleDisabled(item),
              value: item.id,
              label: item.roleName,
            };
          })}
        />
      </Form.Item>
    </Form>
  );
};
export default forwardRef(UserForms);
