import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { authContext } from "../context/AuthContext";
import CardSkeleton from "../loaders/CardSkeleton";
import Get from "../service/Get";
import {
  RESIDENTE_GET_By_ID,
  RESIDENTE_GET_DATOS_CONTACTO,
} from "../service/Routes";

export default function DatosContacto() {
  const { id, idLote } = useParams();
  const { auth } = useContext(authContext);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({
    correoElectronicoList: [],
    telefonoList: [],
    name: "",
    inquilinosList: [],
    representanteLegal: null,
  });

  //aqui vamos a buscar a los inquilinos y representante legal
  useEffect(() => {
    console.log(idLote);
    const fetchDCApi = async () => {
      try {
        const response = await Get({
          url: `${RESIDENTE_GET_DATOS_CONTACTO}/${id}/${idLote}`,
          access_token: auth.data.access_token,
        });
        setItem(response.data.data);
        setLoading(false);
        console.log(response);
      } catch (error) {
        toast.error("Ocurrió un error. Intente más tarde", { autoClose: 6000 });
        setLoading(false);
      }
    };
    fetchDCApi();
  }, []);

  return (
    <Row>
      <ToastContainer />
      <Col>
        <Row className="mb-4">
          <Col>
            {loading ? (
              <CardSkeleton height={200} />
            ) : (
              <Row>
                <Col xs="12" md="12">
                  <Card className="shadow">
                    <Card.Body>
                      <Row>
                        <Col xs="12" md="12">
                          <h5>{item.name}</h5>
                        </Col>
                        <Col xs="6" md="6">
                          <h6>Correo electronicos</h6>
                          <ol className="pl-3">
                            {item.correoElectronicoList.map((item, i) => (
                              <li key={i}>
                                {item.referencia !== ""
                                  ? `${item.referencia} -`
                                  : ""}
                                {item.correo}
                              </li>
                            ))}
                          </ol>
                        </Col>
                        <Col xs="6" md="6">
                          <h6>Telefonos</h6>
                          <ol className="pl-3">
                            {item.telefonoList.map((item, i) => (
                              <li key={i}>
                                {item.tipoNumeroTelefono.name}-{item.numero}
                              </li>
                            ))}
                          </ol>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs="12" md="12" className="mt-4">
                  <Card className="shadow">
                    <Card.Header>Inquilinos</Card.Header>
                    {item.inquilinosList.length > 0 ? (
                      <Card.Body>
                        {item.inquilinosList.map((it) => (
                          <Row key={it.id}>
                            <Col xs="12" md="12">
                              <h5>{it.name}</h5>
                            </Col>
                            <Col xs="6" md="6">
                              <h6>Correo electronicos</h6>
                              <ol className="pl-3">
                                {it.correoElectronicoList.map((item, i) => (
                                  <li key={i}>
                                    {item.referencia !== ""
                                      ? `${item.referencia} -`
                                      : ""}
                                    {item.correo}
                                  </li>
                                ))}
                              </ol>
                            </Col>
                            <Col xs="6" md="6">
                              <h6>Telefonos</h6>
                              <ol className="pl-3">
                                {it.telefonoList.map((item, i) => (
                                  <li key={i}>
                                    {item.tipoNumeroTelefono.name}-{item.numero}
                                  </li>
                                ))}
                              </ol>
                            </Col>
                          </Row>
                        ))}
                      </Card.Body>
                    ) : (
                      <Card.Body>No existe inquilinos</Card.Body>
                    )}
                  </Card>
                </Col>
                <Col xs="12" md="12" className="mt-4">
                  <Card className="shadow">
                    <Card.Header>Representante legal</Card.Header>
                    {item.representanteLegal ? (
                      <Card.Body>
                        <Row>
                          <Col xs="12" md="12">
                            <h5>{item.representanteLegal?.name}</h5>
                          </Col>
                          <Col xs="6" md="6">
                            <h6>Correo electronicos</h6>
                            <ol className="pl-3">
                              {item.representanteLegal.correoElectronicoList.map(
                                (item, i) => (
                                  <li key={i}>
                                    {item.referencia !== ""
                                      ? `${item.referencia} -`
                                      : ""}
                                    {item.correo}
                                  </li>
                                )
                              )}
                            </ol>
                          </Col>
                          <Col xs="6" md="6">
                            <h6>Telefonos</h6>
                            <ol className="pl-3">
                              {item.representanteLegal.telefonoList.map(
                                (item, i) => (
                                  <li key={i}>
                                    {item.tipoNumeroTelefono.name}-{item.numero}
                                  </li>
                                )
                              )}
                            </ol>
                          </Col>
                        </Row>
                      </Card.Body>
                    ) : (
                      <Card.Body>No existe representante legal</Card.Body>
                    )}
                  </Card>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
