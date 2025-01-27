const Dashboard = () => {
  const dataUser: any = localStorage.getItem("user");
  const userData = JSON.parse(dataUser);
  return (
    <>
      <div
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
        }}
      >
        <div>
          <h1>Dashboard</h1>
          <h3>Selamat datang kembali {userData.data.nama}</h3>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
