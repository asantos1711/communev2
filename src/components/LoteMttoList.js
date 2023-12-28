import React from 'react'
import TableSearch from './TableSearch'
import { Card, DropdownButton, Dropdown, Form } from 'react-bootstrap'
import {getMonthStr} from '../utils/getMonthStr'
import { setBagdeStatus } from '../utils/setBagdeStatus'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { formatNumber } from '../utils/formatNumber'

export default function LoteMttoList(props){

    const getPeriodo = (cell, row) => {
        return `${getMonthStr(row.mes)} - ${row.year}`
    }

    const getEstado = (cell) => {
        return <span className={`badge badge-pill ${setBagdeStatus(cell)}`}>{cell}</span>
    }
    const montoFormat = (cell) => {
        return  formatNumber(cell)
    }
    const actions = (cell, row) => {
        return (
            <DropdownButton id="dropdown-table" alignRight title={<BsThreeDots />} size="sm" variant="light">
                <Dropdown.Item as="button"><Link className="dropdown-link" to={`/pago/mantenimiento/${row.id}`}>Ver detalle</Link></Dropdown.Item>
            </DropdownButton>
        );
    }
    
    const column = [
        {
            dataField: 'id',
            headerStyle: { width: '0px' },
            text: 'ID',
            hidden: true
        },
        {
            dataField: '',
            text: 'Período',
            formatter: getPeriodo,
            headerStyle: { 
                width: '30%' ,
            },
        },
        {
            dataField: 'status',
            text: 'Estado del pago',
            formatter: getEstado,
            headerStyle: { 
                width: '20%' ,
                textAlign: 'center'
            },
            style: {
                textAlign: 'center'
            },
        },
        {
            dataField: 'amount',
            text: 'Pagar',
            formatter: montoFormat,
            headerStyle: { 
                textAlign: 'center'
            },
            style: {
                textAlign: 'center'
            },
        },
        {
            dataField: 'E',
            isDummyField: true,
            text: '',
            headerAlign: 'center',
            align: 'center',
            headerStyle: { width: '10%' },
            formatter: actions,            
        }
    ]


    return(
        <Card className="shadow">
            <Card.Body>
                <Card.Title>
                    <div className="d-flex justify-content-between align-items-center">
                        <span>Mantenimientos</span>
                        {
                            props.status!=="disponible" && <small className="text-primary"><Form.Check type="checkbox" checked={props.checked} onChange={e=>props.handleShowDeudas(e)} label="Solo deudas" /></small>
                        }                        
                    </div> 
                </Card.Title>
                <TableSearch columns={column} products={props.mantenimientos}/>
            </Card.Body>
        </Card>        
    )
}