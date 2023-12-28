import React, { useState, useEffect } from 'react'
import useQuery from '../hook/useQuery';
import { useHistory, Link } from 'react-router-dom';
import Get from '../service/Get';
import { CUOTA_INICIAL_GET_BY_ID, CUOTA_INICIAL_SAVE } from '../service/Routes';
import * as Yup from 'yup';
import Skeleton from 'react-loading-skeleton';
import { Formik, Field } from 'formik';
import Post from '../service/Post';
import { toast } from 'react-toastify';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { loaderRequest } from '../loaders/LoaderRequest';

export default function CuotaInicialValue({auth, isEditing}){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const query = useQuery()
    let idEntity = query.get('id');
    const history = useHistory()

    const [initialValues, setInitialValues] = useState({
        id: '', 
        name: '',
        descripcion: '',
        cuotaCondominal: '',
        cuotaHabitacional: '',
        cuotaComercial: '',
        activa: true
    })

    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${CUOTA_INICIAL_GET_BY_ID}/${idEntity}`, access_token: auth.data.access_token})
            .then(response=>{                        
                let entity ={
                    id: response.data.data.id,
                    name: response.data.data.name,
                    descripcion: response.data.data.descripcion,
                    cuotaCondominal: response.data.data.cuotaCondominal,
                    cuotaHabitacional: response.data.data.cuotaHabitacional,
                    cuotaComercial: response.data.data.cuotaComercial,
                    activa: response.data.data.activa
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
        cuotaCondominal: Yup.number()
            .min(0, 'Campo no puede ser negativo')
            .required('Campo Requerido'),
        cuotaHabitacional: Yup.number()
            .min(0, 'Campo no puede ser negativo')          
            .required('Campo Requerido'),
        cuotaComercial: Yup.number()
            .min(0, 'Campo no puede ser negativo')        
            .required('Campo Requerido')
    });

    return (
        <div>
            {
                isLoadEntity
                ? <Skeleton height={200}/>
                : 
                <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, { setSubmitting, setFieldValue }) => { 
                        //console.log(values)  
                        Post({url: CUOTA_INICIAL_SAVE, data: values,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            //console.log(response)
                            setSubmitting(false)
                            if(response.data.success){
                                toast.success("Acción exitosa",{ autoClose: 2000 })
                                history.push("/admin/cuota-inicial")
                            }else{
                                toast.info(response.data.message, {autoClose: 8000})
                            }                            
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
                            <Col xs lg="3">
                                <Form.Group>
                                    <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
                                    <Field
                                        className={`${errors.name && 'error'} form-control`}
                                        type="text"
                                        name="name"
                                    /> 
                                    {errors.name && <Form.Control.Feedback type="invalid" >{errors.name}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col> 
                            <Col xs lg="3">
                                <Form.Group>
                                    <Form.Label>Cuota condiminal <span className="text-danger">*</span></Form.Label>
                                    <Field
                                        className={`${errors.cuotaCondominal && 'error'} form-control`}
                                        type="number"
                                        name="cuotaCondominal"
                                    /> 
                                    {errors.cuotaCondominal && <Form.Control.Feedback type="invalid" >{errors.cuotaCondominal}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>
                            <Col xs lg="3">
                                <Form.Group>
                                    <Form.Label>Cuota habitacional <span className="text-danger">*</span></Form.Label>
                                    <Field
                                        className={`${errors.cuotaHabitacional && 'error'} form-control`}
                                        type="number"
                                        name="cuotaHabitacional"
                                    /> 
                                    {errors.cuotaHabitacional && <Form.Control.Feedback type="invalid" >{errors.cuotaHabitacional}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>
                            <Col xs lg="3">
                                <Form.Group>
                                    <Form.Label>Cuota comercial <span className="text-danger">*</span></Form.Label>
                                    <Field
                                        className={`${errors.cuotaComercial && 'error'} form-control`}
                                        type="number"
                                        name="cuotaComercial"
                                    /> 
                                    {errors.cuotaComercial && <Form.Control.Feedback type="invalid" >{errors.cuotaComercial}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>
                            <Col xs lg="6">
                                <Form.Group>
                                    <Form.Label>Descripción <span className="text-danger">*</span></Form.Label>
                                    <Field
                                        className={`${errors.descripcion && 'error'} form-control`}
                                        as="textarea"                                        
                                        name="descripcion"
                                    />                                    
                                    {errors.descripcion && <Form.Control.Feedback type="invalid" >{errors.descripcion}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col> 
                            <Col xs lg="3">
                                <Form.Group>
                                    <div className="mt-4"></div>
                                    <Form.Label>
                                    <Field
                                            className="form-check-input"
                                            type="checkbox"
                                            name="activa"
                                        />
                                        Activa
                                    </Form.Label>
                                    
                                     
                                </Form.Group>
                            </Col>                
                        </Row>                        
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/admin/cuota-inicial" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )
}