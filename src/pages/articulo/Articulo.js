import React, { useContext, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";
import { Route, useRouteMatch } from "react-router-dom";
import { Link, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { authContext } from "../../context/AuthContext";
import { BsPlusCircleFill } from "react-icons/bs";
import ArticuloList from "./ArticuloList";
import ArticuloValue from "./ArticuloValue";

export default function Articulo() {
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
              Artículos{" "}
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
            <ArticuloList
              path={path}
              auth={auth}
              handleIsEditing={handleIsEditing}
            />
          </Route>
          <Route exact path={`${path}/value`}>
            <Card.Title>{`${
              isEditing ? "Editar" : "Nuevo"
            } artículo`}</Card.Title>
            <Dropdown.Divider />
            <ArticuloValue auth={auth} isEditing={isEditing} />
          </Route>
        </Switch>
      </Card.Body>
    </Card>
  );
}
