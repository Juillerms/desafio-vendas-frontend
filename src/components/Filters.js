// src/components/Filters.js
import React, { useState } from 'react';

const Filters = ({ onFilterChange }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // const [produto, setProduto] = useState(''); // Exemplo para filtro de produto

  const handleApplyFilters = () => {
    // Validação básica das datas pode ser adicionada aqui
    onFilterChange({
      dataInicio: startDate || null, // Envia null se vazio para não filtrar
      dataFim: endDate || null,
      // produto: produto || null,
    });
  };

  return (
    <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
      <h4>Filtrar Dados</h4>
      <div>
        <label htmlFor="startDate" style={{ marginRight: '10px' }}>Data Início:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginRight: '20px' }}
        />
        <label htmlFor="endDate" style={{ marginRight: '10px' }}>Data Fim:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ marginRight: '20px' }}
        />
      </div>
      {/* // Exemplo para filtro de produto (necessitaria de um input e lógica)
      <div style={{ marginTop: '10px' }}>
        <label htmlFor="produto" style={{ marginRight: '10px' }}>Produto/Cliente:</label>
        <input
          type="text"
          id="produto"
          value={produto}
          placeholder="Nome do produto/cliente"
          onChange={(e) => setProduto(e.target.value)}
          style={{ marginRight: '20px' }}
        />
      </div>
      */}
      <button onClick={handleApplyFilters} style={{ marginTop: '10px' }}>
        Aplicar Filtros
      </button>
    </div>
  );
};

export default Filters;