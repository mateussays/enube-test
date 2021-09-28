import React, { useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [option, setOption] = useState("");
  const [inputDate, setInputDate] = useState("");

  function newDate(days) {
    let date = new Date();
    let finalDate;
    finalDate =
      date.getMonth() +
      1 +
      "-" +
      (date.getDate() - days) +
      "-" +
      date.getFullYear();
    return finalDate;
  }

  function getDateValue() {
    if (option === "21 dias") return newDate(21);
    if (option === "14 dias") return newDate(14);
    if (option === "7 dias") return newDate(7);
  }

  async function getPeriodDollar(firstDate, secondDate) {
    let result = null;
    const urlPeriod = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${firstDate}'&@dataFinalCotacao='${secondDate}'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`;
    const resultFetch = await fetch(urlPeriod);
    result = await resultFetch.json();
    return result.value;
  }

  function handleOption(evt) {
    const {
      target: { value },
    } = evt;
    setOption(value);
  }

  function handleInput(evt) {
    const {
      target: { value },
    } = evt;
    
    setInputDate(value);
  }

  async function handleInput2() {
    const urlPeriod = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${inputDate}'&$top=100&$format=json`;
    const resultFetch = await fetch(urlPeriod);
    const result = await resultFetch.json();
    console.log(result);
    setData(result.value);
  }

  async function handleOption2(evt) {
    evt.preventDefault();
    const firstPeriod = getDateValue();
    const date1 = new Date();
    const finalDate1 =
      date1.getMonth() + 1 + "-" + date1.getDate() + "-" + date1.getFullYear();
    const data = await getPeriodDollar(firstPeriod, finalDate1);
    setData(data);
  }

  return (
    <div className="container my-5">
      <header><h1>Cotação Dollar - Teste eNUBE.me</h1></header>
      <section className="d-flex justify-content-around">
        <div className="d-flex">
          <div>
            <select
              className="form-select form-select-sm"
              onChange={(evt) => handleOption(evt)}
            >
              <option></option>
              <option>7 dias</option>
              <option>14 dias</option>
              <option>21 dias</option>
            </select>
          </div>
          <div>
            <button
              type="button"
              class="btn btn-primary btn-sm ms-2"
              onClick={handleOption2}
            >
              Resultado por período
            </button>
          </div>
        </div>

        <div>
          <form className="input-group input-group-sm mb-3">
            <label className="input-group-text">Por data:</label>
            <input
              className="form-control"
              placeholder="mm-dd-yyyy"
              onChange={(evt) => handleInput(evt)}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleInput2}
            >
              Resultado por data
            </button>
          </form>
        </div>
      </section>

      <div>
        <table id="table" className="table">
          <thead>
            <tr>
              <th>COTAÇÃO COMPRA</th>
              <th>COTAÇÃO VENDA</th>
              <th>DATA COTAÇÃO</th>
            </tr>
          </thead>
          <tbody id="colum-result">
            {data.map((item) => (
              <tr key={item.dataHoraCotacao}>
                <td>{item.cotacaoCompra}</td>
                <td>{item.cotacaoVenda}</td>
                <td>{item.dataHoraCotacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
