import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import useQuery from "../../hook/useQuery";
import Get from "../../service/Get";
import {
  GET_NEWSLETTER_BY_ID,
  I_MORATORIOS_GET,
  I_MORATORIOS_SAVE,
  I_MORATORIOS_SAVE_MASIVO,
  LOTE_FOR_VEHICLES,
  SAVE_NEWSLETTER,
} from "../../service/Routes";
import * as Yup from "yup";
import UserSkeleton from "../../loaders/UserSkeleton";
import { Formik } from "formik";
import Post from "../../service/Post";
import { toast } from "react-toastify";
import { loaderRequest } from "../../loaders/LoaderRequest";
import { Button, Col, Form, Row } from "react-bootstrap";
import SelectAjax from "../../components/SelectAjax";

export default function InteresesMoratoriosValue({ auth }) {
  const [isLoadUser, setLoadUser] = useState(false);
  const query = useQuery();
  let id = query.get("id");
  const history = useHistory();
  const [lote, setLote] = useState(null);
  const [tipoLote, setTipoLote] = useState("");
  const [porcentaje, setPorcentaje] = useState(0);

  const [initialValues, setInitialValues] = useState({
    id: null,
    activo: "",
    lote: null,
    porcentaje: "",
  });

  useEffect(() => {
    if (id) {
      setLoadUser(true);
      Get({
        url: `${I_MORATORIOS_GET}/${id}`,
        access_token: auth.data.access_token,
      })
        .then((response) => {
          console.log(response);
          let it = {
            id: response.data.data.id ?? null,
            activo: response.data.data.activo,
            porcentaje: response.data.data.porcentaje,
            lote: response.data.data.lote,
          };
          setInitialValues(it);
          setLote({ value: it.lote.id, label: it.lote.referencia });
          setPorcentaje(it.porcentaje);
          setLoadUser(false);
        })
        .catch((error) => {
          // console.log("error")
          // console.log(error)
        });
    }
  }, []);

  const schemaValidate = Yup.object().shape({});

  return (
    <div>
      {isLoadUser ? (
        <UserSkeleton />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={schemaValidate}
          onSubmit={async (values, { setSubmitting, setFieldValue }) => {
            try {
              const newValues = {
                ...values,
                lote: {
                  id: lote.value,
                },
                porcentaje: porcentaje,
              };
              if (lote) {
                let response = await Post({
                  url: I_MORATORIOS_SAVE,
                  data: newValues,
                  access_token: auth.data.access_token,
                  header: true,
                });
                if (response.data.success) {
                  toast.success("Acción exitosa", { autoClose: 2000 });
                  setTimeout(() => {
                    history.push("/admin/interesesmoratorios");
                  }, 2000);
                } else {
                  toast.info(response.data.message, { autoClose: 8000 });
                }
              } else {
                const url = `${I_MORATORIOS_SAVE_MASIVO}/${tipoLote}/${porcentaje}/${values.activo}`;
                let response = await Post({
                  url: url,
                  data: {},
                  access_token: auth.data.access_token,
                  header: true,
                });
                if (response.data.success) {
                  toast.success("Acción exitosa", { autoClose: 2000 });
                  setTimeout(() => {
                    history.push("/admin/interesesmoratorios");
                  }, 2000);
                } else {
                  toast.info(response.data.message, { autoClose: 8000 });
                }
              }
              setSubmitting(false);
            } catch (error) {
              toast.error(
                "No podemos ejecutar la acción. Contacte al administrador por favor",
                { autoClose: 8000 }
              );
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
            setFieldValue,
          }) => (
            <Form className="mt-4 form" onSubmit={handleSubmit}>
              {isSubmitting && loaderRequest()}
              <Row>
                <Col xs lg="4">
                  <Form.Group>
                    <Form.Label>
                      Lote <span className="text-danger">*</span>
                    </Form.Label>
                    <SelectAjax
                      defaultValue={lote}
                      url={LOTE_FOR_VEHICLES}
                      access_token={auth.data.access_token}
                      isMulti={false}
                      handleChange={(value) => {
                        setLote(value);
                      }}
                      defaultOptions={lote}
                      valid={true}
                      isClearable={true}
                    />
                  </Form.Group>
                </Col>
                {!values.id && (
                  <Col xs="12" lg="3">
                    <Form.Group>
                      <Form.Label>Tipo de lote</Form.Label>
                      <Form.Control
                        as="select"
                        value={tipoLote}
                        onChange={(e) => setTipoLote(e.target.value)}
                      >
                        <option value="">Seleccionar opción</option>
                        <option value="condominal">Condominal</option>
                        <option value="habitacional">Habitacional</option>
                        <option value="comercial">Comercial</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                )}
              </Row>
              <Row>
                <Col xs="12" md="3">
                  <Form.Group>
                    <Form.Label>Porcentaje</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      max="100"
                      value={porcentaje}
                      onChange={(e) => setPorcentaje(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs lg="2">
                  <Form.Group>
                    <Form.Label className="opacity-0">Activo</Form.Label>
                    <Form.Check
                      type="switch"
                      id="activo"
                      label="Activo"
                      name="activo"
                      checked={values.activo}
                      onChange={() => setFieldValue("activo", !values.activo)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Aceptar
                  </Button>{" "}
                  <Link
                    to="/admin/interesesmoratorios"
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </Link>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
