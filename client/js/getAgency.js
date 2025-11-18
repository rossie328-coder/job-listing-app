"use strict"; 

async function getAgency() {
    try {
        const response = await fetch("/agencyProfile"); 
        
        if(!response.ok) {
            throw new Error("No agency found");
        } 
            
        return await response.json();  

    } catch(error) {
        console.log('Errore fetch: ', error); 
        throw error; 
    }
    
}

export default getAgency; 