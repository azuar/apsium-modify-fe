import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormComponent from "../../components/FormComponent";
import { getOptionData } from "../../utils/shared/SharedFunction";

const FormProposal = () => {
  const dataUser: any = localStorage.getItem("user");
  const userData = JSON.parse(dataUser);
  const params = useParams();
  const id = params.id;

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
      label: "Judul Proposal Skripsi",
      name: "judul",
      type: "input",
    },
    {
      label: "Pembimbing 1",
      name: "pembimbing1",
      type: "select",
      options: dataDosen,
    },
    {
      label: "Pembimbing 2",
      name: "pembimbing2",
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
      label: "Simpan",
      type: "submit",
    },
  ];

  return (
    <FormComponent
      endPoint={"skripsi"}
      id={id ?? undefined}
      title="Proposal Skripsi"
      form={form}
      navigate="/proposal"
      button={button}
      user_id={id ? null : userData?.data?._id}
    />
  );
};

export default FormProposal;
