"use strict"; 

const array = []; 

async function getApplication() {
    try {
        const response = await fetch('/api/Application', {
            method: 'GET', 
            credentials: 'include'
        });
        const obj = await response.json(); 
    
        
        obj.forEach(item => {
            if (!array.some(it => it.Numero === item.Numero)) {
                array.push(item);
            }
        });
    
        return array;
    } catch(error) {
        console.log("Errore: ", error);
    }
}

export default getApplication; 