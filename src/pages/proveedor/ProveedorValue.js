import React, { useState, useEffect } from "react";
import useQuery from "../../hook/useQuery";
import { useHistory, Link } from "react-router-dom";
import Get from "../../service/Get";
import * as Yup from "yup";
import { Form, Row, Col, Button } from "react-bootstrap";
import { loaderRequest } from "../../loaders/LoaderRequest";
import { Field, Formik } from "formik";
import Skeleton from "react-loading-skeleton";
import Post from "../../service/Post";
import { toast } from "react-toastify";
import { PROVEEDOR_GET_BY_ID, PROVEEDOR_SAVE } from "../../service/Routes";

export default function ProveedorValue({ auth, isEditing }) {
  const [isLoadEntity, setLoadEntity] = useState(false);
  const query = useQuery();
  let idEntity = query.get("id");
  let history = useHistory();
  const [initialValues, setInitialValues] = useState({
    id: "",
    nombre: "",
    nombreComercial: "",
    rfc: "",
    nombreContacto: "",
    correo: "",
    telefono: "",
  });

  useEffect(() => {
    if (idEntity) {
      setLoadEntity(true);
      Get({
        url: `${PROVEEDOR_GET_BY_ID}/${idEntity}`,
        access_token: auth.data.access_token,
      })
        .then((response) => {
          let entity = {
            id: response.data.data.id,
            nombre: response.data.data.nombre,
            nombreComercial: response.data.data.nombreComercial,
            rfc: response.data.data.rfc,
            nombreContacto: response.data.data.nombreContacto,
            correo: response.data.data.correo,
            telefono: response.data.data.telefono,
          };
          setInitialValues(entity);
          setLoadEntity(false);
        })
        .catch((error) => {
          // console.log("error")
          // console.log(error)
        });
    }
  }, [idEntity, auth.data.access_token]);

  const shemaValidate = Yup.object().shape({
    nombre: Yup.string().required("Campo Requerido"),
    nombreComercial: Yup.string().required("Campo Requerido"),
    nombreContacto: Yup.string().required("Campo Requerido"),
    telefono: Yup.string().required("Campo Requerido"),
  });

  return (
    <div>
      {isLoadEntity ? (
        <Skeleton height={45} />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={shemaValidate}
          onSubmit={(values, { setSubmitting, setFieldValue }) => {
            Post({
              url: PROVEEDOR_SAVE,
              data: values,
              access_token: auth.data.access_token,
              header: true,
            })
              .then((response) => {
                setSubmitting(false);
                toast.success("Acción exitosa", { autoClose: 2000 });
                history.push("/admin/proveedores");
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
              {isSubmitting && loaderRequest()}
              <input
                type="hidden"
                name="id"
                id="id"
                value={values.id}
                onChange={handleChange}
              />
              <Row>
                <Col xs lg="4">
                  <Form.Group>
                    <Form.Label>
                      Nombre/Razón Social<span className="text-danger">*</span>
                    </Form.Label>
                    <Field
                      className={`${errors.nombre && "error"} form-control`}
                      name="nombre"
                    />
                    {errors.nombre && (
                      <Form.Control.Feedback type="invalid">
                        {errors.nombre}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
                <Col xs lg="4">
                  <Form.Group>
                    <Form.Label>
                      Nombre comercial<span className="text-danger">*</span>
                    </Form.Label>
                    <Field
                      className={`${
                        errors.nombreComercial && "error"
                      } form-control`}
                      name="nombreComercial"
                    />
                    {errors.nombreComercial && (
                      <Form.Control.Feedback type="invalid">
                        {errors.nombreComercial}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
                <Col xs lg="4">
                  <Form.Group>
                    <Form.Label>
                      RFC<span className="text-danger">*</span>
                    </Form.Label>
                    <Field
                      className={`${errors.rfc && "error"} form-control`}
                      name="rfc"
                    />
                    {errors.rfc && (
                      <Form.Control.Feedback type="invalid">
                        {errors.rfc}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
                <Col xs lg="4">
                  <Form.Group>
                    <Form.Label>
                      Contacto<span className="text-danger">*</span>
                    </Form.Label>
                    <Field
                      className={`${
                        errors.nombreContacto && "error"
                      } form-control`}
                      name="nombreContacto"
                    />
                    {errors.nombreContacto && (
                      <Form.Control.Feedback type="invalid">
                        {errors.nombreContacto}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
                <Col xs lg="4">
                  <Form.Group>
                    <Form.Label>
                      Correo electrónico<span className="text-danger">*</span>
                    </Form.Label>
                    <Field
                      className={`${errors.correo && "error"} form-control`}
                      name="correo"
                    />
                    {errors.correo && (
                      <Form.Control.Feedback type="invalid">
                        {errors.correo}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
                <Col xs lg="4">
                  <Form.Group>
                    <Form.Label>
                      Teléfono<span className="text-danger">*</span>
                    </Form.Label>
                    <Field
                      className={`${errors.telefono && "error"} form-control`}
                      name="telefono"
                    />
                    {errors.telefono && (
                      <Form.Control.Feedback type="invalid">
                        {errors.telefono}
                      </Form.Control.Feedback>
                    )}
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
                  <Link to="/admin/proveedores" className="btn btn-secondary">
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
