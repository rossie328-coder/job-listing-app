"use strict"; 

//funzione per creare elementi
/*come valore di default per il secondo parametro ho impostato un oggetto vuoto 
per gestire il caso in cui qualche parametro sia undefined
*/
function createElement(tag, {className = "", innerText = "", attributes = {}} = {}) {
    const element = document.createElement(tag);
    if(className) {
      element.classList.add(className);
    }
    if(innerText) {
      element.innerText = innerText; 
    }

    //aggiungo gli attributi se sono presenti
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }
  
    return element;
  }

/**
 * Crea il contenitore per gli annunci
 * @param {object} offer 
 * @returns button
 */
function getTemplateOffer(offer) {
    //elemento contenitore
    const button = createElement("button", {className: "job", attributes: {"data-num": offer.Numero}});
    //tag interni 
    const  nome = createElement("div", {className: "job-title", innerText: offer.Nome}); 
    const azienda = createElement("div", {innerText: offer.Nome}); 
    const localita = createElement("div", {classname: "job-location", innerText: offer.Località});

    const hr = createElement("hr"); 

    const descrizione = createElement("div"); 
    const strong = createElement("strong", {innerText: "Descrizione"}); 
    descrizione.appendChild(strong); 

    const offerta = createElement("div", {classname: "job-description", innerText: offer.Descrizione}); 
    //appendo i tag
    button.append(nome, azienda, localita, hr, descrizione, strong, offerta);

    return button; 
}

export default getTemplateOffer;