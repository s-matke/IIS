import axios from "axios";
import { toInteger } from "lodash";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Select from "react-select";
import { RiSurveyLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

function MaterialCreate() {

    const navigate = useNavigate()
    
    const [material, setMaterial] = useState(
        {
            name: "",
            description: "",
            price: "",
            supplier: ""
        }
    )
  
    const statusOptions = [
        { value: "IP", label: "In Materialion"},
        { value: "OP", label: "Out Of Materialion"}
    ]

    const submitMaterial = async (e) => {
        e.preventDefault();

        var flag = false;
        Object.keys(material).forEach(function(key) {
            if (material[key] === "") {
                alert("Fill all input fields.");
                flag = true;
            }
        })

        if (flag) return;

        axios.post(`http://localhost:8000/material/`, material, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('access-token')
            }})
            .then(res => {
                toast.success('Successfully added new material!', {
                    position: toast.POSITION.TOP_CENTER
                });
                console.log(res);
                console.log(res.data);
                navigate("/material/search");
            })
            .catch(error => {
                toast.error('Something went wrong!', {
                    position: toast.POSITION.TOP_CENTER
                })
                console.log(error);
            })
    }

    console.log(material)

    const onInputChange = (e) => {
        console.log(e)
        console.log("---------------")
        setMaterial({...material, [e.target.name]: e.target.value});
    }

    const onSelectChange = (e) => {
        console.log(e)
        setMaterial({...material, ['status']: e.value})
    }

    return(
        <div className="container position-relative">
            <div className="row">
                <div className="col-md-6 offset-md-4 border rounded p-4 mt-2 shadow position-relative">
                    <h2 className="text-center m-5">Create Material</h2>
                    <div className="mb-4">
                            <h5 style={{'width':'50%%', 'text-align':'center', 'border-bottom':'1px solid #000', 'line-height':'0.1em', 'margin':'10px 0 20px'}}>
                                <span style={{'background':'#fff', 'padding':'0 5px'}}>Info about material</span></h5>
                    </div>
                    <form onSubmit={(e) => submitMaterial(e)}>
                        <div className="mb-4">
                            <label htmlFor="name" className="form-label">
                                Name:
                            </label>
                            <div className="input-group">
                                <input
                                    type={"text"}
                                    maxLength={50}
                                    className="form-control"
                                    placeholder="Name..."
                                    name="name"
                                    onChange={(e) => onInputChange(e)}
                                    required
                                    />
                            </div>
                        </div>
                        <div className="md-4">
                            <label id="description">Description:</label> <br/>
                            <textarea 
                                    className="form-control" 
                                    maxLength={200} 
                                    type={"text"} 
                                    name="description"
                                    placeholder="Description..." 
                                    onChange={(e) => onInputChange(e)}
                                    required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price" className="form-label">
                                Price:
                            </label>
                            <div className="input-group">
                                <input
                                    type={"number"}
                                    min="0"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Price..."
                                    name="price"
                                    onChange={(e) => onInputChange(e)}
                                    required
                                    />
                                <div className="input-group-append">
                                    <span className="input-group-text" id="basic-addon2">€</span>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="supplier" className="form-label">
                                Supplier:
                            </label>
                            <div className="input-group">
                                <input
                                    type={"text"}
                                    className="form-control"
                                    maxLength={30}
                                    placeholder="Supplier..."
                                    name="supplier"
                                    onChange={(e) => onInputChange(e)}
                                    required
                                    />
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

export default MaterialCreate;