import { useEffect, useState } from "react";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import FormComponent from "./FormComponent";
import { getOptionData } from "../utils/shared/SharedFunction";

const ModalSkripsi = (data: any) => {
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().endOf("day");
  };

  const [dataDosen, setDataDosen] = useState([]);

  useEffect(() => {
    FetchData("dosen");
  }, []);

  const FetchData = (endpoint: any) => {
    let data = getOptionData(endpoint);
    data?.then((result) => {
      result.map((x: any, index: any) => {
        x.no = index + 1;
      });
      setDataDosen(result);
    });
  };

  const form = [
    {
      label: location.pathname.includes("seminar")
        ? "Tanggal Seminar"
        : "Tanggal Sidang",
      name: location.pathname.includes("seminar")
        ? "tanggal_seminar"
        : "tanggal_sidang",
      type: "date",
      disabledDate: disabledDate,
    },
    {
      label: location.pathname.includes("seminar")
        ? "Waktu Seminar"
        : "Waktu Sidang",
      name: location.pathname.includes("seminar")
        ? "waktu_seminar"
        : "waktu_sidang",
      type: "time",
    },
    {
      label: "Penguji 1",
      name: "penguji1",
      type: "select",
      options: dataDosen,
    },
    {
      label: "Penguji 2",
      name: "penguji2",
      type: "select",
      options: dataDosen,
    },
    {
      label: "Penguji 3",
      name: "penguji3",
      type: "select",
      options: dataDosen,
    },
  ];

  const button = [
    {
      label: "Batal",
      type: "cancel",
    },
    {
      label: location.pathname.includes("seminar")
        ? "Jadwalkan Seminar"
        : "Jadwalkan Sidang",
      type: "submit",
    },
  ];

  return (
    <FormComponent
      endPoint={"skripsi"}
      id={data.id}
      title={
        location.pathname.includes("seminar")
          ? "Jadwalkan Seminar"
          : "Jadwalkan Sidang"
      }
      form={form}
      button={button}
      formType={"modal"}
      status={
        location.pathname.includes("seminar")
          ? "Terjadwal_Seminar"
          : "Terjadwal_Sidang"
      }
      successMessage={`Skripsi berhasil dijadwalkan untuk ${
        location.pathname.includes("seminar") ? "seminar" : "sidang"
      }`}
    />
  );
};

export default ModalSkripsi;
