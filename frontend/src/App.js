import {BrowserRouter, Routes, Route} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import Sidebar from "./components/Sidebar/Sidebar";
import Signin from "./pages/signin/Signin";
import Signout from "./utils/Signout";

import WorkerCreate from "./pages/workers/create/WorkerCreate";
import ProductCreate from "./pages/product/create/ProductCreate";
import ProductSearch from "./pages/product/search/ProductSearch";
import MaterialCreate from "./pages/material/create/MaterialCreate";
import MaterialSearch from "./pages/material/search/MaterialSearch";
import BillOfMaterialCreate from "./pages/product/create/BillOfMaterialCreate";

function App() {
  return (
    <>
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Signin />}></Route>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/login" element={<Signin />}></Route>
          <Route path="/worker/create" element={<WorkerCreate />}></Route>
          <Route path="/signout" element={<Signout/>}></Route>
          <Route path="/product/create" element={<ProductCreate />}></Route>
          <Route path="/product/search" element={<ProductSearch />}></Route>
          <Route path="/product/create/bom" element={<BillOfMaterialCreate />}></Route>
          <Route path="/material/create" element={<MaterialCreate />}></Route>
          <Route path="/material/search" element={<MaterialSearch />}></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer/>
    </>
  );
}


export default App;
