import React from "react";

export const FiltroCVExtrasSanc = (item, tipo, aux, subtipo) => {

    if(tipo === "Extra") {
        var mapTiposExtr = new Map();
        let arrTiposExtr = [];
        const iterador = mapTiposExtr.values();

        for(let i = 0; i < aux.length; i++) {
            if(!mapTiposExtr.has(aux[i])) {
                mapTiposExtr.set(aux[i], 0);
            }
        }

        Object.keys(item).forEach(key => {
            if(item[key].tipoExtraordinaria !== null) {
                mapTiposExtr.set(item[key].tipoExtraordinaria, item[key].saldoEx);
                arrTiposExtr.push(iterador.next().value);
            }
        })

        let value = 0;
        for(let i = 0; i < item.length; i++) {
            const valor = aux.includes(subtipo);

            if(valor){
                return value = mapTiposExtr.get(subtipo);
            } else {
                return value = 0;
            }

        }
        // return "-1E";


    } else if (tipo === "Sanc") {
        var mapTiposSanc = new Map();
        var saldoAux = 0;
        var copy = item.filter(x => x.tipoSanc !== null);

        for(let i = 0; i < aux.length; i++) {
            if(!mapTiposSanc.has(aux[i])) {
                mapTiposSanc.set(aux[i], 0);
            }
        }

        copy.sort((a,b) => {
            const nameA = a.tipoSanc.toUpperCase();
            const nameB = b.tipoSanc.toUpperCase();
            if(nameA < nameB) {
                return -1;
            } 
            if(nameA > nameB) {
                return 1;
            }

            return 0;
        });
        // if(copy.length > 0) {
            let tipos = copy.map(dato => {
                    if(!mapTiposSanc.has(dato.tipoSanc)) {
                        saldoAux = 0;
                        saldoAux = dato.saldoSanc;
                        mapTiposSanc.set(dato.tipoSanc, saldoAux);
                    } else if (mapTiposSanc.has(dato.tipoSanc)) {
                        saldoAux = mapTiposSanc.get(dato.tipoSanc);
                        mapTiposSanc.set(dato.tipoSanc, saldoAux+dato.saldoSanc);
                    }
                return ":P";
            })
        // }

        let value = 0;
        for(let i = 0; i < item.length; i++) {
            const valor = aux.includes(subtipo);

            if(valor){
                return value = mapTiposSanc.get(subtipo);
            } else {
                return value = 0;
            }

        }
        // return "-1S";
        
    } else if (tipo === "Inicial") {
        var mapTiposInit = new Map();
        let arrTiposInit = [];
        const iterador = mapTiposInit.values();

        for(let i = 0; i < aux.length; i++) {
            if(!mapTiposInit.has(aux[i])) {
                mapTiposInit.set(aux[i], 0);
             }
        }

        Object.keys(item).forEach(key => {
            if(item[key].tipoInit !== null) {
                mapTiposInit.set(item[key].tipoInit, item[key].saldoInit);
                arrTiposInit.push(iterador.next().value);
            }
        })

        let value = 0;
        for(let i = 0; i < item.length; i++) {
            const valor = aux.includes(subtipo);

            if(valor) {
                return value = mapTiposInit.get(subtipo);
            } else {
                return value = 0;
            }
        }
        // return "-1I";

    }

    console.log("no deberías llegar aqui");
    return null;
}
