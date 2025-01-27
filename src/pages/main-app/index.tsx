import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/MainLayout";

const MainApp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <MainLayout />
    </div>
  );
};

export default MainApp;
