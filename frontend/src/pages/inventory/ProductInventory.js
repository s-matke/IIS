import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../../store/production/AuthContext'

export default function ProductInventory() {

    const context = useContext(AuthContext)
    const [products,setProducts]=useState([])
    const [filterData,setFilterData]=useState([])
    const[query,setQuery]=useState('')
    const navigate = useNavigate();
    
    useEffect(()=>{
        loadProducts(); 
    },[])

    const loadProducts=async()=>{
        const result=await axios.get("http://localhost:8000/inventory/products", {
          headers: {
            'Authorization': 'Bearer ' + context.token
          }})
        setProducts(result.data);
        setFilterData(result.data);
    }

    const handleSearch=(event)=>
  {
    const getSearch=event.target.value;
    setQuery(getSearch);
   
    if(getSearch.length>0)
    {
      const searchData=filterData.filter((item)=>item.name.toLowerCase().includes(getSearch.toLowerCase().trim()) || 
                                               item.status.toLowerCase().includes(getSearch.toLowerCase().trim()) || 
                                               item.created.toString().toLowerCase().includes(getSearch.toLowerCase().trim()));
      setProducts(searchData);
    }
    else
    {
      setProducts(filterData);
    }
    setQuery(getSearch);
  }

//   const handleRowClick = async (data) => {
//     const product_id = data["id"]
    
//     navigate('/product/update/' + product_id, // update page TODO
//     {
//       state: {
//         data
//       }
//     })
//   }
  
  return (
    <div className='container'>
        <div className='py-4' style={{'width':'75%','margin-left':'280px'}}>
            <input type="text" name="name" value={query} autoComplete='off' className="form-control" onChange={(e)=>handleSearch(e)} placeholder="Search..."/><br/>
            <table className="table table-hover border rounded p-4 mt-2 shadow table-striped" style={{'cursor': 'pointer'}}>
                <thead>
                    <tr className='table-dark'>
                    <th scope="col"></th>
                    <th scope="col">NAME</th>
                    <th scope="col">QUANTITY</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map((product,index)=>(
                        <tr className='table-light' >
                        <th scope="row" key={index}>{index+1}</th>
                        <td>{product.product_name}</td>
                        <td>{product.quantity}</td>
                        </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    </div>
  )
}