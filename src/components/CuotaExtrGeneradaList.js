import React from 'react'
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsThreeDots } from 'react-icons/bs';
import { setBagdeStatus } from '../utils/setBagdeStatus';
import TableSearch from './TableSearch';
import { formatNumber } from '../utils/formatNumber';

export default function CuotaExtrGeneradaList({items}){
    const actions = (cell, row) => {
        return (
            <div>
                <DropdownButton  variant="light" id="dropdown-table" title={<BsThreeDots />} size="sm">
                    <Dropdown.Item as="button"><Link className="dropdown-link" to="/">Pagar</Link></Dropdown.Item>
                </DropdownButton>
            </div>
        );
    }
    const statusFormatter = cell => {
        return <span className={`badge ${setBagdeStatus(cell)}`}>{cell}</span>
    }
    const numberFormatter = cell => {
        return <span>{formatNumber(cell)}</span>
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
                width: '45%' 
            },
        },
        {
            dataField: 'monto',
            text: 'Monto',
            headerStyle: { 
                width: '15%',
                textAlign: 'center'
            },            
            align: 'center',
            formatter: numberFormatter,
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