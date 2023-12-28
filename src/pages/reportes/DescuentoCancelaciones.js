import React, { useContext } from "react";
import { useState } from "react";
import {
  Container,
  Card,
  Col,
  Dropdown,
  Row,
  Form,
  Button,
  Jumbotron,
  Table,
} from "react-bootstrap";
import { authContext } from "../../context/AuthContext";
import { loaderRequest } from "../../loaders/LoaderRequest";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { FaSearch } from "react-icons/fa";
import moment from "moment";
import { REPORTE_DESCUENTOS_CANCELACIONES } from "../../service/Routes";
import Get from "../../service/Get";
import parseObjectToQueryUrl from "../../utils/parseObjectToQueryUrl";

const DescuentoCancelaciones = () => {
  const [isSubmiting, setSubmiting] = useState(false);
  const { auth } = useContext(authContext);
  const [tipo, setTipo] = useState("1");
  const [referencia, setReferencia] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [items, setItems] = useState([]);

  const handleStartDate = (date) => {
    //console.log(date)
    if (date === null || date === "") {
      setStartDate(new Date());
      setEndDate(new Date());
    } else {
      setStartDate(date);
      if (date > endDate) {
        setEndDate(date);
      }
    }
  };
  const handleEndDate = (date) => {
    if (date === null || date === "") {
      setEndDate(startDate);
    } else {
      if (startDate === "" || startDate === null) {
        setStartDate(date);
      }
      setEndDate(date);
    }
  };
  const report = async () => {
    const d = {
      dateIni: startDate ? moment(startDate).format("YYYY-MM-DD") : "",
      dateFin: endDate ? moment(endDate).format("YYYY-MM-DD") : "",
      tipo: tipo,
      referencia: referencia,
    };
    const q = parseObjectToQueryUrl(d);
    setSubmiting(true);
    try {
      const response = await Get({
        url: `${REPORTE_DESCUENTOS_CANCELACIONES}?${q}`,
        access_token: auth.data.access_token,
      });
      console.log(response);
      setItems(response.data.data);
      setSubmiting(false);
    } catch (error) {
      setItems([]);
      console.log(error);
      setSubmiting(false);
    }
  };

  return (
    <div>
      {isSubmiting && loaderRequest()}
      <Row className="mb-4">
        <Col>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Descuento / Cancelaciones</Card.Title>
              <Dropdown.Divider />
              <Row>
                <Col xs lg="2">
                  <Form.Group as={Row} controlId="formPlaintextEmail">
                    <Form.Label column sm="3" className="pr-0">
                      Tipo
                    </Form.Label>
                    <Col sm="9" className="pl-0">
                      <select
                        className="form-control"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                      >
                        <option value="1">Descuento</option>
                        <option value="2">Cancelaciones</option>
                      </select>
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs lg="3">
                  <Form.Group as={Row} controlId="formPlaintextEmail">
                    <Form.Label column sm="4" className="pr-0">
                      Referencia
                    </Form.Label>
                    <Col sm="8" className="pl-0">
                      <Form.Control
                        value={referencia}
                        onChange={(e) => setReferencia(e.target.value)}
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs lg="3">
                  <Form.Group as={Row} controlId="formPlaintextEmail">
                    <Form.Label column sm="3" className="pr-0">
                      Desde
                    </Form.Label>
                    <Col sm="9" className="pl-0">
                      <DatePicker
                        className="form-control"
                        dateFormat="dd-MM-yyyy"
                        locale="es"
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        selected={startDate}
                        onChange={(date) => handleStartDate(date)}
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs lg="3">
                  <Form.Group as={Row} controlId="formPlaintextEmail">
                    <Form.Label column sm="3" className="pr-0">
                      Hasta
                    </Form.Label>
                    <Col sm="9" className="pl-0">
                      <DatePicker
                        className="form-control"
                        dateFormat="dd-MM-yyyy"
                        locale="es"
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        selected={endDate}
                        onChange={(date) => handleEndDate(date)}
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs lg="1">
                  <Button variant="outline-primary" onClick={(e) => report()}>
                    <FaSearch />
                  </Button>{" "}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="shadow">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <h6>Detalle</h6>
              </div>
              <Dropdown.Divider />
              {items.length === 0 ? (
                <Row>
                  <Col>
                    <Jumbotron fluid className="text-center">
                      <Container>
                        No hay resultados que mostrar. Seleccione nuevas fechas
                        por favor
                      </Container>
                    </Jumbotron>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col
                    className={`${items.length > 10 && "h-600"} mb-2`}
                    xs="12"
                    lg="12"
                  >
                    <Table size="sm" hover responsive id="tableCC">
                      <thead>
                        <tr>
                          <th>Referencia</th>
                          <th>Residente</th>
                          <th>Fecha operación</th>
                          <th>
                            {tipo === "1" ? "Descuento %" : "Monto cancelado"}
                          </th>
                          {tipo === "1" && <th>Autorización</th>}
                          <th>Entidad</th>
                          <th>
                            {tipo === "1" ? "Descripción" : "Razón cancelación"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, i) => (
                          <tr key={i}>
                            <td>{item.referencia}</td>
                            <td>{item.residente}</td>
                            <td>
                              {moment(item.fechaOperacion, "YYYY-MM-DD").format(
                                "DD-MM-YYYY"
                              )}
                            </td>
                            <td>
                              {tipo === "1"
                                ? item.percentDescuento
                                : item.montoCancelado}
                            </td>
                            {tipo === "1" && <td>{item.autorizado}</td>}
                            <td>{item.entidad}</td>
                            <td>{item.descripcion}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DescuentoCancelaciones;
