import React, { useState, useContext, useEffect } from 'react'
import Get from '../service/Get';
import { EMISOR_GET_BY_DEFAULT, EMISOR_SAVE } from '../service/Routes';
import { authContext } from '../context/AuthContext';
import * as Yup from 'yup';
import Skeleton from 'react-loading-skeleton';
import { Formik, Field } from 'formik';
import { Form, Card, Dropdown, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Post from '../service/Post';
import { toast, ToastContainer } from 'react-toastify';
import { loaderRequest } from '../loaders/LoaderRequest';

export default function Emisor(){
    const {auth} = useContext(authContext)
    const[isLoadEntity, setLoadEntity] = useState(true)    

    const [initialValues, setInitialValues] = useState({
        id: '', 
        compania: '',
        direccion: '',
        numeroExt: '',
        colonia: '',
        ciudad: '',
        municipio: '',
        estado: '',
        pais: '',
        codigoPostal: '',
        rfc: '',
        email: '',
        regimenFiscal: '',
        serie: '',
        numeroAprobacion: '',
        anioAprobacion: '',
        numeroCertificado: '',
        contactoTipo: '',
        contactoNombre: '',
        contactoEmail: '',
        contactoTelefono : '',
        version: '4.0'
    })

    useEffect(()=>{
        setLoadEntity(true)
            Get({url: `${EMISOR_GET_BY_DEFAULT}`, access_token: auth.data.access_token})
            .then(response=>{
                //console.log(response)
                if(response.data.data.id!=null){
                    let entity ={
                        id: response.data.data.id,
                        compania: response.data.data.compania,
                        direccion: response.data.data.direccion,
                        numeroExt: response.data.data.numeroExt,
                        colonia: response.data.data.colonia,
                        ciudad: response.data.data.ciudad,
                        municipio: response.data.data.municipio,
                        estado: response.data.data.estado,
                        pais: response.data.data.pais,
                        codigoPostal: response.data.data.codigoPostal,
                        rfc: response.data.data.rfc,
                        regimenFiscal: response.data.data.regimenFiscal,
                        serie: response.data.data.serie,
                        numeroAprobacion: response.data.data.numeroAprobacion,
                        anioAprobacion: response.data.data.anioAprobacion,
                        numeroCertificado: response.data.data.numeroCertificado,
                        contactoTipo: response.data.data.contactoTipo,
                        contactoNombre: response.data.data.contactoNombre,
                        contactoEmail: response.data.data.contactoEmail,
                        contactoTelefono : response.data.data.contactoTelefono,
                        version: response.data.data.version ?? '4.0'
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
        compania: Yup.string()
            .required('Campo Requerido'),
        rfc: Yup.string()
            .required('Campo Requerido'),
        numeroCertificado: Yup.string()
            .required('Campo Requerido'),
        regimenFiscal: Yup.string()
            .required('Campo Requerido'),
        serie: Yup.string()
            .required('Campo Requerido'),
        numeroAprobacion: Yup.string()
            .required('Campo Requerido'),
        anioAprobacion: Yup.string()
            .required('Campo Requerido'),
        direccion: Yup.string()
            .required('Campo Requerido'),
        numeroExt: Yup.string()
            .required('Campo Requerido'),
        colonia: Yup.string()
            .required('Campo Requerido'),
        ciudad: Yup.string()
            .required('Campo Requerido'),
        municipio: Yup.string()
            .required('Campo Requerido'),
        estado: Yup.string()
            .required('Campo Requerido'),
        pais: Yup.string()
            .required('Campo Requerido'),
        codigoPostal: Yup.string()
            .required('Campo Requerido'),
        contactoTipo: Yup.string()
            .required('Campo Requerido'),
        contactoNombre: Yup.string()
            .required('Campo Requerido'),
        contactoEmail: Yup.string()
            .required('Campo Requerido'),
        contactoTelefono: Yup.string()
            .required('Campo Requerido'),
        version: Yup.string()
            .required('Campo Requerido'),
    });

    return(
        <Card>
            <ToastContainer />
            <Card.Body>
                <Card.Title>Datos del emisor</Card.Title>
                <Dropdown.Divider />
                <Row>
                    <Col>
                    {
                        isLoadEntity
                        ? <Skeleton height={300}/>
                        : <Formik
                            initialValues={initialValues}
                            validationSchema={shemaValidate}
                            onSubmit={(values, { setSubmitting, setFieldValue,setFieldError }) => { 
                                //console.log(values)  
                                Post({url: EMISOR_SAVE, data: values, access_token: auth.data.access_token, header: true})
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
                                {isSubmitting && loaderRequest()}
                                <input type="hidden" name="id" id="id" value={values.id} onChange={handleChange}  />
                                <Row className="mb-3">
                                    <Col xs="3" md="3">
                                        <Form.Group>
                                            <Form.Label>Razón social<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.compania && 'error'} form-control`}
                                                type="text"
                                                name="compania"
                                            />
                                            {errors.compania && <Form.Control.Feedback type="invalid" >{errors.compania}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col>
                                    <Col xs="3" md="3">
                                        <Form.Group>
                                            <Form.Label>RFC<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.rfc && 'error'} form-control`}
                                                type="text"
                                                name="rfc"
                                            />
                                            {errors.rfc && <Form.Control.Feedback type="invalid" >{errors.rfc}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col>
                                    <Col xs="3" md="3">
                                        <Form.Group>
                                            <Form.Label>No. certificado<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.numeroCertificado && 'error'} form-control`}
                                                type="text"
                                                name="numeroCertificado"
                                            />
                                            {errors.numeroCertificado && <Form.Control.Feedback type="invalid" >{errors.numeroCertificado}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col>
                                    <Col xs="3" md="3">
                                        <Form.Group>
                                            <Form.Label>Regimen fiscal<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.regimenFiscal && 'error'} form-control`}
                                                type="text"
                                                name="regimenFiscal"
                                            />
                                            {errors.regimenFiscal && <Form.Control.Feedback type="invalid" >{errors.regimenFiscal}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col>
                                    <Col xs="2" md="1">
                                        <Form.Group>
                                            <Form.Label>Serie<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.serie && 'error'} form-control`}
                                                type="text"
                                                name="serie"
                                            />
                                            {errors.serie && <Form.Control.Feedback type="invalid" >{errors.serie}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col>
                                    <Col xs="2" md="2">
                                        <Form.Group>
                                            <Form.Label>No. aprobación<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.numeroAprobacion && 'error'} form-control`}
                                                type="text"
                                                name="numeroAprobacion"
                                            />
                                            {errors.numeroAprobacion && <Form.Control.Feedback type="invalid" >{errors.numeroAprobacion}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col>
                                    <Col xs="2" md="2">
                                        <Form.Group>
                                            <Form.Label>Año aprobación<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.anioAprobacion && 'error'} form-control`}
                                                type="text"
                                                name="anioAprobacion"
                                            />
                                            {errors.anioAprobacion && <Form.Control.Feedback type="invalid" >{errors.anioAprobacion}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col>
                                    <Col xs="2" md="2">
                                        <Form.Group>
                                            <Form.Label>Versión<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.version && 'error'} form-control`}
                                                name="version"
                                            />
                                            {errors.version && <Form.Control.Feedback type="invalid" >{errors.version}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col xs="6" md="6">
                                        <Form.Group>
                                            <Form.Label>Dirección<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.direccion && 'error'} form-control`}
                                                type="text"
                                                name="direccion"
                                            />
                                            {errors.direccion && <Form.Control.Feedback type="invalid" >{errors.direccion}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col>
                                    <Col xs="2" md="2">
                                        <Form.Group>
                                            <Form.Label>No. exterior<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.numeroExt && 'error'} form-control`}
                                                type="text"
                                                name="numeroExt"
                                            />
                                            {errors.numeroExt && <Form.Control.Feedback type="invalid" >{errors.numeroExt}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col>
                                    <Col xs="3" md="3">
                                        <Form.Group>
                                            <Form.Label>Colonia<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.colonia && 'error'} form-control`}
                                                type="text"
                                                name="colonia"
                                            />
                                            {errors.colonia && <Form.Control.Feedback type="invalid" >{errors.colonia}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col>
                                    <Col xs="2" md="1">
                                        <Form.Group>
                                            <Form.Label>CP<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.codigoPostal && 'error'} form-control`}
                                                type="text"
                                                name="codigoPostal"
                                            />
                                            {errors.codigoPostal && <Form.Control.Feedback type="invalid" >{errors.codigoPostal}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col>
                                    <Col xs="3" md="3">
                                        <Form.Group>
                                            <Form.Label>Ciudad<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.ciudad && 'error'} form-control`}
                                                type="text"
                                                name="ciudad"
                                            />
                                            {errors.ciudad && <Form.Control.Feedback type="invalid" >{errors.ciudad}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col>
                                    <Col xs="3" md="3">
                                        <Form.Group>
                                            <Form.Label>Municipio<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.municipio && 'error'} form-control`}
                                                type="text"
                                                name="municipio"
                                            />
                                            {errors.municipio && <Form.Control.Feedback type="invalid" >{errors.municipio}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col>
                                    <Col xs="3" md="3">
                                        <Form.Group>
                                            <Form.Label>Estado<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.estado && 'error'} form-control`}
                                                type="text"
                                                name="estado"
                                            />
                                            {errors.estado && <Form.Control.Feedback type="invalid" >{errors.estado}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col>
                                    <Col xs="3" md="3">
                                        <Form.Group>
                                            <Form.Label>País<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.pais && 'error'} form-control`}
                                                type="text"
                                                name="pais"
                                            />
                                            {errors.pais && <Form.Control.Feedback type="invalid" >{errors.pais}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col>                                    
                                </Row>
                                <Row className="mb-1">
                                    <Col xs="3" md="3">
                                        <Form.Group>
                                            <Form.Label>Tipo contacto<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.contactoTipo && 'error'} form-control`}
                                                type="text"
                                                name="contactoTipo"
                                            />
                                            {errors.contactoTipo && <Form.Control.Feedback type="invalid" >{errors.contactoTipo}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col> 
                                    <Col xs="3" md="3">
                                        <Form.Group>
                                            <Form.Label>Nombre contacto<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.contactoNombre && 'error'} form-control`}
                                                type="text"
                                                name="contactoNombre"
                                            />
                                            {errors.contactoNombre && <Form.Control.Feedback type="invalid" >{errors.contactoNombre}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col> 
                                    <Col xs="3" md="3">
                                        <Form.Group>
                                            <Form.Label>Email contacto<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.contactoEmail && 'error'} form-control`}
                                                type="text"
                                                name="contactoEmail"
                                            />
                                            {errors.contactoEmail && <Form.Control.Feedback type="invalid" >{errors.contactoEmail}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col> 
                                    <Col xs="3" md="3">
                                        <Form.Group>
                                            <Form.Label>Telef. contacto<span className="text-danger">*</span></Form.Label>
                                            <Field 
                                                className={`${errors.contactoTelefono && 'error'} form-control`}
                                                type="text"
                                                name="contactoTelefono"
                                            />
                                            {errors.contactoTelefono && <Form.Control.Feedback type="invalid" >{errors.contactoTelefono}</Form.Control.Feedback>}                            
                                        </Form.Group>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col>
                                        <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                        <Link to="/admin" className="btn btn-secondary">Cancelar</Link>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                        </Formik>
                    }
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}