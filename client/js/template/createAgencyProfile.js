"use strict"; 

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
 * crea il profilo per le aziende
 * @param {object} agency 
 * @returns 
 */

//creo accordion da inserire nel profilo utente
function getAgencyProfile(agency) {
    if (!agency || !agency.nome || !agency.luogo || !agency.settore) {
        console.error("Dati dell'utente incompleti:", agency);
        return;
    }

    //conntenitore principale
    const accordion = createElement('div', 'accordion', null, {'id': 'accordionExample'}); 
    //contenuto 
    let count = 0; 
    while(count < 3) {
        const accordionItem = createElement('div', 'accordion-item'); 
        //titolo voce 
        const h2 = createElement('h2', 'accordion-header'); 
        //creo bottone 
        const button = createElement('button', 'accordion-button', null, {'id': 'accordion-button-' + count, 
            'data-bs-toggle': 'collapse', 'data-bs-target': '#collapse-' + count, 'type': 'button', 'aria-expanded': 'true', 
            'aria-controls': 'collapse-' + count
        }); 
        button.classList.add('bg-warning'); 
        //appendo il bottone 
        h2.appendChild(button); 
        //contenuto sezione
        const collapse = createElement('div', 'accordion-collapse', null, {'id': 'collapse-' + count, 
            'data-bs-parent': '#accordionExample', 
        }); 
        collapse.classList.add('collapse', 'show'); 
        const bodyAccordion = createElement('div', 'accordion-body', null, {'id': 'accordion-body-' + count});
        //colore di sfondo
        bodyAccordion.classList.add('bg-muted'); 
        collapse.appendChild(bodyAccordion);
        h2.after(collapse); 
        //inserisco la voce in accordion
        accordionItem.appendChild(h2); 
        accordionItem.appendChild(collapse); 
        accordion.appendChild(accordionItem); 

        count += 1; 
    }

    const h1 = createElement('h1', null, 'Il tuo profilo', {'id': 'profile-title'}); 
    document.getElementById("main").appendChild(h1); 
    h1.after(accordion); 
    //inserisco i nomi dei bottoni
    document.getElementById("accordion-button-0").textContent = "Dati"; 
    document.getElementById("accordion-button-1").textContent = "Elenco candidature"; 
    document.getElementById("accordion-button-2").textContent = "Pubblica annuncio"; 
    //contenuto della sezione dei dati 
    const data = createElement('ul'); 
    const name = createElement('li', null, 'NOME: ' + agency.nome + ' ', {'id': 'nameAgency'}); 
    const luogo = createElement('li', null, 'LUOGO: ' + agency.luogo, {'id': 'luogo'}); 

    data.appendChild(luogo); 
    data.insertBefore(name, luogo);  
    document.getElementById("accordion-body-0").appendChild(data);

    //pulsante per elenco candidature
    const applicationButton = createElement('button', 'job-button', 'VEDI CANDIDATURE', {'id': 'applicationsId'}); 
    document.getElementById("accordion-body-1").appendChild(applicationButton);

    //bottone per caricamento annunci
    const button = createElement("button", 'job-button', 'PUBBLICA ANNUNCIO', {'id': 'makeApplication'}); 
    document.getElementById("accordion-body-2").appendChild(button);
 
}

export default getAgencyProfile; 