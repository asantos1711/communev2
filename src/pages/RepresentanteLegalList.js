import React, { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import { FiEdit } from "react-icons/fi"
import { RiDeleteBinLine } from "react-icons/ri"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { toast } from "react-toastify"
import ComponentModalDelete from "../components/ComponentModalDelete"
import TableData from "../components/TableData"
import TableSkeleton from "../loaders/TableSkeleton"
import { IsAdministrador } from "../security/IsAdministrador"
import { IsDirector } from "../security/IsDirector"
import Delete from "../service/Delete"
import Get from "../service/Get"
import {REPRESENTANTE_LEGAL_DELETE, REPRESENTANTE_LEGAL_GET} from '../service/Routes'

export default function RepresentanteLegalList({auth,handleIsEditing,path, url}){
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    let history = useHistory()
    const [isDelete, setIsDelete] = useState(false)
    const [idDelete, setIdDelete] = useState(null)
    const [showModalDelete, setShowModalDelete] = useState(false)

    const handleCloseModal = () => setShowModalDelete(false)

    useEffect(()=>{       
        DataList()                
    }, [])

    const DataList = () =>{
        setIsLoading(true)
        Get({url: `${REPRESENTANTE_LEGAL_GET}`, access_token: auth.data.access_token})
        .then(response=>{           
            console.log(response)
            setItems(response.data)
            setIsLoading(false)
        })
        .catch(error=>{
            // console.log('error')
            // console.log(error)
        })
    }
    const actions = (cell, row, rowIndex) => {
        return (
            <div>
                <Button size="sm" variant="outline-secondary" className="btn-xs" onClick={e => editItem(row)} ><FiEdit /></Button>
                { (IsDirector(auth.data.role) || IsAdministrador(auth.data.role)) &&
                    <Button size="sm" variant="outline-danger" className="btn-xs" onClick={e => deleteItem(row.id)}><RiDeleteBinLine  /></Button>
                }
            </div>
        );
    }
    const deleteItem = (id) => {
        setIdDelete(id)
        setShowModalDelete(true)                
    }
    const handleDelete = () =>{
        setIsDelete(true)
        Delete({url: `${REPRESENTANTE_LEGAL_DELETE}/${idDelete}`, access_token: auth.data.access_token})
        .then(response=>{            
            setIsDelete(false) 
            setShowModalDelete(false)           
            toast.success("Acción exitosa",{ autoClose: 2000 })
            DataList()
        })
        .catch(error=>{
            // console.log('error')
            // console.log(error)
            setIsDelete(false)
            setShowModalDelete(false)
            toast.error("No se puede ejecutar la acción. Intente más tarde",{ autoClose: 3000 })
        })
    }
    const editItem = (data) => {
        handleIsEditing(true)
        history.push(`${url}/value?id=${data.id}`)
    }

    const formatLoteList = (cell, row) =>{
        return(
            row.loteList.map((item,i)=>(
                <span className="badge badge-light badge-pill mr-1" key={i}>{item.referencia}</span>
            ))
        )
    }
    const columns = [
        {
            dataField: 'id',
            text: 'ID',
            hidden: true
        }, 
        {
            dataField: 'name',
            text: 'Nombre',
        },
        {
            dataField: 'tipoPoder',
            text: 'Tipo de poder',
        },
        {
            dataField: 'lote',
            text: 'Referencias',
            formatter: formatLoteList
        },
        {
            dataField: '',
            isDummyField: true,
            text: '',
            headerAlign: 'center',
            align: 'center',
            headerStyle: { width: '10%' },
            formatter: actions,            
        }
    ];

    return(
        <div>
            {
                isLoading
                ? <TableSkeleton />
                : <TableData columns={columns} products={items} />
            }
            <ComponentModalDelete 
                handleDelete={handleDelete} 
                show={showModalDelete}
                handleClose={handleCloseModal}
                isDelete={isDelete}
            />
        </div>          
    )
}