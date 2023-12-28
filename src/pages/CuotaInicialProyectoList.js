import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Link, useHistory } from 'react-router-dom';
import TableData from '../components/TableData';
import { loaderRequest } from '../loaders/LoaderRequest';
import TableSkeleton from '../loaders/TableSkeleton';
import Get from '../service/Get';
import { CARGO_CUOTA_INICIAL_PROYECTO_GET } from '../service/Routes';
import { formatNumber } from '../utils/formatNumber';
import { setBagdeStatus } from '../utils/setBagdeStatus';

function CuotaInicialProyectoList({auth,handleIsEditing,path}){
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [isDeleteId, setIsDeleteId] = useState(false)
    let history = useHistory()

    useEffect(()=>{       
        DataList()                
    }, [])

    const DataList = () =>{
        setIsLoading(true)
        Get({url: `${CARGO_CUOTA_INICIAL_PROYECTO_GET}`, access_token: auth.data.access_token})
        .then(response=>{
            console.log(response)
            setItems(response.data)
            setIsLoading(false)
        })
        .catch(error=>{
            // console.log('error')
            // console.log(error)
        })
    }
    const numberFormatter = cell =>{
        return (<div>{formatNumber(cell)}</div>)
    }    
    const actions = (cell, row) => {
        return (
            <div>
                {row.status !== 'pagado' && <Link to={`/pagar-cuota-inicial-proyecto/${row.id}`}>Pagar</Link>}
            </div>
        );
    }
    const statusFormatter = cell => {
        return <span className={`badge ${setBagdeStatus(cell)}`}>{cell}</span>
    }
    const columns = [
        {
            dataField: 'id',
            headerStyle: { width: '0px' },
            text: 'ID',
            hidden: true
        }, 
        {
            dataField: 'lote.referencia',
            text: 'Referencia'
        },
        {
            dataField: 'monto',
            text: 'Monto',
            formatter: numberFormatter
        },
        {
            dataField: 'status',
            text: 'Estado',
            formatter: statusFormatter
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

export default CuotaInicialProyectoList