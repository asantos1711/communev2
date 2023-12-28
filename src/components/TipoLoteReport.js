import React from "react";
import { Card, Dropdown } from "react-bootstrap";
import { FaBuilding } from "react-icons/fa";
import { Link, useRouteMatch } from "react-router-dom";

export default function TipoLoteReport() {
  let { url } = useRouteMatch();

  return (
    <Card className="shadow btcl-cyan btw-2">
      <Card.Body>
        <Card.Title>
          <FaBuilding className="mb-1" /> Lotes
        </Card.Title>
        <Dropdown.Divider />
        <ul className="list-inline mt-3">
          <li className="list-inline-item">
            <Link
              to={`${url}/tipolote`}
              className="btn btn-outline-secondary btn-sm"
            >
              Tipo de lote
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              to={`${url}/descuentos-cancelaciones`}
              className="btn btn-outline-secondary btn-sm"
            >
              Descuentos / Cancelaciones
            </Link>
          </li>
        </ul>
      </Card.Body>
    </Card>
  );
}
