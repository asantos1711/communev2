import React, { useContext, useEffect, useState  } from 'react'
import { authContext } from '../context/AuthContext';
import {Navbar,Nav, NavDropdown, Badge,Dropdown} from 'react-bootstrap';
import { TiUser } from 'react-icons/ti';
import { NavLink, Link, useHistory } from 'react-router-dom';
import { IsDirector } from '../security/IsDirector';
import { IsCobranza } from '../security/IsCobranza';
import { IsAdministrador } from '../security/IsAdministrador';
import { IsObra } from '../security/IsObra';
import Get from '../service/Get';
import { NOTAALERTA_GET_WARNING } from '../service/Routes'
import moment from 'moment'
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { getDiffDays } from '../utils/getDiffDays';
import { GoAlert } from "react-icons/go";
import { IsConsultor } from '../security/IsConsultor';
import { getLogoResidencial } from '../utils/getLogoResidencial';
import { isTags } from '../security/isTags';
import { IsSeguridad } from '../security/IsSeguridad';

export default function HeaderNav(){
    const { setAuthData, auth } = useContext(authContext);
    const history  = useHistory();
    const [alertas, setAlertas] = useState([])

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [item, setItem] = useState(null)

    const logOut = () =>{
        //getData({url:USER_LOGOUT, access_token: auth.data.access_token})
        setAuthData(null);
    } 
    const showCodigoAuth = () =>{
        history.push("/codigo-autorizacion")
    } 

    useEffect(()=>{
        Get({url: NOTAALERTA_GET_WARNING, access_token: auth.data.access_token})
        .then(response=>{
            //setNotas(response.data.filter(x=>x.tipo==='nota'))
            setAlertas(response.data.filter(x=>x.tipo==='alerta'))
        })
        .catch(error=>{
            console.log(error)
        })
    },[])

    const handleClickNota = item =>{
        setItem(item)
        setShow(true)
    }
    
    return(
        <Navbar bg="light" expand="lg" className="shadow-sm">
            <Link className="navbar-brand p-0" to="/">
            <img
                src={getLogoResidencial(process.env.REACT_APP_RESIDENCIAL)}
                className="d-inline-block align-top imgLogo"
                alt="Logo"
            />
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {(IsDirector(auth.data.role) || IsAdministrador(auth.data.role)) && <NavLink to="/admin" activeClassName="selected" className="nav-link">Administración</NavLink>}  
                    {(IsDirector(auth.data.role) || IsCobranza(auth.data.role) || IsAdministrador(auth.data.role) || isTags(auth.data.role)) && <NavLink to="/operaciones" activeClassName="selected" className="nav-link">Operaciones</NavLink>}  
                    {(!IsObra(auth.data.role) && !isTags(auth.data.role) && !IsSeguridad(auth.data.role)) &&   <NavLink to="/mantenimientos" activeClassName="selected" className="nav-link">Mantenimientos</NavLink>  }
                    {(IsDirector(auth.data.role) || IsCobranza(auth.data.role) || IsAdministrador(auth.data.role) || isTags(auth.data.role)) && <NavLink to="/cobranza" activeClassName="selected" className="nav-link">Cobranza</NavLink>}  
                    {(!IsObra(auth.data.role) && !IsSeguridad(auth.data.role)) &&  <NavLink to="/reportes" activeClassName="selected" className="nav-link">Reportes</NavLink>  }
                    {IsDirector(auth.data.role) && <NavLink to="/catalogos" activeClassName="selected" className="nav-link">Catálogos</NavLink>  }
                    {(IsDirector(auth.data.role) || IsAdministrador(auth.data.role)) && <NavLink to="/cancelaciones" activeClassName="selected" className="nav-link">Cancelaciones</NavLink>  }
                </Nav>
                <Nav className="justify-content-end align-items-center">
                    {item && <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>{item.tipo==='nota' ? 'Nota' : 'Alerta'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col>
                                <dl className="row">
                                <dt className="col-sm-5">Referencia</dt>
                                <dd className="col-sm-7"><span className="bg-light rounded px-2">{item.lote.referencia}</span></dd>

                                <dt className="col-sm-5">Fecha recordatorio</dt>
                                <dd className="col-sm-7"><span className={`rounded px-2 ${getDiffDays(item.fechaRecordatorio) <=3 && getDiffDays(item.fechaRecordatorio) >= 0 ? 'bg-warning' : "bg-danger text-white"}`}>{moment(item.fechaRecordatorio).format("DD-MM-YYYY")}</span></dd>
                                
                                <dd className="col-sm-12">{item.descripcion}</dd>
                            </dl>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="primary" onClick={handleClose}>
                            Aceptar
                        </Button>
                        </Modal.Footer>
                    </Modal>}
                    {(!IsObra(auth.data.role) && !IsConsultor(auth.data.role) && !IsSeguridad(auth.data.role)) && <Dropdown className="note-info">
                        <Dropdown.Toggle variant="light" className="btn-note text-secondary">
                            <div className="p-relative text-badge-secondary"><GoAlert className="wh-20"/><span className="badge badge-pill badge-danger note-warning">{alertas.length}</span></div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className={`dropdown-menu-right py-0 max-width-350 ${alertas.length >=8 && 'dropdown-overflow'}`}>
                            {
                                alertas.length === 0 ? <Dropdown.Item eventKey="1" className="border-b-1 py-3 px-1 text-center">Lista vacía</Dropdown.Item> :
                                alertas.map((item,i)=>(
                                    <Dropdown.Item eventKey={i} className="border-b-1 py-3 px-1" key={i} onClick={e=>handleClickNota(item)}>
                                        <div className="d-flex flex-row align-items-center">
                                            <div className="px-2">
                                                <div className={`tipo-note ${(getDiffDays(item.fechaRecordatorio) <=3 && getDiffDays(item.fechaRecordatorio) >= 0) ? 'bg-warning' : "bg-danger"}`}></div>
                                            </div>
                                            <div>
                                                <span className="d-block lh-0-5 text-secondary ft-0-8rem">
                                                    {item.descripcion.length > 50 ? `${item.descripcion.substring(0,50)}...` : item.descripcion}
                                                </span>
                                                <small className={`text-alert-fecha`}>{moment(item.fechaRecordatorio).format("DD-MM-YYYY")}</small>
                                            </div>
                                        </div>
                                    </Dropdown.Item>                                    
                                ))
                            }
                            
                        </Dropdown.Menu>
                    </Dropdown>}

                    {/* {(!IsObra(auth.data.role) && !IsConsultor(auth.data.role)) && <Dropdown className="note-info">
                        <Dropdown.Toggle variant="light" className="btn-note text-secondary">
                            <div className="p-relative text-badge-secondary"><MdTextsms className="wh-20"/><span className="badge badge-pill badge-warning note-warning">{notas.length}</span></div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className={`dropdown-menu-right py-0 max-width-350 ${notas.length >=8 && 'dropdown-overflow'}`}>
                            {
                                notas.length === 0 ? <Dropdown.Item eventKey="1" className="border-b-1 py-3 px-1 text-center">Lista vacía</Dropdown.Item> :
                                notas.map((item,i)=>(
                                    <Dropdown.Item eventKey="1" className="border-b-1 py-3 px-1" key={i} onClick={e=>handleClickNota(item)}>
                                        <div className="d-flex flex-row align-items-center">
                                            <div className="px-2">
                                                <div className={`tipo-note ${getDiffDays(item.fechaRecordatorio) <=3 && getDiffDays(item.fechaRecordatorio) >= 0 ? 'bg-warning' : "bg-danger"}`}></div>
                                            </div>
                                            <div>
                                                <span className="d-block lh-0-5 text-secondary ft-0-8rem">
                                                    {item.descripcion.length > 50 ? `${item.descripcion.substring(0,50)}...` : item.descripcion}
                                                </span>
                                                <small className={`text-alert-fecha`}>{moment(item.fechaRecordatorio).format("DD-MM-YYYY")}</small>
                                            </div>
                                        </div>
                                    </Dropdown.Item>                                    
                                ))
                            }
                            
                        </Dropdown.Menu>
                    </Dropdown>} */}
                    

                    <Badge className="badge-user ml-2"  variant="secondary"><TiUser /></Badge>
                    <NavDropdown title={auth.data.username} id="basic-nav-dropdown" alignRight>
                        {/* <NavDropdown.Item href="#action/3.1">Mi perfil</NavDropdown.Item> */}
                        {IsDirector(auth.data.role) && <NavDropdown.Item onClick={showCodigoAuth}>Código de autorización</NavDropdown.Item>}                         
                        <NavDropdown.Item onClick={logOut}>Cerrar sesión</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}