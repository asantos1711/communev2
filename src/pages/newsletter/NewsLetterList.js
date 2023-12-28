import moment from "moment"
import React, { useEffect, useState } from "react"
import { Button, Col, Form, Row, Table } from "react-bootstrap"
import { FaEdit, FaSearch } from "react-icons/fa"
import { FiEdit } from "react-icons/fi"
import { useHistory } from "react-router-dom"
import TableSkeleton from "../../loaders/TableSkeleton"
import Get from "../../service/Get"
import { DELETE_NEWSLETTER, GET_NEWSLETTER_PAGINABLE } from "../../service/Routes"
import Delete from "../../service/Delete"
import { toast } from "react-toastify"
import { IsDirector } from "../../security/IsDirector"
import { IsAdministrador } from "../../security/IsAdministrador"
import { RiDeleteBinLine } from "react-icons/ri"

export default function NewsLetterList({auth,handleIsEditing,path}){
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [pageSize, setPageSize] = useState(20)
    const [pageNo, setPageNo] = useState(0)
    const [sortBy, setSortBy] = useState('createdAt')
    const [next, setNext] = useState(true)
    const [previous, setPrevious] = useState(false)
    const [searchName, setSearchName] = useState('')
    const [cantidadElementos, setCantidadElementos] = useState(0)
    const [isDeleteId, setIsDeleteId] = useState(false)
    let history = useHistory()

    useEffect(()=>{       
        DataList()                
    }, [pageNo])

    const DataList = () =>{
        setIsLoading(true)
        Get({url: `${GET_NEWSLETTER_PAGINABLE}?page=${pageNo}&size=${pageSize}&sortBy=${sortBy}${searchName && `&name=${searchName}`}`, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setItems(response.data.newsLetterList)
            setPrevious(response.data.previous)
            setNext(response.data.next)
            setCantidadElementos(response.data.total)
            setIsLoading(false)            
        })
        .catch(error=>{
            // console.log('error')
            // console.log(error)
        })
    }

    const handlePrev = e =>{
        setPageNo(pageNo-1)
    }
    const handleNext= e =>{
        setPageNo(pageNo+1)
    }
    const onClickBuscar = e =>{
        setPageNo(0)
        DataList()
    }

    const editItem = (id) => {
        handleIsEditing(true)
        history.push(`${path}/value?id=${id}`)
    }

    const deleteItem = (id) => {      
        setIsDeleteId(true)
        Delete({url: `${DELETE_NEWSLETTER}/${id}`, access_token: auth.data.access_token})
        .then(response=>{            
            setIsDeleteId(false)            
            toast.success("Eliminado correctamente",{ autoClose: 2000 })
            DataList()
        })
        .catch(error=>{
            // console.log('error')
            // console.log(error)
            toast.error("No se puede ejecutar la acción. Intente más tarde",{ autoClose: 3000 })
        })        
    }

    return(
        <div>
            {
                isLoading
                ? <TableSkeleton />
                : <div className="react-bootstrap-table">
                    <Row className="mb-3">
                        <Col xs="12" md="3">
                                <Form.Control 
                                    type="text" 
                                    value={searchName}
                                    onChange={e=>setSearchName(e.target.value)}
                                    placeholder="Buscar por nombre"/>
                        </Col> 
                        <Col xs="12" md="1">
                            <Button variant="outline-primary" onClick={e=>onClickBuscar()}><FaSearch /></Button>{' '}
                        </Col> 
                    </Row>
                    <Table hover striped className="tableVertical">
                        <thead>
                            <tr>
                                <th width="70%">Nombre</th>
                                <th width="20%">Fecha creación</th>
                                <th width="10%"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                items.length > 0 ?
                                items.map((item,i)=>(
                                    <tr key={i}>
                                        <td>{item.name}</td>
                                        <td>{moment(item.createdAt, "YYYY-MM-DDTHH:mm").format("DD-MM-YYYY HH:mm")}</td>
                                       
                                        <td>
                                            <div>
                                                <Button size="sm" variant="outline-secondary" className="btn-xs" onClick={e => editItem(item.id)} ><FiEdit /></Button>
                                                { (IsDirector(auth.data.role) || IsAdministrador(auth.data.role)) &&
                                                    <Button size="sm" variant="outline-danger" className="btn-xs" onClick={e => deleteItem(item.id)}><RiDeleteBinLine  /></Button>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))
                                :<tr><td colSpan="8" className="text-center">No existen valores a mostrar</td></tr>
                            }
                        </tbody>
                    </Table>
                    <div className="d-flex flex-row-reverse">
                            
                        <ul className="pagination">
                            <li className={`${!previous && "disabled"} paginate_button page-item previous cursor-pointer`} id="dataTable_previous">
                                <span className="page-link" onClick={e=>handlePrev()}>Previous</span>
                            </li>
                            <li className={`${!next && "disabled"} paginate_button page-item next cursor-pointer`} id="dataTable_next">
                                <span className="page-link"  onClick={e=>handleNext()}>Next</span>
                            </li>
                        </ul>
                        <span className="text-muted mr-5">Total de elementos {cantidadElementos}</span>
                    </div>
                </div>
            }
        </div>
    )
}