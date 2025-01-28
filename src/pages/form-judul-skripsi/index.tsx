import { Form, Input, Button, Spin, Flex } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormJudulSkripsi = () => {
  const LOCAL_URL = "http://localhost:4000";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    nim: "",
    nama: "",
    program_study: "",
    judul: "",
    pembimbing1: "",
    pembimbing2: "",
  });

  const navigate = useNavigate();

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
          program_study: data.data?.program_study,
          judul: "",
          pembimbing1: "",
          pembimbing2: "",
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

      const bodyReq = {
        user_id: userData?.data?._id,
        judul: formData.judul,
        pembimbing1: formData.pembimbing1,
        pembimbing2: formData.pembimbing2,
        setuju1: false,
        setuju2: false,
      };

      await axios.post(`${LOCAL_URL}/api/skripsi/add`, bodyReq, config);

      alert(`Judul Skripsi berhasil di update!!`);
      navigate("/judul-skripsi");
    } catch (error: any) {
      setError(error.response.data.message);
      console.log(error.response);
    }
  };
  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Tambah Judul Skripsi</h1>
      <div
        style={{
          padding: 30,
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
            <Form.Item label={<h4>Nama :</h4>} style={{ marginBottom: 12 }}>
              <Input
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                disabled
              />
            </Form.Item>
            <Form.Item
              label={<h4>Nomor Induk Mahasiswa :</h4>}
              style={{ marginBottom: 12 }}
            >
              <Input
                name="nim"
                value={formData.nim}
                onChange={handleChange}
                disabled
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
                disabled
              />
            </Form.Item>
            <Form.Item
              label={<h4>Judul Skripsi :</h4>}
              style={{ marginBottom: 12 }}
            >
              <Input
                name="judul"
                value={formData.judul}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              label={<h4>Pembimbing 1 :</h4>}
              style={{ marginBottom: 12 }}
            >
              <Input
                name="pembimbing1"
                value={formData.pembimbing1}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              label={<h4>Pembimbing 2 :</h4>}
              style={{ marginBottom: 12 }}
            >
              <Input
                name="pembimbing2"
                value={formData.pembimbing2}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item label={null} style={{ textAlign: "end", marginTop: 20 }}>
              <Flex gap="small" wrap justify="end">
                <Button
                  type="primary"
                  danger
                  onClick={() => navigate("/judul-skripsi")}
                >
                  Batal
                </Button>
                <Button type="primary" htmlType="submit">
                  Simpan
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
};

export default FormJudulSkripsi;
