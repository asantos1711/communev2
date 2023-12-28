import React, { useContext, useEffect, useState } from 'react';
import { authContext } from '../context/AuthContext';
import Get from '../service/Get';
import * as Yup from 'yup';
import { CLAVE_PRODUCCION_SERVICIO_CFDI_GET, CLAVE_UNIDAD_CFDI_GET, FORMA_PAGO_CFDI_GET, METODO_PAGO_CFI_GET, RECEPTOR_DATOS_FISCALES_GET_BY_DEFAULT, RECEPTOR_DATOS_FISCALES_SAVE, REGIMEN_FISCAL_GET, TIPO_DOCUMENTO_GET, USO_CFDI_GET } from '../service/Routes';
import GetAll from '../service/GetAll';
import { Button, Card, Col, Dropdown, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Field, Formik } from 'formik';
import { loaderRequest } from '../loaders/LoaderRequest';
import Skeleton from 'react-loading-skeleton';
import Post from '../service/Post';
import { toast, ToastContainer } from 'react-toastify';

export default function ReceptorDatosFiscales(){
    const {auth} = useContext(authContext)
    const[isLoadEntity, setLoadEntity] = useState(true)
    const [metodoCFDIOpt, setMetodoCFDIOpt] = useState([])
    const [formaCFDIOpt, setFormCFDIOpt] = useState([])
    const [usoCFDIOpt, setUsoCFDIOpt] = useState([])
    const [tipoDocumentoOpt, setTipoDocumentoOpt] = useState([])
    const [claveUnidadOpt, setClaveUnidadOpt] = useState([])
    const [claveProdSOpt, setClaveProdSOpt] = useState([])
    const [regimenFiscalOpt, setRegimenFiscalOpt] = useState([])

    const [initialValues, setInitialValues] = useState({
        id: '', 
        rfc: '',
        metodoPagoCFDI: '',
        formaPagoCFDI: '',
        usoCFDI: '',
        tipoDocumento: '',
        claveUnidadCFDI: '',
        claveProductoServicio : '',
        regimenFiscal: ''
    })

    useEffect(()=>{
        setLoadEntity(true)
            Get({url: `${RECEPTOR_DATOS_FISCALES_GET_BY_DEFAULT}`, access_token: auth.data.access_token})
            .then(response=>{
                //console.log(response)
                if(response.data.data.id!=null){
                    let entity ={
                        id: response.data.data.id,
                        rfc: response.data.data.rfc,                       
                        metodoPagoCFDI: response.data.data.metodoPagoCFDI.id,
                        formaPagoCFDI: response.data.data.formaPagoCFDI.id,
                        usoCFDI: response.data.data.usoCFDI.id,
                        tipoDocumento: response.data.data.tipoDocumento.id,
                        claveUnidadCFDI: response.data.data.claveUnidadCFDI.id,
                        claveProductoServicio: response.data.data.claveProductoServicio.id,
                        regimenFiscal: response.data.data.regimenFiscal.id,
                    }                
                    setInitialValues(entity)
                }                
                setLoadEntity(false)
            })
            .catch(error=>{
                //console.log(error)
            })
    },[])

    useEffect(()=>{
        //cargar todos los nomencladores
        const urls = [METODO_PAGO_CFI_GET, FORMA_PAGO_CFDI_GET,USO_CFDI_GET, TIPO_DOCUMENTO_GET, CLAVE_UNIDAD_CFDI_GET, CLAVE_PRODUCCION_SERVICIO_CFDI_GET, REGIMEN_FISCAL_GET]
        GetAll({urls:urls, access_token: auth.data.access_token})
        .then(response=>{
            setMetodoCFDIOpt(response[0].data)
            setFormCFDIOpt(response[1].data)
            setUsoCFDIOpt(response[2].data)
            setTipoDocumentoOpt(response[3].data)
            setClaveUnidadOpt(response[4].data)
            setClaveProdSOpt(response[5].data)
            setRegimenFiscalOpt(response[6].data)
        })        
    },[])

    const shemaValidate = Yup.object().shape({
        rfc: Yup.string()
            .required('Campo Requerido'),
        metodoPagoCFDI: Yup.string()
            .required('Campo Requerido'),
        formaPagoCFDI: Yup.string()
            .required('Campo Requerido'),
        usoCFDI: Yup.string()
            .required('Campo Requerido'),
        tipoDocumento: Yup.string()
            .required('Campo Requerido'),
        claveUnidadCFDI: Yup.string()
            .required('Campo Requerido'),
        claveProductoServicio: Yup.string()
            .required('Campo Requerido'), 
        regimenFiscal: Yup.string()
            .required('Campo Requerido'),        
    });
    return (
        <div>
            <ToastContainer />
            {
                isLoadEntity
                ? <Skeleton height={300}/>
                : 
                <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, { setSubmitting, setFieldValue,setFieldError }) => {   
                        const d ={
                            rfc: values.rfc,
                            metodoPagoCFDI: {id: values.metodoPagoCFDI},
                            formaPagoCFDI: {id: values.formaPagoCFDI},
                            usoCFDI: {id: values.usoCFDI},
                            tipoDocumento: {id: values.tipoDocumento},
                            claveUnidadCFDI: {id: values.claveUnidadCFDI},
                            claveProductoServicio: {id: values.claveProductoServicio},
                            regimenFiscal: {id: values.regimenFiscal}
                        }                        

                        Post({url: RECEPTOR_DATOS_FISCALES_SAVE, data: d,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            setFieldValue('id', response.data.data.id)
                            toast.success("Acción exitosa",{ autoClose: 2000 })
                        })
                        .catch(error=>{
                            setSubmitting(false)
                            //console.log(error)
                            toast.error("No se puede ejecutar la acción. Intente más tarde",{ autoClose: 3000 })
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
                    <Form className="mt-4 form" onSubmit={handleSubmit}>
                        {isSubmitting && loaderRequest()}
                        <input type="hidden" name="id" id="id" value={values.id} onChange={handleChange}  />
                        <Row>
                            <Col>
                                <Card className="shadow mb-4">
                                    <Card.Body>
                                        <Card.Title>Receptor a facturar por defecto</Card.Title>
                                        <Dropdown.Divider /> 
                                        <Row>
                                            <Col>
                                                <Row>                                                    
                                                    <Col xs lg="4">
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
                                                    <Col xs lg="8"></Col>
                                                    <Col xs lg="4">
                                                        <Form.Group>
                                                            <Form.Label>Método de pago CFDI</Form.Label>
                                                            <Field 
                                                                className={`${errors.metodoPagoCFDI && 'error'} form-control`}
                                                                as="select"
                                                                name="metodoPagoCFDI"
                                                            >
                                                                <option>Seleccionar opción</option>
                                                                {
                                                                    metodoCFDIOpt.map((item,i)=>(
                                                                        <option key={i} value={item.id}>{item.name}</option>
                                                                    ))
                                                                }
                                                            </Field>  
                                                            {errors.metodoPagoCFDI && <Form.Control.Feedback type="invalid" >{errors.metodoPagoCFDI}</Form.Control.Feedback>}                     
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs lg="4">
                                                        <Form.Group>
                                                            <Form.Label>Forma de pago CFDI</Form.Label>
                                                            <Field 
                                                                className={`${errors.formaPagoCFDI && 'error'} form-control`}
                                                                as="select"
                                                                name="formaPagoCFDI"
                                                            >
                                                                <option>Seleccionar opción</option>
                                                                {
                                                                    formaCFDIOpt.map((item,i)=>(
                                                                        <option key={i} value={item.id}>{item.name}</option>
                                                                    ))
                                                                }
                                                            </Field>  
                                                            {errors.formaPagoCFDI && <Form.Control.Feedback type="invalid" >{errors.formaPagoCFDI}</Form.Control.Feedback>}                                          
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs lg="4">
                                                        <Form.Group>
                                                            <Form.Label>Uso CFDI</Form.Label>
                                                            <Field 
                                                                className={`${errors.usoCFDI && 'error'} form-control`}
                                                                as="select"
                                                                name="usoCFDI"
                                                            >
                                                                <option>Seleccionar opción</option>
                                                                {
                                                                    usoCFDIOpt.map((item,i)=>(
                                                                        <option key={i} value={item.id}>{item.name}</option>
                                                                    ))
                                                                }
                                                            </Field>     
                                                            {errors.usoCFDI && <Form.Control.Feedback type="invalid" >{errors.usoCFDI}</Form.Control.Feedback>}                   
                                                        </Form.Group>
                                                    </Col> 
                                                    <Col xs lg="4">
                                                        <Form.Group>
                                                            <Form.Label>Tipo documento</Form.Label>
                                                            <Field 
                                                                className={`${errors.tipoDocumento && 'error'} form-control`}
                                                                as="select"
                                                                name="tipoDocumento"
                                                            >
                                                                <option>Seleccionar opción</option>
                                                                {
                                                                    tipoDocumentoOpt.map((item,i)=>(
                                                                        <option key={i} value={item.id}>{item.name}</option>
                                                                    ))
                                                                }
                                                            </Field> 
                                                            {errors.tipoDocumento && <Form.Control.Feedback type="invalid" >{errors.tipoDocumento}</Form.Control.Feedback>}                       
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs lg="4">
                                                        <Form.Group>
                                                            <Form.Label>Clave unidad CFDI</Form.Label>
                                                            <Field 
                                                                className={`${errors.claveUnidadCFDI && 'error'} form-control`}
                                                                as="select"
                                                                name="claveUnidadCFDI"
                                                            >
                                                                <option>Seleccionar opción</option>
                                                                {
                                                                    claveUnidadOpt.map((item,i)=>(
                                                                        <option key={i} value={item.id}>{item.name}</option>
                                                                    ))
                                                                }
                                                            </Field> 
                                                            {errors.claveUnidadCFDI && <Form.Control.Feedback type="invalid" >{errors.claveUnidadCFDI}</Form.Control.Feedback>}                      
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs lg="4">
                                                        <Form.Group>
                                                            <Form.Label>Clave producto servicio CFDI</Form.Label>
                                                            <Field 
                                                                className={`${errors.claveProductoServicio && 'error'} form-control`}
                                                                as="select"
                                                                name="claveProductoServicio"
                                                            >
                                                                <option>Seleccionar opción</option>
                                                                {
                                                                    claveProdSOpt.map((item,i)=>(
                                                                        <option key={i} value={item.id}>{item.name}</option>
                                                                    ))
                                                                }
                                                            </Field>    
                                                            {errors.claveProductoServicio && <Form.Control.Feedback type="invalid" >{errors.claveProductoServicio}</Form.Control.Feedback>}                   
                                                        </Form.Group>
                                                    </Col> 
                                                    <Col xs lg="4">
                                                        <Form.Group>
                                                            <Form.Label>Régimen Fiscal</Form.Label>
                                                            <Field 
                                                                className={`${errors.regimenFiscal && 'error'} form-control`}
                                                                as="select"
                                                                name="regimenFiscal"
                                                            >
                                                                <option value="">Seleccionar opción</option>
                                                                {
                                                                    regimenFiscalOpt.map((item,i)=>(
                                                                        <option key={i} value={item.id}>{`${item.clave} - ${item.name}`}</option>
                                                                    ))
                                                                }
                                                            </Field>    
                                                            {errors.regimenFiscal && <Form.Control.Feedback type="invalid" >{errors.regimenFiscal}</Form.Control.Feedback>}                   
                                                        </Form.Group>
                                                    </Col>                                                     
                                                </Row>
                                            </Col>
                                        </Row>
                                        
                                        <Row>
                                            <Col>
                                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                                <Link to="/admin" className="btn btn-secondary">Cancelar</Link>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>                                        
                            </Col>                                    
                        </Row>                       
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )
}