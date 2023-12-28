import React, { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import TableData from "../components/TableData"
import { loaderRequest } from "../loaders/LoaderRequest"
import TableSkeleton from "../loaders/TableSkeleton"
import Get from "../service/Get"
import { TIPO_MOTIVO_CANCELACION_GET } from "../service/Routes"
import { FiEdit } from 'react-icons/fi'

export default function TipoMotivoCancelacionList({auth,handleIsEditing,path}){
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [isDeleteId, setIsDeleteId] = useState(false)
    let history = useHistory()

    useEffect(()=>{       
        DataList()                
    }, [])

    const DataList = () =>{
        setIsLoading(true)
        Get({url: TIPO_MOTIVO_CANCELACION_GET, access_token: auth.data.access_token})
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
            dataField: 'descripcion',
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