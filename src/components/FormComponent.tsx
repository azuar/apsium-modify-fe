import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Select,
  Spin,
  TimePicker,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FormComponent = (data: any) => {
  const LOCAL_URL = "https://apsium-modify-be.vercel.app";
  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  let navigate: any;
  if (data.navigate) {
    navigate = useNavigate();
  }

  useEffect(() => {
    if (data?.id) {
      setLoading(true);

      axios
        .get(`${LOCAL_URL}/api/${data.endPoint}/${data.id}`)
        .then(({ data }) => {
          setFormData(data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setError("Gagal memuat data!");
        });
    }
  }, []);

  const handleSelectChange = (e: any, label: any, optionsData: any[]) => {
    const value = optionsData.find((x: any) => x._id === e);
    setFormData({
      ...formData,
      [label]: value,
    });
  };

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      let bodyReq = formData;
      delete bodyReq._id;
      if (data?.user_id) {
        bodyReq.user_id = data?.user_id;
      }
      if (data?.title === "Jadwalkan Seminar") {
        bodyReq.status = "Terjadwal_Seminar";
      }
      if (data?.id) {
        if (location.pathname.includes("judul-skripsi")) {
          bodyReq = {
            judul: formData.judul,
            pembimbing1: formData.pembimbing1,
            pembimbing2: formData.pembimbing2,
          };
        }
        debugger;
        await axios.put(
          `${LOCAL_URL}/api/${data?.endPoint}/update/${data?.id}`,
          bodyReq,
          config
        );
        message.success(
          data.successMessage ?? `${data?.title} berhasil diperbarui!!`
        );
      } else {
        await axios.post(
          `${LOCAL_URL}/api/${data?.endPoint}/add`,
          bodyReq,
          config
        );
        message.success(
          data.successMessage ?? `${data?.title} berhasil ditambahkan!!`
        );
      }
      setLoading(false);
      if (data?.navigate) {
        navigate(data?.navigate);
      }
      if (data.formType) {
        Modal.destroyAll();
      }
    } catch (error: any) {
      setLoading(false);
      setError(error.response?.data?.message || "Terjadi kesalahan.");
      console.log(error.response);
    }
  };

  return (
    <>
      {data.formType ? (
        <h2 style={{ textAlign: "center" }}>{data?.title}</h2>
      ) : (
        <h1 style={{ marginBottom: 20 }}>
          {data?.id ? "Update" : "Tambah"} {data?.title}
        </h1>
      )}
      <div
        style={
          !data.formType
            ? {
                padding: 30,
                minHeight: 360,
                background: "white",
                borderRadius: 10,
              }
            : {}
        }
      >
        <Spin spinning={loading}>
          <p style={{ color: "red" }}>{error}</p>
          <Form
            name="layout-multiple-vertical"
            style={{ marginTop: 20 }}
            onSubmitCapture={submitHandler}
            layout="vertical"
          >
            {data?.form?.map((element: any, index: number) => (
              <Form.Item
                key={index}
                label={<h4>{element.label}:</h4>}
                style={{ marginBottom: 12 }}
              >
                {element.type === "input" ? (
                  <Input
                    name={element.name}
                    value={formData[element.name]}
                    onChange={handleInputChange}
                    disabled={element.disabled}
                  />
                ) : element.type === "select" ? (
                  <Select
                    showSearch
                    value={formData[element.name]?._id || undefined}
                    placeholder={element.placeholder}
                    onChange={(e) =>
                      handleSelectChange(e, element.name, element.options)
                    }
                    options={(element.options || []).map((d: any) => ({
                      value: d._id,
                      label: d.nama ?? d.judul,
                    }))}
                  />
                ) : element.type === "date" ? (
                  <DatePicker
                    style={{ width: "100%" }}
                    onChange={(_value, dateString) => {
                      setFormData({
                        ...formData,
                        [element.name]: dateString,
                      });
                    }}
                    disabledDate={element?.disabledDate}
                  />
                ) : element.type === "time" ? (
                  <TimePicker.RangePicker
                    format={"HH:mm"}
                    style={{ width: "100%" }}
                    onChange={(_time, timeString) => {
                      setFormData({
                        ...formData,
                        [element.name]: `${timeString[0]} - ${timeString[1]}`,
                      });
                    }}
                  />
                ) : null}
              </Form.Item>
            ))}

            <Form.Item label={null} style={{ textAlign: "end", marginTop: 20 }}>
              <Flex gap="small" wrap justify="end">
                {data?.button?.map((element: any) =>
                  element.type === "submit" ? (
                    <Button type="primary" htmlType="submit">
                      {element.label}
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      danger
                      onClick={() =>
                        data.formType
                          ? Modal.destroyAll()
                          : navigate(data?.navigate)
                      }
                    >
                      {element.label}
                    </Button>
                  )
                )}
              </Flex>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </>
  );
};

export default FormComponent;
