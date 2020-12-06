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

// check if user already started this quiz
router.get('/quizStarted/:studentID/:quizID', async (req, res) => {
    const {studentID, quizID} = req.params;
    try {
        const serviceResponse = await QuizSQL.CheckIfTookQuizAlready(studentID, quizID);
        return res.send(serviceResponse);
    }

    catch {
        return res.send('error');
    }
});

// get score on quiz
router.get('/score/:studentID/:quizID', async (req, res) => {
    const {studentID, quizID} = req.params;

    try {
        const serviceResponse = await QuizSQL.GetScoreOnQuiz(studentID, quizID);
        return res.send(serviceResponse);
    }

    catch {
        return res.send('error');
    }
});

module.exports = router;