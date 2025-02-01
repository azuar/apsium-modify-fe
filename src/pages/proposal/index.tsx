import {
  Table,
  Button,
  Spin,
  Row,
  Col,
  TableColumnsType,
  Tooltip,
  Flex,
  Tabs,
  TabsProps,
  Modal,
} from "antd";
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
import showConfirm from "../../utils/shared/confirmFuction";
import FormComponent from "../../components/FormComponent";

const ProposalSkripsi = () => {
  const navigate = useNavigate();
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

  const confirmUpdate = (id: any, _status: any) => {
    const form = [
      {
        label: "Link Drive Berkas",
        name: "berkas_seminar",
        type: "input",
      },
    ];

    const button = [
      {
        label: "Batal",
        type: "cancel",
      },
      {
        label: "Ajukan Seminar",
        type: "submit",
      },
    ];

    confirm({
      content: (
        <FormComponent
          endPoint={"skripsi"}
          id={id}
          title="Pengajuan Seminar"
          form={form}
          button={button}
          formType={"modal"}
          status={"Verifikasi_Seminar"}
          successMessage={"Pengajuan Berhasil Dirikirim!!"}
        />
      ),
      icon: null,
      footer: null,
      width: 500,
      afterClose: () => {
        ResultData();
      },
    });
  };

  const approved = (data: any) => {
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
    showConfirm(
      "Apakah anda yakin ingin menyetujui judul berikut?",
      <ExclamationCircleFilled />,
      "skripsi/update",
      data._id,
      loading,
      setLoading,
      ResultData,
      null,
      body
    );
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
      title: "Judul Skripsi",
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
                      onClick={() => navigate(`/proposal/edit/${data?._id}`)}
                    />
                  </Tooltip>
                  <Tooltip title="Hapus">
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() =>
                        showConfirm(
                          "Apakah Anda ingin menghapus item ini??",
                          <ExclamationCircleFilled />,
                          "skripsi/delete",
                          data?._id,
                          loading,
                          setLoading,
                          ResultData
                        )
                      }
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
                        showConfirm(
                          `Apakah anda yakin ingin mengajukan permohonan seminar?`,
                          <ExclamationCircleFilled />,
                          "skripsi/update",
                          data?._id,
                          loading,
                          setLoading,
                          ResultData,
                          "Judul tidak bisa diperbaharui setelah status diubah!!!",
                          {
                            status: "Permohonan_Seminar",
                          },
                          600
                        )
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
      <h1 style={{ marginBottom: 20 }}>Proposal Skripsi</h1>
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
            <h3 style={{ marginBottom: 20 }}>Daftar Proposal Skripsi</h3>
          </Col>
          {userData?.data?.role === "mahasiswa" && (
            <Col xs={24} md={12} style={{ textAlign: "end" }}>
              <Button
                icon={<PlusOutlined />}
                onClick={() => navigate("/proposal/add")}
                style={{ marginBottom: 20 }}
              >
                Tambah Proposal
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

export default ProposalSkripsi;
