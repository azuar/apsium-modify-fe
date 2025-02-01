import { Table } from "antd";

const TableComponent = (data: any) => {
  return (
    <Table
      columns={data.columns}
      dataSource={data.dataSource}
      scroll={{ x: "max-content" }}
      bordered={true}
    />
  );
};

export default TableComponent;
