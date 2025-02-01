import {
  Table,
  Button,
  Spin,
  TableColumnsType,
  Tooltip,
  Flex,
  Modal,
  Input,
  Form,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  FileProtectOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const TableSkripi = () => {
  const navigate = useNavigate();
  const LOCAL_URL = "https://apsium-modify-be.vercel.app";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [link, setLink] = useState("");
  const dataUser: any = localStorage.getItem("user");
  const userData = JSON.parse(dataUser);
  const { confirm } = Modal;

  useEffect(() => {
    getData();
  }, []);

  const getData = (key: any = "1") => {
    setLoading(true);
    if (userData) {
      const endPoint =
        userData.data.role === "mahasiswa"
          ? `skripsi/user/${userData?.data?._id}`
          : "skripsi";
      axios
        .get(`${LOCAL_URL}/api/${endPoint}`)
        .then(({ data }) => {
          if (userData.data.role === "dosen") {
            const status = key == "1" ? "Permohonan_Seminar" : "";
            const newData =
              status === ""
                ? data.filter(
                    (e: any) =>
                      (e.pembimbing1.nip === userData.data.nip ||
                        e.pembimbing2.nip === userData.data.nip) &&
                      e.status != "Permohonan_Seminar"
                  )
                : data.filter(
                    (e: any) =>
                      (e.pembimbing1.nip === userData.data.nip ||
                        e.pembimbing2.nip === userData.data.nip) &&
                      e.status == status
                  );
            newData.map((e: any) => {
              if (e.pembimbing1.nip === userData.data.nip) {
                e.status_pembimbing = "pembimbing1";
                e.persetujuan = e.setuju1 ? true : false;
              } else {
                e.status_pembimbing = "pembimbing2";
                e.persetujuan = e.setuju2 ? true : false;
              }
            });
            setData(newData);
          } else if (userData.data.role === "admin") {
            const newData = data.filter(
              (e: any) => e.status == "Verifikasi_Seminar"
            );
            setData(newData);
          } else {
            setData(data.data);
          }
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
          .then(() => {
            console.log();
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
        debugger;
        await axios
          .put(`${LOCAL_URL}/api/skripsi/update/${id}`, body)
          .then(() => {
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
            {userData.data.role == "admin" && (
              <Button
                color="default"
                variant="solid"
                style={{ marginBottom: 5 }}
                onClick={() => approved(data)}
              >
                Jadwalkan Seminar
              </Button>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: "max-content" }}
          bordered={true}
        />
      </Spin>
    </div>
  );
};

export default TableSkripi;
