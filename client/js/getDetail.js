"use strict"; 

async function getDetail(id) {
    try {
        const response = await fetch(`/api/Offerte/${id}`);
        if (!response.ok) throw new Error('Detail not found');
        const detail = await response.json();
        return detail;
    } catch(error) {
        console.log("Errore: ", error); 
    }
    
} 

export default getDetail; 