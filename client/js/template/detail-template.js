"use strict";

//funzione per gestire la creazione dei vari tag 
function createElement(tag, className, innerText, attributes = {}) {
  const element = document.createElement(tag);
  if(className) {
    element.classList.add(className);
  }
  if(innerText) {
    element.innerText = innerText; 
  }

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }

  return element;
}

/**
 * Crea il contenitore per mostrare i dettagli di un annuncio
 * 
 * @param {object} detail 
 * @returns 
 */

function getTemplateDetail(detail) {
  //contenitore principale
  const div = createElement("div", "detail"); 
  //altri tag
  const nome = createElement("div", "job-title", detail.Nome, {"id": "job-name"}); 
  const tipo = createElement("div", null, "Tipo: " + detail.Contratto, {"id": "time"}); 
  const azienda = createElement("div", null, detail.Azienda, {"id": "agency-name"}); 

  const line = createElement("br"); 

  const candidati = createElement("div"); 
  const strong = createElement("strong", null, "Candidati"); 
  candidati.appendChild(strong); 

  const button = createElement("button", "job-button", "Continua e candidati", {"id": "application-btn"}); 

  const hr = createElement("hr"); 

  const dettagli = createElement("div", ); 
  const strong2 = createElement("strong", null, "Dettagli"); 
  dettagli.appendChild(strong2); 

  const descrizione = createElement("div", null, detail.Descrizione, {"id": "text-detail"}); 

  //appendo i tag 
  div.append(nome, tipo, azienda, line, candidati, button, hr, dettagli, descrizione); 

  return div; 
}

export default getTemplateDetail;