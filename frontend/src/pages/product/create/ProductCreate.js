import axios from "axios";
import { toInteger } from "lodash";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Select from "react-select";
import { RiSurveyLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

function ProductCreate() {

    const navigate = useNavigate()
    
    const [product, setProduct] = useState(
        {
            name: "",
            status: "",
            lead_time: "",
            price_of_producing: "",
            planner: localStorage.getItem('userId')
        }
    )
  
    const statusOptions = [
        { value: "IP", label: "In Production"},
        { value: "OP", label: "Out Of Production"}
    ]

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

        axios.post(`http://localhost:8000/product/`, product, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('access-token')
            }})
            .then(res => {
                toast.success('Successfully added new product!', {
                    position: toast.POSITION.TOP_CENTER
                });
                console.log(res);
                console.log(res.data);
                navigate("/product/search");
            })
            .catch(error => {
                toast.error('Something went wrong!', {
                    position: toast.POSITION.TOP_CENTER
                })
                console.log(error);
            })
    }

    console.log(product)

    const onInputChange = (e) => {
        console.log(e)
        console.log("---------------")
        setProduct({...product, [e.target.name]: e.target.value});
    }

    const onSelectChange = (e) => {
        console.log(e)
        setProduct({...product, ['status']: e.value})
    }

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
                                    placeholder="Choose product status"
                                    onChange={(e) => onSelectChange(e)}
                                    isSearchable={false}
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
                                    name="lead_time"
                                    onChange={(e) => onInputChange(e)}
                                    required
                                    />
                                <div className="input-group-append">
                                    <span className="input-group-text" id="basic-addon2">minutes</span>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price_of_producing" className="form-label">
                                Price of producing:
                            </label>
                            <div className="input-group">
                                <input
                                    type={"number"}
                                    min="0"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Price..."
                                    name="price_of_producing"
                                    onChange={(e) => onInputChange(e)}
                                    required
                                    />
                                <div className="input-group-append">
                                    <span className="input-group-text" id="basic-addon2">€</span>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-outline-primary" 
                                style={{'width':'150px', 'height':'50px', 'margin-left':'39%', 'margin-top':'15px'}}>
                        Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default ProductCreate;