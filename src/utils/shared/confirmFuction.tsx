import { message, Modal } from "antd";
import axios from "axios";

const LOCAL_URL = "https://apsium-modify-be.vercel.app";
const { confirm } = Modal;

const showConfirm = (
  title: any = null,
  icon: any,
  endpoint: string,
  id: string,
  isLoading: boolean,
  setLoading: (loading: boolean) => void,
  ResultData: () => void,
  content: any = null,
  body: any = null,
  width: any = null
) => {
  confirm({
    title: title,
    icon: icon,
    content: content,
    width: width,
    okButtonProps: {
      disabled: isLoading,
    },
    async onOk() {
      setLoading(true);
      if (endpoint.includes("delete")) {
        await axios
          .delete(`${LOCAL_URL}/api/${endpoint}/${id}`)
          .then(() => {
            ResultData();
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            message.error(err.response.data.message);
          });
      } else {
        await axios
          .put(`${LOCAL_URL}/api/${endpoint}/${id}`, body)
          .then(() => {
            ResultData();
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            message.error(err.response.data.message);
          });
      }
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

export default showConfirm;
