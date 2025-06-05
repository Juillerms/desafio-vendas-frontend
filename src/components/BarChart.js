// src/components/BarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ vendasData, title }) => {
  // Processar 'vendasData' para o formato do Chart.js
  // Exemplo: agrupar vendas por cliente (ou produto, se tiver essa info)
  const processDataForBarChart = (vendas) => {
    if (!vendas || vendas.length === 0) {
      return { labels: [], datasets: [] };
    }

    const vendasPorCliente = vendas.reduce((acc, venda) => {
      const cliente = venda.cliente || 'Desconhecido'; // Assumindo que 'cliente' é o nome do produto/categoria
      acc[cliente] = (acc[cliente] || 0) + 1; // Contando quantidade de vendas
      // Se quiser somar o valor das vendas: acc[cliente] = (acc[cliente] || 0) + venda.valor;
      return acc;
    }, {});

    const labels = Object.keys(vendasPorCliente);
    const dataValues = Object.values(vendasPorCliente);

    return {
      labels,
      datasets: [
        {
          label: 'Quantidade de Vendas por Cliente/Produto',
          data: dataValues,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = processDataForBarChart(vendasData);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title || 'Gráfico de Barras de Vendas',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantidade de Vendas' // ou 'Valor Total Vendido'
        }
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;