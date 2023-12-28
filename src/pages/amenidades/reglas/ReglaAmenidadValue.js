import React, { useState, useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'
import * as Yup from 'yup';
import Skeleton from 'react-loading-skeleton'
import { Formik, Field } from 'formik'
import { toast } from 'react-toastify'
import { Form, Row, Col, Button } from 'react-bootstrap'
import useQuery from '../../../hook/useQuery';
import Get from '../../../service/Get';
import { REGLAAMENIDAD_GET_BY_ID, REGLAAMENIDAD_SAVE } from '../../../service/Routes';
import Post from '../../../service/Post';
import { loaderRequest } from '../../../loaders/LoaderRequest';

export default function ReglaAmenidadValue({auth,isEditing}){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const query = useQuery()
    let idEntity = query.get('id')
    let history = useHistory()
    const [initialValues, setInitialValues] = useState({
        id: '', 
        name: '',
        category: '',
        active: true,
    })

    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${REGLAAMENIDAD_GET_BY_ID}/${idEntity}`, access_token: auth.data.access_token})
            .then(response=>{         
                let entity ={
                    id: response.data.data.id,
                    name: response.data.data.name,   
                    category: response.data.data.category,
                    active: response.data.data.active,   
                }
                setInitialValues(entity)
                setLoadEntity(false)
            })
            .catch(error=>{
                setLoadEntity(false)
                toast.error("Ocurrió un error en el servidor. Intente otra vez", {autoClose:8000})
            })
        }        
    }, [idEntity ,auth.data.access_token])
    const shemaValidate = Yup.object().shape({
        name: Yup.string()
            .required('Campo Requerido'),
        category: Yup.string()
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
                        Post({url: REGLAAMENIDAD_SAVE, data: values,access_token: auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            toast.success("Acción exitosa",{ autoClose: 2000 })
                            history.push("/admin/reglas-amenidades")
                        })
                        .catch(error=>{
                            setSubmitting(false)
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
                            <Col xs lg="6">
                                <Form.Group>
                                    <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.name && 'error'} form-control`}
                                        name="name" 
                                    />
                                    {errors.name && <Form.Control.Feedback type="invalid" >{errors.name}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col> 
                            <Col xs lg="6">
                                <Form.Group>
                                    <Form.Label>Categoría <span className="text-danger">*</span></Form.Label>
                                    <Field 
                                        className={`${errors.category && 'error'} form-control`}
                                        name="category"
                                        as="select" 
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="maximo_unidad_privada">Máximo por unidad privativa</option>
                                        <option value="cantidad_horario_dia">Reservas por día</option>
                                        <option value="secuencia_horario_premium">Intervalo de reserva de horario premium</option>
                                    </Field>
                                    {errors.category && <Form.Control.Feedback type="invalid" >{errors.category}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col> 
                            <Col xs lg="12">
                                <Form.Group>
                                    <Field 
                                        className={`${errors.active && 'error'}`}
                                        name="active" 
                                        type="checkbox"
                                    />{' '}
                                    <Form.Label>Activa</Form.Label>
                                    {errors.active && <Form.Control.Feedback type="invalid" >{errors.active}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>                                                                        
                        </Row>                                               
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/admin/reglas-amenidades" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )

}