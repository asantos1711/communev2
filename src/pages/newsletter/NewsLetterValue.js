import React, { useEffect } from 'react';
import { useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import useQuery from "../../hook/useQuery";
import Get from '../../service/Get';
import { GET_NEWSLETTER_BY_ID, SAVE_NEWSLETTER } from '../../service/Routes';
import * as Yup from 'yup';
import UserSkeleton from '../../loaders/UserSkeleton';
import { Formik } from 'formik';
import Post from '../../service/Post';
import { toast } from 'react-toastify';
import { loaderRequest } from '../../loaders/LoaderRequest';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { BsEye, BsUpload } from 'react-icons/bs';
import { app } from '../../firebaseConfig';

export default function NewsLetterValue({auth}){
    const[isLoadUser, setLoadUser] = useState(false)
    const query = useQuery()
    let id = query.get('id');
    const history = useHistory()
    const [fileName, setFileName] = useState('Seleccionar archivo')
    const [file, setFile] = useState(null)
    const [errorFile, setErrorFile] = useState(false)

    const [initialValues, setInitialValues] = useState({
        id: '',
        name: '',
        url: '',
        descripcion: '',
        fileName: '',
    });

    useEffect(()=>{        
        if(id){
            setLoadUser(true)
            Get({url: `${GET_NEWSLETTER_BY_ID}/${id}`, access_token: auth.data.access_token})
            .then(response=>{    
                //console.log(response)     
                let newsLetter ={
                    id: response.data.data.id,
                    name: response.data.data.name,
                    url: response.data.data.url,
                    fileName: response.data.data.fileName,
                    oldName: response.data.data.fileName,
                    descripcion: response.data.data.descripcion,
                }
                setInitialValues(newsLetter)
                setLoadUser(false)
            })
            .catch(error=>{
                // console.log("error")
                // console.log(error)
            })
        }        
    }, [])

    const UserShema = Yup.object().shape({
        name: Yup.string()
          .min(3, 'Muy corto!')
          .required('Campo Requerido'),
        descripcion: Yup.string()
          .min(20, 'Muy corto!')
          .required('Campo Requerido'),
        fileName: Yup.string()
          .required('Campo Requerido'),
    });

    const handleUploadFile = (e) =>{
        const file = e.target.files[0];
        if(file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg'){
            setErrorFile(false)
            setFile(file)
            setFileName(file.name)
        }else{
            setErrorFile(true)
            setFile(null)
            setFileName("Seleccionar archivo")
        }
    }

    return (
        <div>
            {
                isLoadUser
                ? <UserSkeleton />
                :
                <Formik
                    initialValues={initialValues}
                    validationSchema={UserShema}
                    onSubmit={async (values, { setSubmitting, setFieldValue }) => { 
                        
                        try{
                            const storageRef = app.storage().ref();
                            if(initialValues.oldName){
                                const constanciaRef = storageRef.child(`documents/${process.env.REACT_APP_RESIDENCIAL}/${initialValues.oldName}`);
                                constanciaRef.delete();
                            }           

                            let fileName = `${file.name}-${new Date().getTime()}`
                            const fileRef = storageRef.child(`documents/${process.env.REACT_APP_RESIDENCIAL}/` +fileName);
                            await fileRef.put(file);
                            let fileUrl = await fileRef.getDownloadURL();

                            if(fileUrl){
                                const newValues = {...values}
                                newValues.fileName = fileName
                                newValues.url = fileUrl

                                let response = await Post({url: SAVE_NEWSLETTER, data: newValues,access_token: auth.data.access_token, header:true});
                                if(response.data.success){
                                    toast.success("Acción exitosa",{ autoClose: 2000 })
                                    setTimeout(()=>{
                                        history.push("/admin/newsletter")
                                    }, 2000)
                                }else{
                                    toast.info(response.data.message, {autoClose: 8000})
                                }
                                setSubmitting(false)
                            }
                        }catch(error){
                            toast.error("No podemos ejecutar la acción. Contacte al administrador por favor", {autoClose: 8000})
                        }
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
                            <Col xs='12' lg="6">
                                <Form.Group>
                                    <Form.Label>Subir imagen</Form.Label>  
                                    <div className="input-group">
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" id="inputFile" aria-describedby="inputFileAddon04"                                                                        
                                                onChange={e=>{
                                                    handleUploadFile(e)
                                                    setFieldValue('fileName', e.target.files[0].name)
                                                }}
                                                accept="image/png, image/jpeg, image/jpg"
                                            />
                                            <label className="custom-file-label" htmlFor="inputFile">{fileName}</label>
                                        </div>
                                    </div>  
                                    {values.fileName &&  
                                        <a href={values.url} target='_blank' rel="noopener noreferrer"><BsEye /> Ver imagen</a>
                                        }
                                    {errorFile && <Form.Control.Feedback type="invalid">Archivo inválido. Solo archivo en formato JPG, JPEG, PNG permitido</Form.Control.Feedback>}                                                        
                                </Form.Group> 
                            </Col>
                            <Col xs={12} lg="8">
                                <Form.Group>
                                    <Form.Label>Descripción<span className="text-danger">*</span></Form.Label>
                                    <textarea 
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`} 
                                        id="description" 
                                        rows="9"
                                        name="descripcion"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.descripcion || ""}                            
                                    />                                    
                                    {errors.descripcion && <Form.Control.Feedback type="invalid" >{errors.descripcion}</Form.Control.Feedback>}                            
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>Aceptar</Button>{' '}
                                <Link to="/admin/newsletter" className="btn btn-secondary">Cancelar</Link>
                            </Col>
                        </Row>
                    </Form>
                )}            
                </Formik>
            }
        </div>
        
    )

}