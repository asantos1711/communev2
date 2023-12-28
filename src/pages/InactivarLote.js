import React, { useContext, useState } from "react";
import { Button, Card, Col, Dropdown, Form, Row } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import SelectAjax from "../components/SelectAjax";
import { authContext } from "../context/AuthContext";
import { loaderRequest } from "../loaders/LoaderRequest";
import Get from "../service/Get";
import { ACTIVAR_LOTE, INACTIVAR_LOTE, LOTE_FOR_VEHICLES } from "../service/Routes";

export default function InactivarLote(){
    const [lote, setLote] = useState(null)
    const [submiting, setSubmiting] = useState(false)
    const {auth} = useContext(authContext)

    const inactivarLote = e =>{
        setSubmiting(true)
        Get({url: `${INACTIVAR_LOTE}/${lote.value}`, access_token: auth.data.access_token})
        .then(response=>{
            setSubmiting(false)
            toast.success("Acción exitosa", {autoClose: 3000})
            setLote(null)
        })
        .catch(error=>{
            setSubmiting(false)
            toast.error("Ocurrió un error. Contacte con el administrador", {autoClose: 5000})
        })
    }

    const activarLote = e =>{
        setSubmiting(true)
        Get({url: `${ACTIVAR_LOTE}/${lote.value}`, access_token: auth.data.access_token})
        .then(response=>{
            setSubmiting(false)
            toast.success("Acción exitosa", {autoClose: 3000})
            setLote(null)
        })
        .catch(error=>{
            setSubmiting(false)
            toast.error("Ocurrió un error. Contacte con el administrador", {autoClose: 5000})
        })
    }

    return(
        <Card className="shadow mb-5">
            {submiting && loaderRequest()}
            <Card.Body>
                <ToastContainer />
                <Card.Title>Inactivar/Activar lote</Card.Title>
                <Dropdown.Divider />
                <Row>
                    <Col xs="12" md="6">
                        <Form.Group>
                            <Form.Label>Seleccionar lote</Form.Label>
                            <SelectAjax
                                defaultValue={false}
                                url={LOTE_FOR_VEHICLES}
                                access_token={auth.data.access_token}
                                isMulti={false}
                                handleChange={(value) => {
                                    setLote(value)
                                }} 
                                defaultOptions={lote}   
                                valid={true}     
                                isClearable={true}                                                 
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant="secondary" onClick={inactivarLote}>Inactivar lote</Button>{' '}
                        <Button variant="primary" onClick={activarLote}>Activar lote</Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}