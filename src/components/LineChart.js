// src/components/LineChart.js
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
  TimeScale, // Importar TimeScale para eixos de tempo
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Adaptador para date-fns

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale // Registrar TimeScale
);

const LineChart = ({ vendasData, title }) => {
  // Processar 'vendasData' para o formato do Chart.js
  const processDataForLineChart = (vendas) => {
    if (!vendas || vendas.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Ordenar vendas por data
    const sortedVendas = [...vendas].sort((a, b) => new Date(a.data) - new Date(b.data));

    // Agrupar vendas por dia (ou mês, semana) e somar os valores ou contar quantidades
    // Para este exemplo, vamos apenas plotar o valor de cada venda ao longo do tempo
    // Numa aplicação real, você provavelmente agruparia (ex: total de vendas por dia)

    const labels = sortedVendas.map(venda => new Date(venda.data)); // Datas para o eixo X
    const dataValues = sortedVendas.map(venda => venda.valor);     // Valores para o eixo Y

    return {
      // labels, // Se usar CategoryScale, mas para TimeScale os dados vão no dataset
      datasets: [
        {
          label: 'Valor da Venda',
          data: sortedVendas.map(venda => ({ x: new Date(venda.data), y: venda.valor })),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.1, // Suaviza a linha
        },
      ],
    };
  };

  const chartData = processDataForLineChart(vendasData);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title || 'Evolução das Vendas ao Longo do Tempo',
      },
    },
    scales: {
      x: {
        type: 'time', // Definir o tipo de escala para tempo
        time: {
          unit: 'day', // Agrupar por dia, pode ser 'month', 'year', etc.
          tooltipFormat: 'dd/MM/yyyy', // Formato da data na dica
          displayFormats: {
             day: 'dd/MM' // Formato da data no eixo
          }
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
          text: 'Valor da Venda (R$)',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;