"use strict"; 

const offers = [];

async function getOffersByName() {
    try {
        const response = await fetch("/api/search");
        const obj = await response.json();

        obj.forEach((offer) => {
            offers.push(offer);
        }); 

        return offers; 
    } catch(error) {
        console.log("Errore: ", error); 
    }

}

export default getOffersByName;