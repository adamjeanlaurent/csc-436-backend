const { Router } = require('express');
const QuestionSQL = require('../sql/questionSQL');

const router = Router();

// get single question
// example: http://localhost:3000/api/question/getSingleQuestion/1/2
router.get('/getSingleQuestion/:quizID/:questionNumber', async(req, res) => {
    const {quizID, questionNumber} = req.params;

    if(isNaN(quizID) || isNaN(questionNumber)) {
        return res.send('error');
    }

    try {
        const questionServiceResponse = await QuestionSQL.GetSingleQuestion(questionNumber, quizID);
        const questionID = questionServiceResponse[0].questionID;
        const answersServiceResponse = await QuestionSQL.GetAllAnswersToQuestion(questionID);
        
        // parse response
        let obj = questionServiceResponse[0];
        obj.answers = answersServiceResponse;

        return res.send(obj);
    }
    
    catch {
        return res.send('error');
    }
});

// answer single question
router.post('/answerSingleQuestion/:studentID/:questionID/:answerID', async(req, res) => {
    const {studentID, questionID, answerID} = req.params;

    if(isNaN(studentID) || isNaN(questionID) || isNaN(answerID)) {
        return res.send('error');
    }

    try {
        const serviceResponse = await QuestionSQL.AnswerSingleQuestion(questionID, answerID, studentID);
        return res.send(serviceResponse);
    }

    catch {
        return res.send('error');
    }
});

module.exports = router;