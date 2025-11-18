"use strict"; 
/**
 * Effettua una fetch a '/api/candidatura' 
 * 
 * @param {string} job 
 * @param {string} agency 
 * @param {string} time 
 * @param {string} text 
 */
async function application(job, agency, time, text) {
    
    try {
        console.log('lato fetch: ', {job, agency, time, text}); 
        const response = await fetch("/api/candidatura", {
            method: 'post', 
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({job, agency, time, text})
        });

    } catch(error) {
        console.error('Error in fetching', error); 
    } 
}

export default application; 