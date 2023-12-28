import * as jsPDF from 'jspdf'
import 'jspdf-autotable'
import moment from 'moment'

export  const facturaPdf = (data) =>{

    var writtenNumber = require('written-number');
    var numeral = require('numeral');

    const nameEmisor = data.nombreFiscalEmisor

    var dirEmisor = data.direccionEmisor;
    var dirReceptor = data.direccionReceptor;

    let bigPdf = false;
    if(data.facturaConceptosList.length > 8){
        bigPdf = true
    }

    const cadenaOriginal = data.cadenaOriginal
    const selloDigital = data.selloDigital;
    const selloDigitalSAT = data.selloDigitalSAT;

    var base64Img = `data:image/jpeg;base64,${data.imageQR}`
    

    var doc = new jsPDF('p', 'mm', 'a4', {putOnlyUsedFonts: true});

    //primer section
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, 20, 90, 35, 3, 3, "FD");


    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, 57, 90, 35, 3, 3, "FD");


    doc.setFillColor(255, 255, 255);
    doc.roundedRect(102, 20, 100, 72, 3, 3, "FD");


    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, 94, 192, 34, 3, 3, "FD");

    //const cfdiLogo = document.getElementById("cfdiLogo")
    const rioLogo = document.getElementById("rioLogo")
    const cfdiVersion = document.getElementById("cfdiVersion")
    const cancelada = document.getElementById("cancelada")

    //doc.addImage("cfdiLogo", "JPEG", 12, 22, 50, 15);
    doc.addImage(rioLogo, "JPEG", 60, 22, 40, 30);
    doc.addImage(cfdiVersion, "JPEG", 18, 32, 15, 15);
    if(data.status==='cancelada'){
        doc.addImage(cancelada, "JPEG", 45, 55, 120, 80);
    }

    var textCadenaOriginal = doc.splitTextToSize(cadenaOriginal, 500);
    var textSelloDigital = doc.splitTextToSize(selloDigital, 300);
    var textSelloDigitalSAT = doc.splitTextToSize(selloDigitalSAT, 300);
    //var textDirEmisor = doc.splitTextToSize(dirEmisor, 100);
    var textDirReceptor = doc.splitTextToSize(dirReceptor, 300);
    var textNombreEmisor = doc.splitTextToSize(nameEmisor, 100)

    doc.setFontSize(8)
    doc.setFont("helvetica", "italic");
    doc.text("Comprobante Fiscal Digital", 12, 25)
    doc.text("por Internet", 12, 28)
    doc.setTextColor(107,107,135);
    //doc.text(data.referenciaReceptor, 12, 112);
    doc.text(textDirReceptor, 12, 115);
    doc.text(`Emitida por ${data.usuario}`, 160, 18);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("green");
    doc.text("EMISOR", 12, 63);
    doc.text("RECEPTOR", 12, 100);
    doc.text("CONCEPTOS", 12, 134);

    doc.setTextColor(0,0,0);

    doc.setFontSize(20);
    doc.text("FACTURA", 105, 28);

    doc.setFontSize(10);
    doc.text("SERIE Y FOLIO", 154, 26);
    doc.text("FOLIO FISCAL:", 105, 35);
    doc.text("CERTIFICADO SAT:", 105, 43);
    doc.text("CERTIFICADO DE EMISOR:", 105, 50);
    doc.text("FECHA HORA DE EMISIÓN:", 105, 57);
    doc.text("FECHA HORA DE CERTIFICACIÓN:", 105, 63);
    doc.text("REGIMEN FISCAL:", 105, 69);
    if(data.status==='cancelada'){
        doc.text('TIPO DE RELACIÓN:', 105, 73);
        doc.text('FOLIO DE FISCAL A RELACIONAR:', 105, 80);
    }

    doc.setTextColor("red");
    doc.text(data.folio, 170, 31, null, null, "center");

    doc.setTextColor(0,0,0);
    //emisor
    doc.text("RFC:", 12, 82);
    doc.text("Lugar expedición(CP):", 12, 88);
    //receptor
    doc.text("RFC:", 12, 125);
    doc.text("USO CFDI:", 82, 125);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(107,107,135);
    //emisor
    doc.text(textNombreEmisor, 12, 68);
    doc.text(data.rfcEmisor, 24, 82);
    doc.text(data.lugarExpedicion, 62, 88);  
    //datos de la fcatura
    doc.text(data.folioFiscal, 105, 38);
    doc.text(data.csdSAT, 105, 46);
    doc.text(data.csdEmisor, 105, 53);
    doc.text(data.fechaEmision, 105, 60);
    doc.text(data.fechaCertificacion, 105, 66);
    doc.text(data.regimenFiscal, 138, 69);
    if(data.status==='cancelada'){
        let tipoR = `${data.tipoRelacionFactura?.clave} ${data.tipoRelacionFactura?.descripcion}`;
        console.log(tipoR)
        doc.text(tipoR, 105, 76);
        doc.text(data.folioFiscalRelacionar ?? '', 105, 85);
    }
    //receptor
    doc.text(data.nombreReceptor, 12, 105);
    doc.text(data.rfcReceptor, 23, 125);
    doc.text(data.usoCFDI, 106, 125);

    doc.setTextColor(0,0,0);
    doc.autoTable({
        html:'#tableFG',
        theme: 'plain',
        startY: 137
    });

    //nuevos datos a adicionar
    doc.setFontSize(10);
    doc.text("Observación:", 12, doc.autoTable.previous.finalY + 5)
    doc.text("Domicilio:", 12, doc.autoTable.previous.finalY + 15)
    doc.text("No. cuenta:", 12, doc.autoTable.previous.finalY + 20)
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");


    //resumen de pago
    doc.text("Total con letras:", 12, doc.autoTable.previous.finalY + 25);    
    doc.text("Forma de pago:", 12, doc.autoTable.previous.finalY + 37);
    doc.text("Método de pago:", 12, doc.autoTable.previous.finalY + 42);

    doc.text("Subtotal:", 165, doc.autoTable.previous.finalY + 5, null, null, "right");
    doc.text("IVA:", 165, doc.autoTable.previous.finalY + 11, null, null, "right");
    doc.text("Total:", 165, doc.autoTable.previous.finalY + 17, null, null, "right");


    doc.text("Cadena Original", 12,doc.autoTable.previous.finalY + 47);

    if(bigPdf){
        doc.text("Sello Digital", 12,doc.autoTable.previous.finalY + 200);
        doc.text("Sello Digital SAT", 12,doc.autoTable.previous.finalY + 230)
    }else{
        doc.text("Sello Digital", 12,doc.autoTable.previous.finalY + 71);
        doc.text("Sello Digital SAT", 12,doc.autoTable.previous.finalY + 89)
    }
   

    doc.setFont("helvetica", "normal");
    doc.setTextColor(107,107,135);

    //datos adicionales
    doc.setFontSize(10);
    doc.text(data.observacion, 42, doc.autoTable.previous.finalY + 5);
    doc.text(data.direccionDomicilio, 40, doc.autoTable.previous.finalY + 15);
    doc.text(data.numeroCuenta, 40, doc.autoTable.previous.finalY + 20);

    //resumen de pago
    doc.setFontSize(12);
    doc.text(`${writtenNumber(data.total, {lang: 'es'}).toUpperCase()} PESOS 00/100 M.N.`, 12, doc.autoTable.previous.finalY + 30);
    doc.text(data.formaPago, 48, doc.autoTable.previous.finalY + 37);
    doc.text(data.metodoPago, 50, doc.autoTable.previous.finalY + 42);
    doc.text(numeral(data.subtotal).format('$0,0.00'), 192, doc.autoTable.previous.finalY + 5,null, null, "right");
    doc.text("$0.00", 192, doc.autoTable.previous.finalY + 11,null, null, "right");
    doc.text(numeral(data.total).format('$0,0.00'), 192, doc.autoTable.previous.finalY + 17,null, null, "right");

    doc.setTextColor(0,0,0);
    doc.setFontSize(6);
    doc.text(textCadenaOriginal, 12, doc.autoTable.previous.finalY + 52);
    if(bigPdf){
        doc.text(textSelloDigital, 12, doc.autoTable.previous.finalY +205);
        doc.text(textSelloDigitalSAT, 12, doc.autoTable.previous.finalY + 235);
    }else{
        doc.text(textSelloDigital, 12, doc.autoTable.previous.finalY + 75);
        doc.text(textSelloDigitalSAT, 12, doc.autoTable.previous.finalY + 92);
    }
    

    doc.addImage(base64Img, 'JPEG', 155, doc.autoTable.previous.finalY + bigPdf ? 210 : 75, 40, 40)    


    doc.setFont("helvetica", "bold");
    doc.setTextColor('black');
    doc.setFontSize(9);
    doc.text("RÉGIMEN DE PERSONAS MORALES CON FINES NO LUCRATIVOS.", 12, doc.autoTable.previous.finalY + 10);

    
   
    doc.save(`${data.nombreReceptor}_${moment().format("DD-MM-YYYY")}.pdf`)
}