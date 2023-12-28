import React, { useEffect, useState } from 'react'
import TableData from '../components/TableData'
import Get from '../service/Get'
import TableSkeleton from '../loaders/TableSkeleton'
import { Button } from 'react-bootstrap'
import Delete from '../service/Delete'
import { USER_DELETE, USER_GET } from '../service/Routes'
import { FiEdit } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import { loaderRequest } from '../loaders/LoaderRequest'
import {IsSuperadmin} from '../security/IsSuperadmin'

export default function UserList({auth,handleIsEditing,path}){
    const [isLoading, setIsLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [isDeleteId, setIsDeleteId] = useState(false)
    let history = useHistory()

    useEffect(()=>{       
        DataList()                
    }, [])

    const DataList = () =>{
        setIsLoading(true)
        Get({url: USER_GET, access_token: auth.data.access_token})
        .then(response=>{
            setIsLoading(false)
            if(IsSuperadmin(auth.data.role)){
                setUsers(response.data)
            }else{
                //console.log(response.data)
                let arr = []
                response.data.forEach(item=>{
                    if(item.roles.filter(x=>x.name==='ROLE_SUPERADMINISTRADOR').length === 0){
                        arr.push(item)
                    }
                })
                setUsers(arr)
            }
        })
        .catch(error=>{
            // console.log('error')
            // console.log(error)
        })
    }
    
    const nameFormatter = (cell, row) => {
        return `${cell} ${row.last_name}`
    }

    const enabledFormatter = (cell) => {
        if(cell){
            return <span className="text-success">ACTIVO</span>
        }else{
            return <span className="text-danger">NO ACTIVO</span>
        }
    }
    
    const actions = (cell, row, rowIndex) => {
        return (
            <div>
                {/* <Button size="sm" variant="outline-danger" className="btn-xs" onClick={e => deleteItem(row)}><RiDeleteBinLine  /></Button> */}
                <Button size="sm" variant="outline-secondary" className="btn-xs" onClick={e => editItem(row)} ><FiEdit /></Button>
            </div>
        );
    }

    const deleteItem = (data) => {      
        setIsDeleteId(true)
        Delete({url: `${USER_DELETE}/${data.id}`, access_token: auth.data.access_token})
        .then(response=>{            
            setIsDeleteId(false)            
            toast.success("Acción exitosa",{ autoClose: 2000 })
            DataList()
        })
        .catch(error=>{
            // console.log('error')
            // console.log(error)
            toast.error("No se puede ejecutar la acción. Intente más tarde",{ autoClose: 3000 })
        })
        
    }

    const editItem = (data) => {
        handleIsEditing(true)
        history.push(`${path}/value?id=${data.id}`)
    }

    const columns = [
        {
            dataField: 'id',
            headerStyle: { width: '0px' },
            text: 'ID',
            hidden: true
        }, 
        {
            dataField: 'name',
            text: 'Nombre',
            formatter: nameFormatter
        }, 
        {
            dataField: 'email',
            text: 'Correo Electrónico'
        },
        {
            dataField: 'username',
            text: 'Usuario'
        },
        {
            dataField: 'enabled',
            text: 'Activo',
            formatter: enabledFormatter,
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
                {isDeleteId ? loaderRequest() : null}
                {
                    isLoading
                    ? <TableSkeleton />
                    : <TableData columns={columns} products={users} />
                }
        </div>
        
    )
}
