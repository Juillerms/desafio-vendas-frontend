import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import Filters from './components/Filters';
import { fetchVendas, fetchVendaById } from './services/api';

function App() {
  const [vendas, setVendas] = useState([]);
  const [filteredVendas, setFilteredVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});

  const [vendaIdInput, setVendaIdInput] = useState(''); 
  const [encontradaVenda, setEncontradaVenda] = useState(null); 
  const [loadingEncontradaVenda, setLoadingEncontradaVenda] = useState(false);
  const [errorEncontradaVenda, setErrorEncontradaVenda] = useState(null);
  const [buscaRealizada, setBuscaRealizada] = useState(false); 

  const loadVendas = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const activeFilters = Object.entries(filters)
        .filter(([_, value]) => value !== null && value !== '')
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});
      
      console.log("Filtros aplicados na API:", activeFilters);
      const data = await fetchVendas(activeFilters);
      setVendas(data);
      setFilteredVendas(data); 
    } catch (err) {
      console.error("Erro ao buscar vendas no App.js:", err);
      setError(err.detalhe || err.message || 'Falha ao carregar os dados das vendas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVendas(); 
  }, [loadVendas]);

  const handleFilterChange = (filters) => {
    console.log("Novos filtros recebidos:", filters);
    setCurrentFilters(filters);
    loadVendas(filters); 
  };

const handleBuscarVendaPorId = async () => {
  if (!vendaIdInput.trim()) {
    alert('Por favor, insira um ID de venda.');
    setEncontradaVenda(null);
    setErrorEncontradaVenda(null);
    setBuscaRealizada(false);
    return;
  }
  setLoadingEncontradaVenda(true);
  setErrorEncontradaVenda(null);
  setEncontradaVenda(null);
  setBuscaRealizada(true);

  try {
    const data = await fetchVendaById(vendaIdInput);
    setEncontradaVenda(data);
    if (data === null) {
      setErrorEncontradaVenda(`Nenhuma venda encontrada com o ID: ${vendaIdInput}`);
    }
  } catch (err) {
    console.error("Erro ao buscar venda por ID no App.js:", err);
    setErrorEncontradaVenda(err.detalhe || err.message || `Falha ao buscar venda com ID: ${vendaIdInput}.`);
  } finally {
    setLoadingEncontradaVenda(false);
  }
};

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

        <section className="todas-vendas-section">
          <h2>Relatório de Vendas</h2>
          {loading && <p className="App-loading">Carregando relatório de vendas...</p>}
          {!loading && error && <p className="App-error">Erro ao carregar vendas: {error}</p>}
          {!loading && !error && filteredVendas.length === 0 && (
            <p>Nenhuma venda encontrada para os filtros aplicados.</p>
          )}
          {!loading && !error && filteredVendas.length > 0 && (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID da Venda</th>
                    <th>Nome do Produto</th>
                    <th>Quantidade</th>
                    <th>Data da Venda</th>
                    <th>Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendas.map((venda) => (
                    <tr key={venda.id}>
                      <td>{venda.id}</td>
                      <td>{venda.nomeProduto}</td>
                      <td>{venda.quantidadeVendida}</td>
                      <td>{new Date(venda.dataVenda + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                      <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(venda.valorTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
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
      
        <section className="buscar-venda-section">
          <h2>Consultar Venda por ID</h2>
          <div className="form-group">
            <input
              type="number" // ou "text" se o ID puder ter não numéricos
              placeholder="Digite o ID da Venda"
              value={vendaIdInput}
              onChange={(e) => {
                setVendaIdInput(e.target.value);
                setBuscaRealizada(false); // Reseta o estado de busca se o input mudar
                setEncontradaVenda(null);
                setErrorEncontradaVenda(null);
              }}
              className="form-input"
            />
            <button 
              onClick={handleBuscarVendaPorId} 
              disabled={loadingEncontradaVenda || !vendaIdInput.trim()} 
              className="form-button"
            >
              {loadingEncontradaVenda ? 'Buscando...' : 'Buscar Venda'}
            </button>
          </div>

          {loadingEncontradaVenda && <p className="App-loading">Consultando venda...</p>}

          {errorEncontradaVenda && !loadingEncontradaVenda && (
            <p className="App-error">Erro: {errorEncontradaVenda}</p>
          )}

          {buscaRealizada && !loadingEncontradaVenda && !errorEncontradaVenda && encontradaVenda && (
            <div className="venda-detalhes">
              <h3>Detalhes da Venda ID: {encontradaVenda.id}</h3>
              <p><strong>Nome do Produto:</strong> {encontradaVenda.nomeProduto}</p>
              <p><strong>Quantidade Vendida:</strong> {encontradaVenda.quantidadeVendida}</p>
              <p><strong>Data da Venda:</strong> {new Date(encontradaVenda.dataVenda + 'T00:00:00').toLocaleDateString('pt-BR')}</p> {/* Adiciona T00:00:00 para evitar problemas de fuso ao converter só a data */}
              <p><strong>Valor Total:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(encontradaVenda.valorTotal)}</p>
            </div>
          )}

          {buscaRealizada && !loadingEncontradaVenda && !errorEncontradaVenda && !encontradaVenda && (
            <p>Nenhuma venda encontrada com o ID: {vendaIdInput}.</p>
          )}
        </section>




    </div>
  );
}

export default App;