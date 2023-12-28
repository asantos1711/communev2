import React, { useState, useEffect } from 'react'
import useQuery from '../hook/useQuery'
import { useHistory, Link } from 'react-router-dom'
import Get from '../service/Get'
import { USO_CFDI_GET_BY_ID, USO_CFDI_SAVE } from '../service/Routes'
import * as Yup from 'yup';
import Skeleton from 'react-loading-skeleton'
import { Formik, Field } from 'formik'
import Post from '../service/Post'
import { toast } from 'react-toastify'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { loaderRequest } from '../loaders/LoaderRequest'

export default function UsoCFDIValue({auth,isEditing}){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const query = useQuery()
    let idEntity = query.get('id')
    let history = useHistory()
    const [initialValues, setInitialValues] = useState({
        id: '', 
        name: '',
        usoCFDI: '',
        fisica: 'Si',
        moral: 'Si'
    })
    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${USO_CFDI_GET_BY_ID}/${idEntity}`, access_token: auth.data.access_token})
            .then(response=>{         
                let entity ={
                    id: response.data.data.id,
                    name: response.data.data.name,
                    usoCFDI: response.data.data.usoCFDI,
                    fisica: response.data.data.fisica,
                    moral: response.data.data.moral,                     
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
        usoCFDI: Yup.string()
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
                        values['usoCFDI']  = values.usoCFDI.toUpperCase()                     
                        Post({url: USO_CFDI_SAVE, data: values,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            toast.success("Acción exitosa",{ autoClose: 2000 })
                            history.push("/catalogos/uso-cfdi")
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
                            <Col xs lg="2">
                                <Form.Group>
                                    <Form.Label>Uso CDFI <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.usoCFDI && 'error'} form-control upper-case`}
                                        name="usoCFDI"
                                        type="text" 
                                    />
                                    {errors.usoCFDI && <Form.Control.Feedback type="invalid" >{errors.usoCFDI}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>
                            <Col xs lg="6">
                                <Form.Group>
                                    <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.name && 'error'} form-control`}
                                        name="name"
                                        type="text" 
                                    />
                                    {errors.name && <Form.Control.Feedback type="invalid" >{errors.name}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col> 
                            <Col xs lg="2">
                                <Form.Group>
                                    <Form.Label>Física <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`form-control`}
                                        name="fisica"
                                        as="select" 
                                    >
                                        <option value="Si">Si</option>
                                        <option value="No">No</option>
                                    </Field>                                    
                                </Form.Group>
                            </Col>
                            <Col xs lg="2">
                                <Form.Group>
                                    <Form.Label>Moral <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`form-control`}
                                        name="moral"
                                        as="select" 
                                    >
                                        <option value="Si">Si</option>
                                        <option value="No">No</option>
                                    </Field>                                    
                                </Form.Group>
                            </Col>                                                                       
                        </Row>                                               
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/catalogos/uso-cfdi" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )


}