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
    title: 'Pembimbing 1',
    key: 'pembimbing1',
    dataIndex: 'pembimbing1',
  },
  {
    title: 'Setuju Pemb. 1',
    key: 'setujupembimbing1',
    dataIndex: 'setujupembimbing1',
  },
  {
    title: 'Pembimbing 2',
    key: 'pembimbing2',
    dataIndex: 'pembimbing1',
  },
  {
    title: 'Setuju Pemb. 2',
    key: 'setujupembimbing1',
    dataIndex: 'setujupembimbing1',
  },
  {
    title: 'Program Studi',
    key: 'programstudi',
    dataIndex: 'programstudi',
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <Space size="middle">
        <Button color="default" variant="solid">Ajukan Seminar</Button>
        <Button color="default" variant="solid">Drive</Button>
        <Button color="default" variant="solid">Log Riset</Button>
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
    time: '1',
  },
  {
    key: '2',
    nama: 'Jim Green',
    nim: 42,
    judul: 'London No. 1 Lake Park',
    time: '2',
  },
  {
    key: '3',
    nama: 'Joe Black',
    nim: 33,
    judul: 'Sydney No. 1 Lake Park',
    time: '3',
  },
];

const JudulSkripsi = () => {
    return (
        <div>
            <h2 style={{marginBottom:20}}>Judul Skripsi</h2>
            <div
                style={{
                padding: 24,
                minHeight: 360,
                background: "white",
                borderRadius: 10,
                }}
            >
                <h4 style={{marginBottom:20}}>Daftar Judul Skripsi</h4>
                <Table columns={columns} dataSource={data} />
            </div>
        </div>
    )
    ;
  };
  
  export default JudulSkripsi;
  