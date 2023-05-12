import axios from "axios";
import { toInteger } from "lodash";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import Select from "react-select";
import { RiSurveyLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import React from 'react';
import Button from 'react-bootstrap/Button';


function ProductUpdate(props) {
    const params = useParams()
    const productId = params.id;

    const navigate = useNavigate()  
    const [product, setProduct] = useState(
        {
            name: "",
            status: "",
            lead_time: "",
            planner: "",
            materials: "",
            bom: ""
        }
    )
    const [materialOptions, setMaterialOptions] = useState([])
    const [selectedMaterials, setSelectedMaterials] = useState([])
    const [selectedStatus, setSelectedStatus] = useState({status: {}})

    const statusOptions = [
        { value: "IP", label: "In Production"},
        { value: "OP", label: "Out Of Production"}
    ]

    useEffect(()=>{
        if (!localStorage.getItem('access-token')){
          navigate("/")
        }
        loadProduct(); 
        loadMaterials();
    },[])

    const loadProduct = async() =>{
        const result=await axios.get("http://localhost:8000/product/" + productId, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access-token')
          }})
          .then(res => {
            // console.log(res.data)

            // const materialsList = res.data.bom.map(material => ({
            //     label: material.material_name,
            //     value: material.material,
            //     quantity: material.quantity
            //   }));

            const selectedMaterialList = res.data.bom.map(material => ({
                id: material.material,
                name: material.material_name,
                quantity: (material.quantity || 0)
            }))
            
            // console.log(res.data)
            const productTmp = {
                    name: res.data['name'],
                    status: res.data['status'],
                    lead_time: res.data['lead_time'],
                    materials: selectedMaterialList
            }

            // console.log(statusOptions.at([res.data['status']]).label)
            const tmpStatus = 
                { label: statusOptions.at([res.data['status']]).label, value: res.data['status'],}
            setSelectedStatus(tmpStatus)
            setSelectedMaterials(selectedMaterialList)
            setProduct(productTmp)
          })
    }

    // console.log(product)

    const loadMaterials = async() =>{
        const result=await axios.get("http://localhost:8000/material", {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access-token')
          }})
          .then(res => {
          
            const materialsList = res.data.map(material => ({
                name: material.name,
                id: material.id,
              }));

            setMaterialOptions(materialsList)
            //   setSelectedMaterials({materials: materialsList})
            // setProduct({...product, ['materials']: materialsList})
          })
    }

    const submitProduct = async (e) => {
        e.preventDefault();

        var flag = false;
        Object.keys(product).forEach(function(key) {
            if (product[key] === "") {
                alert("Fill all input fields.");
                flag = true;
            }
        })

        if (flag) return;

        navigate('/product/update/' + productId + '/bom',
        {
        state: {
            data: product
        }
        })
    }

    const deleteProduct = async (e) => {
        e.preventDefault();

        axios.delete(`http://localhost:8000/product/` + productId, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('access-token')
            }})
            .then(res => {
                toast.success('Successfully deleted product!', {
                    position: toast.POSITION.TOP_CENTER
                });
                navigate("/product/search");
            })
            .catch(error => {
                toast.error('Something went wrong!', {
                    position: toast.POSITION.TOP_CENTER
                })
                console.log(error);
            })
    }

    const onInputChange = (e) => {
        setProduct({...product, [e.target.name]: e.target.value});
    }

    const onSelectChange = (e) => {
        setProduct({...product, ['status']: e.value})
        setSelectedStatus(e)
    }

    const onMultiSelectChange = (e) => {

        // const selectedMaterialList = e.map(material => ({
        //     id: material.value,
        //     name: material.label
        // }))
        const selectedMaterialList = e.map(material => ({
            id: material.id,
            name: material.name,
            quantity: (material.quantity || 0)
        }))

        setSelectedMaterials(selectedMaterialList)
        setProduct({...product, ['materials']: selectedMaterialList})
    }

    console.log(product)
    return(
        <div className="container position-relative">
            <div className="row">
                <div className="col-md-6 offset-md-4 border rounded p-4 mt-2 shadow position-relative">
                    <h2 className="text-center m-5">Create Product</h2>
                    <div className="mb-4">
                            <h5 style={{'width':'50%%', 'text-align':'center', 'border-bottom':'1px solid #000', 'line-height':'0.1em', 'margin':'10px 0 20px'}}>
                                <span style={{'background':'#fff', 'padding':'0 5px'}}>Info about product</span></h5>
                    </div>
                    <form onSubmit={(e) => submitProduct(e)}>
                        <div className="mb-4">
                            <label htmlFor="name" className="form-label">
                                Name:
                            </label>
                            <div className="input-group">
                                <input
                                    type={"text"}
                                    className="form-control"
                                    placeholder="Name..."
                                    name="name"
                                    value={product.name}
                                    onChange={(e) => onInputChange(e)}
                                    required
                                    />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="attendance" className="form-label">
                                Product Status:
                            </label>
                            <div className="dropdown-container">
                                <Select
                                    required
                                    options={statusOptions}
                                    name="status"
                                    value={selectedStatus}
                                    placeholder="Choose product status"
                                    onChange={(e) => onSelectChange(e)}
                                    isSearchable={false}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="attendance" className="form-label">
                                Materials:
                            </label>
                            <div className="dropdown-container">
                                <Select
                                    required
                                    options={materialOptions}
                                    name="materials"
                                    value={selectedMaterials}
                                    placeholder="Choose materials"
                                    onChange={(e) => onMultiSelectChange(e)}
                                    getOptionValue={(option) => option.id}
                                    getOptionLabel={(option) => option.name}
                                    isSearchable={true}
                                    isMulti
                                    isClearable
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="lead_time" className="form-label">
                                Lead time:
                            </label>
                            <div className="input-group">
                                <input
                                    type={"number"}
                                    min="0"
                                    max="500"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Lead time..."
                                    value={product.lead_time}
                                    name="lead_time"
                                    onChange={(e) => onInputChange(e)}
                                    required
                                    />
                                <div className="input-group-append">
                                    <span className="input-group-text" id="basic-addon2">minutes</span>
                                </div>
                            </div>
                        </div>
                        <div class="overlay-right d-flex justify-content-center">
                         {/* style={{'width':'150px', 'height':'50px', 'margin-left':'39%', 'margin-top':'15px'}}> */}
                            <button type="submit" className="btn btn-outline-primary p-3 m-2">
                                    
                            Continue
                            </button>
                            <button type="button" onClick={deleteProduct} className="btn btn-outline-danger p-3 m-2" 
                                    >
                            Delete
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default ProductUpdate;