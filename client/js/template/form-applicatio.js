
/**
 * Crea il form per consentire alle aziende di caricare nuovi annunci
 * @returns form
 */
function getApplicationForm() {
    //array per valori attributi e testo tag
    const name = ['Nome', 'Nome offerta', 'text', 'Nome', 'Contratto', 'Contratto', 'text', 'Contratto']; 
    //creo elementi
    const form = document.createElement("form"); 
    form.classList.add("authFormAgency"); 
    const div = document.createElement("div"); 
    div.classList.add("formTitle"); 
    div.innerText = "Carica un nuovo annuncio"; 
    form.appendChild(div); 
    //ciclo per tag form
    let i = 0; 
    while(i < 2) {
      const div = document.createElement("div"); 
      div.classList.add("mb-3"); 
      const label = document.createElement("label"); 
      label.setAttribute("for", name[4*i]); 
      label.classList.add("form-label"); 
      label.innerText = name[4*i + 1]; 
      const input = document.createElement("input"); 
      input.setAttribute("type", name[4*i + 2]); 
      input.classList.add("form-control"); 
      input.id = name[4*i]; 
      input.setAttribute("name", name[4*i + 3]); 
      //aggancio i tag a div 
      div.appendChild(input); 
      div.insertBefore(label, input); 
      //aggancio i tag al form
      form.appendChild(div); 
      //incremento
      i += 1; 
    }


    const descrizione = document.createElement("div"); 
    descrizione.classList.add("mb-3"); 
    const label = document.createElement("label"); 
    label.setAttribute("for", "Descrizione"); 
    label.innerText = "Descrizione"; 
    const textArea = document.createElement("textarea"); 
    textArea.id = "Descrizione"; 
    textArea.setAttribute("type", "text");
    textArea.setAttribute("name", "Descrizione"); 
    descrizione.appendChild(textArea); 
    descrizione.insertBefore(label, textArea); 
    form.appendChild(descrizione); 
  
    //creo il bottone
    const button = document.createElement("button"); 
    button.setAttribute("type", "submit"); 
    button.classList.add("btn");
    button.classList.add("btn-primary"); 
    button.innerText = "Submit"; 
    //appendo il bottone
    form.appendChild(button); 
  
    return form; 
  }
  
  export default getApplicationForm; 