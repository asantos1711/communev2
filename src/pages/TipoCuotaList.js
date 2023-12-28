import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';
import NumberFormat from 'react-number-format';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import TableData from '../components/TableData';
import { loaderRequest } from '../loaders/LoaderRequest';
import TableSkeleton from '../loaders/TableSkeleton';
import Delete from '../service/Delete';
import Get from '../service/Get';
import { TIPO_CUOTA_DELETE, TIPO_CUOTA_GET } from '../service/Routes';


export default function TipoCuotaList({url, auth,handleIsEditing}){
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [isDeleteId, setIsDeleteId] = useState(false)
    let history = useHistory()

    useEffect(()=>{       
        DataList()                
    }, [])

    const DataList = () =>{
        setIsLoading(true)
        Get({url: `${TIPO_CUOTA_GET}`, access_token: auth.data.access_token})
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
                <Button size="sm" variant="outline-secondary" className="btn-xs" onClick={e => editItem(row)} ><FiEdit /></Button>
            </div>
        );
    }
    const changeStatus = (row, cell) =>{
        setIsDeleteId(true)
        Delete({url: `${TIPO_CUOTA_DELETE}/${row.id}`, access_token: auth.data.access_token})
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
    const numberFormatter = cell =>{
        return(
            <NumberFormat value={cell} displayType={'text'} prefix={'$'} decimalScale={2} fixedDecimalScale={true} />
        )
    }
    const activeFormatter = (cell, row) =>{
        return(
            <Form.Check 
                type="switch"
                id={`${row.id}_custom-switch`}
                label=""
                defaultChecked={cell}
                onChange={e=>changeStatus(row, e.target.checked)}
            />
        )
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
            dataField: 'monto',
            text: 'Monto',
            formatter: numberFormatter
        },
        {
            dataField: 'active',
            headerStyle: { 
                width: '15%',
                textAlign: 'center'
            },
            style: {
                textAlign: 'center'
            },            
            text: 'Habilitar/Deshabilitar',
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