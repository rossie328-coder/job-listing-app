"use strict";

const offers = [];

async function getOffers() {
    try {
        const response = await fetch('/api/Offerte', {
            method: 'GET', 
            credentials: 'include'
        });
        const obj = await response.json(); 
    
        
        obj.forEach(offer => {
            //controllo che nell'array vengano inserite solo offerte nuove
            if (!offers.some(of => of.Numero === offer.Numero)) {
                offers.push(offer);
            }
        });
    
        return offers;
    } catch(error) {
        console.log("Errore: ", error);
    }
    
}

export default getOffers; 