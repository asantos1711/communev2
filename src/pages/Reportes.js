import React from "react";
import { Row, Col } from "react-bootstrap";
import Caja from "../components/Caja";
import FacturaReport from "../components/FacturaReport";
import MantenimientoReport from "../components/MantenimientoReport";
import PagosAtrasadosReport from "../components/PagosAtrasadosReport";
import SancionesReport from "../components/SancionesReport";
import TipoLoteReport from "../components/TipoLoteReport";
import { isTags } from "../security/isTags";

export default function Reportes({ auth }) {
  return (
    <Row>
      {!isTags(auth.data.role) && (
        <Col xs lg="4" className="mb-4">
          <Caja />
        </Col>
      )}
      <Col xs lg="4" className="mb-4">
        <SancionesReport />
      </Col>
      {!isTags(auth.data.role) && (
        <Col xs lg="4" className="mb-4">
          <MantenimientoReport />
        </Col>
      )}
      {!isTags(auth.data.role) && (
        <Col xs lg="4" className="mb-4">
          <FacturaReport />
        </Col>
      )}
      {!isTags(auth.data.role) && (
        <Col xs lg="4" className="mb-4">
          <PagosAtrasadosReport />
        </Col>
      )}
      {!isTags(auth.data.role) && (
        <Col xs lg="4" className="mb-4">
          <TipoLoteReport />
        </Col>
      )}
    </Row>
  );
}
