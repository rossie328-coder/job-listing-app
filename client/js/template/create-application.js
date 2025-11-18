"use strict"; 

const status = {
    'sospeso': 'bg-warning',  
    'accettata': 'bg-success', 
    'rifiutata': 'bg-danger'
}

/**
 * crea un contenitore per una candidatura
 * 
 * @param {object} item 
 * @returns application
 */

function createApplication(item) {
    
    const application = document.createElement("li"); 
    const nome = document.createElement("strong"); 
    nome.innerText = "Lavoro:  "
    const nomeText = document.createTextNode(item.Job + " ");
    application.appendChild(nome); 
    nome.after(nomeText);  
    const azienda = document.createElement("strong"); 
    azienda.innerText = "Azienda: "; 
    const aziendaText = document.createTextNode(item.Agency + " "); 
    nomeText.after(azienda); 
    azienda.after(aziendaText);
    const stato = document.createElement("strong"); 
    stato.innerText = "Stato: "; 
    const statoText = document.createTextNode(item.Status + " "); 
    aziendaText.after(stato); 
    stato.after(statoText);
    //indicazione grafica per lo stato
    const span = document.createElement("span"); 
    span.id = "circle"; 
    span.classList.add(status[item.Status]); 
    span.classList.add("rounded-circle"); 
    span.classList.add("d-inline-block");
    statoText.after(span); 


    return application; 
}

export default createApplication; 