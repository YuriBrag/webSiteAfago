// src/components/AreaForm.js
import React, { useState } from "react";
import axios from "axios";

export default function AreaForm({ userEmail, propertyName, onSuccess }) {
  const [tamanho, setTamanho] = useState("");
  const [tipoAplicacao, setTipoAplicacao] = useState("");
  const [cultura, setCultura] = useState("");
  const [tempoTratamento, setTempoTratamento] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/areas", {
      email: userEmail,
      propertyName,
      tamanho: parseInt(tamanho),
      tipo_aplicacao: tipoAplicacao,
      cultura,
      tempo_tratamento: tempoTratamento
    });
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Tamanho (ha)" type="number" value={tamanho} onChange={e => setTamanho(e.target.value)} required />
      <input placeholder="Tipo de Aplicação" value={tipoAplicacao} onChange={e => setTipoAplicacao(e.target.value)} />
      <input placeholder="Cultura" value={cultura} onChange={e => setCultura(e.target.value)} />
      <input placeholder="Tempo de Tratamento" value={tempoTratamento} onChange={e => setTempoTratamento(e.target.value)} />
      <button type="submit">Cadastrar Área</button>
    </form>
  );
}