import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Get from '../service/Get'
import { TARJETA_ACCESO_GET, TARJETA_ACCESO_DELETE } from '../service/Routes'
import { Button } from 'react-bootstrap'
import { RiDeleteBinLine } from 'react-icons/ri'
import { FiEdit } from 'react-icons/fi'
import Delete from '../service/Delete'
import { toast } from 'react-toastify'
import { loaderRequest } from '../loaders/LoaderRequest'
import TableSkeleton from '../loaders/TableSkeleton'
import TableData from '../components/TableData'
import moment from 'moment'

export default function TarjetaAccesoList({auth,handleIsEditing,path}){
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [isDeleteId, setIsDeleteId] = useState(false)
    let history = useHistory()

    useEffect(()=>{       
        DataList()                
    }, [])

    const DataList = () =>{
        setIsLoading(true)
        Get({url: TARJETA_ACCESO_GET, access_token: auth.data.access_token})
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
                {/* <Button size="sm" variant="outline-danger" className="btn-xs" onClick={e => deleteItem(row)}><RiDeleteBinLine  /></Button> */}
                <Button size="sm" variant="outline-secondary" className="btn-xs" onClick={e => editItem(row)} ><FiEdit /></Button>
            </div>
        );
    }
    const deleteItem = (data) => {      
        setIsDeleteId(true)
        Delete({url: `${TARJETA_ACCESO_DELETE}/${data.id}`, access_token: auth.data.access_token})
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
        history.push(`${path}/value?id=${data.id}`)
    }

    const formatDate = (cell) => {
        return cell === null ? '' : moment(cell).format('DD-MM-YYYY')
    }

    const columns = [
        {
            dataField: 'id',
            headerStyle: { width: '0px' },
            text: 'ID',
            hidden: true
        }, 
        {
            dataField: 'numero',
            text: 'Número',
        },
        {
            dataField: 'vehiculo.placa',
            text: 'Placa vehículo',
        },
        {
            dataField: 'status',
            text: 'Estado',
        },
        {
            dataField: 'fechaBaja',
            text: 'Fecha baja',
            formatter: formatDate,
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