import axios from "axios";

const LOCAL_URL = "http://localhost:4000";
const dataUser: any = localStorage.getItem("user");
const userData = JSON.parse(dataUser);
const getData = (key: any = "1") => {
  if (userData) {
    const endPoint =
      userData.data.role === "mahasiswa"
        ? `skripsi/user/${userData?.data?._id}`
        : "skripsi";
    const dataReturn = axios
      .get(`${LOCAL_URL}/api/${endPoint}`)
      .then(({ data }) => {
        if (userData.data.role === "dosen") {
          const newData = data.filter(
            (e: any) =>
              e.pembimbing1.nip === userData.data.nip ||
              e.pembimbing2.nip === userData.data.nip
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
          return newData;
        } else if (userData.data.role === "admin") {
          const status =
            key == "1"
              ? "Verifikasi_Seminar"
              : key == "2"
              ? "Terjadwal_Seminar"
              : key == "3"
              ? "Revisi_Seminar"
              : "Selesai_Seminar";
          const newData = data.filter((e: any) => e.status == status);
          return newData;
        } else {
          return data.data;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return dataReturn;
  }
};

export default getData;
