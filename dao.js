const db = require('./db'); 
const bcrypt = require('bcrypt'); 

exports.getOffers = async () => {
    return new Promise((resolve, reject) => { 
       const sql = 'SELECT * FROM Offerte'; 
       db.all(sql, (err, rows) => {
        if(err) {
            reject({status: 500, msg: err.message});
        }
        else {
            if(rows.length) {
                resolve(rows);
            }
            else {
                reject({status: 404, error: 'Error: no offers in the database'}); 
            }
        }
       }) 
        
       }
    )
}

exports.getSingleOffer = function(num) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Offerte WHERE Numero = ?'; 
        db.get(sql, [num], (err, row) => {
            if(row) {
                resolve(row);
            }
            else {
                reject({status:  404, error: 'No offers found'}); 
            }
        });
    });
}

//Creo una nuova offerta 
exports.createOffer = function(nome, azienda, luogo,  descrizione, contratto) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Offerte(Nome, Azienda, Località, Descrizione, Contratto) VALUES (?, ?, ?, ?, ?)'; 
        const sqlLastId = 'SELECT last_insert_rowid() as Numero'; 
        db.run(sql, [nome, azienda, luogo, descrizione, contratto], (err) => {
            if(err) {
                reject(err); 
            } else { 
                db.get(sqlLastId, [], (err, row) => {
                    if (err) {
                        console.error('Errore durante la lettura del lastID:', err);
                        reject(err);
                    } else {
                        console.log('Ultimo ID inserito:', row.Numero);
                        resolve({id: row.Numero});
                    }
                });
            }
        }); 
    })
}

//Seleziono un'offerta in base al suo nome
exports.getOfferByName = function(name) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Offerte WHERE Nome = ?';
        db.all(sql, [name], (err, rows) => {
            if(err) {
                reject({status: 500, msg: err.message});
            }
            else {
                if(rows.length) {
                    resolve(rows);
                }
                else {
                    reject({status: 404, msg: "No offer found"});
                }
            }
        });
    });
}

exports.createUser = async (utente) => {
    try {
        const sql = 'INSERT INTO user(Username, Password, Name, Surname, role) VALUES(?, ?, ?, ?, ?)';
        const sqlLastId = 'SELECT last_insert_rowid() as id';
        //hash della password
        const hash = await bcrypt.hash(utente.Password, 10);
        return new Promise(function(resolve, reject) {
            db.run(sql, [utente.Username, hash, utente.Name, utente.Surname], (err) => {
                if(err) {
                    reject(err); 
                }
                else {
                    db.get(sqlLastId, [], (err, row) => {
                        if (err) {
                            console.error('Errore durante la lettura del lastID:', err);
                            reject(err);
                        } else {
                            console.log('Ultimo ID inserito:', row.id);
                            resolve({ id: row.id });
                        }
                    });
                    
                }
            })
         
        })

    } catch(error) {
        throw error; 
    }
}

exports.getUser = async function(username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE Username = ?';
        console.log('Esecuzione query:', sql, 'Parametri:', username);

        db.get(sql, [username], (err, row) => {
            if (err) {
                console.error('Errore del database:', err.message);
                reject(new Error('Errore del database: ' + err.message));
            } else if (!row) {
                console.log('Utente non trovato.');
                reject(new Error('Utente non trovato'));
            } else {
                console.log('Utente trovato:', row);

                row.checkPassword = async function(password) {
                    try {
                        const isValid = await bcrypt.compare(password, row.Password);
                        console.log('Risultato verifica password:', isValid);
                        return isValid;
                    } catch (err) {
                        console.error('Errore durante il confronto della password:', err.message);
                        throw err;
                    }
                };

                resolve(row);
            }
        });
    });
};


exports.getUserById = function(id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE id = ?'; 
        db.get(sql, [id], (err, row) => {
            if(err) {
                console.error('Error retrieving user:', err);
                reject({status: 500, message:   err.message}); 
            }
            else {
                if(row) {
                    resolve(row); 
                }
                else {
                    reject({status: 404, message: `Utente con id ${id} non trovato`}); 
                }
            }
        })
    })
}

exports.createAgency = async (agency) => {
    try {
        const sql = 'INSERT INTO Aziende(Nome, Password, Luogo, Settore, role) VALUES(?, ?, ?, ?, agency)';
        const sqlLastId = 'SELECT last_insert_rowid() as Id'; 
        //hash della password
        const hash = await bcrypt.hash(agency.Password, 10);
        return new Promise((resolve, reject) => {
            db.run(sql, [agency.Nome, hash, utente.Luogo, utente.Settore], (err) => {
                if(err) {
                    reject(err); 
                }
                else {
                    db.get(sqlLastId, (err, row) => {
                        if (err) {
                            console.error('Errore durante la lettura del lastID:', err);
                            reject(err);
                        } else {
                            console.log('Ultimo ID inserito:', row.id);
                            resolve({ id: row.id });
                        }
                    }); 
                }
            })
        })

    } catch(error) {
        throw err; 
    }
}

//estrazione dati azienda
exports.getAgency = async function(name) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Aziende WHERE Nome = ?';

        db.get(sql, [name], (err, row) => {
            if (err) {
                reject(new Error('Errore del database: ' + err.message));
            } else if (!row) {
                reject(new Error('Azienda non trovata'));
            } else {
                row.checkPassword = async function(password) {
                    try {
                        const isValid = await bcrypt.compare(password, row.Password);
                        console.log('Risultato verifica password:', isValid);
                        return isValid;
                    } catch (err) {
                        console.error('Errore durante il confronto della password:', err.message);
                        throw err;
                    }
                };

                resolve(row);
            }
        });
    });
};

//ottengo l'azienda dal suo id
exports.getAgencyById = function(id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Aziende WHERE id = ?'; 
        db.get(sql, [id], (err, row) => {
            if(err) {
                reject({status: 500, message:   err.message}); 
            }
            else {
                if(row) {
                    resolve(row); 
                }
                else {
                    reject({status: 404, message: `Azienda con id ${id} non trovata`}); 
                }
            }
        })
    })
}

exports.storeFile = function(nome_utente, file_name, length, file, id) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Curricula(nome_utente, file_name, file_size, file_data, user_id) VALUES(?, ?, ?, ?, ?)"; 
        const sqlLastId = "SELECT last_insert_rowid() as file_id"; 
        db.run(sql, [nome_utente, file_name, length, file, id], (err) => {
            if(err) {
                reject(err); 
            }
            else {
                db.get(sqlLastId, (err, row) => {
                    if (err) {
                        console.error('Errore durante la lettura del lastID:', err);
                        reject(err);
                    } else {
                        console.log('Ultimo ID inserito:', row.file_id);
                        resolve({ id: row.file_id });
                    }
                }); 
            }
        }); 
    })
}

exports.getCv = function(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Curricula WHERE user_id = ?"; 
        db.get(sql, [id], (err, row) => {
            if(err) {
                reject(err); 
            }
            else {
                if(row) {
                    resolve(row.file_data); 
                }
                else {
                    reject({status: 404, message: 'Curriculum non trovato'}); 
                }
            }
        }); 
    }); 
}

exports.createApplication = function(name, surname, username, curriculum, job, agency, time, text, user_id, agency_id) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Applications(Name, Surname, Username, Curriculum, Job, Agency, Time, Text, user_Id, agency_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"; 
        db.run(sql, [name, surname, username, curriculum, job, agency, time, text, user_id, agency_id], (err) => {
            if(err) {
                console.error('Error inserting applicaiton', err.message);
                reject(err); 
            }
            else {
                resolve({status: 201, message: 'Application created succesfully!'}); 
            }
        }); 
    }); 
}

exports.getApplications =  function(id, role)  {
    return new Promise((resolve, reject) => {
        let sql; 
        if(role === 'user') {
            sql = "SELECT * FROM Applications WHERE user_Id = ?"; 
        } else if(role === 'agency') {
            sql = "SELECT * FROM Applications WHERE agency_id = ?"; 
        } else {
            reject({status: 400, message: 'Invalid role'});
            return; 
        }
        
        db.all(sql, [id], (err, rows) => {
            if(err) {
                reject({status: 500, message: err.message});
            }
            else {
                if(rows.length === 0) {
                    reject({status: 404, message: 'No application found'});
                }
                else {
                    resolve(rows);
                }
            }
        })
    })
}

exports.changeStatus = function(numero, stato) {
    return new Promise((resolve, reject) => {
        let sql; 
        if(stato === 'accetta') {
            sql = "UPDATE Applications set Status = 'accettata' WHERE agency_id = ?"; 
        } else if(stato === 'rifiuta') {
            sql = "UPDATE Applications set Status = 'rifiutata' WHERE agency_id = ?"; 
        } else {
            reject({status: 400, message: 'Invalid status'}); 
        }

        db.run(sql, [numero], (err) => {
            if(err) {
                reject({status: 500, message: err.msg}); 
            }
            else {
                resolve({status: 200, message: 'Ok'}); 
            }
        }); 

    }); 
}

exports.getAgencyId = function(agency) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Aziende WHERE Nome = ?"; 
        db.get(sql, [agency], (err, row) => {
            if(err) {
                reject({status: 404, message: 'Not found'})
            } 
            else {
                resolve(row.id); 
            }
        })
    })
}