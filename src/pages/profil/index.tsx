import { Form, Input, Button, Spin } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

const Profil = () => {
  const LOCAL_URL = "http://localhost:4000";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    nim: "",
    nama: "",
    nohp: "",
    program_study: "",
  });

  const dataUser: any = localStorage.getItem("user");
  const userData = JSON.parse(dataUser);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${LOCAL_URL}/api/users/${userData.data._id}`)
      .then(({ data }) => {
        const dataUpdate = {
          nim: data.data?.nim,
          nama: data.data?.nama,
          nohp: data.data?.nohp,
          program_study: data.data?.program_study,
        };
        setFormData(dataUpdate);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setError("Gagal memuat data!");
      });
  }, []);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      await axios.put(
        `${LOCAL_URL}/api/users/update/${userData.data._id}`,
        {
          ...formData,
        },
        config
      );

      alert(`Profil berhasil di update!!`);
    } catch (error: any) {
      setError(error.response.data.message);
      console.log(error.response);
    }
  };
  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Profil</h2>
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: "white",
          borderRadius: 10,
        }}
      >
        <Spin spinning={loading}>
          <p>{error}</p>
          <Form
            name="layout-multiple-vertical"
            layout="vertical"
            onSubmitCapture={submitHandler}
          >
            <Form.Item
              label={<h4>Nomor Induk Mahasiswa :</h4>}
              style={{ marginBottom: 12 }}
            >
              <Input name="nim" value={formData.nim} onChange={handleChange} />
            </Form.Item>
            <Form.Item label={<h4>Nama :</h4>} style={{ marginBottom: 12 }}>
              <Input
                name="nama"
                value={formData.nama}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              label={<h4>Nomor Whatsapp (+62xxxxxx) :</h4>}
              style={{ marginBottom: 12 }}
            >
              <Input
                name="nohp"
                value={formData.nohp}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              label={<h4>Program Studi :</h4>}
              style={{ marginBottom: 12 }}
            >
              <Input
                name="program_study"
                value={formData.program_study}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item label={null} style={{ textAlign: "end", marginTop: 20 }}>
              <Button type="primary" htmlType="submit">
                Simpan
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
};

export default Profil;
