import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Get from '../service/Get'
import { TIPO_COMPROBANTE_GET, BANCO_DELETE, TIPO_COMPROBANTE_DELETE } from '../service/Routes'
import { IsDirector } from '../security/IsDirector'
import { IsAdministrador } from '../security/IsAdministrador'
import { Button } from 'react-bootstrap'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBinLine } from 'react-icons/ri'
import Delete from '../service/Delete'
import { toast } from 'react-toastify'
import { loaderRequest } from '../loaders/LoaderRequest'
import TableSkeleton from '../loaders/TableSkeleton'
import TableData from '../components/TableData'

export default function TipoComprobanteList({auth,handleIsEditing,path}){
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [isDeleteId, setIsDeleteId] = useState(false)
    let history = useHistory()

    useEffect(()=>{       
        DataList()                
    }, [])

    const DataList = () =>{
        setIsLoading(true)
        Get({url: TIPO_COMPROBANTE_GET, access_token: auth.data.access_token})
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
        Delete({url: `${TIPO_COMPROBANTE_DELETE}/${data.id}`, access_token: auth.data.access_token})
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
            dataField: 'tipoComprobante',
            text: 'Tipo comprobante',
            headerStyle:{
                width: '15%'
            }
        },
        {
            dataField: 'name',
            text: 'Nombre',
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