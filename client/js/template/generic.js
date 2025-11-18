"use strict"; 

//modulo che implementa componenti html ricorrenti per evitare ridondanze

 function getSection() {
    const section = document.createElement("section"); 
    section.setAttribute("id", "section-annunci"); 

    return section; 
}

//riempie la sezione con testo e bottoni
function getInnerSection(titolo, ricerca, id) {
    const h1 = document.createElement("h1"); 
    h1.innerText = titolo;  
    h1.setAttribute("id", "pubblica");
    const button = document.createElement("button"); 
    button.setAttribute("id", id); 
    button.innerText = ricerca;
    
    document.getElementById("section-annunci").appendChild(button); 
    document.getElementById("section-annunci").insertBefore(h1, button); 
}

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

//creo accordion da inserire nel profilo utente
function getProfile(user) {
    if (!user || !user.name || !user.surname) {
        console.error("Dati dell'utente incompleti:", user);
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
        button.classList.add('bg-primary'); 
        //appendo il bottone 
        h2.appendChild(button); 
        //contenuto sezione
        const collapse = createElement('div', 'accordion-collapse', null, {'id': 'collapse-' + count, 
            'data-bs-parent': '#accordionExample', 
        }); 
        collapse.classList.add('collapse', 'show'); 
        const bodyAccordion = createElement('div', 'accordion-body', null, {'id': 'accordion-body-' + count});
        //colore di sfondo
        bodyAccordion.classList.add('bg-info'); 
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
    document.getElementById("accordion-button-0").textContent = "Dati utente"; 
    document.getElementById("accordion-button-1").textContent = "Elenco candidature"; 
    document.getElementById("accordion-button-2").textContent = "Impostazioni"; 
    //contenuto della sezione dei dati 
    const data = createElement('ul'); 
    const name = createElement('li', null, 'NOME E COGNOME: ' + user.name + ' ' + user.surname, {'id': 'name'}); 
    const email = createElement('li', null, 'EMAIL: ' + user.name, {'id': 'email'}); 
    const form = createElement('form', null, null, {'id': 'uploadForm'}); 
    const label = createElement('label', null,'Scegli un file txt, pdf, docx o doc:  ', {'for': 'document'}); 
    const input = createElement('input', null,  null, {'id': 'document', 'type': 'file', 'accept': '.pdf .docx .doc .txt', 'name': 'document'}); 
    const formGroup = createElement('div', 'form-group'); 
    const button = createElement('button', 'job-button', 'Carica curriculum', {'type': 'submit'}); 

    formGroup.appendChild(input); 
    formGroup.insertBefore(label, input); 
    form.appendChild(button); 
    form.insertBefore(formGroup, button); 

    data.appendChild(form); 
    data.insertBefore(name, form); 
    name.after(email); 
    document.getElementById("accordion-body-0").appendChild(data);

    //pulsante per elenco candidature
    const applicationButton = createElement('button', 'job-button', 'VEDI STATO CANDIDATURE', {'id': 'applicationId'}); 
    document.getElementById("accordion-body-1").appendChild(applicationButton);

 
}

//viene incollato nella route '/profile' in caso di utente non trovato
function getNotFound(role) {
    //creo gli elementi
    const h1 = document.createElement("h1"); 
    h1.innerText = "UTENTE NON TROVATO!"; 
    const advise = document.createElement("h1"); 
    advise.innerText = "CLICCA PER AUTENTICARTI"; 
    const button =  document.createElement("button"); 
    button.classList.add("job-button"); 
    button.innerText = "EFFETTUA IL LOGIN"; 
    if(role === 'user') {
      button.id = "user-btn"; 
    }
    else if(role === 'agency') {
      button.id = "agency-btn"; 
    }
    //inserisco gli elementi nel DOM
    
    const aside = document.getElementById("aside"); 
    const main = document.getElementById("main"); 
    aside.innerHTML = ""; 
    main.innerHTML = ""; 
    main.appendChild(h1); 
    aside.appendChild(button); 
    aside.insertBefore(advise, button); 
    


}

export {getSection, getInnerSection, getProfile, getNotFound};