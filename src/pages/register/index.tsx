import { Form, Input, Button, Flex, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const LOCAL_URL = "https://apsium-modify-be.vercel.app";

  const submitHandler = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${LOCAL_URL}/api/users/register`,
        {
          email,
          password,
          nama,
        },
        config
      );

      alert(`akun ${data.nama} berhasil di daftarkan!!`);
      navigate("/login");
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
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
        <h2 style={{ marginBottom: 10, marginTop: 30 }}>Selamat Datang</h2>
        <hr style={{ width: 200, display: "block", margin: "0 auto" }} />
        <h4 style={{ marginBottom: 10, marginTop: 10, color: "#1777FF" }}>
          Silahkan Daftar Akun Aplikasi Skripsi Anda
        </h4>
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: "white",
            borderRadius: 10,
          }}
        >
          <Spin spinning={loading}>
            {error && <h3 style={{ color: "#f04848" }}>{error}</h3>}
            <Form
              name="layout-multiple-vertical"
              layout="vertical"
              onSubmitCapture={submitHandler}
            >
              <Form.Item
                label={<h4>Nama :</h4>}
                name="nama"
                style={{ marginBottom: 12 }}
              >
                <Input value={nama} onChange={(e) => setNama(e.target.value)} />
              </Form.Item>
              <Form.Item
                label={<h4>Email (UMRAH) :</h4>}
                name="email"
                style={{ marginBottom: 12 }}
              >
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
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
              <Form.Item
                label={<h4>Konfirmasi Password :</h4>}
                name="confirmpassword"
                dependencies={["password"]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The password that you entered do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label={null}
                style={{ textAlign: "end", marginTop: 20 }}
              >
                <Flex vertical gap="small" style={{ width: "100%" }}>
                  <Button type="primary" htmlType="submit">
                    Daftar
                  </Button>
                </Flex>
              </Form.Item>
              <p>
                Sudah Punya Akun ? <a href="/login">Masuk</a>
              </p>
            </Form>
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default Register;
