const { Router } = require('express');
const AuthSQL = require('../sql/authSQL');

const router = Router();

router.post('/register/:username/:password', async (req, res) => {
    const {username, password} = req.params;

    if(username === 'empty' || password === 'empty') {
        return res.send('error: password and username cant be empty');
    }

    try {
        const serviceResponse = await AuthSQL.RegisterNewStudent(username, password);
        return res.send(serviceResponse);
    }
    
    catch(e) {
        return res.send(e);
    }
});

router.get('/login/:username/:password', async (req, res) => {
    const {username, password} = req.params;

    if(username.length === 0 || password.length === 0 ) {
        return 'error';
    }

    try {
        const serviceResponse = await AuthSQL.LoginStudent(username, password);
        return res.send(serviceResponse);
    }

    catch(e) {
        return res.send(e);
    }
});

module.exports = router;