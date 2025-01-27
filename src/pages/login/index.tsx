import { Form, Input, Button, Flex } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const LOCAL_URL = "http://localhost:4000";

  const submitHandler = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${LOCAL_URL}/api/users/login`,
        {
          email,
          password,
        },
        config
      );

      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.response.data.message);
      console.log(error.response);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minWidth: "100vw",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          textAlign: "center",
          border: "1px solid black",
          padding: 20,
          margin: 20,
          width: 600,
          borderRadius: 10,
        }}
      >
        <h2 style={{ marginBottom: 10, marginTop: 30 }}>
          Selamat Datang Kembali
        </h2>
        <hr style={{ width: 200, display: "block", margin: "0 auto" }} />
        <h4 style={{ marginBottom: 10, marginTop: 10, color: "#1777FF" }}>
          Silahkan Login Aplikasi Skripsi
        </h4>
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: "white",
            borderRadius: 10,
          }}
        >
          {error && <h3 style={{ color: "#f04848" }}>{error}</h3>}
          <Form
            name="layout-multiple-vertical"
            layout="vertical"
            onSubmitCapture={submitHandler}
          >
            <Form.Item
              label={<h4>Email :</h4>}
              name="email"
              style={{ marginBottom: 12 }}
            >
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item
              label={<h4>Password :</h4>}
              name="password"
              style={{ marginBottom: 12 }}
            >
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <p style={{ textAlign: "end" }}>
              Lupa Password ? <a href="/lupa-pasword">Reset Password</a>
            </p>
            <Form.Item label={null} style={{ textAlign: "end", marginTop: 20 }}>
              <Flex vertical gap="small" style={{ width: "100%" }}>
                <Button type="primary" htmlType="submit">
                  Masuk
                </Button>
              </Flex>
            </Form.Item>
            <p>
              Belum Punya Akun ? <a href="/register">Daftar</a>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
