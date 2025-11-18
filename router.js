"use strict"; 

const express = require('express'); 
const router = express.Router(); 
const dao = require('./dao');
const {check, validationResult} = require('express-validator'); 
const swaggerUi = require('swagger-ui-express');  
const YAML = require('yamljs'); 
const swaggerDocument = YAML.load('./swagger.yaml'); 
const passport = require('passport'); 
const LocalStrategy = require('passport-local').Strategy; 
const morgan = require ('morgan'); 
const path = require('path'); 
const session = require('express-session'); 
const db = require('./db'); 

//middlewares
router.use(express.static('client')); 
router.use(express.urlencoded({ extended: true })); 
router.use(express.json()); 
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use(morgan('tiny'));
router.use(express.static(path.join(__dirname, 'client')));

router.get('/casa', (req, res) => {
    res.send('Hello');
});

//autenticazione utente
passport.use(new LocalStrategy(async function(username, password, done) {
    console.log('Tentativo di login per:', username);

    try {
        //provo a ottenere utente dal db
        let user; 
        try {
            user = await dao.getUser(username); 
        } catch(err) {
            console.error('Utente non trovato nel database', err.message); 
        }

        if(user) {
            const match = await user.checkPassword(password); 
            if(match) {
                return done(null, {id: user.id, role: user.role}); 
            }
        }

        //provo a ottenere azienda dal db
        let agency; 
        try {
            agency = await dao.getAgency(username); 
        } catch(err) {
            console.error('Utente non trovato nel database', err.message); 
        }

        if(agency) {
            const match = await agency.checkPassword(password); 
            if(match) {
                return done(null, {id: agency.id, role: agency.role}); 
            }
        }

        return done(null, false, {message: 'User not found'}); 


    } catch(err) {
        console.error('Errore durante l\autenticazione', err.message); 
        return done(null, false, {message: 'Errore durante l\'autenticazione'}); 
    }
      
}));

//abilito le sessioni 
router.use(session({
    secret: "frase", 
    resave: false,  
    saveUninitialized: false
}))

router.use(passport.initialize()); 
router.use(passport.session()); 

//personalizzazione sessione
passport.serializeUser(function(user, done) { 
    //memorizzo nella sessione l'id utente e il tipo di utente 
    console.log("Serializing user:", user);
    done(null, {id: user.id, role: user.role}); 
}); 

passport.deserializeUser(async function(user, done) {
    

    //distinguo tra diversi tipi di utenti
    try {
        if (user.role === 'user') {
            user = await dao.getUserById(user.id);
        } else if (user.role === 'agency') {
            user = await dao.getAgencyById(user.id);
        }  

        if(!user) {
            return done(null, false, {message: 'Utente non trovato'});
        }

        return done(null, user); 
    } catch(err) {
        return done(err); 
    }
    
}); 

//verifica il ruolo dell'utente
function checkRole(requiredRole) {
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === requiredRole) {
        return next();
      }
      else {
        res.status(401).json({message: 'Unauthorized'}); 
      }
    };
}

//API REST
//Tutte le offerte
router.get('/api/Offerte', async (req, res) => {
    try {
        const offers = await dao.getOffers();
        res.status(200).json(offers); 
    } catch(error) {
        res.status(error.status).json({error: error.msg}); 
    }
})

//Seleziono un'offerta in base al numero
router.get('/api/Offerte/:numero', [
    check('numero').isInt({min: 0}).withMessage("Id must be an integer and not negative")
], async (req, res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()}); 
    }

    try {
        const offer = await dao.getSingleOffer(req.params.numero); 
        res.status(200).json(offer); 
    } catch(error) {
        res.status(error.status).json({message: error.msg}); 
    }
});

//metto a disposizione i dati dell'utente in base al suo id
router.get("/profile", checkRole('user'), (req, res) => {  
    console.log(req.user); 

    const name = req.user.Name;
    const surname = req.user.Surname;
    const email = req.user.Username; 
    res.json({name, surname, email});
}); 

//metto a disposizione i dati dell'agenzia in base al suo id
router.get("/agencyProfile", checkRole('agency'), (req, res) => {  
    console.log(req.user); 

    const nome = req.user.Nome;
    const luogo = req.user.Luogo;
    const settore = req.user.Settore; 
    res.json({nome, luogo, settore});
}); 

//API per la RESTful search usata nella ricerca delle offerte
router.get('/api/search', async (req, res) => {
    const name = req.query.query; 
    if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: 'Invalid parameter' });
    }
    try {
        const offer = await dao.getOfferByName(name); 

        if(!offer) {
            return res.status(404).json({message: 'No offer found'}); 
        }

        res.status(200).json(offer); 
    } catch(error) {
        res.status(error.status).json({message: error.msg}); 
    } 
}); 

//Log-out
router.post('/api/logout', function(req, res, next) {
    req.logout(function(err) {
        next(err); 
    }); 
    res.redirect('/'); 
});

//api post per ricevere il curriculum dall'utente
router.post('/api/Curriculum', [
    check('file-name')
      .isLength({max: 100})
      .withMessage('Il nome del file è troppo lungo')
], async (req, res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
        res.status(400).json({errors: errors.array})
    }

    const fileName = req.headers['file-name']; 
    const chunkFile = []; 
    try {

        req.on('data', (chunk) => {
            chunkFile.push(chunk); 
        })

        req.on('end', async () => {
            try {
                console.log('username: ', req.user.Name)
                console.log('nome file: ', fileName)
                const completeFile = chunkFile.join(''); 
                console.log('lunghezza file: ', completeFile.length); 
                console.log('File: ', completeFile);
                console.log("Tipo file: ", typeof completeFile); 
                console.log(req.user.id)
                const result = await dao.storeFile(req.user.Username, fileName, completeFile.length, completeFile, req.user.id); 
                if(!res.headersSent) {
                    res.status(201).json({message: `Object created succesfully with ID: ${result}`});
                }
                
            } catch(error) {
                if(!res.headersSent) {
                    res.status(500).json({message: 'Object not created'}); 
                } 
            }
        })

    } catch(error) {
        res.status(500).json({message: error.msg}); 
    } 
})

//api post per inviare i dati della candidatura
router.post('/api/candidatura', checkRole('user'), async (req, res) => {

    let curriculum; 
    console.log('body: ', req.body); 
    console.log('id', req.user.id); 
    try {
        curriculum = await dao.getCv(req.user.id);
        console.log('Curriculum: ', curriculum); 
    } catch(error) {
        return res.send(error); 
    }
    let agency_id; 
    try {
        agency_id = await dao.getAgencyId(req.body.agency); 
    } catch(error) {
        console.error(error.msg); 
    }

    try {
        const result = await dao.createApplication(req.user.Name, req.user.Surname, req.user.Username, curriculum, req.body.job, req.body.agency, req.body.time, req.body.text, req.user.id, agency_id); 
        return res.send(result); 
    } catch(error) {
        return res.status(500).json({message: error.msg}); 
    }
})

router.get('/api/Application', async (req, res) => {
 
    const id = req.session.passport.user.id;
    const role = req.session.passport.user.role;

    try {
        if(role !== 'user' && role !== 'agency') {
            return res.status(403).json({message: 'Unauthorized role'}); 
        }

        const applications = await dao.getApplications(id, role);
        res.status(200).json(applications); 
    } catch(error) {
        console.error(error); 
        res.status(error.status).json({message: error.message}); 
    }
})

//api per cambiare lo stato della candidatura
router.post('/api/status', async (req, res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const numero = req.body.numero; 
    const stato = req.body.id; 
    if(numero != null && stato != null) {
        try {
            const response = await dao.changeStatus(numero, stato); 
            return res.status(response.status).json({message: response.msg}); 
        } catch(error) {
            res.status(error.status).json({message: error.msg}); 
        }
    }
}); 

//Creo una nuova offerta
router.post('/api/createOffer',  [
    check('Nome')
       .isLength({min:1}),
    check('Contratto')
       .isLength({min:1}), 
    check('Descrizione')
       .isLength({min:1})
], async (req, res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    console.log("Dati: ", req.body);

    const nome = req.body.Nome; 
    const contratto = req.body.Contratto; 
    const descrizione = req.body.Descrizione;
    const azienda = req.user.Nome; 
    const luogo = req.user.Luogo;
    console.log('azienda ', azienda)
    console.log(luogo)

    try {
        const response = await dao.createOffer(nome, azienda, luogo, descrizione, contratto); 
        res.status(201).json({message: 'Offer created succesfully'}); 
    } catch(error) {
        res.status(500).json({message: 'Error in offer creation'}); 
    }
    

}); 

//api login per candidati
router.post('/api/login', (req, res, next) => {
    console.log('Richiesta POST /api/login:', req.body);

    passport.authenticate('local', (err, user, info) => {
        console.log('Risultato autenticazione:', { err, user, info });

        if (err) {
            console.error('Errore nell\'autenticazione:', err.message);
            return next(err);
        }

        if (!user) {
            console.log('Login fallito:', info.message);
            return res.status(401).json(info);
        }

        req.login(user, (err) => {
            if (err) {
                console.error('Errore durante il login:', err.message);
                return next(err);
            }

            console.log("Autenticazione riuscita, utente:", req.user);
            return res.status(200).json({message: 'Login riuscito'});

        
        });
    })(req, res, next);
});

//api login per aziende
router.post('/api/login-agency', (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            console.log('Login fallito:', info.message);
            return res.status(401).json(info);
        }

        req.login(user, (err) => {
            if (err) {
                console.error('Errore durante il login:', err.message);
                return next(err);
            }

            console.log('Login riuscito:', user);
            return res.status(200).json({message: 'Login riuscito'}); 
        
        });
    })(req, res, next);
});


//API per signup delle aziende
router.post('/api/signup-agency', [
    check('Nome')
        .isString()
        .isLength({max: 30}),
    check('Password')
        .isLength({min: 8, max: 20}),
    check('Luogo')
        .isString()
        .isLength({max: 30}),
    check('Settore')
        .isString()
        .isLength({max: 30})
], async (req, res, next) => {
    
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
        console.log(errors)
        return res.status(422).json({error: errors.array()}); 
    }

    try {
        const result = await dao.createAgency(req.body);
        const user = { id: result.agencyId };
        console.log('Agency created:', result);
        req.login(user, (err) => {
            if (err) {
                console.error('Login error:', err);
                return next(err); 
            }

            res.status(201).json({ message: result.message});
        });
    } catch(err) {
        console.error('Error during user creation:', err);
        res.status(500).json({ status: err.status || 500, message: err.message });
    }

});

//API per signup dei candidati
router.post('/api/signup', [
    check('Username')
        .isEmail()
        .isString()
        .isLength({max: 20}),
    check('Password')
        .isLength({min: 8, max: 20}),
    check('Name')
        .isString()
        .isLength({max: 20}),
    check('Surname')
        .isString()
        .isLength({max: 20})
], async (req, res, next) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
        return res.status(422).json({error: errors.array()}); 
    }

    try {
        const result = await dao.createUser(req.body);
        const user = { id: result };
        console.log('User created:', result);
        req.login(user, (err) => {
            if (err) {
                console.error('Login error:', err);
                return next(err); 
            }

            res.status(201).json({ message: result.message});
        });
    } catch(err) {
        console.error('Error during user creation:', err);
        res.status(500).json({ status: err.status || 500, message: err.message });
    }

});


module.exports = router; 