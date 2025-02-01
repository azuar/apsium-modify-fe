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
  Input,
  Form,
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
import getData from "../../utils/shared/SharedFunction";
import TableComponent from "../../components/TableComponent";

const JudulSkripsi = () => {
  const navigate = useNavigate();
  const LOCAL_URL = "https://apsium-modify-be.vercel.app";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dataUser: any = localStorage.getItem("user");
  const userData = JSON.parse(dataUser);
  const { confirm } = Modal;

  const ResultData = (key: any = "1") => {
    setLoading(true);
    let dataSkripsi = getData(key);
    dataSkripsi?.then((result) => {
      result.map((x: any, index: any) => {
        x.no = index + 1;
      });
      setData(result);
      setLoading(false);
    });
  };

  useEffect(() => {
    ResultData();
  }, []);

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
          .then(() => {
            console.log();
            setLoading(false);
            ResultData();
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

  const confirmUpdate = (id: any, status: any) => {
    let link = "";
    const content =
      status === "Permohonan_Seminar" ? (
        "Judul tidak bisa diperbaharui setelah status diubah!!!"
      ) : (
        <Form.Item
          label={<h5>Link Drive Berkas </h5>}
          style={{ marginBottom: 12, marginTop: 12 }}
        >
          <Input
            name="link"
            placeholder="Masukan link drive berkas anda!!"
            onChange={(e) => {
              link = e.target.value;
            }}
          />
        </Form.Item>
      );

    confirm({
      title: `Apakah anda yakin ingin mengupdate status ke ${status}?`,
      content: content,
      icon: <ExclamationCircleFilled />,
      width: 600,
      okButtonProps: {
        disabled: loading,
      },
      async onOk() {
        setLoading(true);
        let body = new Object();
        if (status === "Permohonan_Seminar") {
          body = {
            status: status,
          };
        } else {
          body = {
            drive: link,
            status: status,
          };
        }
        await axios
          .put(`${LOCAL_URL}/api/skripsi/update/${id}`, body)
          .then(() => {
            setLoading(false);
            ResultData();
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

  const approved = (data: any) => {
    confirm({
      title: "Apakah anda yakin ingin menyetujui judul berikut?",
      icon: <ExclamationCircleFilled />,
      okButtonProps: {
        disabled: loading,
      },
      async onOk() {
        setLoading(true);
        let body = new Object();
        if (data.status_pembimbing == "pembimbing2") {
          if (data.setuju1) {
            body = {
              setuju2: true,
              status: "Disetujui_Pembimbing",
            };
          } else {
            body = {
              setuju2: true,
            };
          }
        } else {
          if (data.setuju2) {
            body = {
              setuju1: true,
              status: "Disetujui_Pembimbing",
            };
          } else {
            body = {
              setuju1: true,
            };
          }
        }
        await axios
          .put(`${LOCAL_URL}/api/skripsi/update/${data._id}`, body)
          .then(() => {
            setLoading(false);
            ResultData();
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
            {data?.status == "Disetujui_Pembimbing" &&
              userData.data.role == "mahasiswa" && (
                <Button
                  color="default"
                  variant="solid"
                  style={{ marginBottom: 5 }}
                  onClick={() => confirmUpdate(data?._id, "Verifikasi_Seminar")}
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
                      onClick={() =>
                        confirmUpdate(data?._id, "Permohonan_Seminar")
                      }
                    />
                  </Tooltip>
                </Flex>
              </>
            )}
            {data?.status == "Permohonan_Seminar" &&
              userData.data.role == "dosen" &&
              data?.persetujuan == false && (
                <Button
                  color="default"
                  variant="solid"
                  style={{ marginBottom: 5 }}
                  onClick={() => approved(data)}
                >
                  Setujui
                </Button>
              )}
            {data?.drive && (
              <Button color="cyan" variant="solid" style={{ marginBottom: 5 }}>
                Drive
              </Button>
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
      children: (
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: "max-content" }}
          bordered={true}
        />
      ),
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
        <Spin spinning={loading}>
          {userData?.data?.role === "mahasiswa" && (
            <TableComponent columns={columns} dataSource={data} />
          )}
          {userData?.data?.role === "dosen" && (
            <Tabs
              defaultActiveKey="1"
              items={tabsItems}
              onChange={(key: string) => {
                ResultData(key);
              }}
            />
          )}
        </Spin>
      </div>
    </div>
  );
};

export default JudulSkripsi;
