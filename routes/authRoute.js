const { Router } = require('express');
const AuthSQL = require('../sql/authSQL');

const router = Router();

router.post('/register/:username/:password', async (req, res) => {
    const {username, password} = req.params;

    if(username.length === 0 || password.length === 0) {
        return 'error';
    }

    try {
        const serviceResponse = await AuthSQL.RegisterNewStudent(username, password);
        return res.send(serviceResponse);
    }
    
    catch {
        return res.send('error');
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

    catch {
        res.send('error');
    }
});

module.exports = router;