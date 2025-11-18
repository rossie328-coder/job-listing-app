"use strict"; 

async function statusApp(numero, id) {
    try {
        const response = await fetch("/api/status", {
            method: 'post', 
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({numero, id})
        }); 

    } catch(error) {
        console.error(error); 
    }
}

export default statusApp; 