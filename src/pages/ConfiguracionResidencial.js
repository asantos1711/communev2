import React, { useContext, useEffect, useState } from "react"
import { authContext } from "../context/AuthContext"
import Get from "../service/Get"
import { RESIDENCIAL_GET_DEFAULT, RESIDENCIAL_SAVE } from "../service/Routes"
import * as Yup from 'yup';
import { Field, Formik } from "formik";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Post from "../service/Post";
import { toast, ToastContainer } from "react-toastify";
import Skeleton from "react-loading-skeleton";

export default function ConfiguracionResidencial(){
    const {auth} = useContext(authContext)
    const[isLoadEntity, setLoadEntity] = useState(true)

    const [initialValues, setInitialValues] = useState({
        id: '', 
        nombreCortoCR: '',
        codigoResidencialCR: '',
        codigoResidencialEntidadCR: '',
        codigoResidencialNombreCR: '',
        codigoWebTransferResidencialCR: '',
        codigoWebTransferCortoResidencialCR: '',
        nombreResidencial: '',        
        residencial: ''
    })

    useEffect(()=>{
        setLoadEntity(true)
            Get({url: `${RESIDENCIAL_GET_DEFAULT}`, access_token: auth.data.access_token})
            .then(response=>{
                //console.log(response)
                if(response.data.data.id!=null){
                    let entity ={
                        id: response.data.data.id,
                        nombreCortoCR: response.data.data.nombreCortoCR,
                        codigoResidencialCR: response.data.data.codigoResidencialCR,
                        codigoResidencialEntidadCR: response.data.data.codigoResidencialEntidadCR,
                        codigoResidencialNombreCR: response.data.data.codigoResidencialNombreCR,
                        codigoWebTransferResidencialCR: response.data.data.codigoWebTransferResidencialCR,
                        codigoWebTransferCortoResidencialCR: response.data.data.codigoWebTransferCortoResidencialCR,
                        nombreResidencial: response.data.data.nombreResidencial,                        
                        residencial: response.data.data.residencial
                    }                
                    setInitialValues(entity)
                }                
                setLoadEntity(false)
            })
            .catch(error=>{
                //console.log(error)
            })
    },[])
    const shemaValidate = Yup.object().shape({
        nombreCortoCR: Yup.string()
            .required('Campo Requerido'),
        codigoResidencialCR: Yup.string()
            .required('Campo Requerido'),
        codigoResidencialEntidadCR: Yup.string()
            .required('Campo Requerido'),
        codigoResidencialNombreCR: Yup.string()
            .required('Campo Requerido'),
        codigoWebTransferResidencialCR: Yup.string()
            .required('Campo Requerido'),
        codigoWebTransferCortoResidencialCR: Yup.string()
            .required('Campo Requerido'),
        nombreResidencial: Yup.string()
            .required('Campo Requerido'),        
        residencial: Yup.string()
            .required('Campo Requerido')
    });

    return (
        <>
            {
                isLoadEntity ?
                <Skeleton height={300}/>:
                <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, { setSubmitting, setFieldValue,setFieldError }) => { 
                        //console.log(values)     
                        Post({url: RESIDENCIAL_SAVE, data: values, access_token: auth.data.access_token, header: true})
                        .then(response=>{
                            //console.log(response)
                            toast.success("Acción exitosa", {autoClose: 3000})
                            setFieldValue('id', response.data.data.id)   
                            setSubmitting(false)                                 
                        })
                        .catch(error=>{
                            toast.error("Ocurrió un error en el servidor. Intente más tarde o contacte con el administrador", {autoClose: 8000})
                            setSubmitting(false)
                        })                                                             
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue
                    }) => (
                        <Form onSubmit={handleSubmit}>
                            <ToastContainer />
                            <Row>
                                <Col xs="12" md="6">
                                    <Card className="shadow-sm">
                                        <Card.Body>
                                            <Row>
                                                <Col xs="12" md="8">
                                                    <Form.Group>
                                                        <Form.Label>Nombre fiscal</Form.Label>
                                                        <Field
                                                            className={`form-control ${errors.nombreResidencial && 'error'}`} 
                                                            name="nombreResidencial"
                                                            type="text"
                                                        />
                                                        {errors.nombreResidencial && <Form.Control.Feedback type="invalid" >{errors.nombreResidencial}</Form.Control.Feedback>}                            
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <Form.Group>
                                                        <Form.Label>Residencial</Form.Label>
                                                        <Field
                                                            className={`form-control ${errors.residencial && 'error'}`} 
                                                            name="residencial"
                                                            as="select"
                                                        >
                                                            <option value="">Seleccionar</option>
                                                            <option value="RIO">RESIDENCIAL RIO</option>
                                                            <option value="CHETUMAL">RESIDENCIAL CUMBRES CHETUMAL</option>
                                                            <option value="PALMARIS">RESIDENCIAL PALMARIS</option>
                                                            <option value="CUMBRES">CUMBRES MEMBERS RESORTS</option>
                                                            <option value="AQUA">AQUA COMMUNITY DE CANCUN</option>
                                                            <option value="ARBOLADA">RESIDENCIAL ARBOLADA CANCUN</option>
                                                            <option value="VIACUMBRES">RESIDENCIAL VIA CUMBRES</option>
                                                        </Field>
                                                        {errors.residencial && <Form.Control.Feedback type="invalid" >{errors.residencial}</Form.Control.Feedback>}                            
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs="12" md="6">
                                    <Card className="shadow-sm">
                                        <Card.Body>
                                            <h6 className="mb-3">Configuración para cargos recurrentes</h6>
                                            <Row>
                                                <Col xs="12" md="4">
                                                    <Form.Group>
                                                        <Form.Label>Nombre corto</Form.Label>
                                                        <Field
                                                            className={`form-control ${errors.nombreCortoCR && 'error'}`} 
                                                            name="nombreCortoCR"
                                                            type="text"
                                                        />
                                                        {errors.nombreCortoCR && <Form.Control.Feedback type="invalid" >{errors.nombreCortoCR}</Form.Control.Feedback>}                            
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <Form.Group>
                                                        <Form.Label>Código residencial</Form.Label>
                                                        <Field
                                                            className={`form-control ${errors.codigoResidencialCR && 'error'}`} 
                                                            name="codigoResidencialCR"
                                                            type="text"
                                                        />
                                                        {errors.codigoResidencialCR && <Form.Control.Feedback type="invalid" >{errors.codigoResidencialCR}</Form.Control.Feedback>}                            
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <Form.Group>
                                                        <Form.Label>Código entidad</Form.Label>
                                                        <Field
                                                            className={`form-control ${errors.codigoResidencialEntidadCR && 'error'}`} 
                                                            name="codigoResidencialEntidadCR"
                                                            type="text"
                                                        />
                                                        {errors.codigoResidencialEntidadCR && <Form.Control.Feedback type="invalid" >{errors.codigoResidencialEntidadCR}</Form.Control.Feedback>}                            
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="12" md="6">
                                                    <Form.Group>
                                                        <Form.Label>Código por nombre</Form.Label>
                                                        <Field
                                                            className={`form-control ${errors.codigoResidencialNombreCR && 'error'}`} 
                                                            name="codigoResidencialNombreCR"
                                                            type="text"
                                                        />
                                                        {errors.codigoResidencialNombreCR && <Form.Control.Feedback type="invalid" >{errors.codigoResidencialNombreCR}</Form.Control.Feedback>}                            
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="12" md="6">
                                                    <Form.Group>
                                                        <Form.Label>Código WT corto</Form.Label>
                                                        <Field
                                                            className={`form-control ${errors.codigoWebTransferCortoResidencialCR && 'error'}`} 
                                                            name="codigoWebTransferCortoResidencialCR"
                                                            type="text"
                                                        />
                                                        {errors.codigoWebTransferCortoResidencialCR && <Form.Control.Feedback type="invalid" >{errors.codigoWebTransferCortoResidencialCR}</Form.Control.Feedback>}                            
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="12" md="12">
                                                    <Form.Group>
                                                        <Form.Label>Código WT residencial</Form.Label>
                                                        <Field
                                                            className={`form-control ${errors.codigoWebTransferResidencialCR && 'error'}`} 
                                                            name="codigoWebTransferResidencialCR"
                                                            type="text"
                                                        />
                                                        {errors.codigoWebTransferResidencialCR && <Form.Control.Feedback type="invalid" >{errors.codigoWebTransferResidencialCR}</Form.Control.Feedback>}                            
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            <Row className="my-3">
                                <Col>
                                    <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                    <Link to="/admin" className="btn btn-secondary">Cancelar</Link>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>                
            }            
        </>
    )
}