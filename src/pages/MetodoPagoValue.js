import React, { useState, useEffect } from 'react'
import useQuery from '../hook/useQuery'
import { useHistory, Link } from 'react-router-dom'
import { METODO_PAGO_GET_BY_ID, METODO_PAGO_SAVE, FORMA_PAGO_CFDI_GET } from '../service/Routes'
import * as Yup from 'yup';
import Skeleton from 'react-loading-skeleton'
import { Formik, Field } from 'formik'
import Post from '../service/Post'
import { toast } from 'react-toastify'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { loaderRequest } from '../loaders/LoaderRequest'
import GetAll from '../service/GetAll'
import Get from '../service/Get';

export default function MetodoPagoValue({auth,isEditing}){
    const[isLoadEntity, setLoadEntity] = useState(true)
    const query = useQuery()
    let idEntity = query.get('id')
    let history = useHistory()
    const [initialValues, setInitialValues] = useState({
        id: '', 
        name: '',
        formaPagoCFDI: ''
    })
    const [formaPagoOpt, setFormaPagoOpt] = useState('')
    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            const urls = [`${METODO_PAGO_GET_BY_ID}/${idEntity}`, FORMA_PAGO_CFDI_GET]
            GetAll({urls: urls, access_token: auth.data.access_token})            
            .then(response=>{     
                //console.log(response[1].data)    
                let entity ={
                    id: response[0].data.data.id,
                    name: response[0].data.data.name,
                    formaPagoCFDI: response[0].data.data.formaPagoCFDI === null ? '' : response[0].data.data.formaPagoCFDI.id
                }
                setFormaPagoOpt(response[1].data)
                setInitialValues(entity)
                setLoadEntity(false)
            })
            .catch(error=>{
                // console.log("error")
                // console.log(error)
            })
        }else{
            setLoadEntity(true)
            Get({url: FORMA_PAGO_CFDI_GET,access_token: auth.data.access_token})
            .then(response=>{
                setFormaPagoOpt(response.data)
                setLoadEntity(false)
            })
            .catch(error=>{
                // console.log(error)
            })
        }   
    }, [idEntity ,auth.data.access_token])
    const shemaValidate = Yup.object().shape({
        name: Yup.string()
            .required('Campo Requerido'),
        formaPagoCFDI: Yup.string()
            .required('Campo Requerido'),
    });
    return (
        <div>
            {
                isLoadEntity
                ? <Skeleton  height={45}/>
                : 
                <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, { setSubmitting, setFieldValue }) => {   
                        values['formaPagoCFDI'] = {id: values.formaPagoCFDI}                     
                        Post({url: METODO_PAGO_SAVE, data: values,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            toast.success("Acción exitosa",{ autoClose: 2000 })
                            history.push("/catalogos/metodo-pago")
                        })
                        .catch(error=>{
                            setSubmitting(false)
                            // console.log(error)
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
                            <Col xs="6" lg="6">
                                <Form.Group>
                                    <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.name && 'error'} form-control`}
                                        name="name" 
                                    />
                                    {errors.name && <Form.Control.Feedback type="invalid" >{errors.name}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col> 
                            <Col xs="6" lg="6">
                                <Form.Group>                                    
                                    <Form.Label>Forma pago CFDI <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.formaPagoCFDI && 'error'} form-control`}
                                        name="formaPagoCFDI" 
                                        as="select"
                                    >
                                        <option value="">Seleccionar opción</option>
                                        {
                                            formaPagoOpt.map((item,i)=>(
                                                <option key={i} value={item.id}>{item.name}</option>
                                            ))
                                        }
                                    </Field>
                                    {errors.formaPagoCFDI && <Form.Control.Feedback type="invalid" >{errors.formaPagoCFDI}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>                                                                       
                        </Row>                                               
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/catalogos/metodo-pago" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )

}