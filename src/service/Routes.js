//security
export const USER_LOGIN = "/security/login";
//user
export const USER_GET = "/user/all";
export const USER_GET_By_ID = "/user/get";
export const USER_SAVE = "/user/save";
export const USER_DELETE = "/user/delete";

//roles
export const ROLE_GET = "/role/all";
export const ROLE_GET_By_ID = "/role/get";
export const ROLE_SAVE = "/role/save";
export const ROLE_DELETE = "/role/delete";

//habitantes
export const RESIDENTE_GET = "/residente/all";
export const RESIDENTE_GET_BY_TIPO = "/residente/all";
export const RESIDENTE_GET_By_ID = "/residente/get";
export const RESIDENTE_GET_DATOS_CONTACTO = "/residente/getDatosContacto";
export const RESIDENTE_SAVE = "/residente/save";
export const RESIDENTE_DELETE = "/residente/delete";
export const RESIDENTE_EMAIL = "/residente/getemailasociado";

//mantenimiento
export const MANTENIMIENTO_GET_DATALIST = "/mantenimiento/get-datalist";
export const MANTENIMIENTO_GET = "/mantenimiento/all";
export const MANTENIMIENTO_DELETE = "/mantenimiento/delete";
export const MANTENIMIENTO_GET_BY_ID = "/mantenimiento/get";
export const MANTENIMIENTO_SAVE = "/mantenimiento/save";

//lotes
export const LOTE_GET = "/lote/all";
export const LOTE_SAVE = "/lote/save";
export const LOTE_GET_BY_ID = "/lote/get";
export const LOTE_GET_CHILDREN = "/lote/get-datalist";
export const LOTE_DELETE = "/lote/delete";
export const LOTE_SAVE_HAB = "/lote/habitacional/save";
export const LOTE_DELETE_HAB = "/lote/habitacional/delete";
export const GET_LOTE_STATUS = "/lote/loteByStatus";

//search global
export const SEARCH_GLOBAL = "/search/get";

//reglas
export const REGLAS_GET = "/reglas/all";
export const REGLAS_DELETE = "/reglas/delete";
export const REGLAS_GET_BY_ID = "/reglas/get";
export const REGLAS_SAVE = "/reglas/save";

//mtto generados
export const MTTO_GENERADO_GET = "/mtto-generado/get";
export const MTTO_GENERADO_GET_BY_STATUS = "/mtto-generado/get/status";
export const MTTO_GENERADO_GENERAR = "/mtto-generado/save";

//tipos multas
export const TIPO_MULTA_GET = "/tipomulta/all";
export const TIPO_MULTA_GET_BY_ID = "/tipomulta/get";
export const TIPO_MULTA_SAVE = "/tipomulta/save";
export const TIPO_MULTA_DELETE = "/tipomulta/delete";

//residentes multas
export const RESIDENTE_FOR_MULTA = "/residente/get/multas";

// residente deudas
export const RESIDENTE_FOR_DEUDAS = "/residente/get/deudas";
export const RESIDENTE_FOR_DEUDAS_DETAIL = "/residente/get/deudas/detail";

//generar multas
export const MULTA_SAVE = "/multa/save";
export const MULTA_GET = "/multa/get";

//estados de cuenta lote
export const LOTE_FOR_ESTADO_CUENTA = "/lote/get/estadocuenta";

//pagos multas
export const PAGOS_MULTAS_SAVE = "/pagosmultas/save";
export const PAGOS_MULTAS_FONDOS_SAVE = "/pagosmultas/save/fondos";
export const PAGOS_MULTAS_COMPLETAR_PAGO = "/pagosmultas/completar-pago";

//mantenimiento
export const LOTE_FOR_MTTO = "/lote/get-for-mantenimiento";
export const LOTE_FOR_MTTO_DEUDAS = "/lote/get-for-mantenimiento/deuda";
//mantenimiento listar todos los pago x cada mtto
export const PAGO_MTTO = "/cobromantenimiento/get-for-mantenimiento";
//vista de pagar mtto
export const GET_LOTE_PAGO_MTTO = "/lote/get-for-pagarmantenimiento";
//cobrar mttos
export const COBRO_MTTO_SAVE = "/cobromantenimiento/save";

//estados de cuenta residente
export const RESIDENTE_FOR_ESTADO_CUENTA = "/residente/get/estadocuenta";
//estados de cuenta residente details por fechas
export const RESIDENTE_FOR_ESTADO_CUENTA_DETAIL =
  "/residente/get/estadocuenta/detail";

//vehiculos
export const VEHICULO_GET = "/vehiculo/all";
export const VEHICULO_GET_BY_ID = "/vehiculo/get";
export const VEHICULO_SAVE = "/vehiculo/save";
export const VEHICULO_DELETE = "/vehiculo/delete";

//tarjeta accesos
export const TARJETA_ACCESO_GET = "/tarjetaacceso/all";
export const TARJETA_ACCESO_GET_BY_ID = "/tarjetaacceso/get";
export const TARJETA_ACCESO_SAVE = "/tarjetaacceso/save";
export const TARJETA_ACCESO_DELETE = "/tarjetaacceso/delete";
export const TARJETA_ACCESO_AUTOCOMPLETE_RESIDENTE =
  "/tarjetaacceso/autocomplete";

//operaciones
//corte de caja
export const CORTE_CAJA = "/operaciones/cortecaja";

//dashboard
export const DASHBOARD_TOTALES = "/dashboard/totales";
export const DASHBOARD_INDICE_CARTERA_PAGADA =
  "/dashboard/indice-cartera-pagada";
export const DASHBOARD_CARTERA_VENCIDA = "/dashboard/cartera-vencida";
export const DASHBOARD_FORMA_PAGO = "/dashboard/forma-pago";
export const DASHBOARD_TIPO_PAGO = "/dashboard/tipo-pago";
export const DASHBOARD_LOTE_ANIO = "/dashboard/lote-mtto-anio";
export const DASHBOARD_LOTE_MES_ANIO = "/dashboard/lote-mtto-mes-anio";

//tipo de numero telefono
export const TIPO_NUMERO_TELEFONO = "/tiponumerotelefono/all";
export const TIPO_NUMERO_TELEFONO_BY_ID = "/tiponumerotelefono/get";
export const TIPO_NUMERO_TELEFONO_SAVE = "/tiponumerotelefono/save";
export const TIPO_NUMERO_TELEFONO_DELETE = "/tiponumerotelefono/delete";

//telefono
export const TELEFONO_DELETE = "/telefono/delete";

//email
export const EMAIL_DELETE = "/email/delete";

//residente mis pagos
export const RESIDENTE_MIS_PAGOS = "/residente/get/pagos";

//GENERAR SANCION
export const LOTE_FOR_SANCION = "/lote/get-for-sancion";

//GET LOTE PARA VEHICULOS
export const LOTE_FOR_VEHICLES = "/lote/get-for-vehicles";

//factura
export const FACTURA_GET = "/factura/all";
export const FACTURA_ALL = "/factura/allByFilter";
export const FACTURA_ALL_PAGINABLE = "/factura/allpaginable";
export const FACTURA_GET_BY_ID = "/factura/get";
export const FACTURA_SAVE = "/factura/save";
export const FACTURA_PAGO_FACTURAR = "/factura/pagofacturar";
export const FACTURA_GET_EMAIL_FACTURAR = "/factura/getemailfacturar";
export const FACTURA_ENVIAR_EMAIL = "/factura/enviarfactura";
export const FACTURAS_CANCELADAS = "/factura/canceladas";
//export const FACTURA_DELETE = "/factura/delete"

//datos fiscales
export const DATOS_FISCALES_GET = "/datosfiscales/all";
export const DATOS_FISCALES_GET_BY_ID = "/datosfiscales/get";
export const DATOS_FISCALES_SAVE = "/datosfiscales/save";
export const DATOS_FISCALES_DELETE = "/datosfiscales/delete";
export const DATOS_FISCALES_UPLOADCONSTANCIA =
  "/datosfiscales/uploadConstancia";

//metodo pago cfdi
export const METODO_PAGO_CFI_GET = "/metodopagocfdi/all";
export const METODO_PAGO_CFI_GET_BY_ID = "/metodopagocfdi/get";
export const METODO_PAGO_CFI_SAVE = "/metodopagocfdi/save";
export const METODO_PAGO_CFI_DELETE = "/metodopagocfdi/delete";
//forma pago cfdi
export const FORMA_PAGO_CFDI_GET = "/formapagocfdi/all";
export const FORMA_PAGO_CFDI_GET_BY_ID = "/formapagocfdi/get";
export const FORMA_PAGO_CFDI_SAVE = "/formapagocfdi/save";
export const FORMA_PAGO_CFDI_DELETE = "/formapagocfdi/delete";
//forma pago cfdi
export const USO_CFDI_GET = "/usocfdi/all";
export const USO_CFDI_GET_BY_ID = "/usocfdi/get";
export const USO_CFDI_SAVE = "/usocfdi/save";
export const USO_CFDI_DELETE = "/usocfdi/delete";

//lote get por tipo de tarjeta de cargos recurrentes
export const LOTE_TIPO_TARJETA_GET = "/lote/all/recurrentes";

//importar pagos mantenimientos
export const MANTENIMIENTO_IMPORTAR_PAGOS = "/mantenimiento/importarpagos";

//tiie
export const TIIE_GET = "/tiie/all";
export const TIIE_GET_BY_ID = "/tiie/get";
export const TIIE_SAVE = "/tiie/save";
export const TIIE_DELETE = "/tiie/delete";

//metodo pago
export const METODO_PAGO_GET = "/metodopago/all";
export const METODO_PAGO_GET_BY_ID = "/metodopago/get";
export const METODO_PAGO_SAVE = "/metodopago/save";
export const METODO_PAGO_DELETE = "/metodopago/delete";

//codigo autorizacion
export const CODIGO_AUTORIZACION_GET = "/codigoautorizacion/all";
export const CODIGO_AUTORIZACION_GET_BY_ID = "/codigoautorizacion/get";
export const CODIGO_AUTORIZACION_SAVE = "/codigoautorizacion/save";
export const CODIGO_AUTORIZACION_GET_BY_USER = "/codigoautorizacion/getbyuser";
export const CODIGO_AUTORIZACION_CHECK_CODIGO =
  "/codigoautorizacion/checkcodigo";
export const CODIGO_AUTORIZACION_CHANGE_ACTIVE =
  "/codigoautorizacion/changeactive";

//tarjeta
export const TARJETA_DELETE = "/tarjeta/delete";
export const TARJETA_CHANGE_ACTIVE = "/tarjeta/changeactive";

//banco
export const BANCO_GET = "/banco/all";
export const BANCO_GET_BY_ID = "/banco/get";
export const BANCO_SAVE = "/banco/save";
export const BANCO_DELETE = "/banco/delete";

//REPORTES
export const REPORTE_TIPO_SANCION = "/reporte/byTipoSancion";
export const REPORTE_MTTO_VENCIDO = "/reporte/mantenimientovencido";
export const REPORTE_PAGOS_ATRASADOS = "/reporte/pagosatrasados";
export const REPORTE_CARTERA_VENCIDA = "/reporte/carteravencida";
export const REPORTE_MTTO_VENCIDO_CONCILIACION =
  "/reporte/mantenimientovencidoconciliado";
export const REPORTE_DESCUENTOS_CANCELACIONES =
  "/reporte/decuentoCancelaciones";

//pasos para generar factura
//primero buscamos el pago para completarlo
export const COBRO_MTTO_COMPLETAR_PAGO = "cobromantenimiento/completar-pago";

//CLAVE UNIDAD CFDI
export const CLAVE_UNIDAD_CFDI_GET = "/claveunidadcfdi/all";
export const CLAVE_UNIDAD_CFDI_GET_BY_ID = "/claveunidadcfdi/get";
export const CLAVE_UNIDAD_CFDI_SAVE = "/claveunidadcfdi/save";
export const CLAVE_UNIDAD_CFDI_DELETE = "/claveunidadcfdi/delete";

//CLAVE PRODUCCION SERVICIO CFDI
export const CLAVE_PRODUCCION_SERVICIO_CFDI_GET =
  "/claveproduccionserviciocfdi/all";
export const CLAVE_PRODUCCION_SERVICIO_GET_BY_ID =
  "/claveproduccionserviciocfdi/get";
export const CLAVE_PRODUCCION_SERVICIO_SAVE =
  "/claveproduccionserviciocfdi/save";
export const CLAVE_PRODUCCION_SERVICIO_DELETE =
  "/claveproduccionserviciocfdi/delete";

//tipo documento
export const TIPO_DOCUMENTO_GET = "/tipodocumento/all";
export const TIPO_DOCUMENTO_GET_BY_ID = "/tipodocumento/get";
export const TIPO_DOCUMENTO_SAVE = "/tipodocumento/save";
export const TIPO_DOCUMENTO_DELETE = "/tipodocumento/delete";

//tipo comprobante
export const TIPO_COMPROBANTE_GET = "/tipocomprobante/all";
export const TIPO_COMPROBANTE_GET_BY_ID = "/tipocomprobante/get";
export const TIPO_COMPROBANTE_SAVE = "/tipocomprobante/save";
export const TIPO_COMPROBANTE_DELETE = "/tipocomprobante/delete";

//modal pago de mantenimientos
export const MODAL_LOTE_GET_MTTOS = "/lote/getformodalpagarmantenimiento";

//cuota extraordinaria
export const CUOTA_EXTRAORDINARIA_GET = "/cuotaextraordinaria/all";
export const CUOTA_EXTRAORDINARIA_GET_BY_ID = "/cuotaextraordinaria/get";
export const CUOTA_EXTRAORDINARIA_SAVE = "/cuotaextraordinaria/save";
export const CUOTA_EXTRAORDINARIA_DELETE = "/cuotaextraordinaria/delete";

//cuota extraordinaria
export const CUOTA_INICIAL_GET = "/cuotainicial/all";
export const CUOTA_INICIAL_GET_BY_ID = "/cuotainicial/get";
export const CUOTA_INICIAL_SAVE = "/cuotainicial/save";
export const CUOTA_INICIAL_DELETE = "/cuotainicial/delete";

//crear cargo masivo de cuota extraordinaria
export const CARGO_CUOTA_EXTRAORDINARIA_MASIVO =
  "/cargocuotaextraordinaria/createcargomasivo";
export const CARGO_CUOTA_EXTRAORDINARIA_GET_BY_CUOTA =
  "/cargocuotaextraordinaria/getcargosbycuotaextraordinaria";
export const CARGO_CUOTA_EXTRAORDINARIA_GET_BY_ID =
  "/cargocuotaextraordinaria/get";
export const CARGO_CUOTA_EXTRAORDINARIA_BY_LOTE =
  "/cargocuotaextraordinaria/createCargoByLote";

//crear cargo masivo de cuota inicial
export const CARGO_CUOTA_INICIAL_MASIVO =
  "/cargocuotainicial/createcargomasivo";
export const CARGO_CUOTA_INICIAL_GET_BY_CUOTA =
  "/cargocuotainicial/getcargosbycuotainicial";
export const CARGO_CUOTA_INICIAL_GET_BY_ID = "/cargocuotainicial/get";
export const CARGO_CUOTA_INICIAL_SAVE = "/cargocuotainicial/saveByLote";

//pagos de los cargos de cuota inicial
export const PAGO_CARGO_CUOTA_INICIAL_SAVE = "/pagocuotainicial/save";

//pagos de los cargos de cuota extraordinaria
export const PAGO_CARGO_CUOTA_EXTRAORDINARIA_SAVE =
  "/pagocuotaextraordinaria/save";

//moratorios
export const LOTE_FOR_MORATORIOS = "/lote/getformoratorios";
export const LOTE_GET_MTTO_FOR_LOTE = "/lote/getmttobylote";
export const LOTE_GENERAR_INTERESES_MRATORIOS =
  "/lote/generarinteresesmoratorios";

//moratorios bitacora
export const INTERESES_MORATORIOS_BTACORA_LAST =
  "/interesesmoratoriosbitacora/gaslast";

//agregar fondo a lote
export const LOTE_AGREGAR_FONDO = "/lote/agregarfondos";

//cobrar cargos recurrentes
export const MTTO_COBRAR_PAGOS_RECURRENTES =
  "/mantenimiento/cobrarcargosrecurrentes";

//emisor
export const EMISOR_GET_BY_DEFAULT = "/emisor/get";
export const EMISOR_SAVE = "/emisor/save";

//emisor
export const CONTROL_FACTURA_GET_BY_DEFAULT = "/controlfactura/get";
export const CONTROL_FACTURA_SAVE = "/controlfactura/save";

//cancelar pagos
export const CANCELAR_PAGO = "/factura/cancelarpago";
export const CANCELAR_FACTURA = "/factura/cancelarfactura";

//bitacora
export const BITACORA_ALL = "/bitacora/all";
export const BITACORA_ALL_PAGINABLE = "/bitacora/allpaginable";

//correo campanas
export const CORREO_CAMPANAS_ALL = "/correocampanas/all";
export const CORREO_CAMPANAS_GET_BY_ID = "/correocampanas/get";
export const CORREO_CAMPANAS_SAVE = "/correocampanas/save";
export const CORREO_CAMPANAS_DELETE = "/correocampanas/delete";
export const CORREO_CAMPANAS_ENVIAR = "/correocampanas/enviarcorreo";

//nota factura
export const FACTURA_NOTA = "factura/nota";

//receptor datos fiscales
export const RECEPTOR_DATOS_FISCALES_GET_BY_DEFAULT =
  "/receptordatosfiscales/get";
export const RECEPTOR_DATOS_FISCALES_SAVE = "/receptordatosfiscales/save";

//cancelar multa y condonar multa
export const MULTA_CONDONAR = "/multa/condonar";
export const MULTA_CANCELAR = "/multa/cancelar";

//cargo cuota inicial de proyecto
export const CARGO_CUOTA_INICIAL_PROYECTO_GET =
  "/cargocuotainicialproyecto/all";
export const CARGO_CUOTA_INICIAL_PROYECTO_GET_BY_ID =
  "/cargocuotainicialproyecto/get";
export const CARGO_CUOTA_INICIAL_PROYECTO_SAVE =
  "/cargocuotainicialproyecto/save";

//pago cuota inicial de proyecto
export const PAGO_CUOTA_INICIAL_PROYECTO_COBRAR =
  "/pagocuotainicialproyecto/cobrar";

//descuento especial
export const LOTE_DESCUENTO_ESPECIAL_GET = "/lote/descuentosespeciales";
export const LOTE_DESCUENTO_ESPECIAL_DELETE =
  "/lote/descuentosespeciales/delete";
export const LOTE_DESCUENTO_ESPECIAL_SAVE = "/lote/descuentosespeciales/save";

//nota alertas
export const NOTAALERTA_GET_ALL = "/notaalerta/all";
export const NOTAALERTA_GET_BY_LOTE = "/notaalerta/getbytipoandlote";
export const NOTAALERTA_GET_SAVE = "/notaalerta/save";
export const NOTAALERTA_GET_BY_ID = "/notaalerta/get";
export const NOTAALERTA_CHANGE_ACTIVA = "/notaalerta/changeactiva";
export const NOTAALERTA_GET_WARNING = "/notaalerta/getwarning";

//tipos de cuotas
export const TIPO_CUOTA_GET = "/tipocuota/all";
export const TIPO_CUOTA_GET_ACTIVE = "/tipocuota/all-active";
export const TIPO_CUOTA_GET_BY_ID = "/tipocuota/get";
export const TIPO_CUOTA_SAVE = "/tipocuota/save";
export const TIPO_CUOTA_DELETE = "/tipocuota/delete";

//GENERAR CUOTAS
export const CUOTA_SAVE = "/cuota/save";
export const CUOTA_GET = "/cuota/get";
export const CUOTA_CONDONAR = "/cuota/condonar";
export const CUOTA_CANCELAR = "/cuota/cancelar";

//pagos cuotas
export const PAGO_CUOTA_SAVE = "/pagocuota/save";

//buscar lote para generar periodo
export const GET_LOTE_PERIODO = "/lote/getforgenerarperiodo";
//add nuevos periodos personalizados
export const ADD_PERIODO_LOTO = "/lote/generarmantenimientospersonalizado";
//buscar lote para generar facturar en los pagos que no tienen facturas
export const GET_LOTE_PAGOS_FACTURAR = "/lote/getforgenerarfactura";

//configuracion de residencial
export const RESIDENCIAL_GET_DEFAULT = "/configuracionresidencial/get";
export const RESIDENCIAL_SAVE = "/configuracionresidencial/save";

//marcar como factura del sist anteriod
export const FACTURAR_PAGO_SIST_ANT = "/operaciones/marcarfacturado";

//representante legal
export const REPRESENTANTE_LEGAL_GET = "/representantelegal/all";
export const REPRESENTANTE_LEGAL_GET_BY_ID = "/representantelegal/get";
export const REPRESENTANTE_LEGAL_SAVE = "/representantelegal/save";
export const REPRESENTANTE_LEGAL_DELETE = "/representantelegal/delete";
export const REPRESENTANTE_LEGAL_GET_BY_LOTE = "/representantelegal/getbylote";

export const GET_LOTES_HABITACIONALES = "/lote/lotehabitacional";
export const LOTES_FUSIONAR = "/lote/fusionarlotes";
export const INACTIVAR_LOTE = "/lote/inactivarlote";
export const ACTIVAR_LOTE = "/lote/activarlote";

//caja
export const CAJA_GET = "/caja/all";
export const CAJA_GET_ACTIVE = "/caja/listactive";
export const CAJA_GET_BY_ID = "/caja/get";
export const CAJA_SAVE = "/caja/save";
export const CAJA_DELETE = "/caja/delete";

//cancelar deudas globales
export const GET_CANCELAR_DEUDA = "/lote/getCancelardeudaglobal";
export const CANCELAR_DEUDA = "/lote/cancelardeudaglobal";

//tipo motivo cancelacion
export const TIPO_MOTIVO_CANCELACION_GET = "/tipomotivocancelacion/all";
export const TIPO_MOTIVO_CANCELACION_GET_BY_ID = "/tipomotivocancelacion/get";
export const TIPO_MOTIVO_CANCELACION_SAVE = "/tipomotivocancelacion/save";

//tipo relacion factura
export const TIPO_RELACION_FACTURA_GET = "/tiporelacionfactura/all";
export const TIPO_RELACION_FACTURA_GET_BY_ID = "/tiporelacionfactura/get";
export const TIPO_RELACION_FACTURA_SAVE = "/tiporelacionfactura/save";

//update factura folio a referenciar
export const UPDATE_FOLIO_REFERENCIAR = "/factura/updateFolioReferenciar";

//user app
export const USER_APP_GET = "/userapp/all";
export const USER_APP_GET_BY_ID = "/userapp/get";
export const USER_APP_SAVE = "/userapp/save";
export const USER_APP_GET_BY_LOTE = "/userapp/getByLote";
export const USER_APP_DELETE = "/userapp/delete";

//GET TODOS LOTE CON REFERENCIA Y ASOCIADO
export const GET_LOTE_REFERENCIA = "/lote/get-lote-referencia-lote";

//regimen fiscal
export const REGIMEN_FISCAL_GET = "/regimenfiscal/all";
export const REGIMEN_FISCAL_GET_BY_ID = "/regimenfiscal/get";
export const REGIMEN_FISCAL_SAVE = "/regimenfiscal/save";

//amenidades
export const TIPOAMENIDAD_GET = "/tipoamenidad/all";
export const TIPOAMENIDAD_GET_ACTIVAS = "/tipoamenidad/allactivas";
export const TIPOAMENIDAD_GET_BY_ID = "/tipoamenidad/get";
export const TIPOAMENIDAD_SAVE = "/tipoamenidad/save";

//agenda amenidades
export const AMENIDAD_AGENDA_SAVE = "/amenidadagenda/save";
export const GET_AGENDA = "/amenidadagenda/get";
export const GET_AGENDA_BY_FECHA_LOTE = "/amenidadagenda/getByFechaLote";
export const GET_AGENDA_BY_FECHA_LOTEHIJOS_AMENIDAD =
  "/amenidadagenda/getByFechaLoteHijoAmenidad";
export const AMENIDAD_CREATE_AGENDA_SAVE = "/amenidadagenda/crearagenda";
export const GET_AGENDA_BY_LOTE = "/amenidadagenda/getByLote";
export const DELETE_VARIACIONES = "/amenidadagenda/deletevariacion";
export const DELETE_HORARIOP = "/amenidadagenda/deletehorariop";
export const GET_AGENDA_BY_FECHA_AMENIDAD_LOTE =
  "/amenidadagenda/getByFechaAmenidadLote";

//agendar reservar
export const AGENDAR_RESERVAR = "/amenidadagenda/reservar";
export const GET_LOTES_BY_PARENT = "/lote/getChildrenByLote";

//newsletter
export const GET_NEWSLETTER_PAGINABLE = "/newsletter/allpaginable";
export const SAVE_NEWSLETTER = "/newsletter/save";
export const GET_NEWSLETTER_BY_ID = "/newsletter/get";
export const DELETE_NEWSLETTER = "/newsletter/delete";

//accesos
export const GET_ACCESOS_PAGINABLE = "/acceso/allpaginable";
export const SAVE_ACCESOS = "/acceso/save";

//reglas amenidad
export const REGLAAMENIDAD_GET = "/reglaamenidad/all";
export const REGLAAMENIDAD_GET_ACTIVE = "/reglaamenidad/allactivas";
export const REGLAAMENIDAD_GET_BY_ID = "/reglaamenidad/get";
export const REGLAAMENIDAD_SAVE = "/reglaamenidad/save";

//proveedores
export const PROVEEDOR_GET = "/proveedor/all";
export const PROVEEDOR_GET_BY_ID = "/proveedor/get";
export const PROVEEDOR_SAVE = "/proveedor/save";
export const PROVEEDOR_DELETE = "/proveedor/delete";

//articulo
export const ARTICULO_GET = "/articulo/all";
export const ARTICULO_GET_BY_ID = "/articulo/get";
export const ARTICULO_SAVE = "/articulo/save";
export const ARTICULO_DELETE = "/articulo/delete";

//orden compra
export const ORDENCOMPRA_PAGINABLE = "/ordencompra/allpaginable";
export const ORDENCOMPRA_GET = "/ordencompra/all";
export const ORDENCOMPRA_GET_BY_ID = "/ordencompra/get";
export const ORDENCOMPRA_SAVE = "/ordencompra/save";
export const ORDENCOMPRA_CANCELARORDEN = "/ordencompra/cancelarOrden";

//intereses moratorios v2
export const I_MORATORIOS_LIST = "/imoratorios/list";
export const I_MORATORIOS_GET = "/imoratorios/get";
export const I_MORATORIOS_SAVE_MASIVO = "/imoratorios/masivo";
export const I_MORATORIOS_SAVE = "/imoratorios/save";
