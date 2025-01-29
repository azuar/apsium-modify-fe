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
  Tabs,
  TabsProps,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  FileProtectOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const JudulSkripsi = () => {
  const navigate = useNavigate();
  const LOCAL_URL = "http://localhost:4000";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dataUser: any = localStorage.getItem("user");
  const userData = JSON.parse(dataUser);
  const { confirm } = Modal;

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);
    if (userData) {
      const endPoint =
        userData.data.role === "dosen"
          ? "skripsi"
          : `skripsi/user/${userData?.data?._id}`;
      axios
        .get(`${LOCAL_URL}/api/${endPoint}`)
        .then(({ data }) => {
          if (userData.data.role === "dosen") {
            const newData = data.filter(
              (e: any) =>
                (e.pembimbing1.nip === userData.data.nip ||
                  e.pembimbing2.nip === userData.data.nip) &&
                e.status == "Permohonan_Seminar"
            );
            setData(newData);
          } else {
            setData(data.data);
          }
          // debugger;
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const showConfirm = (id: any) => {
    confirm({
      title: "Apakah Anda ingin menghapus item ini??",
      icon: <ExclamationCircleFilled />,
      okButtonProps: {
        disabled: loading,
      },
      async onOk() {
        setLoading(true);
        await axios
          .delete(`${LOCAL_URL}/api/skripsi/delete/${id}`)
          .then((data) => {
            console.log(data);
            setLoading(false);
            getData();
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

  const confirmUpdate = (id: any) => {
    confirm({
      title: "Apakah anda yakin ingin mengupdate status ke permohonan seminar?",
      content: "Judul tidak bisa diperbaharui setelah status diubah!!!",
      icon: <ExclamationCircleFilled />,
      okButtonProps: {
        disabled: loading,
      },
      async onOk() {
        setLoading(true);
        await axios
          .put(`${LOCAL_URL}/api/skripsi/update/${id}`, {
            status: "Permohonan_Seminar",
          })
          .then((data) => {
            console.log(data);
            setLoading(false);
            getData();
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
      render: () => {
        return "1";
      },
      fixed: "left",
    },
    {
      title: "NIM",
      key: "nim",
      render: (data: any) => {
        return data?.mahasiswa?.nim;
      },
      fixed: "left",
    },
    {
      title: "Nama",
      key: "nama",
      width: 200,
      render: (data: any) => {
        return data?.mahasiswa?.nama;
      },
      fixed: "left",
    },
    {
      title: "Judul",
      key: "judul",
      dataIndex: "judul",
      width: 500,
    },
    {
      title: "Pembimbing 1",
      key: "pembimbing1",
      render: (data: any) => {
        return data?.pembimbing1?.nama;
      },
    },
    {
      title: "Setuju Pemb. 1",
      key: "setuju1",
      render: (data: any) => {
        return data?.setuju1 ? "Disetujui" : "Belum Disetujui";
      },
    },
    {
      title: "Pembimbing 2",
      key: "pembimbing2",
      render: (data: any) => {
        return data?.pembimbing2?.nama;
      },
    },
    {
      title: "Setuju Pemb. 2",
      key: "setuju2",
      render: (data: any) => {
        return data?.setuju2 ? "Disetujui" : "Belum Disetujui";
      },
    },
    {
      title: "Program Studi",
      key: "programstudi",
      render: (data: any) => {
        return data?.mahasiswa?.program_study;
      },
    },
    {
      title: "Status",
      key: "status",
      render: (data: any) => {
        return data?.status ?? "-";
      },
    },
    {
      title: "",
      key: "action",
      width: 100,
      render: (data: any) => {
        return (
          <>
            {data?.setuju1 && data?.setuju2 && (
              <Button
                color="default"
                variant="solid"
                style={{ marginBottom: 5 }}
              >
                Ajukan Seminar
              </Button>
            )}
            {!data?.status && (
              <>
                <Flex gap="small">
                  <Tooltip title="Edit">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() =>
                        navigate(`/judul-skripsi/edit/${data?._id}`)
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Hapus">
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => showConfirm(data?._id)}
                    />
                  </Tooltip>
                  <Tooltip
                    title="Ajukan Persetujuan Seminar"
                    placement={"left"}
                  >
                    <Button
                      type="default"
                      icon={<FileProtectOutlined />}
                      onClick={() => confirmUpdate(data?._id)}
                    />
                  </Tooltip>
                </Flex>
              </>
            )}
          </>
        );
      },
    },
  ];

  const tabsItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Permohonan Seminar",
      children: (
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: "max-content" }}
          bordered={true}
        />
      ),
    },
    {
      key: "2",
      label: "Disetujui",
      children: "Content of Tab Pane 2",
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Judul Skripsi</h1>
      <div
        style={{
          padding: 30,
          minHeight: 360,
          background: "white",
          borderRadius: 10,
        }}
      >
        <Row>
          <Col xs={24} md={12}>
            <h3 style={{ marginBottom: 20 }}>Daftar Judul Skripsi</h3>
          </Col>
          {userData?.data?.role === "mahasiswa" && (
            <Col xs={24} md={12} style={{ textAlign: "end" }}>
              <Button
                icon={<PlusOutlined />}
                onClick={() => navigate("/judul-skripsi/add")}
                style={{ marginBottom: 20 }}
              >
                Tambah Judul Skripsi
              </Button>
            </Col>
          )}
        </Row>
        {userData?.data?.role === "mahasiswa" && (
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={data}
              scroll={{ x: "max-content" }}
              bordered={true}
            />
          </Spin>
        )}
        {userData?.data?.role === "dosen" && (
          <Tabs defaultActiveKey="1" items={tabsItems} />
        )}
      </div>
    </div>
  );
};

export default JudulSkripsi;
