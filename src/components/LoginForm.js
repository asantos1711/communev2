import React, { useContext, useState } from 'react'
import { TiUser,TiLockClosed } from "react-icons/ti";
import { authContext } from '../context/AuthContext';
import Post from '../service/Post';
import { USER_LOGIN } from '../service/Routes';
import logo from '../img/logo.png'
import { Image } from 'react-bootstrap';
import { getLogoResidencial } from '../utils/getLogoResidencial';
import config from "../../package.json"


export default function LoginForm({history}){
    const { setAuthData } = useContext(authContext);

    const [username, setUsername] = useState()
    const [password, setPassword] = useState();
    const [invalidUsername, setInvalidUsername] = useState(false)
    const [invalidPassword, setInvalidPassword] = useState(false)
    const [errorGlobal, setErrorGlobal] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const onFormSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
    
        if(username === '' || username===undefined) {
            setInvalidUsername(true)
            setLoading(false)
        }
        if(password === '' || password===undefined)  {
            setInvalidPassword(true)
            setLoading(false)
        }

        const credentials = {
            username: username,
            password: password
        }
        Post({url: USER_LOGIN, data: credentials, header: false})
            .then(response => {
                setLoading(false)
                setAuthData(response.data)
                history.replace('/');
            })
            .catch(error => {
                setLoading(false)
                //console.log('error')
                switch(error.response.status){
                    case 404:
                        setErrorGlobal(true)
                        break
                    default:
                        setErrorGlobal(true);

                }
            })
      };
    return(
        <div style={{ height: "100vh"}} className="d-flex justify-content-center align-items-center">
            <div style={{ width: 300 }}>
                <img src={logo} className="card-img-top mb-5" alt="..." />
                <div className="card">                    
                    <div className="card-body">
                        {/* <small className="text-muted text-center d-block">Usuario: demo Contraseña: demo</small> */}
                        <br />
                            {
                                errorGlobal && 
                                <div className="alert alert-danger alert-sm" role="alert">
                                    Usuario o Contraseña incorrecta / Usuario no activo
                                </div>                               
                            }
                        <form onSubmit={onFormSubmit} className="needs-validation" noValidate>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" ><TiUser /></span>
                                    </div>
                                    <input                                     
                                        type="text" 
                                        className={`${invalidUsername && 'error'} form-control`} 
                                        placeholder="Usuario" 
                                        onChange={e => {setUsername(e.target.value);}}
                                        onKeyUp={() => {setInvalidUsername(false); setErrorGlobal(false)}}
                                    />
                                </div>
                                {
                                    invalidUsername &&
                                    <div className="invalid-feedback">
                                        Usuario requerido.
                                    </div>
                                }
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1"><TiLockClosed /></span>
                                    </div>
                                    <input 
                                        type="password" 
                                        className={`${invalidPassword && 'error'} form-control`} 
                                        placeholder="Contraseña"
                                        onChange={e => {setPassword(e.target.value);}} 
                                        onKeyUp={() => {setInvalidPassword(false); setErrorGlobal(false)}}
                                    />
                                </div>
                                {
                                    invalidPassword &&
                                    <div className="invalid-feedback">
                                        Contraseña requerida.
                                    </div>
                                }
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">
                                {
                                     loading 
                                     ?  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 
                                     : 'Iniciar sesión'
                                }
                            </button>
                        </form>
                    </div>
                </div>

                <div className="text-center mt-5">
                    <Image src={getLogoResidencial(process.env.REACT_APP_RESIDENCIAL)} fluid className="h-70-px" />
                </div>
                

                <div className='text-center mt-3'>
                    <span className='text-muted font-size-08rem'>
                        v {config.version}
                    </span>
                </div>
                
            </div>
        </div>
    )
}