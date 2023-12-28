import React, { useState, useEffect } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Formik } from 'formik'
import * as Yup from 'yup';
import { USER_APP_GET_BY_ID, USER_APP_SAVE, GET_LOTE_REFERENCIA} from '../service/Routes'
import { toast } from 'react-toastify'
import Post from '../service/Post'
import useQuery from '../hook/useQuery';
import Get from '../service/Get';
import UserSkeleton from '../loaders/UserSkeleton';
import { loaderRequest } from '../loaders/LoaderRequest';
import SelectAjax from '../components/SelectAjax';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function UserAppValue(props){   
    const[isLoadUser, setLoadUser] = useState(false)
    const query = useQuery()
    let idUser = query.get('id');
    const [lote, setLote] = useState(null)
    const history = useHistory()

    const [initialValues, setInitialValues] = useState({
            id: '',
            name: '',
            phone: '',
            email: '',
            status: 'pendiente',
            lote: '',
            token: ''
    })

    useEffect(()=>{        
        if(idUser){
            setLoadUser(true)
            Get({url: `${USER_APP_GET_BY_ID}/${idUser}`, access_token: props.auth.data.access_token})
            .then(response=>{    
                //console.log(response)     
                let user ={
                    id: response.data.data.id,
                    name: response.data.data.name,
                    phone: response.data.data.phone,
                    email: response.data.data.email,
                    status: response.data.data.status,
                    lote: response.data.data.lote?.id,
                    token: response.data.data.token
                }
                if(response.data.data.lote){
                    setLote({
                        value: response.data.data.lote.id,
                        label: `Lote: ${response.data.data.lote.referencia}`
                    })
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
        phone: Yup.string()
          .required('Campo Requerido'),
        status: Yup.string()
          .required('Required'),
        email: Yup.string()
          .email('Email Inválido')
          .required('Campo Requerido'),
        lote: Yup.string().required('Campo requerido')
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
                        values.lote = {id: values.lote}
                        console.log(values)
                        Post({url: USER_APP_SAVE, data: values,access_token: props.auth.data.access_token, header:true})
                        .then(response=>{
                            setSubmitting(false)
                            if(!response.data.success){
                                toast.info(response.data.message, {autoClose: 8000})
                                setTimeout(()=>{
                                    history.push("/admin/usuarios-app")
                                }, 7000)
                            }else{
                                toast.success("Acción exitosa",{ autoClose: 2000 })
                                setTimeout(()=>{
                                    history.push("/admin/usuarios-app")
                                }, 2000)
                            }
                        })
                        .catch(error=>{
                            setSubmitting(false)
                            console.log(error)
                            console.log(error.response)
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
                            <Col xs={12} lg="4">
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
                            <Col xs={12} lg="4">
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
                            <Col xs="12" md="4">
                                <Form.Group>
                                    <Form.Label>Seleccionar lote</Form.Label>
                                    <SelectAjax
                                        url={GET_LOTE_REFERENCIA}
                                        access_token={props.auth.data.access_token}
                                        isMulti={false}
                                        handleChange={(value) => {
                                            setLote(value)
                                            setFieldValue('lote', value.value)
                                        }} 
                                        value={lote}   
                                        defaultValue={lote}
                                        valid={true}     
                                        isClearable={true}                                                 
                                    />
                                    {errors.lote && <Form.Control.Feedback type="invalid" >{errors.lote}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                            <Col xs={12} lg="4">
                                <Form.Group>
                                    <Form.Label>Estado <span className="text-danger">*</span></Form.Label>
                                    <Form.Control className={`${errors.status && 'error'}`}
                                        as="select"
                                        name="status" 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.status}  
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="verificada">Verificada</option>
                                        <option value="bloqueada">Bloqueada</option>
                                        <option value="plazo_pago">Plazo de pago</option>
                                        <option value="bloqueo_adeudo">Bloqueo por adeudo</option>
                                    </Form.Control>
                                    {errors.status && <Form.Control.Feedback type="invalid" >{errors.status}</Form.Control.Feedback>}    
                                </Form.Group>
                            </Col>
                            <Col xs={12} lg="4">
                                <Form.Group>
                                    <Form.Label>Teléfono <span className="text-danger">*</span></Form.Label>
                                    <Form.Control className={`${errors.phone && 'error'}`}
                                        type="text"
                                        name="phone" 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.phone}  
                                    />
                                    {errors.phone && <Form.Control.Feedback type="invalid" >{errors.phone}</Form.Control.Feedback>}    
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/admin/usuarios-app" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
        
    )
}