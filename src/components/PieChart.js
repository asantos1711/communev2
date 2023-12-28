import React from 'react'
import { Pie } from 'react-chartjs-2';

export default function PieChart({values}){
    const legendOpts = {
        onClick: (e, item) => null,
        onHover: (e, item) => null,
      };
    const data = {
        labels: [
            'Mtto Pagado',
            'Mtto Vigente',
            'Mtto Incompleto',
            'Mtto Cancelado',
        ],
        datasets: [{
            data: values,
            backgroundColor: [
            '#4d9f0c',
            '#dc3545',
            '#ffc107',
            '#343a40',
            ],
            hoverBackgroundColor: [
                '#4d9f0c',
                '#dc3545',
                '#ffc107',
                '#343a40',
            ]
        }]
    }

    return (
        <Pie data={data} height={70} legend={legendOpts} />
    )
}