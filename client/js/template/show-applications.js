"use strict";

const status = {
    'sospeso': 'bg-warning',  
    'accettata': 'bg-success', 
    'rifiutata': 'bg-danger'
}

/**
 * Crea il contenitore per una singola candidatura
 * @param {object} item 
 * @returns application
 */
function showApplications(item) {
    
    const application = document.createElement("li"); 
    application.id = item.Numero; 
    application.classList.add('application-show'); 
    //nome lavoro
    const lavoro = document.createElement("strong"); 
    lavoro.innerText = "Lavoro:  "
    const lavoroText = document.createTextNode(item.Job + " ");
    application.appendChild(lavoro); 
    lavoro.after(lavoroText);  
    //nome e cognome candidato
    const nome = document.createElement("strong"); 
    nome.innerText = "Nome e cognome: "; 
    const nomeText = document.createTextNode(item.Name + " " + item.Surname + " "); 
    lavoroText.after(nome); 
    nome.after(nomeText);
    //curriculum
    const curriculum = document.createElement("strong"); 
    curriculum.innerText = "Curriculum: "; 
    const curriculumText = document.createTextNode(item.Curriculum + " "); 
    nomeText.after(curriculum); 
    curriculum.after(curriculumText); 
    //indicazione grafica per lo stato
    const stato = document.createElement("strong"); 
    stato.innerText = "Stato: "; 
    const span = document.createElement("span"); 
    span.id = "circle"; 
    span.classList.add(status[item.Status]); 
    span.classList.add("rounded-circle"); 
    span.classList.add("d-inline-block");
    nomeText.after(stato);
    stato.after(span); 
    //bottoni per accettare o rifiutare la domanda
    const accetta = document.createElement("button"); 
    accetta.innerText = "ACCETTA"; 
    accetta.classList.add("bg-success"); 
    accetta.id = "accetta"; 
    const rifiuta = document.createElement("button"); 
    rifiuta.innerText = "RIFIUTA"; 
    rifiuta.classList.add("bg-danger");
    rifiuta.id = "rifiuta"; 
    application.appendChild(rifiuta); 
    rifiuta.after(accetta); 
    //logica bottoni
    if(item.Status === 'accettata' || item.Status === 'rifiutata') {
        accetta.disabled = true; 
        rifiuta.disabled = true; 
    }

    return application; 
}

export default showApplications; 