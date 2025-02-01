import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";
import Login from "../pages/login";
import MainApp from "../pages/main-app";
import Dashboard from "../pages/dashboard";
import Profil from "../pages/profil";
import CatSeminar from "../pages/cat-seminar";
import CatSidang from "../pages/cat-sidang";
import JudulSkripsi from "../pages/judul-skripsi";
import Register from "../pages/register";
import FormJudulSkripsi from "../pages/form-judul-skripsi";
import Dosen from "../pages/dosen";
import AddFormDosen from "../pages/form-dosen";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/" element={<MainApp />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profil" element={<Profil />} />
          <Route path="seminar" element={<CatSeminar />} />
          <Route path="sidang" element={<CatSidang />} />
          <Route path="dosen" element={<Dosen />} />
          <Route path="judul-skripsi" element={<JudulSkripsi />} />
          <Route path="judul-skripsi/add" element={<FormJudulSkripsi />} />
          <Route path="judul-skripsi/edit/:id" element={<FormJudulSkripsi />} />
          <Route path="dosen/add" element={<AddFormDosen />} />
          <Route path="dosen/edit/:id" element={<AddFormDosen />} />
        </Route>
        <Route path="*" element={<Dashboard />} />
      </Switch>
    </Router>
  );
};

export default Routes;
