import React, { useEffect, useState } from "react";
import { Button, Dropdown, Form, Input, Table } from "antd";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { MenuProps } from "antd/es/menu";
import axios from "axios";
import { Link } from "react-router-dom";

interface Employee {
  name: string;
  lastName: string;
  position: string;
  email: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    lastName: "",
    position: "",
    email: "",
  });

  const menuItems: MenuProps["items"] = [
    {
      key: "1",
      label: "Дія 1",
    },
    {
      key: "2",
      label: "Дія 2",
    },
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async (filterParams = {}) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://demo2-uk.prod.itua.in.ua/core_api/company/users?page=1&itemsPerPage=20",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: 1,
            itemsPerPage: 20,
            ...filterParams,
          },
        }
      );
      setEmployees(response.data["hydra:member"]);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = () => {
    const filterParams: Record<string, string> = {};

    if (filters.name) filterParams["name"] = filters.name;
    if (filters.lastName) filterParams["lastName"] = filters.lastName;
    if (filters.position) filterParams["position"] = filters.position;
    if (filters.email) filterParams["email"] = filters.email;

    fetchEmployees(filterParams);
  };

  const handleClearFilters = () => {
    setFilters({
      name: "",
      lastName: "",
      position: "",
      email: "",
    });
    fetchEmployees();
  };

  const columns = [
    {
      title: "",
      key: "actions",
      render: () => (
        <Dropdown menu={{ items: menuItems }}>
          <Button type="text" icon={<MenuOutlined />} />
        </Dropdown>
      ),
    },
    { title: "Ім'я", dataIndex: "name", key: "name" },
    { title: "Прізвище", dataIndex: "lastName", key: "lastName" },
    { title: "Посада", dataIndex: "position", key: "position" },
    { title: "E-mail", dataIndex: "email", key: "email" },
  ];

  return (
    <div className="border-l-8 border-r-8 border-[#e5e7eb]">
      <div className="h-[40px] bg-[#e5e7eb] flex items-center justify-between">
        <h2 className="font-[700]">Співробітники</h2>
        <Link to="/departmens">
          <button className="font-[700]">Відкрити структуру компанії</button>
        </Link>
      </div>
      <div className="flex gap-3">
        <Form className="w-[20%] border-r-2 border-[#e5e7eb]">
          <div className=" p-4 border-b-2 border-[#e5e7eb] flex justify-between items-center">
            <h3 className="font-[700]">Фільтри</h3>
            <Button
              type="text"
              icon={<CloseOutlined />}
              style={{ marginLeft: "8px", color: "blue" }}
              onClick={handleClearFilters}
            />
          </div>
          <Form.Item
            className="px-4"
            label="Ім'я"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
            />
          </Form.Item>
          <Form.Item
            className="px-4"
            label="Прізвище"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input
              name="lastName"
              value={filters.lastName}
              onChange={handleFilterChange}
            />
          </Form.Item>
          <Form.Item
            className="px-4"
            label="Посада"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input
              name="position"
              value={filters.position}
              onChange={handleFilterChange}
            />
          </Form.Item>
          <Form.Item
            className="px-4"
            label="E-mail"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
            />
          </Form.Item>
          <div className="flex justify-between border-t-2 border-b-2 border-[#e5e7eb]">
            <Form.Item className="px-4 mt-6">
              <Button type="primary" onClick={handleFilterSubmit}>
                Фільтрувати
              </Button>
            </Form.Item>
            <Form.Item className="px-4 mt-6">
              <Button
                onClick={() =>
                  setFilters({
                    name: "",
                    lastName: "",
                    position: "",
                    email: "",
                  })
                }
              >
                Очистити
              </Button>
            </Form.Item>
          </div>
        </Form>
        <Table
          className="w-[80%] p-4"
          dataSource={employees}
          columns={columns}
          rowKey="email"
        />
      </div>
    </div>
  );
}
