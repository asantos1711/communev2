import React, { useState } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import TableSkeleton from '../loaders/TableSkeleton'
import TableData from '../components/TableData'
import SelectAjax from '../components/SelectAjax'
import { LOTE_FOR_MORATORIOS, LOTE_GET_MTTO_FOR_LOTE } from '../service/Routes'
import Get from '../service/Get'
import { formatNumber } from '../utils/formatNumber'
import { setBagdeStatus } from '../utils/setBagdeStatus'
import moment from 'moment'
import { toast } from 'react-toastify'

export default function InteresesMoratoriosList({auth}){
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const numberFormatter = cell =>{
        return (<div>{formatNumber(cell)}</div>)
    }
    const getEstado = (cell) => {
        return <span className={`badge badge-pill ${setBagdeStatus(cell)}`}>{cell}</span>
    }
    const periodoFormatter = (cell) => {
        return moment(cell).format('MMMM-YYYY')
    }
    const corteFormatter = (cell, row) => {
        return moment(row.periodo).format('DD-MM-YYYY')
    }
    const columns = [
        {
            dataField: 'id',
            headerStyle: { width: '0px' },
            text: 'ID',
            hidden: true
        }, 
        {
            dataField: 'periodo',
            text: 'Período',
            formatter: periodoFormatter,
            headerStyle: { 
                width: '10%',
            },            
            
        },
        {
            dataField: 'concepto',
            text: 'Concepto',
            headerStyle: { 
                width: '35%',
            }
        },
        {
            dataField: 'periodo1',
            text: 'Fecha corte',
            formatter: corteFormatter,
            headerStyle: { 
                width: '10%',
                textAlign: 'center'
            },            
            align: 'center',
        },
        {
            dataField: 'costo',
            text: 'Total',
            formatter: numberFormatter,
            headerStyle: { 
                width: '10%',
                textAlign: 'center'
            },            
            align: 'center',
        },
        {
            dataField: 'pagado',
            text: 'Pagado',
            formatter: numberFormatter,
            headerStyle: { 
                width: '10%',
                textAlign: 'center'
            },            
            align: 'center',
        },
        {
            dataField: 'status',
            text: 'Estado',
            formatter: getEstado,
            headerStyle: { 
                width: '10%',
                textAlign: 'center'
            },            
            align: 'center',
        },
        {
            dataField: 'interesMoratorio',
            text: 'Interes moratorio',
            formatter: numberFormatter,
            headerStyle: { 
                width: '15%',
                textAlign: 'center'
            },            
            align: 'center',
        },
    ]

    const onChangeSelect = value =>{
        if(value!=null){
            setIsLoading(true)
            Get({url: `${LOTE_GET_MTTO_FOR_LOTE}/${value.value}`, access_token: auth.data.access_token})
            .then(response=>{
                //console.log(response)
                setItems(response.data.data)
                setIsLoading(false)
            })
            .catch(error=>{
                //console.log(error)
                toast.error("Ocurrió error en el servidor. Contacte con el administrador", {autoClose: 8000})
                setIsLoading(false)
            })
        }else{
            setItems([])
        }

        
    }


    return(
        <div>
            <Row className="mb-4">
                <Col>
                    <Form.Group>
                    <Form.Row>
                        <Form.Label column lg={3}>Referencia de lote</Form.Label>
                        <Col>
                        <SelectAjax 
                            defaultValue={false}
                            url={LOTE_FOR_MORATORIOS}
                            access_token={auth.data.access_token}
                            isMulti={false}
                            handleChange={(value) => onChangeSelect(value)} 
                            defaultOptions={false}   
                            valid={true}     
                            isClearable={true} 
                        />
                        </Col>
                    </Form.Row>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    {
                        isLoading
                        ? <TableSkeleton />
                        : <TableData columns={columns} products={items} />
                    }
                </Col>
            </Row>
        </div>
    )
}