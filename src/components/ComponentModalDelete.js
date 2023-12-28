import React from 'react'
import { Button, Modal } from "react-bootstrap";
import { MdWarning } from 'react-icons/md';
import SimpleLoad from '../loaders/SimpleLoad';

export default function ComponentModalDelete({handleDelete, show,handleClose,isDelete}){


    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Body className="position-relative overflow-hidden">
                {isDelete && <SimpleLoad />}
                <h5><MdWarning className="text-danger"/> Estás seguro que deseas eliminar!!!</h5>
                <p>No podrás deshacer esta acción</p>

                <div className="text-right">
                    <Button variant="light" onClick={handleClose}>Cancelar</Button>{' '}
                    <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}