"use strict"; 

async function getUser() {
    try {
        const response = await fetch("/profile"); 
        
        if(!response.ok) {
            throw new Error("No user found");
        } 
            
        return await response.json();  

    } catch(error) {
        console.log('Errore fetch: ', error); 
        throw error; 
    }
    
}

export default getUser; 