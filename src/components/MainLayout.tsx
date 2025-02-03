import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

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
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { MenuProps } from "antd";
import { Layout, Menu, FloatButton } from "antd";

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState(["1"]);
  const { Content, Footer, Sider } = Layout;

  const user: any = localStorage.getItem("user");
  const userData = JSON.parse(user);

  const navigate = useNavigate();

  if (!userData) {
    navigate("/login");
    return;
  }

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
            <Link to="/skripsi">Judul Skripsi</Link>,
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
            <Link to="/skripsi">Judul Skripsi</Link>,
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

  const setMenuActicve = () => {
    const url = location.pathname;
    const dataReturn: any = [];
    items.map((x: any) => {
      if (x.children) {
        x.children.forEach((e: any) => {
          dataReturn.push(e);
        });
      } else {
        dataReturn.push(x);
      }
      return;
    });
    const activeMenu = dataReturn.filter((x: any) => {
      if (x.label.props?.to == url) {
        return x.key;
      }
    });
    setSelected([activeMenu[0]?.key]);
  };

  useEffect(() => {
    setMenuActicve();
  }, []);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      {window.innerWidth > 600 ? (
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
                  style={{
                    color: "white",
                    fontSize: "20px",
                    marginLeft: "10px",
                    fontWeight: 500,
                  }}
                >
                  APSIUM
                </span>
              </div>
            )}
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={selected}
            selectedKeys={selected}
            defaultOpenKeys={["sub1", "sub2"]}
            mode="inline"
            items={items}
            onSelect={setMenuActicve}
          />
        </Sider>
      ) : (
        <>
          <FloatButton.Group
            trigger="click"
            type="primary"
            style={{ insetInlineEnd: 24 }}
            icon={<MenuUnfoldOutlined />}
          >
            <FloatButton
              icon={<PieChartOutlined />}
              tooltip={<div>Dashboard</div>}
              onClick={() => navigate("/dashboard")}
            />
            <FloatButton
              icon={<UserOutlined />}
              tooltip={<div>Profil</div>}
              onClick={() => navigate("/profil")}
            />
          </FloatButton.Group>
        </>
      )}
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
