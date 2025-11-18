"use strict"; 

async function logoutUser() {
    try {
        const response = await fetch('/api/logout', {
            method: 'post'
        }); 
        if(!response.ok) {
            console.error('logout fallito'); 
        }
        else {
            window.location.href = '/'; 
        }
    } catch(err) {
        console.log(err); 
    }
}

export {logoutUser}; 