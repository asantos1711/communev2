import React, { useState, useEffect } from 'react'
import Get from '../service/Get'
import { CODIGO_AUTORIZACION_GET_BY_USER, CODIGO_AUTORIZACION_CHANGE_ACTIVE } from '../service/Routes'
import TableSkeleton from '../loaders/TableSkeleton'
import TableData from '../components/TableData'
import { Button, Form } from 'react-bootstrap'
import Post from '../service/Post'
import { toast } from 'react-toastify'
import { loaderRequest } from '../loaders/LoaderRequest'
import { useHistory } from 'react-router-dom'
import { FiEdit } from 'react-icons/fi'

export default function CodigoAutorizacionList({path, auth,handleIsEditing}){
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [isSubmiting, setSubmiting] = useState(false)
    const history = useHistory()

    useEffect(()=>{       
        DataList()                
    }, [])

    const DataList = () =>{
        setIsLoading(true)
        Get({url: CODIGO_AUTORIZACION_GET_BY_USER, access_token: auth.data.access_token})
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
    const onChangeActive = (checked, row) =>{
        setSubmiting(true)
        const d ={
            id: row.id,
            active: checked
        }

        Post({url: CODIGO_AUTORIZACION_CHANGE_ACTIVE, data: d, access_token: auth.data.access_token, header: true})
        .then(response=>{
            //console.log(response)
            setSubmiting(false)
            if(response.data){
                toast.success("Acción exitosa", {autoClose: 3000})
            }else{
                toast.info("No se puede realizar la acción. Intente más tarde", {autoClose: 3000})
            }      
        })
        .catch(error=>{
            toast.error("Ocurrió un error en el servidor. Contacte con el administrador", {autoClose: 8000})
            setSubmiting(false)
        })
    }
    const activeFormatter = (cell, row) => {
        return <Form.Check 
            type="switch"
            id={`custom-switch_${row.id}`}
            label="Activar o desactivar el código"
            defaultChecked={cell}
            value={cell}
            onChange={e => onChangeActive(e.target.checked, row)}
        />
    }
    const actions = (cell, row) => {
        return (
            <div>                
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
            dataField: 'codigo',
            text: 'Código',
        },
        {
            dataField: 'cantidad',
            text: 'Usos',
        },
        {
            dataField: 'active',
            text: 'Activo',
            formatter: activeFormatter
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
            {isSubmiting && loaderRequest()}
            {
                isLoading
                ? <TableSkeleton />
                : <TableData columns={columns} products={items} />
            }
        </div>        
    )
}