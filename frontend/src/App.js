import {BrowserRouter, Routes, Route} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import Sidebar from "./components/Sidebar/Sidebar";
import Signin from "./pages/signin/Signin";
import Signout from "./utils/Signout";

import React, { useContext } from "react";

import WorkerCreate from "./pages/workers/create/WorkerCreate";
import ProductCreate from "./pages/product/create/ProductCreate";
import ProductUpdate from "./pages/product/update/ProductUpdate";
import ProductSearch from "./pages/product/search/ProductSearch";
import MaterialCreate from "./pages/material/create/MaterialCreate";
import MaterialSearch from "./pages/material/search/MaterialSearch";
import MaterialUpdate from "./pages/material/update/MaterialUpdate";
import BillOfMaterialCreate from "./pages/product/create/BillOfMaterialCreate";
import BillOfMaterialUpdate from "./pages/product/create/BillOfMaterialUpdate";
import AuthContext from "./store/production/AuthContext";
import ProtectedRoute from "./components/routing/ProtectedRoute";

function App() {
  const context = useContext(AuthContext);

  return (
    <>
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path="/signout" element={<Signout/>}></Route>
          
          <Route element={<ProtectedRoute isAllowed={context.isLoggedIn} redirectPath="/product/search" />}>
            <Route path="/" element={<Signin />}></Route>
            <Route path="/signin" element={<Signin />}></Route>
            <Route path="/login" element={<Signin />}></Route>
          </Route>

          <Route element={<ProtectedRoute isAllowed={context.isLoggedIn && context.role == "Admin"} />}>
            <Route path="/worker/create" element={<WorkerCreate />}/>
          </Route>
          
          <Route element={<ProtectedRoute isAllowed={context.isLoggedIn && (context.role == "Plan Manager" || context.role == "Inventory Manager" || context.role == "Admin" )} />}>
            <Route path="/product/search" element={<ProductSearch />}/>
            <Route path="/material/search" element={<MaterialSearch />}/>
          </Route>

          <Route element={<ProtectedRoute isAllowed={context.isLoggedIn && context.role == "Inventory Manager" } redirectPath="/product/search" />}>
            <Route path="/product/create" element={<ProductCreate />}/>
            <Route path="/product/update/:id" element={<ProductUpdate />}/>
            <Route path="/product/update/:id/bom/" element={<BillOfMaterialUpdate />}/>
            <Route path="/product/create/bom" element={<BillOfMaterialCreate />}/>
            
          </Route>
          
          <Route element={<ProtectedRoute isAllowed={context.isLoggedIn && context.role == "Inventory Manager" } redirectPath="/material/search" />}>
            <Route path="/material/create" element={<MaterialCreate />}/>
            <Route path="/material/update/:id" element={<MaterialUpdate />}/>
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer/>
    </>
  );
}


export default App;
