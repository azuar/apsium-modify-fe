import { Space, Table, Button, } from 'antd';

const columns = [
  {
    title: 'No',
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: 'NIM',
    dataIndex: 'nim',
    key: 'nim',
  },
  {
    title: 'Nama',
    dataIndex: 'nama',
    key: 'nama',
  },
  {
    title: 'Judul',
    key: 'judul',
    dataIndex: 'judul',
  },
  {
    title: 'Waktu Seminar',
    key: 'time',
    dataIndex: 'time',
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <Space size="middle">
        <Button color="default" variant="solid">Catatan</Button>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    nama: 'John Brown',
    nim: 32,
    judul: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    nama: 'Jim Green',
    nim: 42,
    judul: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    nama: 'Joe Black',
    nim: 33,
    judul: 'Sydney No. 1 Lake Park',
  },
];
const CatSeminar = () => {
    return (
        <div>
            <h2 style={{marginBottom:20}}>Seminar Proposal</h2>
            <div
                style={{
                padding: 24,
                minHeight: 360,
                background: "white",
                borderRadius: 10,
                }}
            >
                <h4 style={{marginBottom:20}}>Daftar Seminar</h4>
                <Table columns={columns} dataSource={data} />
            </div>
        </div>
    )
    ;
  };
  
  export default CatSeminar;
  