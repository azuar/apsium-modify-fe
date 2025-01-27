import { Form, Input, Button } from 'antd';
const Profil = () => {
    return (
        <div>
            <h2 style={{marginBottom:20}}>Profil</h2>
            <div
                style={{
                padding: 24,
                minHeight: 360,
                background: "white",
                borderRadius: 10,
                }}
            >
            <Form
                name="layout-multiple-vertical"
                layout="vertical"
            >
                <Form.Item label={<h4>Nomor Induk Mahasiswa :</h4>} name="nim" style={{marginBottom:12}}>
                    <Input />
                </Form.Item>
                <Form.Item label={<h4>Nama :</h4>} name="nama" style={{marginBottom:12}}>
                    <Input />
                </Form.Item>
                <Form.Item label={<h4>Nomor Whatsapp (+62xxxxxx) :</h4>} name="wa" style={{marginBottom:12}}>
                    <Input />
                </Form.Item>
                <Form.Item label={<h4>Program Studi :</h4>} name="studi" style={{marginBottom:12}}>
                    <Input />
                </Form.Item>
                <Form.Item label={null} style={{textAlign:"end", marginTop:20}}>
                    <Button type="primary" htmlType="submit">
                        Simpan
                    </Button>
                </Form.Item>
            </Form>
            </div>
        </div>
    )
    ;
  };
  
  export default Profil;
  