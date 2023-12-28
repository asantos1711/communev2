import React, { useState, useEffect } from "react";
import useQuery from "../../hook/useQuery";
import { useHistory, Link } from "react-router-dom";
import Get from "../../service/Get";
import * as Yup from "yup";
import { Form, Row, Col, Button } from "react-bootstrap";
import { loaderRequest } from "../../loaders/LoaderRequest";
import { Field, FieldArray, Formik } from "formik";
import Skeleton from "react-loading-skeleton";
import Post from "../../service/Post";
import { toast } from "react-toastify";
import {
  ARTICULO_GET,
  ORDENCOMPRA_SAVE,
  PROVEEDOR_GET,
} from "../../service/Routes";

export const estatusOpt = [
  "CREADA",
  "CANCELADA",
  "RECIBIDA TOTAL",
  "RECIBIDA PARCIAL",
];
export const estatuspagoOpt = ["SIN PAGAR", "PAGO PARCIAL", "PAGO TOTAL"];

export default function OrdenCompraValue({ auth, isEditing }) {
  const [isLoadEntity, setLoadEntity] = useState(false);
  const query = useQuery();
  let idEntity = query.get("id");
  let history = useHistory();
  const [initialValues, setInitialValues] = useState({
    id: "",
    estatus: "",
    precio: "",
    estatusPago: "",
    numFacturas: "",
    proveedor: { id: "" },
    ordenCompraArticuloList: [
      {
        articulo: {
          id: "",
        },
        unidadMedida: "",
        cantidad: 1,
        presentacion: "",
        precioUnitario: 0,
      },
    ],
  });
  const [articulosOpt, setArticulosOpt] = useState([]);
  const [proveedorOpt, setProveedorOpt] = useState([]);

  useEffect(() => {
    const fetchProveedorApi = async () => {
      try {
        const response = await Get({
          url: PROVEEDOR_GET,
          access_token: auth.data.access_token,
        });
        setProveedorOpt(response.data);
        console.log(response);
      } catch (error) {}
    };
    fetchProveedorApi();

    //artiuclos
    const fetchArticulosrApi = async () => {
      try {
        const response = await Get({
          url: ARTICULO_GET,
          access_token: auth.data.access_token,
        });
        console.log(response);
        setArticulosOpt(response.data);
      } catch (error) {}
    };
    fetchArticulosrApi();
  }, []);

  const shemaValidate = Yup.object().shape({
    proveedor: Yup.object().shape({
      id: Yup.string().required("Campo Requerido"),
    }),
    estatus: Yup.string().required("Campo Requerido"),
    precio: Yup.string().required("Campo Requerido"),
    estatusPago: Yup.string().required("Campo Requerido"),
  });

  return (
    <div>
      {isLoadEntity ? (
        <Skeleton height={45} />
      ) : (
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={shemaValidate}
          onSubmit={(values, { setSubmitting, setFieldValue }) => {
            console.log(values);
            Post({
              url: ORDENCOMPRA_SAVE,
              data: values,
              access_token: auth.data.access_token,
              header: true,
            })
              .then((response) => {
                setSubmitting(false);
                toast.success("Acción exitosa", { autoClose: 2000 });
                history.push("/admin/ordenescompra");
              })
              .catch((error) => {
                setSubmitting(false);
                //console.log(error)
                toast.error(
                  "No se puede ejecutar la acción. Intente más tarde",
                  { autoClose: 3000 }
                );
              });
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
              {/* {isSubmitting && loaderRequest()} */}
              <input
                type="hidden"
                name="id"
                id="id"
                value={values.id}
                onChange={handleChange}
              />
              <Row>
                <Col xs lg="3">
                  <Form.Group>
                    <Form.Label>
                      Proveedor<span className="text-danger">*</span>
                    </Form.Label>
                    <Field
                      className={`${errors.estatus && "error"} form-control`}
                      name="proveedor.id"
                      as="select"
                    >
                      <option value="">Seleccionar opción</option>
                      {proveedorOpt.map((item) => (
                        <option value={item.id} key={item.id}>
                          {item.nombre}
                        </option>
                      ))}
                    </Field>
                    {errors.proveedor?.id && (
                      <Form.Control.Feedback type="invalid">
                        {errors.proveedor?.id}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
                <Col xs lg="2">
                  <Form.Group>
                    <Form.Label>
                      Estatus<span className="text-danger">*</span>
                    </Form.Label>
                    <Field
                      className={`${errors.estatus && "error"} form-control`}
                      name="estatus"
                      as="select"
                    >
                      <option value="">Seleccionar opción</option>
                      {estatusOpt.map((item) => (
                        <option value={item.id} key={item}>
                          {item}
                        </option>
                      ))}
                    </Field>
                    {errors.estatus && (
                      <Form.Control.Feedback type="invalid">
                        {errors.estatus}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
                <Col xs lg="2">
                  <Form.Group>
                    <Form.Label>
                      Precio<span className="text-danger">*</span>
                    </Form.Label>
                    <Field
                      className={`${errors.precio && "error"} form-control`}
                      name="precio"
                      type="number"
                    />
                    {errors.precio && (
                      <Form.Control.Feedback type="invalid">
                        {errors.precio}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
                <Col xs lg="2">
                  <Form.Group>
                    <Form.Label>
                      Estatus de pago<span className="text-danger">*</span>
                    </Form.Label>
                    <Field
                      className={`${
                        errors.estatusPago && "error"
                      } form-control`}
                      name="estatusPago"
                      as="select"
                    >
                      <option value="">Seleccionar opción</option>
                      {estatuspagoOpt.map((item) => (
                        <option value={item.id} key={item}>
                          {item}
                        </option>
                      ))}
                    </Field>
                    {errors.estatusPago && (
                      <Form.Control.Feedback type="invalid">
                        {errors.estatusPago}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
                <Col xs lg="2">
                  <Form.Group>
                    <Form.Label>
                      Cantidad de facturas<span className="text-danger">*</span>
                    </Form.Label>
                    <Field
                      className={`${
                        errors.numFacturas && "error"
                      } form-control`}
                      name="numFacturas"
                      type="number"
                    />
                    {errors.numFacturas && (
                      <Form.Control.Feedback type="invalid">
                        {errors.numFacturas}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col xs="12" md="12">
                  <FieldArray
                    name="ordenCompraArticuloList"
                    render={(arrayHelper) => (
                      <div>
                        {values.ordenCompraArticuloList &&
                          values.ordenCompraArticuloList.length > 0 &&
                          values.ordenCompraArticuloList.map((item, index) => (
                            <div key={index}>
                              <Row>
                                <Col xs="12" md="3">
                                  <Form.Group>
                                    <Form.Label className="mb-0">
                                      Artículo
                                      <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Field
                                      className={`form-control ${
                                        errors?.ordenCompraArticuloList
                                          ?.length > 0 &&
                                        errors.ordenCompraArticuloList[index]
                                          ?.articulo?.id
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      name={`ordenCompraArticuloList.${index}.articulo.id`}
                                      as="select"
                                    >
                                      <option value="">
                                        Seleccionar opción
                                      </option>
                                      {articulosOpt.map((item) => (
                                        <option value={item.id} key={item.id}>
                                          {item.nombre}
                                        </option>
                                      ))}
                                    </Field>
                                  </Form.Group>
                                </Col>
                                <Col xs="12" md="2">
                                  <Form.Group>
                                    <Form.Label className="mb-0">
                                      Presentación:
                                    </Form.Label>
                                    <Field
                                      className={`form-control ${
                                        errors?.ordenCompraArticuloList
                                          ?.length > 0 &&
                                        errors.ordenCompraArticuloList[index]
                                          ?.presentacion
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      name={`ordenCompraArticuloList.${index}.presentacion`}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col xs="12" md="2">
                                  <Form.Group>
                                    <Form.Label className="mb-0">
                                      UM:
                                    </Form.Label>
                                    <Field
                                      className={`form-control ${
                                        errors?.ordenCompraArticuloList
                                          ?.length > 0 &&
                                        errors.ordenCompraArticuloList[index]
                                          ?.unidadMedida
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      name={`ordenCompraArticuloList.${index}.unidadMedida`}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col xs="12" md="2">
                                  <Form.Group>
                                    <Form.Label className="mb-0">
                                      Precio unitario:
                                    </Form.Label>
                                    <Field
                                      className={`form-control ${
                                        errors?.ordenCompraArticuloList
                                          ?.length > 0 &&
                                        errors.ordenCompraArticuloList[index]
                                          ?.precioUnitario
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      name={`ordenCompraArticuloList.${index}.precioUnitario`}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col xs="12" md="2">
                                  <Form.Group>
                                    <Form.Label className="mb-0">
                                      Cantidad:
                                    </Form.Label>
                                    <Field
                                      className={`form-control ${
                                        errors?.ordenCompraArticuloList
                                          ?.length > 0 &&
                                        errors.ordenCompraArticuloList[index]
                                          ?.cantidad
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      name={`ordenCompraArticuloList.${index}.cantidad`}
                                    />
                                  </Form.Group>
                                </Col>
                                {index > 0 && (
                                  <Col xs="12" md="1">
                                    <Form.Group>
                                      <Form.Label className="mb-0 opacity-0">
                                        Cantidad:
                                      </Form.Label>
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() =>
                                          arrayHelper.remove(index)
                                        }
                                      >
                                        Eliminar
                                      </Button>
                                    </Form.Group>
                                  </Col>
                                )}
                              </Row>
                            </div>
                          ))}
                        <Button
                          type="button"
                          variant="link"
                          onClick={() =>
                            arrayHelper.push({
                              articulo: {
                                id: "",
                              },
                              cantidad: 1,
                              presentacion: "",
                              precioUnitario: 0,
                            })
                          }
                        >
                          <i className="mdi mdi-notebook-plus-outline me-1"></i>
                          Agregar nuevo artículo
                        </Button>
                      </div>
                    )}
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Aceptar
                  </Button>{" "}
                  <Link to="/admin/ordenescompra" className="btn btn-secondary">
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
