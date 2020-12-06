const connection = require("./connection");

class QuestionSQL {
    // gets single question from a quiz
    static async GetSingleQuestion(questionNumber, quizID) {
        const query = `SELECT * FROM QUESTION WHERE quizID = ${quizID} AND questionNum = ${questionNumber}`;
        const [rows] = await connection.promise().query(query);
        return rows;
    }
    
    // answer single question
    static async AnswerSingleQuestion(questionID, answerID, studentID) {
        const query = `INSERT INTO STUDENT_ANSWER VALUES(${questionID}, ${answerID}, ${studentID})`;
        const [rows] = await connection.promise().query(query);
        return {message: 'success'};
    }

    // get all possible answers for a question
    static async GetAllAnswersToQuestion(questionID) {
        const query = `SELECT * FROM ANSWER_POOL WHERE questionID = ${questionID}`;
        const [rows] = await connection.promise().query(query);
        return rows;
    }
}

module.exports = QuestionSQL;