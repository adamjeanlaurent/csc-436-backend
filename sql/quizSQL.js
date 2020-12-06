const connection = require("./connection");

class QuizSQL {
    static async GetAllQuizzes() {
        const query = 'SELECT * FROM QUIZ';
        const [rows] = await connection.promise().query(query);
        return rows;
    }

    static async GetScoreOnQuiz(studentID, quizID) {
        // maybe do a join to get the number of correct answers, and number of total answers ? 
        `SELECT * 
        FROM STUDENT_ANSWER
        WHERE 
        studentID = 1
        AND
        questionID 
        IN
            (
                SELECT * 
                FROM QUESTION 
                WHERE quizID = 1;
            )`
        const studentAnswersQueryOuter = `SELECT * FROM STUDENT_ANSWER WHERE studentID = ${studentID} AND questionID IN`;
        const studentAnswersQueryInner = `(SELECT * FROM QUESTION WHERE quizID = ${quizID})`;

        const studentAnswersQuery = (studentAnswersQueryOuter + ' ' + studentAnswersQueryInner);
        
    
    }
}

module.exports = QuizSQL;