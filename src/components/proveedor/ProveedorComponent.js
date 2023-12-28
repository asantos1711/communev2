import React from "react";
import { Card, Dropdown } from "react-bootstrap";
import { AiOutlineAppstore } from "react-icons/ai";
import { Link, useRouteMatch } from "react-router-dom";

export default function ProveedorComponentt() {
  const { url } = useRouteMatch();

  return (
    <Card className="shadow btcl-danger btw-2">
      <Card.Body>
        <Card.Title>
          <AiOutlineAppstore className="mb-1" /> Proveedores
        </Card.Title>
        <Dropdown.Divider />
        <ul className="list-inline mt-3">
          <li className="list-inline-item">
            <Link
              to={`${url}/proveedores`}
              className="btn btn-outline-secondary btn-sm mb-2"
            >
              Proveedores
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              to={`${url}/articulos`}
              className="btn btn-outline-secondary btn-sm mb-2"
            >
              Artículos
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              to={`${url}/ordenescompra`}
              className="btn btn-outline-secondary btn-sm mb-2"
            >
              Órdenes de compra
            </Link>
          </li>
        </ul>
      </Card.Body>
    </Card>
  );
}
