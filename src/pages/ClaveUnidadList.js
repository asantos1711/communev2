import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Get from '../service/Get'
import { IsDirector } from '../security/IsDirector'
import { Button } from 'react-bootstrap'
import { IsAdministrador } from '../security/IsAdministrador'
import { RiDeleteBinLine } from 'react-icons/ri'
import { FiEdit } from 'react-icons/fi'
import Delete from '../service/Delete'
import { toast } from 'react-toastify'
import { CLAVE_UNIDAD_CFDI_DELETE,CLAVE_UNIDAD_CFDI_GET } from '../service/Routes'
import { loaderRequest } from '../loaders/LoaderRequest'
import TableSkeleton from '../loaders/TableSkeleton'
import TableData from '../components/TableData'

export default function ClaveUnidadList({auth,handleIsEditing,path}){
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [isDeleteId, setIsDeleteId] = useState(false)
    const history = useHistory()

    useEffect(()=>{       
        DataList()                
    }, [])

    const DataList = () =>{
        setIsLoading(true)
        Get({url: CLAVE_UNIDAD_CFDI_GET, access_token: auth.data.access_token})
        .then(response=>{    
            //console.log(response)        
            setItems(response.data)
            setIsLoading(false)
        })
        .catch(error=>{
            // console.log('error')
            // console.log(error)
        })
    }

    const actions = (cell, row, rowIndex) => {
        return (
            <div>
                {/* { (IsDirector(auth.data.role) || IsAdministrador(auth.data.role)) &&
                    <Button size="sm" variant="outline-danger" className="btn-xs" onClick={e => deleteItem(row)}><RiDeleteBinLine  /></Button>
                } */}
                <Button size="sm" variant="outline-secondary" className="btn-xs" onClick={e => editItem(row)} ><FiEdit /></Button>
            </div>
        );
    }

    const deleteItem = (data) => {      
        setIsDeleteId(true)
        Delete({url: `${CLAVE_UNIDAD_CFDI_DELETE}/${data.id}`, access_token: auth.data.access_token})
        .then(response=>{            
            setIsDeleteId(false) 
            if(!response.data.success){
                toast.info(response.data.message, {autoClose:10000})
            }else{          
                toast.success("Acción exitosa",{ autoClose: 2000 })
                DataList()
            }            
        })
        .catch(error=>{
            // console.log('error')
            // console.log(error)
            toast.error("No se puede ejecutar la acción. Intente más tarde",{ autoClose: 3000 })
        })        
    }
    const editItem = (data) => {
        handleIsEditing(true)
        history.push(`${path}/value?id=${data.id}`)
    }

    const columns = [
        {
            dataField: 'id',
            headerStyle: { width: '0px' },
            text: 'ID',
            hidden: true
        },
        {
            dataField: 'claveUnidad',
            text: 'Clave unidad',
            headerStyle:{
                width: '25%'
            }
        },
        {
            dataField: 'name',
            text: 'Descripción',
        },
        {
            dataField: '',
            isDummyField: true,
            text: '',
            headerAlign: 'center',
            align: 'center',
            headerStyle: { width: '10%' },
            formatter: actions,            
        }
    ]
    return(
        <div>
            {isDeleteId ? loaderRequest() : null}
            {
                isLoading
                ? <TableSkeleton />
                : <TableData columns={columns} products={items} />
            }
        </div>        
    )
}