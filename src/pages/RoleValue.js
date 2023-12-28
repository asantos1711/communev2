import React, { useState, useEffect } from 'react'
import useQuery from '../hook/useQuery'
import Get from '../service/Get';
import { ROLE_GET_By_ID, ROLE_SAVE } from '../service/Routes';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Post from '../service/Post';
import { toast } from 'react-toastify';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { loaderRequest } from '../loaders/LoaderRequest';
import { Link, useHistory } from 'react-router-dom';
import RoleSkeleton from '../loaders/RoleSkeleton';

export default function RoleValue(props){
    const[isLoadEntity, setLoadEntity] = useState(false)
    const query = useQuery()
    let idEntity = query.get('id');
    const history  =useHistory()

    const [initialValues, setInitialValues] = useState({id: '', name: ''})

    useEffect(()=>{        
        if(idEntity){
            setLoadEntity(true)
            Get({url: `${ROLE_GET_By_ID}/${idEntity}`, access_token: props.auth.data.access_token})
            .then(response=>{         
                let entity ={
                    id: response.data.data.id,
                    name: response.data.data.name,       
                }
                setInitialValues(entity)
                setLoadEntity(false)
            })
            .catch(error=>{
                // console.log("error")
                // console.log(error)
            })
        }        
    }, [idEntity ,props.auth.data.access_token])

    const shemaValidate = Yup.object().shape({
        name: Yup.string()
          .min(3, 'Muy corto!')
          .required('Campo Requerido')
    });


    return (
        <div>
            {
                isLoadEntity
                ? <RoleSkeleton />
                : 
                <Formik
                    initialValues={initialValues}
                    validationSchema={shemaValidate}
                    onSubmit={(values, { setSubmitting, setFieldValue }) => {   
                        Post({url: ROLE_SAVE, data: values,access_token: props.auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            setFieldValue("id", response.data.data.id)
                            toast.success("Acción exitosa",{ autoClose: 2000 })
                            history.push("/admin/role")
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
                            <Col xs lg="4">
                                <Form.Group>
                                    <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
                                    <Form.Control className={`${errors.name && 'error'}`}
                                        type="text"
                                        name="name" 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.name} 
                                    />
                                    {errors.name && <Form.Control.Feedback type="invalid" >{errors.name}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>                           
                        </Row>                        
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/admin/role" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
    )
}