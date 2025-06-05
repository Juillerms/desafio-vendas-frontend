import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale, 
} from 'chart.js';
import 'chartjs-adapter-date-fns'; 
import { parseISO } from 'date-fns'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale 
);

const LineChart = ({ vendasData, title }) => {
  const processDataForLineChart = (vendas) => {
    if (!vendas || vendas.length === 0) {
      return { datasets: [{ label: 'Valor da Venda', data: [] }] };
    }

    const vendasAgrupadasPorDia = vendas.reduce((acc, venda) => {
      const diaDaVenda = venda.dataVenda; 

      if (!acc[diaDaVenda]) {
        acc[diaDaVenda] = 0;
      }
      acc[diaDaVenda] += venda.valorTotal; 
      return acc;
    }, {});

    console.log('LineChart - Vendas Agrupadas por Dia:', vendasAgrupadasPorDia);

    const dataPoints = Object.keys(vendasAgrupadasPorDia)
      .map(dia => ({
        x: parseISO(dia), 
        y: vendasAgrupadasPorDia[dia],
      }))
      .sort((a, b) => a.x - b.x); 

    console.log('LineChart - Data Points para o gráfico:', dataPoints);

    return {
      datasets: [
        {
          label: 'Valor Total de Vendas por Dia',
          data: dataPoints,
          borderColor: 'rgb(54, 162, 235)', 
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          tension: 0.1,
          fill: false, 
        },
      ],
    };
  };

  const chartData = processDataForLineChart(vendasData);

  const options = {
    responsive: true,
    maintainAspectRatio: true, 
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title || 'Evolução do Valor das Vendas',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'dd/MM/yyyy', 
          displayFormats: {
            day: 'dd/MM/yy', 
          },
        },
        title: {
          display: true,
          text: 'Data da Venda',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Valor Total Vendido (R$)',
        },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
          }
        }
      },
    },
  };

  if (!chartData || !chartData.datasets) {
      return <p>Preparando dados para o gráfico...</p>;
  }

  return <Line data={chartData} options={options} />;
};

export default LineChart;