import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Get from '../service/Get'
import { REGIMEN_FISCAL_GET } from '../service/Routes'
import { Button } from 'react-bootstrap'
import { FiEdit } from 'react-icons/fi'
import TableSkeleton from '../loaders/TableSkeleton'
import TableData from '../components/TableData'

export default function RegimenFiscalList({auth,handleIsEditing,path}){
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    let history = useHistory()

    useEffect(()=>{       
        DataList()                
    }, [])

    const DataList = () =>{
        setIsLoading(true)
        Get({url: REGIMEN_FISCAL_GET, access_token: auth.data.access_token})
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
            dataField: 'clave',
            text: 'Clave',
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
            {
                isLoading
                ? <TableSkeleton />
                : <TableData columns={columns} products={items} />
            }
        </div>        
    )
}