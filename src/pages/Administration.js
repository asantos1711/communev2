import React from "react";
import { Row, Col } from "react-bootstrap";
import Security from "../components/Security";
import Mtto from "../components/Mtto";
import CuotaExtComp from "../components/CuotaExtComp";
import CuotaInicialComp from "../components/CuotaInicialComp";
import InteresesMoratoriosComp from "../components/InteresesMoratoriosComp";
import DatosConfigurables from "../components/DatosConfigurables";
import Bitacora from "../components/Bitacora";
import { IsDirector } from "../security/IsDirector";
import CuotaInicialProyecto from "../components/CuotaInicialProyecto";
import AppComponent from "../components/AppComponent";
import AmenidadReservaComponent from "../components/AmenidadReservaComponent";
import NewsLetterComponent from "../components/newsletter/NewsLetterComponent";
import AccesoComponent from "../components/acceso/AccesoComponent";
import EmailTemplateComponent from "../components/emailtemplate/EmailTemplateComponent";
import ProveedorComponentt from "../components/proveedor/ProveedorComponent";
import MoratoriosComponent from "../components/moratorios/MoratoriosComponent";

export default function Administration({ auth }) {
  return (
    <Row>
      {IsDirector(auth.data.role) && (
        <Col xs lg="4" className="mb-4">
          <Security />
        </Col>
      )}
      <Col xs lg="4" className="mb-4">
        <Mtto />
      </Col>
      <Col xs lg="4" className="mb-4">
        <CuotaExtComp />
      </Col>
      <Col xs lg="4" className="mb-4">
        <CuotaInicialComp />
      </Col>
      <Col xs lg="4" className="mb-4">
        <InteresesMoratoriosComp />
      </Col>
      <Col xs lg="4" className="mb-4">
        <DatosConfigurables />
      </Col>
      {IsDirector(auth.data.role) && (
        <Col xs lg="4" className="mb-4">
          <Bitacora />
        </Col>
      )}
      <Col xs lg="4" className="mb-4">
        <CuotaInicialProyecto />
      </Col>
      <Col xs lg="4" className="mb-4">
        <AppComponent />
      </Col>
      <Col xs lg="4" className="mb-4">
        <AmenidadReservaComponent />
      </Col>
      <Col xs lg="4" className="mb-4">
        <NewsLetterComponent />
      </Col>
      <Col xs lg="4" className="mb-4">
        <AccesoComponent />
      </Col>
      {/* <Col xs lg="4" className="mb-4">
                <EmailTemplateComponent />
            </Col>        */}
      <Col xs lg="4" className="mb-4">
        <ProveedorComponentt />
      </Col>
      <Col xs lg="4" className="mb-4">
        <MoratoriosComponent />
      </Col>
    </Row>
  );
}
