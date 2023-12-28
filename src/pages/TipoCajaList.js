import React, { useEffect } from "react"
import { useState } from "react"
import { Button } from "react-bootstrap"
import { FiEdit } from "react-icons/fi"
import { useHistory } from "react-router-dom"
import TableData from "../components/TableData"
import { loaderRequest } from "../loaders/LoaderRequest"
import TableSkeleton from "../loaders/TableSkeleton"
import Get from "../service/Get"
import { CAJA_GET } from "../service/Routes"

export default function TipoCajaList({url, auth,handleIsEditing}){
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [isDeleteId, setIsDeleteId] = useState(false)
    let history = useHistory()

    useEffect(() => {
        setIsLoading(true)
        Get({url: `${CAJA_GET}`, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setItems(response.data)
            setIsLoading(false)            
        })
        .catch(error=>{
            // console.log('error')
            // console.log(error)
        })
    }, [])


    const actions = (cell, row, rowIndex) => {
        return (
            <div>
                {/* <Button size="sm" variant="outline-danger" className="btn-xs" onClick={e => deleteItem(row)}><RiDeleteBinLine  /></Button> */}
                <Button size="sm" variant="outline-secondary" className="btn-xs" onClick={e => editItem(row)} ><FiEdit /></Button>
            </div>
        );
    }

    const editItem = (data) => {
        handleIsEditing(true)
        history.push(`${url}/value?id=${data.id}`)
    }

    const columns = [
        {
            dataField: 'id',
            text: 'ID',
            hidden: true
        }, 
        {
            dataField: 'name',
            text: 'Nombre',
        },
        {
            dataField: 'noCuenta',
            text: 'No. Cuenta'
        },
        {
            dataField: 'noConvenio',
            text: 'No. Convenio'
        },
        {
            dataField: 'noCLABE',
            text: 'No. CLABE'
        },
        {
            dataField: 'banco.name',
            text: 'Banco'
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