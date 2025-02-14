import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const dataUser: any = localStorage.getItem("user");

  useEffect(() => {
    if (!dataUser) {
      navigate("/login");
    }
  }, [navigate]);
  const userData = JSON.parse(dataUser);

  return (
    <>
      <div
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
        }}
      >
        <div>
          <h1>Dashboard</h1>
          <h3>Selamat datang kembali {userData?.data?.nama}</h3>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
