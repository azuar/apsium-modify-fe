import { Table, Button, Tabs, TabsProps, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import getData from "../../utils/shared/SharedFunction";
import ModalSkripsi from "../../components/ModalComponent";
import dayjs from "dayjs";
import FormComponent from "../../components/FormComponent";

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
        resultData();
      },
    });
  };

  const lihatCatatan = (catatan: any, penguji: any) => {
    const catatanpenguji = catatan.filter((x: any) => x.penguji == penguji)[0];
    confirm({
      title: "Catatan Seminar",
      content: (
        <div>
          <hr />
          <div
            style={{ margin: 20 }}
            dangerouslySetInnerHTML={{ __html: catatanpenguji.catatan }}
          ></div>
        </div>
      ),
      icon: null,
      footer: null,
      closable: true,
      width: 500,
      afterClose: () => {
        resultData();
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
        resultData();
      },
    });
  };

  const resultData = (key: any = "1") => {
    setLoading(true);
    let dataSkripsi = getData(key);
    dataSkripsi?.then((result) => {
      result.map((x: any, index: any) => {
        x.no = index + 1;
      });
      let filterData;
      if (userData.data.role !== "admin") {
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
              onClick={() =>
                lihatCatatan(data.catatan_seminar, data.status_penguji)
              }
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
      hidden: userData.data.role != "admin" || activeKey != "1",
      render: (data: any) => (
        <>
          <Button
            color="cyan"
            variant="solid"
            style={{ marginBottom: 5 }}
            href={data?.berkas_seminar}
            target="_blank"
          >
            Berkas Seminar
          </Button>
          <Button
            color="default"
            variant="solid"
            onClick={() => {
              jadwalkanSeminar(data?._id);
            }}
          >
            Jadwalkan Seminar
          </Button>
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
            <Button color="default" variant="solid" style={{ marginBottom: 5 }}>
              Upload Berkas Revisi
            </Button>
          )}
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
      key: "1",
      label: "Terjadwal Seminar",
    },
    {
      key: "2",
      label: "Revisi",
    },
    {
      key: "3",
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
        {userData.data.role === "admin" ||
          (userData.data.role == "dosen" && (
            <Tabs
              defaultActiveKey="1"
              items={
                userData.data.role === "admin" ? tabsItems : tabsItemsDosen
              }
              onChange={(key) => {
                setActiveKey(key);
                resultData(key);
              }}
            />
          ))}
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
