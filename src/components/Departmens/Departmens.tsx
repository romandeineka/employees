import { Button, List } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Department {
  id: number;
  title: string;
  parentId: number | null;
  children: Department[];
  chief?: string;
}

export default function Departmens() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [openDepartments, setOpenDepartments] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async (parentId: number | null = null) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://demo2-uk.prod.itua.in.ua/core_api/company/departments?page=1&itemsPerPage=20",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response:", response.data);
      const fetchedDepartments: Department[] = Array.isArray(
        response.data["hydra:member"]
      )
        ? response.data["hydra:member"].map((dept) => ({
            id: dept.id,
            title: dept.title,
            parentId: dept.parent ? dept.parent.id : null,
            children: [],
            chief: dept.chief ? dept.chief.fullName : "Немає керівника",
          }))
        : [];
      console.log("Fetched Departments:", fetchedDepartments);
      const departmentMap: { [key: number]: Department } = {};
      fetchedDepartments.forEach((dept) => {
        departmentMap[dept.id] = dept;
      });

      const rootDepartments: Department[] = [];
      for (const dept of fetchedDepartments) {
        if (dept.parentId === null || dept.parentId === undefined) {
          rootDepartments.push(dept);
        } else {
          const parentDept = departmentMap[dept.parentId];
          if (parentDept) {
            parentDept.children.push(dept);
          }
        }
      }
      console.log("Root Departments:", rootDepartments);
      setDepartments(rootDepartments);
    } catch (error) {
      console.log("Error fetching departments:", error);
    }
  };

  const toggleDepartment = (id: number) => {
    setOpenDepartments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleEdit = (id: number) => {
    console.log("Edit department with id:", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete department with id:", id);
  };

  const handleHolderClick = (id: number) => {
    console.log("Holder button clicked for department with id:", id);
  };

  const renderDepartments = (departments: Department[], level: number = 0) => {
    return (
      <List
        dataSource={departments}
        renderItem={(dept) => (
          <List.Item
            style={{
              display: "block",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginInline: "10px",
                backgroundColor: "white",
              }}
            >
              <div className="">
                {level > 0 && (
                  <Button onClick={() => handleHolderClick(dept.id)}
                    icon={<HolderOutlined />}
                    style={{
                      color: "blue",
                      marginLeft: "10px",
                      border: "none",
                    }}
                  />
                )}
                <Button
                  onClick={() => toggleDepartment(dept.id)}
                  style={{ marginRight: "10px", color: "blue", border: "none" }}
                >
                  +
                </Button>
                {dept.title}
              </div>
              <div className="">
                {dept.chief && (
                  <span>
                    {`Керівник: ${dept.chief}`}
                    {dept.chief === "Назарок Богдан Михайлович" && (
                      <UserOutlined
                        style={{
                          border: "2px solid gray",
                          borderRadius: "50%",
                          marginInline: "5px",
                          padding: "2px",
                        }}
                      />
                    )}
                  </span>
                )}
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(dept.id)}
                  style={{
                    marginLeft: "10px",
                    color: "blue",
                    border: "none",
                    background: "transparent",
                  }}
                  size="small"
                />
                {level > 0 && (
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(dept.id)}
                    style={{
                      marginLeft: "10px",
                      color: "blue",
                      border: "none",
                      background: "transparent",
                    }}
                    size="small"
                  />
                )}
              </div>
            </div>

            {openDepartments[dept.id] &&
              dept.children &&
              dept.children.length > 0 && (
                <div style={{ paddingLeft: "20px" }}>
                  {renderDepartments(dept.children, level + 1)}
                </div>
              )}
          </List.Item>
        )}
      />
    );
  };

  return (
    <div className="bg-gray-300">
      <div className="pl-[30px] flex items-center h-10">
        <h2>Структура компанії</h2>
      </div>
      {renderDepartments(departments)}
    </div>
  );
}
