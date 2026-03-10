import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./App.css";

export default function App() {
  const [lancamentos, setLancamentos] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [data, setData] = useState("");
  const [mesSelecionado, setMesSelecionado] = useState("");

  function adicionarLancamento(e) {
    e.preventDefault();

    if (!descricao || !valor || !data) return;

    const novo = {
      id: Date.now(),
      descricao,
      valor: parseFloat(valor),
      tipo,
      data,
    };

    setLancamentos([...lancamentos, novo]);
    setDescricao("");
    setValor("");
    setData("");
  }

  function excluirLancamento(id) {
    setLancamentos(lancamentos.filter((item) => item.id !== id));
  }

  const lancamentosFiltrados = useMemo(() => {
    if (!mesSelecionado) return lancamentos;

    return lancamentos.filter((item) => {
      const mesItem = item.data.slice(0, 7);
      return mesItem === mesSelecionado;
    });
  }, [lancamentos, mesSelecionado]);

  const totais = useMemo(() => {
    let entrada = 0;
    let saida = 0;
    let cartao = 0;

    lancamentosFiltrados.forEach((item) => {
      if (item.tipo === "entrada") entrada += item.valor;
      if (item.tipo === "saida") saida += item.valor;
      if (item.tipo === "cartao") cartao += item.valor;
    });

    return { entrada, saida, cartao };
  }, [lancamentosFiltrados]);

  const saldo = totais.entrada - totais.saida - totais.cartao;

  const dadosGrafico = [
    { name: "Entrada", valor: totais.entrada },
    { name: "Saída", valor: totais.saida },
    { name: "Cartão", valor: totais.cartao },
  ];

  return (
    <div className="container">
      <h1>Controle Financeiro</h1>

      <form onSubmit={adicionarLancamento} className="form">
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />

        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
          <option value="cartao">Cartão</option>
        </select>

        <button type="submit">Adicionar</button>
      </form>

      <div className="filtro">
        <label>Filtrar por mês:</label>
        <input
          type="month"
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(e.target.value)}
        />
      </div>

      <div className="resumo">
        <div className="card entrada">
          <h3>Entrada</h3>
          <p>R$ {totais.entrada.toFixed(2)}</p>
        </div>

        <div className="card saida">
          <h3>Saída</h3>
          <p>R$ {totais.saida.toFixed(2)}</p>
        </div>

        <div className="card cartao">
          <h3>Cartão</h3>
          <p>R$ {totais.cartao.toFixed(2)}</p>
        </div>

        <div className="card">
          <h3>Saldo Total</h3>
          <h1>R$ {saldo.toFixed(2)}</h1>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#22C55E" }}>
              Entradas: R$ {totais.entrada.toFixed(2)}
            </span>

            <span style={{ color: "#EF4444" }}>
              Saídas: R$ {totais.saida.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="grafico">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="valor" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ul className="lista">
        {lancamentosFiltrados.map((item) => (
          <li key={item.id} className={`item ${item.tipo}`}>
            <span>
              {item.descricao} - R$ {item.valor.toFixed(2)}
            </span>

            <button onClick={() => excluirLancamento(item.id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}