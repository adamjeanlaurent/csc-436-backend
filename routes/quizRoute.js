const { Router } = require('express');
const QuizSQL = require('../sql/quizSQL');

const router = Router();

// get all quizzes
router.get('/getAllQuizzes', async (req, res) => {
    try {
        const serviceResponse = await QuizSQL.GetAllQuizzes();
        return res.send(serviceResponse);
    }
    
    catch {
        return res.send('error');
    }
});

module.exports = router;