// src/components/PropertyForm.js
import React, { useState } from "react";
import axios from "axios";

export default function PropertyForm({ userEmail, onSuccess }) {
  const [nome, setNome] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [clima, setClima] = useState("");
  const [solo, setSolo] = useState("");
  const [endereco, setEndereco] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/properties", {
      email: userEmail,
      nome,
      tamanho: parseInt(tamanho),
      clima,
      solo,
      endereco
    });
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
      <input placeholder="Tamanho (ha)" type="number" value={tamanho} onChange={e => setTamanho(e.target.value)} required />
      <input placeholder="Clima" value={clima} onChange={e => setClima(e.target.value)} />
      <input placeholder="Solo" value={solo} onChange={e => setSolo(e.target.value)} />
      <input placeholder="Endereço" value={endereco} onChange={e => setEndereco(e.target.value)} />
      <button type="submit">Cadastrar Propriedade</button>
    </form>
  );
}