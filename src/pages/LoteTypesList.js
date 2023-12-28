import React, { useEffect, useState } from 'react'
import { LOTE_GET, LOTE_DELETE } from '../service/Routes'
import { loaderRequest } from '../loaders/LoaderRequest'
import TableSkeleton from '../loaders/TableSkeleton'
import TableData from '../components/TableData'
import { toast } from 'react-toastify'
import Delete from '../service/Delete'
import { Button } from 'react-bootstrap'
import { RiDeleteBinLine } from 'react-icons/ri'
import { FiEdit } from 'react-icons/fi'
import Get from '../service/Get'
import { useHistory } from 'react-router-dom'
import { IsAdministrador } from '../security/IsAdministrador'
import { IsDirector } from '../security/IsDirector'
import { labelLote } from '../constant/token'

export default function LoteTypesList({url, auth,handleIsEditing, type_lote}){
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [isDeleteId, setIsDeleteId] = useState(false)
    let history = useHistory()

    useEffect(()=>{       
        DataList()                
    }, [])

    const DataList = () =>{
        setIsLoading(true)
        Get({url: `${LOTE_GET}/${type_lote}`, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setIsLoading(false)
            setItems(response.data)
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
                    <Button size="sm" variant="outline-danger" className="btn-xs" onClick={e => deleteItem(row)}>
                        <RiDeleteBinLine  /></Button>
                } */}
                <Button size="sm" variant="outline-secondary" className="btn-xs" onClick={e => editItem(row)} ><FiEdit /></Button>
            </div>
        );
    }
    const deleteItem = (data) => {      
        setIsDeleteId(true)
        Delete({url: `${LOTE_DELETE}/${data.id}`, access_token: auth.data.access_token})
        .then(response=>{            
            setIsDeleteId(false)            
            toast.success("Acción exitosa",{ autoClose: 2000 })
            DataList()
        })
        .catch(error=>{
            // console.log('error')
            // console.log(error)
            toast.error("No se puede ejecutar la acción. Intente más tarde",{ autoClose: 3000 })
        })
        
    }
    const editItem = (data) => {
        handleIsEditing(true)
        history.push(`${url}/value?id=${data.id}`)
    }

    const formatDireccion = (cell) => {
        const newString = cell.replace('Lote:', `${labelLote}:`)
        return newString;
    }

    const columns = [
        {
            dataField: 'id',
            headerStyle: { width: '0px' },
            text: 'ID',
            hidden: true
        }, 
        {
            dataField: 'referencia',
            text: 'Referencia',
            headerStyle: { 
                width: '15%' ,
            },  
        },
        {
            dataField: 'residente_name',
            text: 'Asociado',
            headerStyle: { 
                width: '20%' ,
            },
        },
        {
            dataField: 'direccion',
            text: 'Dirección',
            formatter: formatDireccion
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
    ];
    return (
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