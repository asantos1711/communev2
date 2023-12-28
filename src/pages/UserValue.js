import React, { useState, useEffect } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { Formik, Field } from 'formik'
import * as Yup from 'yup';
import {USER_SAVE, USER_GET_By_ID} from '../service/Routes'
import { toast } from 'react-toastify'
import Post from '../service/Post'
import useQuery from '../hook/useQuery';
import Get from '../service/Get';
import UserSkeleton from '../loaders/UserSkeleton';
import { loaderRequest } from '../loaders/LoaderRequest';
import {IsSuperadmin} from '../security/IsSuperadmin';

export default function UserValue(props){   
    const[isLoadUser, setLoadUser] = useState(false)
    const query = useQuery()
    let idUser = query.get('id');
    const history = useHistory()

    const [initialValues, setInitialValues] = useState({
            view_edit: false,
            id: '',
            name: '',
            last_name: '',
            email: '',
            username: '',
            password: '',
            enabled: true,
            role: '4' 
    })

    useEffect(()=>{        
        if(idUser){
            setLoadUser(true)
            Get({url: `${USER_GET_By_ID}/${idUser}`, access_token: props.auth.data.access_token})
            .then(response=>{    
                //console.log(response)     
                let user ={
                    view_edit: true,
                    id: response.data.data.id,
                    name: response.data.data.name,
                    last_name: response.data.data.last_name,
                    email: response.data.data.email,
                    username: '',
                    password: '',
                    enabled: response.data.data.enabled,
                    role: response.data.data.roles[0].id
                }
                setInitialValues(user)
                setLoadUser(false)
            })
            .catch(error=>{
                // console.log("error")
                // console.log(error)
            })
        }        
    }, [idUser ,props.auth.data.access_token])

    const UserShema = Yup.object().shape({
        name: Yup.string()
          .min(3, 'Muy corto!')
          .required('Campo Requerido'),
        role: Yup.string()
          .required('Campo Requerido'),
        last_name: Yup.string()
          .min(3, 'Muy corto!')
          .required('Required'),
        email: Yup.string()
          .email('Email Inválido')
          .required('Campo Requerido'),
        username: Yup.string().when('view_edit', {
            is: true,
            then: Yup.string().notRequired(),
            otherwise: Yup.string()
                        .min(3, 'Su usuario debe tener entre 3 y 15 caracteres')
                        .max(15, 'Su usuario debe tener entre 3 y 15 caracteres')
                        .required('Campo requerido'),
        }),        
        password: Yup.string().when('view_edit', {
            is: true,
            then: Yup.string().notRequired(),
            otherwise:  Yup.string().required("Campo requerido")
                                    .min(8,  'Su contraseña debe tener más de 8 caracteres')
                                    .max(50, 'Su contraseña debe tener menos de 50 caracteres')
        }),
    });

    return (
        <div>
            {
                isLoadUser
                ? <UserSkeleton />
                :
                <Formik
                    initialValues={initialValues}
                    validationSchema={UserShema}
                    onSubmit={(values, { setSubmitting, setFieldValue }) => {                          
                        values['roles'] = [{id: values['role']}]
                        Post({url: USER_SAVE, data: values,access_token: props.auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            if(!response.data.success){
                                toast.info(response.data.message, {autoClose: 8000})
                            }else{
                                setFieldValue("view_edit", true) 
                                toast.success("Acción exitosa",{ autoClose: 2000 })
                                history.push("/admin/usuario")
                            }
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
                        <input type="hidden" name="view_edit" id="view_edit" value={values.view_edit} onChange={handleChange}  />
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
                            <Col xs lg="4">
                                <Form.Group>
                                    <Form.Label>Apellidos <span className="text-danger">*</span></Form.Label>
                                    <Form.Control className={`${errors.last_name && 'error'}`}
                                        type="text"
                                        name="last_name" 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.last_name}  
                                    />
                                    {errors.last_name && <Form.Control.Feedback type="invalid" >{errors.last_name}</Form.Control.Feedback>}    
                                </Form.Group>
                            </Col>
                            <Col xs lg="4">
                                <Form.Group>
                                    <Form.Label>Correo electrónico <span className="text-danger">*</span></Form.Label>
                                    <Form.Control className={`${errors.email && 'error'}`}
                                        type="email"
                                        name="email" 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}  
                                    />
                                    {errors.email && <Form.Control.Feedback type="invalid" >{errors.email}</Form.Control.Feedback>}    
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            {
                                idUser===null &&
                                <Col xs lg="4">
                                        <Form.Group>
                                            <Form.Label>Usuario <span className="text-danger">*</span></Form.Label>
                                            <Form.Control className={`${errors.username && 'error'}`}
                                                type="text" 
                                                name="username" 
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.username}
                                            />
                                            {errors.username && <Form.Control.Feedback type="invalid" >{errors.username}</Form.Control.Feedback>}    
                                        </Form.Group>
                                    </Col>
                            }
                            {
                                    idUser===null &&
                                    <Col xs lg="4">
                                        <Form.Group>
                                            <Form.Label>Contraseña <span className="text-danger">*</span></Form.Label>
                                            <Form.Control className={`${errors.password && 'error'}`}
                                                type="password" 
                                                name="password" 
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.password}
                                            />
                                            {errors.password && <Form.Control.Feedback type="invalid" >{errors.password}</Form.Control.Feedback>}    
                                        </Form.Group>
                                    </Col>
                                
                            }
                            
                            <Col xs lg="4">
                                <Form.Group>
                                    <Form.Label className="opacity-0">Activo</Form.Label>
                                    <Form.Check 
                                        type="switch"
                                        id="enabled"
                                        label="Activo"
                                        name="enabled"
                                        checked={values.enabled}
                                        onChange={() => setFieldValue('enabled', !values.enabled)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs lg="4">
                                <Form.Group>
                                    <Form.Label>Role <span className="text-danger">*</span></Form.Label>
                                    <Field as="select" name="role" className={`${errors.role && 'error'} form-control`}>
                                        {IsSuperadmin(props.auth.data.role) && <option value="1">ROLE_SUPERADMINISTRADOR</option>}
                                        
                                        <option value="2">ROLE_DIRECTOR</option>
                                        <option value="3">ROLE_ADMINISTRADOR</option>
                                        <option value="4">ROLE_CONSULTOR</option>
                                        <option value="5">ROLE_PAGOS_COBRANZA</option>
                                        <option value="6">ROLE_OBRAS</option>
                                        <option value="7">ROLE_TAGS</option>
                                        <option value="8">ROLE_SEGURIDAD</option>
                                    </Field>   
                                    {errors.role && <Form.Control.Feedback type="invalid" >{errors.role}</Form.Control.Feedback>}                                   
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/admin/usuario" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
        
    )
}