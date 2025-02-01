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
      label: "Tanggal Seminar",
      name: "tanggal_seminar",
      type: "date",
      disabledDate: disabledDate,
    },
    {
      label: "Waktu Seminar",
      name: "waktu_seminar",
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
      label: "Jadwalkan Seminar",
      type: "submit",
    },
  ];

  return (
    <FormComponent
      endPoint={"skripsi"}
      id={data.id}
      title="Jadwalkan Seminar"
      form={form}
      button={button}
      formType={"modal"}
      status={"Terjadwal_Seminar"}
      successMessage={"Skripsi berhasil dijadwalkan untuk seminar"}
    />
  );
};

export default ModalSkripsi;
