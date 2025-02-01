import {
  Table,
  Button,
  Spin,
  Row,
  Col,
  TableColumnsType,
  Tooltip,
  Flex,
  Modal,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Dosen = () => {
  const navigate = useNavigate();
  const LOCAL_URL = "https://apsium-modify-be.vercel.app";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dataUser: any = localStorage.getItem("user");
  const userData = JSON.parse(dataUser);
  const { confirm } = Modal;

  useEffect(() => {
    setLoading(true);
    if (userData) {
      axios
        .get(`${LOCAL_URL}/api/dosen`)
        .then(({ data }) => {
          data.map((x: any, index: any) => {
            x.no = index + 1;
          });
          setData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, []);

  const showConfirm = (id: any) => {
    confirm({
      title: "Do you want to delete these items?",
      icon: <ExclamationCircleFilled />,
      okButtonProps: {
        disabled: loading,
      },
      async onOk() {
        setLoading(true);
        await axios
          .delete(`${LOCAL_URL}/api/dosen/delete/${id}`)
          .then(() => {
            setLoading(false);
            navigate(0);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const columns: TableColumnsType<any> = [
    {
      title: "No",
      key: "no",
      dataIndex: "no",
      width: 50,
    },
    {
      title: "NIP",
      key: "nip",
      dataIndex: "nip",
    },
    {
      title: "Nama Dosen",
      key: "nama",
      width: 400,
      dataIndex: "nama",
    },
    {
      title: "Program Studi",
      key: "program_studi",
      dataIndex: "program_study",
    },
    {
      title: "Total Mahasiswa",
      key: "status",
      width: 100,
      render: () => {
        return "-";
      },
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (data: any) => {
        return (
          <>
            <Flex gap="small">
              <Tooltip title="edit">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/dosen/edit/${data?._id}`)}
                />
              </Tooltip>
              <Tooltip title="delete">
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => showConfirm(data?._id)}
                />
              </Tooltip>
            </Flex>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Dosen</h1>
      <div
        style={{
          padding: 30,
          minHeight: 360,
          background: "white",
          borderRadius: 10,
        }}
      >
        <Row style={{ marginBottom: 10 }}>
          <Col xs={24} md={12}>
            <h3 style={{ marginBottom: 20 }}>Daftar Dosen</h3>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: "end" }}>
            <Button
              icon={<PlusOutlined />}
              onClick={() => navigate("/dosen/add")}
            >
              Tambah Dosen
            </Button>
          </Col>
        </Row>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={data}
            scroll={{ x: "max-content" }}
            bordered={true}
          />
        </Spin>
      </div>
    </div>
  );
};

export default Dosen;
