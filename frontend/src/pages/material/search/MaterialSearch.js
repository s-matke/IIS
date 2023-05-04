import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function MaterialSearch() {

    const [materials,setMaterials]=useState([])
    const [filterData,setFilterData]=useState([])
    const[query,setQuery]=useState('')
    const navigate = useNavigate();
    
    useEffect(()=>{
        if (!localStorage.getItem('access-token')){
          navigate("/login")
        }
        loadMaterials(); 
    },[])

    const loadMaterials=async()=>{
        const result=await axios.get("http://localhost:8000/material/", {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access-token')
          }})
        setMaterials(result.data);
        setFilterData(result.data);
    }

    const handleSearch=(event)=>
    {
        const getSearch=event.target.value;
        setQuery(materials);
    
        if(getSearch.length>0)
        {
            const searchData=filterData.filter((item)=>item.name.toLowerCase().includes(getSearch.toLowerCase().trim()) || 
                                                    item.supplier.toLowerCase().includes(getSearch.toLowerCase().trim()) || 
                                                    item.description.toLowerCase().includes(getSearch.toLowerCase().trim()) ||
                                                    item.created.toString().toLowerCase().includes(getSearch.toLowerCase().trim()));
            setMaterials(searchData);
        }
        else
        {
            setMaterials(filterData);
        }
        setQuery(getSearch);
    }

  const handleRowClick = async (data) => {
    navigate('/', // update page TODO
    {
      state: {
        data
      }
    })
  }
  
  return (
    <div className='container'>
        <div className='py-4' style={{'width':'75%','margin-left':'280px'}}>
          <input type="text" name="name" value={query} className="form-control" onChange={(e)=>handleSearch(e)} placeholder="Search..."/><br/>
          <table className="table table-hover border rounded p-4 mt-2 shadow table-striped" style={{'cursor': 'pointer'}}>
            <thead>
              <tr className='table-dark'>
                <th scope="col"></th>
                <th scope="col">NAME</th>
                <th scope="col">PRICE</th>
                <th scope="col">SUPPLIER</th>
                <th scope="col">CREATED</th>
                <th scope="col">DESCRIPTION</th>
              </tr>
            </thead>
            <tbody>
              {
                  materials.map((material,index)=>(
                  <tr className='table-light' onClick={() => handleRowClick(material)}>
                  <th scope="row" key={index}>{index+1}</th>
                  <td>{material.name}</td>
                  <td>{material.price}</td>
                  <td>{material.supplier}</td>
                  <td>{material.created}</td>
                  <td>{material.description}</td>
                  </tr>
                  ))
              }
            </tbody>
          </table>
          <p style={{'margin-left':'745px', 'margin-top':'20px'}}>Click on row to select the material</p>
        </div>
    </div>
  )
}