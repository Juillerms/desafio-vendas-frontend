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
  const processDataForBarChart = (vendas) => {
    if (!vendas || vendas.length === 0) {
      return { labels: [], datasets: [] };
    }

    const vendasPorNomeProduto = vendas.reduce((acc, venda) => {
      const produto = venda.nomeProduto || 'Desconhecido'; 
      acc[produto] = (acc[produto] || 0) + venda.quantidadeVendida; 
      acc[produto] = (acc[produto] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(vendasPorNomeProduto);
    const dataValues = Object.values(vendasPorNomeProduto);

    return {
      labels,
      datasets: [
        {
          label: 'Quantidade Vendida por Produto',
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
          text: 'Quantidade Vendida'
        }
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;