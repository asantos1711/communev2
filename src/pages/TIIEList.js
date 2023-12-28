import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Get from '../service/Get'
import { TIIE_GET, TIIE_DELETE } from '../service/Routes'
import { Button } from 'react-bootstrap'
import Delete from '../service/Delete'
import { toast } from 'react-toastify'
import { RiDeleteBinLine } from 'react-icons/ri'
import { FiEdit } from 'react-icons/fi'
import NumberFormat from 'react-number-format'
import { loaderRequest } from '../loaders/LoaderRequest'
import TableSkeleton from '../loaders/TableSkeleton'
import TableData from '../components/TableData'
import { getMonthStr }  from '../utils/getMonthStr'

export default function TIIEList({auth,handleIsEditing,path}){
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [isDeleteId, setIsDeleteId] = useState(false)
    let history = useHistory()

    useEffect(()=>{       
        DataList()                
    }, [])

    const DataList = () =>{
        setIsLoading(true)
        Get({url: `${TIIE_GET}`, access_token: auth.data.access_token})
        .then(response=>{
            setItems(response.data)
            setIsLoading(false)
        })
        .catch(error=>{
            // console.log('error')
            // console.log(error)
        })
    }

    const actions = (cell, row) => {
        return (
            <div>
                {/* <Button size="sm" variant="outline-danger" className="btn-xs" onClick={e => deleteItem(row)}><RiDeleteBinLine  /></Button> */}
                <Button size="sm" variant="outline-secondary" className="btn-xs" onClick={e => editItem(row)} ><FiEdit /></Button>
            </div>
        );
    }
    const deleteItem = (data) => {      
        setIsDeleteId(true)
        Delete({url: `${TIIE_DELETE}/${data.id}`, access_token: auth.data.access_token})
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
    const periodoFormatter = (cell, row) =>{
        return `${getMonthStr(row.mes)}-${row.year}`
    }
    const porcentajeFormatter = cell =>{
        return <NumberFormat 
                    value={cell}
                    suffix="%"
                    displayType="text"
               />
    }
    const columns = [
        {
            dataField: 'id',
            headerStyle: { width: '0px' },
            text: 'ID',
            hidden: true
        }, 
        {
            dataField: 'mes',
            text: 'Período',
            formatter: periodoFormatter
        },
        {
            dataField: 'porcentaje',
            text: 'Porcentaje',
            formatter: porcentajeFormatter
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