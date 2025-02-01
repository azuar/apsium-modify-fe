import { useParams } from "react-router-dom";
import FormComponent from "../../components/FormComponent";

const AddFormDosen = () => {
  const params = useParams();
  const id = params.id;

  const form = [
    {
      label: "Nama Dosen",
      name: "nama",
      type: "input",
    },
    {
      label: "Nomor Induk Pegawai",
      name: "nip",
      type: "input",
    },
    {
      label: "Program Studi",
      name: "program_study",
      type: "input",
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
      endPoint={"dosen"}
      id={id ?? undefined}
      title="Dosen"
      form={form}
      navigate="/dosen"
      button={button}
    />
  );
};

export default AddFormDosen;
