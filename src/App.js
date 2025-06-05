// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import Filters from './components/Filters';
import { fetchVendas } from './services/api'; // Importa a função de busca

function App() {
  const [vendas, setVendas] = useState([]);
  const [filteredVendas, setFilteredVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});

  const loadVendas = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Remove chaves com valores nulos ou vazios dos filtros
      const activeFilters = Object.entries(filters)
        .filter(([_, value]) => value !== null && value !== '')
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});
      
      console.log("Filtros aplicados na API:", activeFilters);
      const data = await fetchVendas(activeFilters);
      setVendas(data);
      setFilteredVendas(data); // Inicialmente, todas as vendas são "filtradas"
    } catch (err) {
      console.error("Erro ao buscar vendas no App.js:", err);
      setError(err.detalhe || err.message || 'Falha ao carregar os dados das vendas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVendas(); // Carrega todas as vendas inicialmente
  }, [loadVendas]);

  const handleFilterChange = (filters) => {
    console.log("Novos filtros recebidos:", filters);
    setCurrentFilters(filters);
    // A chamada da API com filtros será feita pelo useEffect abaixo
    // ou pode ser chamada diretamente aqui se preferir:
    loadVendas(filters); 
  };

  // Este useEffect poderia ser usado para filtrar no frontend se a API não suportar todos os filtros
  // Mas o ideal é que a API faça a filtragem.
  // useEffect(() => {
  //   let dataToFilter = [...vendas];
  //   if (currentFilters.dataInicio) {
  //     dataToFilter = dataToFilter.filter(v => new Date(v.data) >= new Date(currentFilters.dataInicio));
  //   }
  //   if (currentFilters.dataFim) {
  //     // Adiciona 1 dia ao dataFim para incluir vendas do dia final inteiro
  //     const endDate = new Date(currentFilters.dataFim);
  //     endDate.setDate(endDate.getDate() + 1);
  //     dataToFilter = dataToFilter.filter(v => new Date(v.data) < endDate);
  //   }
  //   // Adicionar mais lógicas de filtro aqui se necessário (ex: produto)
  //   setFilteredVendas(dataToFilter);
  // }, [vendas, currentFilters]);


  if (loading) {
    return <div className="App-loading">Carregando dados...</div>;
  }

  if (error) {
    return <div className="App-error">Erro: {error}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dashboard de Vendas</h1>
      </header>
      <main className="App-main">
        <Filters onFilterChange={handleFilterChange} />
        {filteredVendas.length === 0 && !loading && (
          <p>Nenhuma venda encontrada para os filtros aplicados ou no período selecionado.</p>
        )}
        {filteredVendas.length > 0 && (
          <>
            <div className="chart-container">
              <BarChart vendasData={filteredVendas} title="Vendas por Cliente/Produto" />
            </div>
            <div className="chart-container">
              <LineChart vendasData={filteredVendas} title="Evolução do Valor das Vendas" />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;