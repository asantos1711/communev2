import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Row, Col, Card, Dropdown, Form, Button, Alert } from "react-bootstrap";
import { RiArrowGoBackLine } from "react-icons/ri";
import { loaderRequest } from "../loaders/LoaderRequest";
import {
  CARGO_CUOTA_EXTRAORDINARIA_BY_LOTE,
  LOTE_FOR_VEHICLES,
} from "../service/Routes";
import Post from "../service/Post";
import { toast } from "react-toastify";
import SelectAjax from "../components/SelectAjax";

export default function CuotaExtraordinariaGeneradaNuevaLote({
  selectOpt,
  access_token,
}) {
  const history = useHistory();
  const [isSubmiting, setSubmiting] = useState(false);
  const [idCuota, setIdCuota] = useState("");
  const [lote, setLote] = useState(null);
  const [validForm, setValidForm] = useState(true);

  const handleSubmit = (e) => {
    if (idCuota === "" || !lote) {
      setValidForm(false);
      //console.log('error')
    } else {
      setSubmiting(true);
      setValidForm(true);
      //console.log('checktru')
      const d = {
        idCuota: idCuota,
        checkCondominal: false,
        checkHabitacional: false,
        checkComercial: false,
      };

      //console.log(d)
      Post({
        url: `${CARGO_CUOTA_EXTRAORDINARIA_BY_LOTE}/${lote.value}`,
        data: d,
        access_token: access_token,
        header: true,
      })
        .then((response) => {
          //console.log(response)
          setSubmiting(false);
          if (response.data.success) {
            toast.success("Acción exitosa", { autoClose: 2000 });
            history.push("/admin/cuota-extraordinaria-generadas");
          } else {
            toast.info(response.data.message, { autoClose: 8000 });
          }
        })
        .catch((error) => {
          setSubmiting(false);
          //console.log(error)
          toast.error(
            "En estos momentos no se puede realizar la acción. Intente más tarde o contacte con el administrador",
            { autoClose: 10000 }
          );
        });
    }
  };

  return (
    <div>
      {isSubmiting && loaderRequest()}
      <Row className="mb-1">
        <Col className="text-right">
          <span
            className="badge badge-pill badge-dark go-back"
            onClick={history.goBack}
          >
            <RiArrowGoBackLine /> Atrás
          </span>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Generar Cuota extraordinaria por lote</Card.Title>
              <Dropdown.Divider />
              {!validForm && (
                <Alert variant="danger">
                  Debe seleccionar el tipo de cuota extraordinaria y el lote
                </Alert>
              )}
              <Row>
                <Col xs="12" lg="3">
                  <Form.Group>
                    <Form.Label>Tipo cuota extraordinaria</Form.Label>
                    <Form.Control
                      as="select"
                      value={idCuota}
                      onChange={(e) => setIdCuota(e.target.value)}
                    >
                      <option value="">Seleccionar opción</option>
                      {selectOpt.map((item, i) => (
                        <option key={i} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col xs="12" lg="3">
                  <Form.Group>
                    <Form.Label>Lote</Form.Label>
                    <SelectAjax
                      defaultValue={lote}
                      url={LOTE_FOR_VEHICLES}
                      access_token={access_token}
                      isMulti={false}
                      handleChange={(value) => {
                        setLote(value);
                      }}
                      valid={true}
                      defaultOptions={lote}
                      isClearable={false}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="primary" onClick={(e) => handleSubmit()}>
                    Aceptar
                  </Button>{" "}
                  <Link
                    to={`/admin/cuota-extraordinaria-generadas`}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
