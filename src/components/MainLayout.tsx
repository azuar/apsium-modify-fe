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
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";

const { Content, Footer, Sider } = Layout;

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

const items: MenuItem[] = [
  getItem(<Link to="/dashboard">Dashboard</Link>, "1", <PieChartOutlined />),
  getItem("Mahasiswa", "sub1", <UserOutlined />, [
    getItem(<Link to="/profil">Profil</Link>, "2", <UserOutlined />),
    getItem(
      <Link to="/judul-skripsi">Judul Skripsi</Link>,
      "3",
      <ClusterOutlined />
    ),
    getItem(<Link to="/seminar">Cat. Seminar</Link>, "4", <ScheduleOutlined />),
    getItem(
      <Link to="/sidang">Cat. Sidang</Link>,
      "5",
      <ReconciliationOutlined />
    ),
  ]),
  getItem("Settings", "sub2", <SettingOutlined />, [
    getItem("Ganti Password", "6", <HistoryOutlined />),
    getItem("Logout", "7", <LogoutOutlined />),
  ]),
];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
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
