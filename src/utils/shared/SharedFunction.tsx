import axios from "axios";

const LOCAL_URL = "https://apsium-modify-be.vercel.app";
const dataUser: any = localStorage.getItem("user");
const userData = JSON.parse(dataUser);
export default function getData(key: any = "1") {
  if (userData) {
    const endPoint =
      userData.data.role === "mahasiswa"
        ? `skripsi/user/${userData?.data?._id}`
        : "skripsi";
    const dataReturn = axios
      .get(`${LOCAL_URL}/api/${endPoint}`)
      .then(({ data }) => {
        if (userData.data.role === "dosen") {
          let newData: any = [];
          if (location.pathname.includes("skripsi")) {
            const status =
              key == "1"
                ? "Permohonan_Seminar"
                : key == "2"
                ? "Seminar"
                : key == "3"
                ? "Permohonan_Sidang"
                : key == "4"
                ? "Sidang"
                : "Selesai";
            newData = data.filter(
              (e: any) =>
                (e.pembimbing1.nip === userData.data.nip ||
                  e.pembimbing2.nip === userData.data.nip) &&
                e.status.includes(status)
            );
            newData.map((e: any, index: any) => {
              e.no = index + 1;
              if (e.pembimbing1.nip === userData.data.nip) {
                e.status_pembimbing = "pembimbing1";
                e.persetujuan = e.setuju1 ? true : false;
              } else {
                e.status_pembimbing = "pembimbing2";
                e.persetujuan = e.setuju2 ? true : false;
              }
            });
          } else if (location.pathname.includes("seminar")) {
            newData = data.filter(
              (e: any) =>
                e.penguji1?.nip === userData?.data?.nip ||
                e.penguji2?.nip === userData?.data?.nip ||
                e.penguji3?.nip === userData?.data?.nip
            );
          }
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
          newData.map((e: any, index: any) => {
            e.no = index + 1;
          });
          return newData;
        } else {
          data.data.map((e: any, index: any) => {
            e.no = index + 1;
          });
          return data.data;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return dataReturn;
  }
}

const getOptionData = async (endpoint: any) => {
  try {
    const { data } = await axios.get(`${LOCAL_URL}/api/${endpoint}`);
    return data;
  } catch (err) {
    console.error(err);
    return null; // Bisa dikembalikan nilai default sesuai kebutuhan
  }
};

export { getOptionData };
