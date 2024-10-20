import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    setLoading(true);
    axios
      .post("https://demo2-uk.prod.itua.in.ua/core_api/auth/login", values)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        navigate("/employees");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Form
        requiredMark={false}
        style={{
          borderTop: "15px solid blue",
          borderBottom: "15px solid blue",
          borderLeft: "10px solid blue",
          borderRight: "10px solid blue",
        }}
        className="w-[25%] rounded p-6"
        onFinish={onFinish}
      >
        <Form.Item
          label={
            <span>
              Логин<span style={{ color: "red" }}> *</span>
            </span>
          }
          labelCol={{ span: 24 }}
          name="login"
          rules={[{ required: true, message: "Please input your login!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={
            <span>
              Пароль<span style={{ color: "red" }}> *</span>
            </span>
          }
          labelCol={{ span: 24 }}
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Увійти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
