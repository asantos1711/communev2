import React from 'react';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import { sumCobros } from './sumCobros';

export const notaPDF = (data) =>{
    //console.log(data)

    var numeral = require('numeral');

    var doc = new jsPDF('p', 'mm', 'a4', {putOnlyUsedFonts: true});

    const rioLogo = document.getElementById("rioLogo")

    doc.addImage(rioLogo, "JPEG", 150, 20, 45, 40);    

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");

    doc.text(data[0].asociado, 12, 63);
    doc.text(data[0].referencia, 12, 68);
    doc.text(data[0].direccion, 12, 73);

    doc.line(12, 80, 190, 80);

    doc.autoTable({
        html:'#tableFNG',
        theme: 'plain',
        startY: 90
    });
    

    doc.text("Total:", 160, doc.autoTable.previous.finalY + 27, null, null, "right");
    doc.text(numeral(sumCobros(data)).format('$0,0.00'), 190, doc.autoTable.previous.finalY + 27,null, null, "right");

    doc.setFontSize(8)
    doc.setFont("helvetica", "italic");
    doc.setTextColor(107,107,135);
    doc.text(`Emitido por ${data[0].emitido}`, 160, 15);
    doc.text(moment().format("DD MMM YYYY HH:mm"), 160, 18);

    doc.save(`${data[0].asociado}_${moment().format("DD-MM-YYYY")}.pdf`)

}