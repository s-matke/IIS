import axios from "axios";
import { toInteger } from "lodash";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import Select from "react-select";
import { RiSurveyLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import AuthContext from "../../../store/production/AuthContext";

function BillOfMaterialUpdate() {

    const params = useParams()
    const productId = params.id;

    const navigate = useNavigate();
    const context = useContext(AuthContext);

    const { state } = useLocation();

    const [materials, setMaterials] = useState(state?.data.materials)
    const [product, setProduct] = useState(state?.data)

    const submitProduct = async (e) => {
        e.preventDefault();

        var flag = false;

        product.materials.map((material, index) => {
            if (material.quantity == "" || isNaN(toInteger(material.quantity))) {
                toast.warn('Quantity can\'t be empty or not a number!', {
                    position: toast.POSITION.TOP_RIGHT
                })
                flag = true;
            }
        })

        if (flag) return;

        axios.put(`http://localhost:8000/product/` + productId, product, {
            headers: {
              'Authorization': 'Bearer ' + context.token
            }})
            .then(res => {
                toast.success('Successfully updated product!', {
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

    const onInputChange = index => e => {
        console.log("index: " + index)

        let newData = [...product.materials]

        newData[index][e.target.name] = e.target.value

        // setMaterials(newData)
        setProduct({...product, ['materials']: newData})

    }

    return(
        <div className="container position-relative">
            <div className="row">
                <div className="col-md-6 offset-md-4 border rounded p-4 mt-2 shadow position-relative">
                    <h2 className="text-center m-5">Amount of materials required</h2>
                    <form onSubmit={(e) => submitProduct(e)}>
                        <div className="mb-4">
                        <table className="table table-bordered table-hover border rounded p-4 mt-2 shadow">
                            <thead>
                            <tr className='table-dark'>
                                <th scope="col">NAME</th>
                                <th scope="col">QUANTITY</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                product.materials.map((material,index)=>(
                                <tr className='table-light'>
                                <td>{material.name}</td>
                                <td>
                                    <input
                                    type={"number"}
                                    max={200}
                                    className="form-control"
                                    placeholder="Quantity..."
                                    name="quantity"
                                    value={material.quantity}
                                    id={material.id}
                                    onChange={onInputChange(index)}
                                    required
                                    />
                                </td>
                                </tr>
                                ))
                            }
                            </tbody>
                        </table>
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

export default BillOfMaterialUpdate;