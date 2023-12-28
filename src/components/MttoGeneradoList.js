import React from 'react'
import { DropdownButton, Dropdown } from 'react-bootstrap';
import TableSearch from './TableSearch';
import { BsThreeDots } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { setBagdeStatus } from '../utils/setBagdeStatus';
import moment from 'moment'

export default function MttoGeneradoList({items}){
    const actions = (cell, row) => {
        return (
            <div>
                <DropdownButton  variant="light" id="dropdown-table" title={<BsThreeDots />} size="sm">
                    <Dropdown.Item as="button"><Link className="dropdown-link" to={`/mantenimiento/pagar/lote/${row.id}`}>Pagar</Link></Dropdown.Item>
                </DropdownButton>
            </div>
        );
    }

    const statusFormatter = cell => {
        return <span className={`badge ${setBagdeStatus(cell)}`}>{cell}</span>
    }
    const fechaFormatter = cell => {
        return moment(cell).format("DD-MM-YYYY")
    }

    const column = [
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
                width: '10%' 
            },
        },
        {
            dataField: 'asociado',
            text: 'Asociado',
            headerStyle: { 
                width: '15%' 
            },
        },
        {
            dataField: 'direccion',
            text: 'Dirección',
            headerStyle: { 
                width: '40%' 
            },
        },
        {
            dataField: 'fecha_corte',
            text: 'Fecha corte',
            headerStyle: { 
                width: '10%',
                textAlign: 'center'
            },
            align: 'center',
            formatter: fechaFormatter,
        },
        {
            dataField: 'pago_status',
            text: 'Estado pago',
            headerStyle: { 
                width: '15%',
                textAlign: 'center'
            },            
            align: 'center',
            formatter: statusFormatter,
        },
        {
            dataField: '',
            isDummyField: true,
            text: '',
            headerAlign: 'center',
            align: 'center',
            headerStyle: { 
                width: '10%' 
            },
            formatter: actions,          
        }
    ]

    return(
        <TableSearch columns={column} products={items}/>
    )

}