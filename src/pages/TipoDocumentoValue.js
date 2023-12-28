import React, { useState, useEffect } from 'react'
import useQuery from '../hook/useQuery'
import { useHistory, Link } from 'react-router-dom'
import { TIPO_DOCUMENTO_GET_BY_ID, TIPO_DOCUMENTO_SAVE, TIPO_COMPROBANTE_GET } from '../service/Routes'
import Get from '../service/Get'
import * as Yup from 'yup';
import { Form, Row, Col, Button } from 'react-bootstrap'
import { loaderRequest } from '../loaders/LoaderRequest'
import { Field, Formik } from 'formik'
import Skeleton from 'react-loading-skeleton'
import Post from '../service/Post'
import { toast } from 'react-toastify'

export default function TipoDocumentoValue({auth,isEditing}){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const query = useQuery()
    let idEntity = query.get('id')
    let history = useHistory()
    const [tipoCompOpts, setTipoCompOpts] = useState([])
    const [initialValues, setInitialValues] = useState({
        id: '', 
        name: '',
        tipoComprobante: ''
    })
    useEffect(()=>{
        Get({url: TIPO_COMPROBANTE_GET, access_token: auth.data.access_token})
        .then(response=>{
            setTipoCompOpts(response.data)
        })
        .catch(error=>{
            //console.log(error)
        })
    },[])

    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${TIPO_DOCUMENTO_GET_BY_ID}/${idEntity}`, access_token: auth.data.access_token})
            .then(response=>{         
                let entity ={
                    id: response.data.data.id,
                    name: response.data.data.name, 
                    tipoComprobante: response.data.data.tipoComprobante.id,                     
                }
                setInitialValues(entity)
                setLoadEntity(false)
            })
            .catch(error=>{
                // console.log("error")
                // console.log(error)
            })
        }        
    }, [idEntity ,auth.data.access_token])

    const shemaValidate = Yup.object().shape({
        name: Yup.string()
            .required('Campo Requerido'),
        tipoComprobante: Yup.string()
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
                        values['tipoComprobante'] = {id: values.tipoComprobante}                      
                        Post({url: TIPO_DOCUMENTO_SAVE, data: values,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            toast.success("Acción exitosa",{ autoClose: 2000 })
                            history.push("/catalogos/tipo-documento")
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
                            <Col xs lg="3">
                                <Form.Group>
                                    <Form.Label>Tipo comprobante <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.tipoComprobante && 'error'} form-control`}
                                        name="tipoComprobante"
                                        as="select" 
                                    >
                                        <option value=''>Seleccionar opción</option>
                                        {
                                            tipoCompOpts.map((item,i)=>(
                                                <option key={i} value={item.id}>{item.name}</option>
                                            ))
                                        }
                                    </Field>
                                    {errors.tipoComprobante && <Form.Control.Feedback type="invalid" >{errors.tipoComprobante}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>
                            <Col xs lg="6">
                                <Form.Group>
                                    <Form.Label>Tipo documento <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.name && 'error'} form-control`}
                                        name="name"
                                        type="text" 
                                    />
                                    {errors.name && <Form.Control.Feedback type="invalid" >{errors.name}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>                                                                        
                        </Row>                                               
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/catalogos/tipo-documento" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )

}