import React from 'react'
import moment  from 'moment'
import { setBagdeStatus } from '../utils/setBagdeStatus'
import { formatNumber } from '../utils/formatNumber'
import { Card } from 'react-bootstrap'
import TableSearch from './TableSearch'
import { sumPagos } from '../utils/sumPagos'

export default function PagoList(props){
    const formatDate = (cell) => {
        return moment(cell).format("DD-MM-YYYY")
    }

    const getEstado = (cell) => {
        return <span className={`badge badge-pill ${setBagdeStatus(cell)}`}>{cell}</span>
    }

    const montoFormat = (cell) => {
        return  formatNumber(cell)
    }

    const column = [
        {
            dataField: 'id',
            headerStyle: { width: '0px' },
            text: 'ID',
            hidden: true
        },
        {
            dataField: 'fechaPago',
            text: 'Fecha pago',
            formatter: formatDate,
            headerStyle: { 
                width: '30%' ,
            },
        },
        {
            dataField: 'pagoStatus',
            text: 'Estado',
            formatter: getEstado,
            headerStyle: { 
                width: '30%' ,
                textAlign: 'center'
            },
            style: {
                textAlign: 'center'
            },
        },
        {
            dataField: 'pagado',
            text: 'Pagado',
            formatter: montoFormat,
            headerStyle: { 
                width: '30%' ,
            },
        }
    ]

    return(
        <Card className="shadow">
            <Card.Body>
                <Card.Title>
                    <div className="d-flex justify-content-between">
                        <span>Pagos</span>
                        <span>Total: {formatNumber(sumPagos(props.items))}</span>
                    </div>
                </Card.Title>
                <TableSearch columns={column} products={props.items}/>                              
            </Card.Body>
        </Card>        
    )
}