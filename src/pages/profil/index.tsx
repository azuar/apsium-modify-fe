import FormComponent from "../../components/FormComponent";

const Profil = () => {
  const dataUser: any = localStorage.getItem("user");
  const userData = JSON.parse(dataUser);
  const form = [
    {
      label: "Nomor Induk Mahasiswa",
      name: userData?.data?.role == "dosen" ? "nip" : "nim",
      type: "input",
    },
    {
      label: "Nama",
      name: "nama",
      type: "input",
    },
    {
      label: "Nomor Whatsapp (+62xxxxxx)",
      name: "nohp",
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
      label: "Simpan",
      type: "submit",
    },
  ];
  return (
    <div>
      <FormComponent
        endPoint={"users"}
        id={userData.data._id}
        title="Profil"
        form={form}
        button={button}
      />
    </div>
  );
};

export default Profil;
