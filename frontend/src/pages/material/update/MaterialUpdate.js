import axios from "axios";
import { toInteger } from "lodash";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import Select from "react-select";
import { RiSurveyLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

function MaterialUpdate() {

    const params = useParams()
    const materialId = params.id;

    const navigate = useNavigate()
    
    const [material, setMaterial] = useState(
        {
            name: "",
            description: "",
            price: "",
            supplier: "",
            min_amount: "",
            max_amount: ""
        }
    )
  
    useEffect(()=>{
        if (!localStorage.getItem('access-token')){
          navigate("/")
        }
        loadMaterial();
    },[])

    const loadMaterial = async() =>{
        const result=await axios.get("http://localhost:8000/material/" + materialId, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access-token')
          }})
          .then(res => {
            setMaterial(res.data)
          })
          .catch(error => {
            toast.error("Couldn't retrieve material! Try again later.", {
                position: toast.POSITION.TOP_CENTER
            })
            console.log(error);
        })
    }

    const submitMaterial = async (e) => {
        e.preventDefault();

        var flag = false;
        Object.keys(material).forEach(function(key) {
            if (material[key] === "") {
                alert("Fill all input fields.");
                flag = true;
            }
        })

        if (material['min_amount'] >= material['max_amount']) {
            flag = true
            toast.warning('Value for min amount must be lower than value for max amount!', {
                position: toast.POSITION.TOP_CENTER
            })
        }

        if (flag) return;

        axios.put(`http://localhost:8000/material/` + materialId, material, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('access-token')
            }})
            .then(res => {
                toast.success('Successfully updated material!', {
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

    const onInputChange = (e) => {
        setMaterial({...material, [e.target.name]: e.target.value});
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
                                    value={material.name}
                                    onChange={(e) => onInputChange(e)}
                                    required
                                    />
                            </div>
                        </div>
                        <div className="md-4">
                            <label id="description" className="form-label">Description:</label>
                            <textarea 
                                    className="form-control" 
                                    maxLength={200}
                                    type={"text"} 
                                    name="description"
                                    value={material.description}
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
                                    value={material.price}
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
                                    value={material.supplier}
                                    name="supplier"
                                    onChange={(e) => onInputChange(e)}
                                    required
                                    />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="min_max_amount" className="form-label">
                                Min-Max Amount:
                            </label>
                            <div class="input-group">
                                <input
                                    type={"number"}
                                    className="form-control"
                                    min="0"
                                    value={material.min_amount}
                                    placeholder="Min amount..."
                                    name="min_amount"
                                    onChange={(e) => onInputChange(e)}
                                    required
                                    />
                                <span class="input-group-addon"> - </span>
                                <input
                                    type={"number"}
                                    className="form-control"
                                    min="0"
                                    placeholder="Max amount..."
                                    value={material.max_amount}
                                    name="max_amount"
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

export default MaterialUpdate;