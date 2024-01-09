import React from "react";
import { Card, Dropdown } from "react-bootstrap";
import { AiOutlineAppstore } from "react-icons/ai";
import { Link, useRouteMatch } from "react-router-dom";

export default function MoratoriosComponent() {
  const { url } = useRouteMatch();

  return (
    <Card className="shadow btcl-danger btw-2">
      <Card.Body>
        <Card.Title>
          <AiOutlineAppstore className="mb-1" /> Moratorios
        </Card.Title>
        <Dropdown.Divider />
        <ul className="list-inline mt-3">
          <li className="list-inline-item">
            <Link
              to={`${url}/interesesmoratorios`}
              className="btn btn-outline-secondary btn-sm mb-2"
            >
              Intereses
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              to={`${url}/penalizaciones`}
              className="btn btn-outline-secondary btn-sm mb-2"
            >
              Penalizaciones
            </Link>
          </li>
        </ul>
      </Card.Body>
    </Card>
  );
}
