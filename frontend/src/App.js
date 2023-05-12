import {BrowserRouter, Routes, Route} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import Sidebar from "./components/Sidebar/Sidebar";
import Signin from "./pages/signin/Signin";
import Signout from "./utils/Signout";

import WorkerCreate from "./pages/workers/create/WorkerCreate";
import ProductCreate from "./pages/product/create/ProductCreate";
import ProductUpdate from "./pages/product/update/ProductUpdate";
import ProductSearch from "./pages/product/search/ProductSearch";
import MaterialCreate from "./pages/material/create/MaterialCreate";
import MaterialSearch from "./pages/material/search/MaterialSearch";
import MaterialUpdate from "./pages/material/update/MaterialUpdate";
import BillOfMaterialCreate from "./pages/product/create/BillOfMaterialCreate";
import BillOfMaterialUpdate from "./pages/product/create/BillOfMaterialUpdate";

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
          <Route path="/product/update/:id" element={<ProductUpdate />}></Route>
          <Route path="/product/update/:id/bom/" element={<BillOfMaterialUpdate />}></Route>
          <Route path="/product/search" element={<ProductSearch />}></Route>
          <Route path="/product/create/bom" element={<BillOfMaterialCreate />}></Route>
          <Route path="/material/create" element={<MaterialCreate />}></Route>
          <Route path="/material/search" element={<MaterialSearch />}></Route>
          <Route path="/material/update/:id" element={<MaterialUpdate />}></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer/>
    </>
  );
}


export default App;
