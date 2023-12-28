import React, { useContext, useState } from "react";
import { useRouteMatch, Switch, Route, Link } from "react-router-dom";
import { authContext } from "../context/AuthContext";
import { Card, Dropdown } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { BsPlusCircleFill } from "react-icons/bs";
import TipoDocumentoList from "./TipoDocumentoList";
import TipoDocumentoValue from "./TipoDocumentoValue";

export default function TipoDocumento() {
  let { path, url } = useRouteMatch();
  const { auth } = useContext(authContext);
  const [isEditing, setIsEditing] = useState(false);

  const handleIsEditing = (valor) => {
    setIsEditing(valor);
  };

  return (
    <Card className="shadow">
      <ToastContainer />
      <Card.Body>
        <Switch>
          <Route path={path} exact>
            <Card.Title>
              Tipo documento{" "}
              <small>
                <Link
                  to={`${url}/value`}
                  className="btn btn-outline-primary btn-sm"
                >
                  <BsPlusCircleFill className="mt-m5" /> Nuevo
                </Link>
              </small>
            </Card.Title>
            <Dropdown.Divider />
            <TipoDocumentoList
              path={path}
              auth={auth}
              handleIsEditing={handleIsEditing}
            />
          </Route>
          <Route exact path={`${path}/value`}>
            <Card.Title>{`${
              isEditing ? "Editar" : "Nuevo"
            } tipo de documento`}</Card.Title>
            <Dropdown.Divider />
            <TipoDocumentoValue auth={auth} isEditing={isEditing} />
          </Route>
        </Switch>
      </Card.Body>
    </Card>
  );
}
