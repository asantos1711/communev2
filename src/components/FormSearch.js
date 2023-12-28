import React, { useState } from 'react'
import { Container, Row, Col, Form, InputGroup, FormControl, Button, Modal } from 'react-bootstrap'
import { IoIosSearch } from "react-icons/io";
import { useHistory } from 'react-router-dom';
import { labelManzana } from '../constant/token';

export  default function FormSearch(){
    let history = useHistory()
    const [inputSearch, setInputSearch] = useState("")
    const [type, setType] = useState('Asociado')
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCheck = e =>{
        setType(e.target.value)
        setShow(false)
    }

    const Search = e =>{
        e.preventDefault()
        if(inputSearch!==""){
            history.push(`/search?q=${inputSearch}&type=${type}`)
        }        
    }

    return(
        <Container fluid className="mb-4">
            <Row className="justify-content-md-center">
                <Col xs lg="6">
                    <Form inline onSubmit={Search}>
                        <InputGroup className="w-100">
                            <InputGroup.Prepend>
                                <InputGroup.Text>{type}</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl 
                                placeholder="Buscar..." 
                                onChange={e => setInputSearch(e.target.value)}
                            />
                            <InputGroup.Append>
                                <Button variant="primary" type="submit"><IoIosSearch /></Button>
                            </InputGroup.Append>
                        </InputGroup>
                        <div className="w-100 text-right">
                        <Button type="button" variant="link" className="p-0" onClick={handleShow}>Avanzada</Button>
                        </div>                        
                    </Form>
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Filtrar por</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Form.Check inline label="Asociado" type="radio" name="type" value="Asociado" onChange={handleCheck} />
                            <Form.Check inline label="Referencia del lote" type="radio" name="type" value="Referencia" onChange={handleCheck} />
                            <Form.Check inline label={labelManzana} type="radio" name="type" value="Manzana" onChange={handleCheck} />
                            <Form.Check inline label="Calle" type="radio" name="type" value="Calle" onChange={handleCheck} />
                            <Form.Check inline label="Lote" type="radio" name="type" value="Lote" onChange={handleCheck} />
                        </Col>
                    </Row>
                </Modal.Body>                
            </Modal>
        </Container>
    )
}