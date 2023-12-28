import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { FiEdit } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import TableSearch from '../../../components/TableSearch';
import { authContext } from '../../../context/AuthContext';
import Get from '../../../service/Get';
import { GET_AGENDA_BY_LOTE, LOTE_GET } from '../../../service/Routes';
import Select  from "react-select";

export default function VerAgenda(){
    const [lote, setLote] = useState('')
    const [lotesOpt, setLotesOpt] = useState([])
    const { auth } = useContext(authContext)
    const [items, setItems] = useState([])
    const [general, setGeneral] = useState(false)

    useEffect(() => {
        Get({url: `${LOTE_GET}/condominal`, access_token: auth.data.access_token})
        .then(response=>{
            setLotesOpt(response.data)
        })
        .catch(error=>{
            //console.log(error)
        })
    }, [])

    const buscarAgenda = () => {
        if(lote || general){
            Get({url: `${GET_AGENDA_BY_LOTE}/${lote ? lote?.value : 0}/${general}`, access_token: auth.data.access_token})
            .then(response=>{
                setItems(response.data.data)
            })
            .catch(error=>{
                //console.log(error)
            })
        }        
    }

    const actions = (cell, row, rowIndex) => {
        return (
            <div>
                <Link to={`/admin/editar-agenda/${row.id}`} className="btn btn-outline-secondary btn-xs"><FiEdit /></Link>
            </div>
        );
    }

    const columns = [
        {
            dataField: 'id',
            headerStyle: { width: '0px' },
            text: 'ID',
            hidden: true
        }, 
        {
            dataField: 'tipoAmenidad.name',
            text: 'Actividad',
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
        <Row className='mb-3'>            
            <Col xs="12" lg="12">
                <Card className="shadow">
                    <Card.Body>
                        <Row className='align-items-center justify-content-end'>
                            <Col xs="12" lg="1">
                                <Form.Label className='opacity-0 d-block'>Lote</Form.Label>
                                <Form.Check 
                                    type="checkbox"
                                    checked={general}
                                    onChange={e=>{
                                        if(e.target.checked){
                                            setLote(null)
                                        }
                                        setGeneral(e.target.checked)
                                    }}
                                    label="General"
                                />
                            </Col>
                            <Col xs="12" lg="4">
                                <Form.Group>
                                    <Form.Label>Lote</Form.Label>
                                    <Select 
                                        options={general ? [] : lotesOpt.map(item=>({label: `ref: ${item.referencia}. Propietario: ${item.residente_name}`, value: item.id}))} 
                                        isClearable
                                        value={lote}
                                        onChange={(value)=>{
                                            setLote(value)
                                        }}
                                        placeholder="Seleccionar opción"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs="12" lg="1">
                                <Form.Group>
                                    <Form.Label className='opacity-0 d-block'>Lote</Form.Label>
                                    <Button variant="primary" type="button" onClick={buscarAgenda}>Buscar</Button>
                                </Form.Group>                                
                            </Col>
                            <Col xs="12" lg="2">
                                <Form.Group>
                                    <Form.Label className='opacity-0 d-block'>Lote</Form.Label>
                                    <Link className='btn btn-outline-primary' to="/admin/crear-agenda">Crear agenda</Link>
                                </Form.Group>                                
                            </Col>
                        </Row>

                        <Row>
                            <Col xs="12" md="12">
                                <TableSearch columns={columns} products={items} />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}