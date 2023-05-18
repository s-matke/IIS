import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/production/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Select from "react-select";


function CreateOrder() {
    const context = useContext(AuthContext);
    const navigate = useNavigate()
    const today = new Date().toISOString().split('T')[0];
    
    const [materialOptions, setMaterialOptions] = useState([])
    const [selectedMaterial, setSelectedMaterial] = useState()
    const [order, setOrder] = useState(
        {
            material: "",
            ordered_by: context.user.id,
            expected_delivery_date: "", // TODO: remove, used only for DEV testing
            ordered_quantity: ""
        }
    )

    useEffect(() => {
        loadMaterials();
    }, [])

    const loadMaterials = async() => {
        const result = await axios.get("http://localhost:8000/material", {
            headers: {
                'Authorization': 'Bearer ' + context.token
            }
        })
        .then(res => {
            const materialList = res.data.map(material => ({
                label: material.name,
                value: material.id
            }));

            setMaterialOptions(materialList);
        })
    }

    const submitOrder = async(e) => {
        e.preventDefault();

        var flag = false;
        
        Object.keys(order).forEach(function(key) {
            if (order[key] === "") {
                alert("Fill all input fields.");
                flag = true;
            }
        })

        if (flag) return;

        axios.post(`http://localhost:8000/orders/`, order, {
            headers: {
                'Authorization': 'Bearer ' + context.token
            }
        })
        .then(res => {
            toast.success('Successfully sent order!', {
                position: toast.POSITION.TOP_CENTER
            });
            navigate("/inventory/materials")
        })
    }

    const onInputChange = (e) => {
        setOrder({...order, [e.target.name]: e.target.value})
    }

    const onSelectChange = (e) => {
        const newSelectedMaterial = {
            id: e.value,
            name: e.name
        }
        setSelectedMaterial(newSelectedMaterial)
        setOrder({...order, ['material']: e.value})
    }

    return(
        <div className="container position-relative">
            <div className="row">
                <div className="col-md-6 offset-md-4 border rounded p-4 mt-2 shadow position-relative">
                    <h2 className="text-center m-5">Order Material</h2>
                    <div className="mb-4">
                            <h5 style={{'width':'50%%', 'text-align':'center', 'border-bottom':'1px solid #000', 'line-height':'0.1em', 'margin':'10px 0 20px'}}>
                                <span style={{'background':'#fff', 'padding':'0 5px'}}>Info about order</span></h5>
                    </div>
                    <form onSubmit={(e) => submitOrder(e)}>
                        <div className="mb-4">
                            <label htmlFor="material" className="form-label">
                                Material:
                            </label>
                            <div className="dropdown-container">
                                <Select
                                    required
                                    options={materialOptions}
                                    name="material"
                                    placeholder="Choose material"
                                    onChange={(e) => onSelectChange(e)}
                                    isSearchable={true}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="eta" className="form-label">
                                Delivery Date [DEVONLY]:
                            </label>
                            <div className="input-group">
                                <input
                                    type={"date"}
                                    // min={today}
                                    className="form-control"
                                    placeholder="Date..."
                                    name="expected_delivery_date"
                                    onChange={(e) => onInputChange(e)}
                                    required
                                    />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price" className="form-label">
                                Quantity:
                            </label>
                            <div className="input-group">
                                <input
                                    type={"number"}
                                    min="1"
                                    className="form-control"
                                    placeholder="Quantity..."
                                    name="ordered_quantity"
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

export default CreateOrder;
