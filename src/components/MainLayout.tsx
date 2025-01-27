import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import {
  ClusterOutlined,
  ScheduleOutlined,
  PieChartOutlined,
  ReconciliationOutlined,
  UserOutlined,
  SettingOutlined,
  HistoryOutlined,
  LogoutOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { Content, Footer, Sider } = Layout;

  const user: any = localStorage.getItem("user");
  const userData = JSON.parse(user);

  type MenuItem = Required<MenuProps>["items"][number];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }

  const logout = () => {
    localStorage.clear();
  };

  const items: MenuItem[] = [
    getItem(<Link to="/dashboard">Dashboard</Link>, "1", <PieChartOutlined />),
    userData.data.role === "mahasiswa"
      ? getItem("Mahasiswa", "sub1", <UserOutlined />, [
          getItem(<Link to="/profil">Profil</Link>, "2", <UserOutlined />),
          getItem(
            <Link to="/judul-skripsi">Judul Skripsi</Link>,
            "3",
            <ClusterOutlined />
          ),
          getItem(
            <Link to="/seminar">Cat. Seminar</Link>,
            "4",
            <ScheduleOutlined />
          ),
          getItem(
            <Link to="/sidang">Cat. Sidang</Link>,
            "5",
            <ReconciliationOutlined />
          ),
        ])
      : userData.data.role === "dosen"
      ? getItem("Dosen", "sub1", <UserOutlined />, [
          getItem(<Link to="/profil">Profil</Link>, "2", <UserOutlined />),
          getItem(
            <Link to="/judul-skripsi">Judul Skripsi</Link>,
            "3",
            <ClusterOutlined />
          ),
          getItem(
            <Link to="/seminar">Cat. Seminar</Link>,
            "4",
            <ScheduleOutlined />
          ),
          getItem(
            <Link to="/sidang">Cat. Sidang</Link>,
            "5",
            <ReconciliationOutlined />
          ),
        ])
      : getItem("Admin", "sub1", <UserOutlined />, [
          getItem(<Link to="/dosen">Dosen</Link>, "2", <TeamOutlined />),
          getItem(
            <Link to="/seminar">Cat. Seminar</Link>,
            "3",
            <ScheduleOutlined />
          ),
          getItem(
            <Link to="/sidang">Cat. Sidang</Link>,
            "4",
            <ReconciliationOutlined />
          ),
        ]),
    getItem("Settings", "sub2", <SettingOutlined />, [
      getItem("Ganti Password", "6", <HistoryOutlined />),
      getItem(
        <Link to="/login" onClick={logout}>
          Logout
        </Link>,
        "7",
        <LogoutOutlined />
      ),
    ]),
  ];
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          {collapsed ? (
            <img
              src="https://upload.wikimedia.org/wikipedia/id/9/96/Lambang_Universitas_Maritim_Raja_Ali_Haji.png"
              alt=""
              height={34}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="https://upload.wikimedia.org/wikipedia/id/9/96/Lambang_Universitas_Maritim_Raja_Ali_Haji.png"
                alt=""
                height={34}
              />{" "}
              <span
                style={{ color: "white", fontSize: "20px", marginLeft: "10px" }}
              >
                APSIUM
              </span>
            </div>
          )}
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1", "sub2"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Content
          style={{
            marginInline: "30px",
            marginBlock: "30px",
          }}
        >
          <Outlet />
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Aplikasi Pengelolaan Skripsi UMRAH ©{new Date().getFullYear()} Created
          by Azuar
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
