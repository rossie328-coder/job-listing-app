"use strict";

import getOffers from "./getOffers.js";
import getTemplateOffer from "./template/offers-template.js";
import getDetail from "./getDetail.js";
import getTemplateDetail from "./template/detail-template.js";
import getLogin from "./template/login-template.js";
import getSignup from "./template/signup-template.js"; 
import {getSection, getProfile, getNotFound} from "./template/generic.js"; 
import getUser from "./getUser.js"; 
import getAgencyLogin from "./template/agencyLogin-template.js";
import getSignupAgency from "./template/signupAgency-template.js";
import {logoutUser} from "./logoutUser.js";
import application from "./application.js";
import createApplication from "./template/create-application.js";
import getApplication from "./getApplication.js";
import getAgencyProfile from "./template/createAgencyProfile.js";
import getAgency from "./getAgency.js";
import showApplications from "./template/show-applications.js";
import statusApp from "./stausApp.js";
import getApplicationForm from "./template/form-applicatio.js";


class Controller {
    /**
     * Crea un'istanza del Controller
     * 
     * @param {HTMLElement} main elemento in cui saranno visualizzati gli annunci
     * @param {HTMLElement} aside elemento in cui saranno visualizzati i dettagli degli annunci
     */
    constructor(main, aside) {
        this.main = main; 
        this.aside = aside; 

        //inizializzazione event listener delegando gli eventi al body
        //evento click
        document.body.addEventListener("click", (event) => {
            if(event.target.closest("#annunci-btn")) {
                document.getElementById("section-annunci").innerHTML = "";
                document.getElementById("section-annunci").innerHTML = getFormAnnunci(); 
            } 
            if(event.target.id === 'cv-btn') {
                document.getElementById("section-annunci").innerHTML = "";
                document.getElementById("section-annunci").innerHTML = getCv(); 
            }
            if(event.target.id === 'candidati-btn') {
                page("/profile"); 
            }
            //torno alla home
            if(event.target.id === 'title-btn' || event.target.id === 'site-name') {
                page.redirect("/"); 
            }

            if(event.target.id === 'logout-btn' || event.target.id === 'out-btn' || event.target.id === 'path1' || event.target.id === 'path2') {
                logoutUser(); 
            }

            if(event.target.id === 'aziende-btn') {
                page("/agencyProfile"); 
            }
                 
         });

         //evento da tastiera: keypress
         document.body.addEventListener("keypress", event => {
            if(event.key === 'Enter') {
                const myCanvas = document.getElementById("offcanvasRight"); 
                myCanvas.classList.toggle("show");
            } 
         }); 

        page("/", () => {
            main.innerHTML = ""; 
            aside.innerHTML = ""; 
            this.createOffers();
        
        }); 
        
        page("/offer/:id", (ctx) => { 
            this.expandOffer(ctx);
        });

        document.querySelectorAll(".job").forEach((item) => {
            item.addEventListener("click", () => {
                const id = item.getAttribute("data-num"); 
                page(`/offer/${id}`);
            });
        }); 

        //login aziende
        page("/login-agency", () => {
            main.innerHTML = "";
            aside.innerHTML = ""; 
            //creo il form
            const form = getAgencyLogin(); 
            main.appendChild(form);
            //scrivo messaggio aside
            const p = document.createElement("p"); 
            p.innerText = "INSERISCI LE CREDENZIALI O PREMI IL BOTTONE PER REGISTRARTI: "; 
            p.id = "login-text";
            const button = document.createElement("button"); 
            button.innerText = "REGISTRATI"; 
            button.classList.add("job-button"); 
            aside.appendChild(button); 
            aside.insertBefore(p, button); 

            button.addEventListener("click", () => {
                page.redirect("/signup-agency"); 
            }); 
        
            //gestisco invio dei dati al server
            form.addEventListener('submit', async (event) => {
                event.preventDefault(); 
        
                const data = event.target;
                if (!data.Nome.value || !data.Password.value) {
                    return;
                }
    
                try {
                    const response = await fetch('/api/login-agency', {
                        method: 'post', 
                        headers: {
                            'Content-Type': 'application/json',
                        }, 
                        body: JSON.stringify({
                            username: data.Nome.value,
                            password: data.Password.value
                        }),
                    });
        
                    if(response.ok) {

                        page.redirect('/');
                    } else {
                        console.log('Errore durante il login:', response.statusText);
                    }
                } catch (error) {
                    console.error('Errore di rete:', error);
                }
            });
        });

        //login candidati
        page("/login", () => {
            main.innerHTML = "";
            aside.innerHTML = ""; 
            //creo il form
            const form = getLogin(); 
            main.appendChild(form);
            //scrivo messaggio aside
            const p = document.createElement("p"); 
            p.innerText = "INSERISCI LE CREDENZIALI O PREMI IL BOTTONE PER REGISTRARTI: "; 
            p.id = "login-text";
            const button = document.createElement("button"); 
            button.innerText = "REGISTRATI"; 
            button.classList.add("job-button"); 
            aside.appendChild(button); 
            aside.insertBefore(p, button); 

            button.addEventListener("click", () => {
                page.redirect("/signup"); 
            }); 
        
            //gestisco invio dei dati al server
            form.addEventListener('submit', async (event) => {
                event.preventDefault(); 
        
                const data = event.target;
                if (!data.Username.value || !data.Password.value) {
                    console.log('Please fill all fields');
                    return;
                }
    
                try {
                    const response = await fetch('/api/login', {
                        method: 'post', 
                        headers: {
                            'Content-Type': 'application/json',
                        }, 
                        body: JSON.stringify({
                            username: data.Username.value,
                            password: data.Password.value
                        }),
                    });
        
                    if(response.ok) {

                        page.redirect('/');
                    } else {
                        console.log('Errore durante il login:', response.statusText);
                    }
                } catch (error) {
                    console.error('Errore di rete:', error);
                }
            });
        });

        //signup aziende
        page('/signup-agency', () => {
            main.innerHTML = ""; 
            aside.innerHTML = ""; 
            //creo il form 
            const form = getSignupAgency(); 
            //appendo il form al main
            main.appendChild(form); 

             //scrivo messaggio aside
             const p = document.createElement("p"); 
             p.innerText = "REGISTRATI O PREMI IL BOTTONE PER EFFETTUARE IL LOGIN: "; 
             p.id = "login-text";
             const button = document.createElement("button"); 
             button.innerText = "LOGIN"; 
             button.classList.add("job-button");  
             aside.appendChild(button); 
             aside.insertBefore(p, button); 

             button.addEventListener("click", () => {
                page.redirect("/login-agency"); 
             }); 


             //gestisco invio dei dati al server
             form.addEventListener('submit', async (event) => {
                event.preventDefault(); 

                /*oggetto che contiene le coppie campo/valore per ogni campo del form 
                formData non restituisce un oggetto Javascript tradizionale ma una specie di contenitore che ospita 
                le coppie chiave/valore di un form

                event.target fa riferimento al tag form
                */
                const formData = new FormData(event.target); 

                //converto formData in un oggetto
                const dataObject = {};
                formData.forEach((value, key) => {
                    dataObject[key] = value;
                });

                //converto in oggetto Json
                const data = JSON.stringify(dataObject); 

                const response = await fetch('/api/signup-agency', {
                    method: 'post', 
                    headers: {
                        'Content-Type': 'application/json',
                    }, 
                    body: data,
                }); 

                if(response.ok) {
                    const result = await response.json();
                    console.log('Success:', result); 
                    page.redirect("/");
                }
                else {
                    console.log('Error:', response.statusText);
                }
            })

        }); 

        
        //route per il signup
        page('/signup', () => {
            //document.body.innerHTML = ''; 
            //svuoto gli elementi
            main.innerHTML = ""; 
            aside.innerHTML = ""; 
            //creo il form 
            const form = getSignup(); 
            //appendo il form al main
            main.appendChild(form); 

             //scrivo messaggio aside
             const p = document.createElement("p"); 
             p.innerText = "REGISTRATI O PREMI IL BOTTONE PER EFFETTUARE IL LOGIN: "; 
             p.id = "login-text";
             const button = document.createElement("button"); 
             button.innerText = "LOGIN"; 
             button.classList.add("job-button");  
             aside.appendChild(button); 
             aside.insertBefore(p, button); 

             button.addEventListener("click", () => {
                page.redirect("/login"); 
             }); 


             //gestisco invio dei dati al server
             form.addEventListener('submit', async (event) => {
                event.preventDefault(); 

                /*oggetto che contiene le coppie campo/valore per ogni campo del form 
                formData non restituisce un oggetto Javascript tradizionale ma una specie di contenitore che ospita 
                le coppie chiave/valore di un form

                event.target fa riferimento al tag form
                */
                const formData = new FormData(event.target); 

                //converto formData in un oggetto
                const dataObject = {};
                formData.forEach((value, key) => {
                    dataObject[key] = value;
                });

                //converto in oggetto Json
                const data = JSON.stringify(dataObject); 

                const response = await fetch('/api/signup', {
                    method: 'post', 
                    headers: {
                        'Content-Type': 'application/json',
                    }, 
                    body: data,
                }); 

                if(response.ok) {
                    const result = await response.json();
                    page.redirect("/"); 
                }
                else {
                    console.log('Error:', response.statusText);
                }
            })

        }); 

        //gestisco la ricerca degli annunci
        document.getElementById("search-form").addEventListener("submit", async function(event) {
            event.preventDefault(); 
            const query = document.getElementById("search-input").value; 
            const response = await fetch("/api/search?query=" + encodeURIComponent(query));
            const offers = await response.json(); 
            const main = document.getElementById("main");
            const aside = document.getElementById("aside");
    
            aside.innerHTML = "";
            main.innerHTML = ""; 

            offers.forEach(offer => {
                const block = getTemplateOffer(offer);
                main.appendChild(block);
            });
        
            document.querySelectorAll(".job").forEach((item) => {
                item.addEventListener("click", () => {
                    const id = item.getAttribute("data-num");
                    page(`/offer/${id}`);
                });
            });
        });

        //attivo bottone per accesso candidati 
        document.getElementById("auth-candidati").addEventListener("click", () => {
            page("/login"); 
        })

        //attivo bottone per accesso aziende
        document.getElementById("auth-aziende").addEventListener("click", () => {
            page("/login-agency"); 
        })

        //route per l'area aziende 
        page("/agency-area", () => {
            this.deleteExceptNavbar(); 
            
            const navbar = document.getElementById("navbar"); 
            navbar.innerHTML = ""; 

            //nome del sito 
            const name = document.createElement("span"); 
            name.innerText = "JobSearch"; 
            name.setAttribute("class", "site-name"); 
            navbar.appendChild(name); 

            //creo pulsanti per navigare sulla navbar
            const div = document.createElement("div"); 
            div.setAttribute("id", "button-container");

            //pulsante annunci
            const  annunci = document.createElement("button"); 
            annunci.setAttribute("class", "nav-btn"); 
            annunci.innerText = "Pubblica annuncio"; 

            //pulsante CV
            const cv = document.createElement("button"); 
            cv.setAttribute("class", "nav-btn"); 
            cv.innerText = "Cerca CV"; 

            //pulsante profilo azienda
            const profile = document.createElement("button"); 
            profile.setAttribute("class", "nav-btn"); 
            profile.innerText = "Profilo azienda"; 
            
            div.appendChild(cv); 
            div.insertBefore(annunci, cv); 
            div.insertBefore(profile, annunci); 
            navbar.appendChild(div); 

            //profilo azienda
            document.body.appendChild(getSection()); 
            

            //aggiungo eventi su pulsanti
            annunci.addEventListener("click", () => {
                this.createAnnunci();
            }); 

            cv.addEventListener("click", () => {
                this.createCv(); 
            })

        }); 

        //route per il profilo utente 
        page("/profile", async () => {
            //fetch per ottenere i dati dell'utente 
            try {
                //elimino il contenuto del body eccetto la navbar e il footer
                this.deleteExceptNavbar(); 
                const user = await getUser(); 
                getProfile(user);

                //gestione caricamento curriculum
                document.getElementById("uploadForm").addEventListener("submit", async (event) => {
                    event.preventDefault(); 

                    const fileInput = document.getElementById("document"); 
                    const file = fileInput.files[0]; 
                    
                    if(!file) {
                        console.log('file mancante'); 
                    }

                    const formData = new FormData(); 
                    formData.append("document", file, file.name); 

                    try {
                        const response = await fetch('/api/Curriculum', {
                            method: 'post', 
                            headers: {
                                'file-name': file.name
                            },
                            body: formData
                        }); 
    
                        if(response.ok) {
                            console.log('File caricato con successo'); 
                        }
                        else {
                            console.log("Errore nel caricamento del file");
                        }

                    } catch(error) {
                        console.error('Errore', error); 
                    }
                })
            } catch(error) {
                console.log(error); 
                getNotFound('user'); 
            }   

            const button = document.getElementById("applicationId")
            //gestisco click su pulsante candidature
            button.addEventListener('click', async () => {
                try {
                    const h1 = document.createElement("h1");
                    h1.innerText = "Elenco candidature"; 
                    aside.appendChild(h1);  
                    const applications = await getApplication(); 
                    applications.forEach(item => { 
                        const container = document.createElement("ul"); 
                        container.id = "containerId"; 
                        container.appendChild(createApplication(item)); 
                        document.getElementById("aside").appendChild(container); 
                    });
                    
                    //disabilito il bottone
                    button.disabled = true; 

                } catch(error) {
                    console.error(error); 
                }
            })
        });

        //route per il profilo delle aziende
        page("/agencyProfile", async () => {
            try {
                this.deleteExceptNavbar(); 
                const agency = await getAgency(); 
                getAgencyProfile(agency); 
            } catch(error) {
                console.log(error); 
                getNotFound('agency'); 
            }

            const button = document.getElementById("applicationsId")
            //gestisco click su pulsante candidature
            button.addEventListener('click', async () => {
                try {
                    aside.innerHTML = ""; 
                    const h1 = document.createElement("h1");
                    h1.innerText = "Elenco candidature"; 
                    aside.appendChild(h1);  
                    const applications = await getApplication(); 
                    applications.forEach(item => { 
                        const container = document.createElement("ul"); 
                        container.id = "containerId"; 
                        container.appendChild(showApplications(item)); 
                        document.getElementById("aside").appendChild(container); 
                    });
                    
                    //disabilito il bottone
                    button.disabled = true; 

                } catch(error) {
                    console.error(error); 
                }

                //gestione bottone per vedere le candidature 
                const applicationsElement = document.getElementsByClassName("application-show");
                const applications = Array.from(applicationsElement) ; 
                console.log(applications); 
                applications.forEach(app => {
                    app.addEventListener("click", async (event) => {
                        const numero = app.id;
                        if((event.target.id === 'accetta' || event.target.id === 'rifiuta') && app.classList.contains('application-show')) {
                            try {
                                const response = await statusApp(numero, event.target.id); 
                                console.log(response); 
                            } catch(error) {
                                console.error(error); 
                            }
                        }
                        else {
                            console.log('Errore');
                        }
                    })
                }); 
  
            })

            //gestisco click su bottone per creare annunci
            document.getElementById("makeApplication").addEventListener('click', () => {
                aside.innerText = ""; 
                const h1 = document.createElement("h1");
                h1.innerText = "Pubblica annuncio"; 
                aside.appendChild(h1);

                const form = getApplicationForm(); 
                aside.appendChild(form); 

                //click su bottone submit
                form.addEventListener('submit', async (event) => {
                    event.preventDefault(); 
    
                    /*oggetto che contiene le coppie campo/valore per ogni campo del form 
                    formData non restituisce un oggetto Javascript tradizionale ma una specie di contenitore che ospita 
                    le coppie chiave/valore di un form
    
                    event.target fa riferimento al tag form
                    */
                    const formData = new FormData(event.target); 
    
                    //converto formData in un oggetto
                    const dataObject = {};
                    formData.forEach((value, key) => {
                        dataObject[key] = value;
                    });
    
                    //converto in oggetto Json
                    const data = JSON.stringify(dataObject); 
    
                    const response = await fetch('/api/createOffer', {
                        method: 'post', 
                        headers: {
                            'Content-Type': 'application/json',
                        }, 
                        body: data,
                    }); 
    
                    if(response.ok) {
                        const result = await response.json();
                        console.log("Ok"); 
                    }
                    else {
                        console.log('Error:', response.statusText);
                    }
                })

            }); 
        });

        page();
    }

   /**
    * metodo che cancella tutti i nodi figli di body
     esclusa la navbar, il footer e il container
    */
    deleteExceptNavbar = function() {
        const children = Array.from(document.body.children);  
        const exId = ['footer', 'navbar', 'aside', 'main', 'container', 'header']; 

        children.forEach(child => {
            if(!exId.includes(child.id)) {
                child.remove(); 
            }
        })

        document.getElementById("main").innerHTML = ""; 
        document.getElementById("aside").innerHTML = "";
    }

    /**
     * metodo che crea gli annunci e li appende al main. Si serve di una fetch 
     * per recuperare le offerte da una api get
     */

    async createOffers() {
        const offers = await getOffers();

        offers.forEach(offer => {
            const block = getTemplateOffer(offer);
            this.main.appendChild(block); 
        });

        //Aggiungo gli event listener subito dopo la creazione delle offerte
        document.querySelectorAll(".job").forEach((item) => {
            item.addEventListener("click", () => {
                const id = item.getAttribute("data-num"); 
                page(`/offer/${id}`);
            });
        });

    }

    /**
     * metodo per ottenere i dettagli di un annuncio in seguito al click 
     * sul suo contenitore
     * @param {*} ctx 
     */
    async expandOffer(ctx) {
        const id = ctx.params.id; 
        try {
            const detail = await getDetail(id); 
            const block = getTemplateDetail(detail);
            const aside = document.getElementById("aside"); 
            aside.innerHTML = ""; 
            aside.appendChild(block); 
        } catch(error) {
            console.log("Error fetching data: ", error); 
        } 

        //gestione click su bottone per invio candidature
        document.getElementById("application-btn").addEventListener("click", async(event) => {
            event.preventDefault(); 
            const job = document.getElementById("job-name").innerText; 
            const agency = document.getElementById("agency-name").innerText;
            const time = document.getElementById("time").innerText; 
            const detailText = document.getElementById("text-detail").innerText;
            console.log('job: ', job); 
            console.log('agency: ', agency); 

            try {
                const response = await application(job, agency, time, detailText); 
                console.log(response); 
            } catch(error) {
                console.log(error); 
            }
        })
    }
    
}

export default Controller;