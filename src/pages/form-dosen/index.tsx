import { Form, Input, Button, Spin, Flex } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AddFormDosen = () => {
  const LOCAL_URL = "http://localhost:4000";

  const params = useParams();
  const id = params.id;

  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`${LOCAL_URL}/api/dosen/${id}`)
        .then(({ data }) => {
          setFormData(data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setError("Gagal memuat data!");
        });
    }
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
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const bodyReq = formData;
      if (id) {
        await axios.put(`${LOCAL_URL}/api/dosen/update/${id}`, bodyReq, config);
        alert(`Dosen berhasil diperbaharui!!`);
      } else {
        await axios.post(`${LOCAL_URL}/api/dosen/add`, bodyReq, config);
        alert(`Dosen berhasil ditambahkan!!`);
      }

      setLoading(false);
      navigate("/dosen");
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.message);
      console.log(error.response);
    }
  };
  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>{id ? "Update" : "Tambah"} Dosen</h1>
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
            <Form.Item
              label={<h4>Nama Dosen :</h4>}
              style={{ marginBottom: 12 }}
            >
              <Input
                name="nama"
                value={formData.nama}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              label={<h4>Nomor Induk Pegawai :</h4>}
              style={{ marginBottom: 12 }}
            >
              <Input name="nip" value={formData.nip} onChange={handleChange} />
            </Form.Item>
            <Form.Item
              label={<h4>Program Studi :</h4>}
              style={{ marginBottom: 12 }}
            >
              <Input
                name="program_studi"
                value={formData.program_studi}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item label={null} style={{ textAlign: "end", marginTop: 20 }}>
              <Flex gap="small" wrap justify="end">
                <Button
                  type="primary"
                  danger
                  onClick={() => navigate("/dosen")}
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

export default AddFormDosen;
