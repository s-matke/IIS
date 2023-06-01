import {BrowserRouter, Routes, Route} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

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
import CreateOrder from "./pages/material/order/CreateOrder";
import ProductInventory from "./pages/inventory/ProductInventory";
import MaterialInventory from "./pages/inventory/MaterialInventory";
import PlanCreate from "./pages/plan/create/PlanCreate";
import PlanSearch from "./pages/plan/search/PlanSearch";
import MachineCreate from "./pages/machine/create/MachineCreate";
import MachineSearch from "./pages/machine/search/MachineSearch";
import MachineUpdate from "./pages/machine/update/MachineUpdate";
import ProductionCreate from "./pages/production/create/ProductionCreate";
import ProductionSearch from "./pages/production/search/ProductionSearch";
import ProductionProgress from "./pages/production/search/ProductionProgress";

function App() {
  const context = useContext(AuthContext);

  return (
    <>
      <BrowserRouter>
        <Sidebar />
        <Routes>

          <Route element={<ProtectedRoute isAllowed={context.isLoggedIn} />}>
            <Route path="/signout" element={<Signout/>}></Route>
          </Route>

          <Route element={<ProtectedRoute isAllowed={!context.isLoggedIn} />}>
            <Route path="/" element={<Signin />}></Route>
            <Route path="/signin" element={<Signin />}></Route>
            <Route path="/login" element={<Signin />}></Route>
          </Route>

          <Route element={<ProtectedRoute isAllowed={context.isLoggedIn && context.role == "Admin"} />}>
            <Route path="/worker/create" element={<WorkerCreate />}/>
            <Route path="/machine/create" element={<MachineCreate />}/>
            <Route path="/machine/search" element={<MachineSearch />}/>
            <Route path="/machine/update/:id" element={<MachineUpdate />}/>
          </Route>
          
          <Route element={<ProtectedRoute isAllowed={context.isLoggedIn && (context.role == "Plan Manager" || context.role == "Inventory Manager" || context.role == "Admin" || context.role == "Production Manager") } />}>
            <Route path="/product/search" element={<ProductSearch />}/> 
            <Route path="/material/search" element={<MaterialSearch />}/>
            <Route path="/inventory/products" element={<ProductInventory />}/>
            <Route path="/inventory/materials" element={<MaterialInventory />}/>
            {/* <Route path="/material/order/search" element={<OrderMaterial/>}/> */}
          </Route>

          <Route element={<ProtectedRoute isAllowed={context.isLoggedIn && context.role == "Inventory Manager" } redirectPath="/product/search" />}>
            <Route path="/product/create" element={<ProductCreate />}/>
            <Route path="/product/update/:id" element={<ProductUpdate />}/>
            <Route path="/product/update/:id/bom/" element={<BillOfMaterialUpdate />}/>
            <Route path="/product/create/bom" element={<BillOfMaterialCreate />}/>
            <Route path="/material/order/create" element={<CreateOrder/>}/>
          </Route>
          
          <Route element={<ProtectedRoute isAllowed={context.isLoggedIn && context.role == "Inventory Manager" } redirectPath="/material/search" />}>
            <Route path="/material/create" element={<MaterialCreate />}/>
            <Route path="/material/update/:id" element={<MaterialUpdate />}/>
          </Route>

          <Route element={<ProtectedRoute isAllowed={context.isLoggedIn && (context.role == "Plan Manager" || context.role == "Production Manager" )} />}>
            <Route path="/production/plan" element={<PlanCreate />}/>
            <Route path="/production/plan/search" element={<PlanSearch />}/>
            <Route path="/production/order/create/:id" element={<ProductionCreate />} />
            {/* <Route path="/production/plan/:id" element={<PlanUpdate />}/> */}
          </Route>

          <Route element={<ProtectedRoute isAllowed={context.isLoggedIn && context.role == "Production Manager"}/>}>
            <Route path="/production/order/search" element={<ProductionSearch/> }/>
            <Route path="/production/order/progress" element={<ProductionProgress/> }/>
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer/>
    </>
  );
}


export default App;
