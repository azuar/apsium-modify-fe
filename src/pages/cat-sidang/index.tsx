import { Table, Button, Tabs, TabsProps, Spin, Modal } from "antd";
import { useEffect, useState } from "react";
import getData from "../../utils/shared/SharedFunction";
import dayjs from "dayjs";
import showConfirm from "../../utils/shared/confirmFuction";
import { ExclamationCircleFilled } from "@ant-design/icons";
import ModalSkripsi from "../../components/ModalComponent";

const CatSidang = () => {
  const dataUser: any = localStorage.getItem("user");
  const userData = JSON.parse(dataUser);

  const [data, setData] = useState([]);
  const [activeKey, setActiveKey] = useState("1");
  const [loading, setLoading] = useState(false);

  const { confirm } = Modal;

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
            e.status === "Terjadwal_Sidang" ||
            e.status === "Revisi_Sidang" ||
            e.status === "Selesai_Skripsi"
        );
        setData(filterData);
        setLoading(false);
      } else {
        setData(result);
        setLoading(false);
      }
    });
  };

  const jadwalkanSidang = (id: any) => {
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
      title: "Waktu Sidang",
      key: "waktu_sidang",
      hidden: activeKey == "1",
      render: (data: any) => {
        return (
          <>
            <p>
              Tanggal :{" "}
              {dayjs(data?.tanggal_sidang).format("DD MMM YYYY").toString()}
            </p>
            <p>Jam : {data?.waktu_sidang}</p>
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
          {data?.catatan_sidang?.filter(
            (x: any) => x.penguji == data.status_penguji
          ).length ? (
            <Button color="cyan" variant="solid" style={{ marginBottom: 5 }}>
              Lihat Catatan
            </Button>
          ) : (
            <Button color="cyan" variant="solid" style={{ marginBottom: 5 }}>
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
          {data?.berkas_sidang && (
            <Button
              color="cyan"
              variant="solid"
              style={{ marginBottom: 5 }}
              href={data?.berkas_sidang}
              target="_blank"
            >
              Berkas Sidang
            </Button>
          )}
          {data?.berkas_revisi_sidang && (
            <Button
              color="cyan"
              variant="solid"
              style={{ marginBottom: 5 }}
              href={data?.berkas_revisi_sidang}
              target="_blank"
            >
              Berkas Revisi
            </Button>
          )}
          {activeKey == "1" ? (
            <Button
              color="default"
              variant="solid"
              onClick={() => jadwalkanSidang(data._id)}
            >
              Jadwalkan Sidang
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
          {data.status == "Revisi_Sidang" && (
            <Button color="default" variant="solid" style={{ marginBottom: 5 }}>
              Upload Berkas Revisi
            </Button>
          )}
          {data?.catatan_sidang?.length && data.status.includes("Sidang") ? (
            <Button color="cyan" variant="solid" style={{ marginBottom: 5 }}>
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
      label: "Verifikasi Sidang",
    },
    {
      key: "2",
      label: "Terjadwal Sidang",
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
      label: "Terjadwal Sidang",
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
      <h1 style={{ marginBottom: 20 }}>Sidang Skripsi</h1>
      <div
        style={{
          padding: 30,
          minHeight: 360,
          background: "white",
          borderRadius: 10,
        }}
      >
        {userData.data.role !== "admin" && (
          <h3 style={{ marginBottom: 20 }}>Daftar Sidang Skripsi</h3>
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

export default CatSidang;
