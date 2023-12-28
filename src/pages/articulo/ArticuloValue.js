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
import { ARTICULO_GET_BY_ID, ARTICULO_SAVE } from "../../service/Routes";

export default function ArticuloValue({ auth, isEditing }) {
  const [isLoadEntity, setLoadEntity] = useState(false);
  const query = useQuery();
  let idEntity = query.get("id");
  let history = useHistory();
  const [initialValues, setInitialValues] = useState({
    id: "",
    nombre: "",
  });

  useEffect(() => {
    if (idEntity) {
      setLoadEntity(true);
      Get({
        url: `${ARTICULO_GET_BY_ID}/${idEntity}`,
        access_token: auth.data.access_token,
      })
        .then((response) => {
          let entity = {
            id: response.data.data.id,
            nombre: response.data.data.nombre,
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
              url: ARTICULO_SAVE,
              data: values,
              access_token: auth.data.access_token,
              header: true,
            })
              .then((response) => {
                setSubmitting(false);
                toast.success("Acción exitosa", { autoClose: 2000 });
                history.push("/admin/articulos");
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
                      Nombre<span className="text-danger">*</span>
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
                  <Link to="/admin/articulos" className="btn btn-secondary">
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
