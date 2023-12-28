import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { FiEdit } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { TIPOAMENIDAD_GET } from '../../../service/Routes'
import Get from '../../../service/Get'
import { loaderRequest } from '../../../loaders/LoaderRequest'
import TableSkeleton from '../../../loaders/TableSkeleton'
import TableData from '../../../components/TableData'

export default function TipoAmenidadList({auth,handleIsEditing,path}){
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [isDeleteId, setIsDeleteId] = useState(false)
    let history = useHistory()
    useEffect(()=>{       
        DataList()                
    }, [])

    const DataList = () =>{
        setIsLoading(true)
        Get({url: TIPOAMENIDAD_GET, access_token: auth.data.access_token})
        .then(response=>{           
            setItems(response.data)
            setIsLoading(false)
        })
        .catch(error=>{
            setIsLoading(false)
            toast.error("Ocurrió un error en el servidor. Intente otra vez", {autoClose:8000})
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
            dataField: 'name',
            text: 'Nombre',
        },
        {
            dataField: 'active',
            text: 'Activa',
            formatter: cell => cell ? 'Si' : 'No'
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