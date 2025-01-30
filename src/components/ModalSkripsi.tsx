import {
  Form,
  Spin,
  Select,
  Flex,
  Button,
  Modal,
  DatePicker,
  TimePicker,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";

const ModalSkripsi = (data: any) => {
  const LOCAL_URL = "http://localhost:4000";
  const [api, _contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [dosen, setDosen] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${LOCAL_URL}/api/dosen`)
      .then(({ data }) => {
        setDosen(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleSelectChangeDosen = (e: any, dosenType: any) => {
    const value = dosen.filter((x) => x._id == e)[0];
    setFormData({
      ...formData,
      [dosenType]: value,
    });
  };
  type NotificationType = "success" | "info" | "warning" | "error";
  const openNotificationWithIcon = (type: NotificationType, message: any) => {
    api[type]({
      message: message,
    });
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      formData.status = "Terjadwal_Seminar";
      await axios.put(
        `${LOCAL_URL}/api/skripsi/update/${data.id}`,
        formData,
        config
      );
      setLoading(false);
      openNotificationWithIcon("success", "Jadwal Sudah Dibuat!!");
    } catch (error: any) {
      setLoading(false);
      openNotificationWithIcon("error", error.response.data.message);
      console.log(error.response);
    }
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().endOf("day");
  };

  return (
    <div>
      <Spin spinning={loading}>
        <Form
          name="layout-multiple-vertical"
          style={{
            marginTop: 20,
          }}
          onSubmitCapture={submitHandler}
          layout={"vertical"}
        >
          <Form.Item
            label={<h4>Tanggal Seminar </h4>}
            style={{ marginBottom: 12 }}
          >
            <DatePicker
              style={{ width: "100%" }}
              onChange={(_value, dateString) => {
                setFormData({
                  ...formData,
                  ["tanggal_seminar"]: dateString,
                });
              }}
              disabledDate={disabledDate}
            />
          </Form.Item>
          <Form.Item
            label={<h4>Waktu Seminar </h4>}
            style={{ marginBottom: 12 }}
          >
            <TimePicker.RangePicker
              format={"HH:mm"}
              style={{ width: "100%" }}
              onChange={(_time, timeString) => {
                setFormData({
                  ...formData,
                  ["waktu_seminar"]: `${timeString[0]} - ${timeString[1]}`,
                });
              }}
            />
          </Form.Item>
          <Form.Item label={<h4>Penguji 1 </h4>} style={{ marginBottom: 12 }}>
            <Select
              showSearch
              value={formData.penguji1?._id}
              placeholder="Pilih Dosen Penguji 1"
              onChange={(e) => handleSelectChangeDosen(e, "penguji1")}
              options={(dosen || []).map((d) => ({
                value: d._id,
                label: d.nama,
              }))}
            />
          </Form.Item>
          <Form.Item label={<h4>Penguji 2 </h4>} style={{ marginBottom: 12 }}>
            <Select
              showSearch
              value={formData.penguji2?._id}
              placeholder="Pilih Dosen Penguji 2"
              onChange={(e) => handleSelectChangeDosen(e, "penguji2")}
              options={(dosen || []).map((d) => ({
                value: d._id,
                label: d.nama,
              }))}
            />
          </Form.Item>
          <Form.Item label={<h4>Penguji 3 </h4>} style={{ marginBottom: 12 }}>
            <Select
              showSearch
              value={formData.penguji3?._id}
              placeholder="Pilih Dosen Penguji 3"
              onChange={(e) => handleSelectChangeDosen(e, "penguji3")}
              options={(dosen || []).map((d) => ({
                value: d._id,
                label: d.nama,
              }))}
            />
          </Form.Item>
          <Form.Item label={null} style={{ textAlign: "end", marginTop: 30 }}>
            <Flex gap="small" wrap justify="end">
              <Button type="primary" danger onClick={() => Modal.destroyAll()}>
                Batal
              </Button>
              <Button type="primary" htmlType="submit">
                Jadwalkan
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default ModalSkripsi;
