import { Table, Button, Tabs, TabsProps, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import getData from "../../utils/shared/SharedFunction";
import ModalSkripsi from "../../components/ModalComponent";
import dayjs from "dayjs";
import FormComponent from "../../components/FormComponent";
import showConfirm from "../../utils/shared/confirmFuction";
import { ExclamationCircleFilled } from "@ant-design/icons";

const CatSeminar = () => {
  const dataUser: any = localStorage.getItem("user");
  const userData = JSON.parse(dataUser);

  const [data, setData] = useState([]);
  const [activeKey, setActiveKey] = useState("1");
  const [loading, setLoading] = useState(false);

  const { confirm } = Modal;

  const jadwalkanSeminar = (id: any) => {
    confirm({
      content: <ModalSkripsi id={id} />,
      icon: null,
      footer: null,
      width: 500,
      afterClose: () => {
        resultData(activeKey);
      },
    });
  };

  const uploadBerkas = (data: any) => {
    const form = [
      {
        label: "Link Drive Berkas",
        name: "berkas_revisi_seminar",
        type: "input",
      },
    ];

    const button = [
      {
        label: "Batal",
        type: "cancel",
      },
      {
        label: "Kirim",
        type: "submit",
      },
    ];

    confirm({
      content: (
        <FormComponent
          endPoint={"skripsi"}
          id={data._id}
          title="Berkas Revisi Seminar"
          form={form}
          button={button}
          formType={"modal"}
          successMessage={"Berkas Revisi Berhasil Dikirim!!"}
        />
      ),
      icon: null,
      footer: null,
      width: 500,
      afterClose: () => {
        resultData(activeKey);
      },
    });
  };

  const lihatCatatan = (data: any, penguji: any = null) => {
    function compare(a: any, b: any) {
      if (a.penguji < b.penguji) {
        return -1;
      }
      if (a.penguji > b.penguji) {
        return 1;
      }
      return 0;
    }

    let catatanpenguji;
    if (penguji) {
      catatanpenguji = data.catatan_seminar.filter(
        (x: any) => x.penguji == penguji
      )[0];
    } else {
      data.catatan_seminar.sort(compare);
    }
    confirm({
      title: <h3 style={{ textAlign: "center" }}>Catatan Seminar</h3>,
      content: (
        <div>
          <hr style={{ width: "40px", display: "block", margin: "auto" }} />
          {penguji ? (
            <div
              style={{ margin: 20 }}
              dangerouslySetInnerHTML={{ __html: catatanpenguji.catatan }}
            ></div>
          ) : (
            data.catatan_seminar.map((element: any) => (
              <div style={{ margin: 20 }}>
                <h4 style={{ textAlign: "center" }}>
                  {element.penguji == "penguji3"
                    ? `${data.penguji3.nama} (Penguji 3)`
                    : element.penguji == "penguji2"
                    ? `${data.penguji2.nama} (Penguji 2)`
                    : `${data.penguji1.nama} (Penguji 1)`}
                </h4>
                <hr
                  style={{ border: "1px solid lightgray", marginBlock: 10 }}
                />
                <div
                  dangerouslySetInnerHTML={{ __html: element.catatan }}
                ></div>
              </div>
            ))
          )}
        </div>
      ),
      icon: null,
      footer: null,
      closable: true,
      width: 500,
      afterClose: () => {
        resultData(activeKey);
      },
    });
  };

  const setCatatanSeminar = (id: any, penguji: any) => {
    const form = [
      {
        label: "Catatan",
        name: "catatan",
        type: "textarea",
      },
    ];
    const button = [
      {
        label: "Cancel",
        type: "cancel",
      },
      {
        label: "Simpan",
        type: "submit",
      },
    ];
    confirm({
      content: (
        <FormComponent
          id={id}
          endPoint={"skripsi"}
          title="Catatan Seminar"
          form={form}
          button={button}
          formType={"modal"}
          successMessage={"Catatan berhasil disimpan!!"}
          penguji={penguji}
        />
      ),
      icon: null,
      footer: null,
      width: 500,
      afterClose: () => {
        resultData(activeKey);
      },
    });
  };

  const resultData = (key: any = "1") => {
    setLoading(true);
    if (userData.data.role == "dosen" && key == "1") {
      setActiveKey("2");
      key = "2";
    }
    let dataSkripsi = getData(key);
    dataSkripsi?.then((result) => {
      result.map((x: any, index: any) => {
        x.no = index + 1;
      });
      let filterData;
      if (userData.data.role == "mahasiswa") {
        setActiveKey("2");
        filterData = result.filter(
          (e: any) =>
            e.status === "Terjadwal_Seminar" ||
            e.status === "Revisi_Seminar" ||
            e.status === "Selesai_Seminar"
        );
        setData(filterData);
        setLoading(false);
      } else {
        setData(result);
        setLoading(false);
      }
    });
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "key",
      width: 50,
    },
    {
      title: "NIM",
      key: "nim",
      render: (data: any) => {
        return data?.mahasiswa?.nim;
      },
    },
    {
      title: "Nama",
      key: "nama",
      render: (data: any) => {
        return data?.mahasiswa?.nama;
      },
    },
    {
      title: "Judul",
      key: "judul",
      dataIndex: "judul",
      width: 450,
    },
    {
      title: "Pembimbing 1",
      key: "pembimbing1",
      hidden: activeKey != "1",
      width: 200,
      render: (data: any) => {
        return data?.pembimbing1?.nama;
      },
    },
    {
      title: "Pembimbing 2",
      key: "pembimbing2",
      hidden: activeKey != "1",
      width: 200,
      render: (data: any) => {
        return data?.pembimbing2?.nama;
      },
    },
    {
      title: "Waktu Seminar",
      key: "waktu_seminar",
      hidden: activeKey == "1",
      render: (data: any) => {
        return (
          <>
            <p>
              Tanggal :{" "}
              {dayjs(data?.tanggal_seminar).format("DD MMM YYYY").toString()}
            </p>
            <p>Jam : {data?.waktu_seminar}</p>
          </>
        );
      },
    },
    {
      title: "Penguji 1",
      key: "penguji1",
      hidden: activeKey == "1",
      width: 200,
      render: (data: any) => {
        return data?.penguji1?.nama;
      },
    },
    {
      title: "Penguji 2",
      key: "penguji2",
      hidden: activeKey == "1",
      width: 200,
      render: (data: any) => {
        return data?.penguji2?.nama;
      },
    },
    {
      title: "Penguji 3",
      key: "penguji3",
      hidden: activeKey == "1",
      width: 200,
      render: (data: any) => {
        return data?.penguji3?.nama;
      },
    },
    {
      title: "Status",
      key: "status",
      hidden: userData.data.role == "admin",
      render: (data: any) => {
        return data?.status ?? "-";
      },
    },
    {
      title: "",
      key: "action",
      width: 50,
      hidden: userData.data.role != "dosen",
      render: (data: any) => (
        <>
          {data?.catatan_seminar?.filter(
            (x: any) => x.penguji == data.status_penguji
          ).length ? (
            <Button
              color="cyan"
              variant="solid"
              style={{ marginBottom: 5 }}
              onClick={() => lihatCatatan(data, data.status_penguji)}
            >
              Lihat Catatan
            </Button>
          ) : (
            <Button
              color="cyan"
              variant="solid"
              style={{ marginBottom: 5 }}
              onClick={() => setCatatanSeminar(data._id, data.status_penguji)}
            >
              Buat Catatan
            </Button>
          )}
        </>
      ),
    },
    {
      title: "",
      key: "action",
      width: 50,
      hidden: userData.data.role != "admin",
      render: (data: any) => (
        <>
          {data.status == "Verifikasi_Seminar" && (
            <Button
              color="cyan"
              variant="solid"
              style={{ marginBottom: 5 }}
              href={data?.berkas_seminar}
              target="_blank"
            >
              Berkas Seminar
            </Button>
          )}
          {data?.berkas_revisi_seminar && (
            <Button
              color="cyan"
              variant="solid"
              style={{ marginBottom: 5 }}
              href={data?.berkas_revisi_seminar}
              target="_blank"
            >
              Berkas Revisi
            </Button>
          )}
          {activeKey == "1" ? (
            <Button
              color="default"
              variant="solid"
              onClick={() => {
                jadwalkanSeminar(data?._id);
              }}
            >
              Jadwalkan Seminar
            </Button>
          ) : activeKey == "2" || activeKey == "3" ? (
            <Button
              color="default"
              variant="solid"
              onClick={() => {
                const status = data.status.includes("Revisi")
                  ? "Selesai_Seminar"
                  : "Revisi_Seminar";
                showConfirm(
                  `Apakah anda yakin ingin memindahkan status menjadi ${status}?`,
                  <ExclamationCircleFilled />,
                  "skripsi/update",
                  data._id,
                  loading,
                  setLoading,
                  resultData,
                  null,
                  {
                    status: status,
                  },
                  null,
                  activeKey
                );
              }}
            >
              Update Status
            </Button>
          ) : null}
        </>
      ),
    },
    {
      title: "",
      key: "action",
      width: 50,
      hidden: userData.data.role != "mahasiswa",
      render: (data: any) => (
        <>
          {data.catatan && (
            <Button color="default" variant="solid" style={{ marginBottom: 5 }}>
              Catatan
            </Button>
          )}
          {data.status == "Selesai_Seminar" && (
            <Button color="default" variant="solid" style={{ marginBottom: 5 }}>
              Ajukan Sidang
            </Button>
          )}
          {data.status == "Revisi_Seminar" && (
            <Button
              color="default"
              variant="solid"
              style={{ marginBottom: 5 }}
              onClick={() => uploadBerkas(data)}
            >
              Upload Berkas Revisi
            </Button>
          )}
          {data?.catatan_seminar?.length ? (
            <Button
              color="cyan"
              variant="solid"
              style={{ marginBottom: 5 }}
              onClick={() => lihatCatatan(data)}
            >
              Lihat Catatan
            </Button>
          ) : null}
        </>
      ),
    },
  ];

  const tabsItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Verifikasi Seminar",
    },
    {
      key: "2",
      label: "Terjadwal Seminar",
    },
    {
      key: "3",
      label: "Revisi",
    },
    {
      key: "4",
      label: "Selesai",
    },
  ];
  const tabsItemsDosen: TabsProps["items"] = [
    {
      key: "2",
      label: "Terjadwal Seminar",
    },
    {
      key: "3",
      label: "Revisi",
    },
    {
      key: "4",
      label: "Selesai",
    },
  ];

  useEffect(() => {
    resultData();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Seminar Proposal</h1>
      <div
        style={{
          padding: 30,
          minHeight: 360,
          background: "white",
          borderRadius: 10,
        }}
      >
        {userData.data.role !== "admin" && (
          <h3 style={{ marginBottom: 20 }}>Daftar Seminar</h3>
        )}
        {(userData.data.role === "admin" || userData.data.role == "dosen") && (
          <Tabs
            defaultActiveKey="1"
            items={userData.data.role === "admin" ? tabsItems : tabsItemsDosen}
            onChange={(key) => {
              setActiveKey(key);
              resultData(key);
            }}
          />
        )}
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

export default CatSeminar;
