const { format } = require("./connection");
const connection = require("./connection");

class QuizSQL {
    static async CheckIfTookQuizAlready(studentID, quizID) {
        // `SELECT * 
        // FROM STUDENT_ANSWER
        // WHERE 
        // studentID = 1
        // AND
        // questionID 
        // IN
        //     (
        //         SELECT * 
        //         FROM QUESTION 
        //         WHERE quizID = 1;
        //     )`
        const queryOuter = `SELECT * FROM STUDENT_ANSWER WHERE studentID = ${studentID} AND questionID IN`;
        const queryInner = `SELECT * FROM QUESTION WHERE quizID = ${quizID}`;
        const query = queryOuter + ' ' + queryInner;

        const [rows] = await connection.promise().query(query);
        if(rows.length !== 0) {
            return 'took already';
        }
        return 'has not took already';
    }

    static async GetAllQuizzes() {
        const query = 'SELECT * FROM QUIZ';
        const [rows] = await connection.promise().query(query);
        return rows;
    }

    static async GetScoreOnQuiz(studentID, quizID) {
        // `SELECT * 
        // FROM STUDENT_ANSWER
        // WHERE 
        // studentID = 1
        // AND
        // questionID 
        // IN
        //     (
        //         SELECT * 
        //         FROM QUESTION 
        //         WHERE quizID = 1;
        //     )`

        // get total number of question in quiz
        const numberOfQuestionsQuery = `SELECT numQuestions FROM QUIZ WHERE quizID = ${quizID}`;
        const [numberOfQuestionsRow] = await connection.promise().query(numberOfQuestionsQuery);
        const numOfQuestionsInQuiz = numberOfQuestionsRow[0].numQuestions;

        const studentAnswersQueryOuter = `SELECT * FROM STUDENT_ANSWER WHERE studentID = ${studentID} AND questionID IN`;
        const studentAnswersQueryInner = `(SELECT * FROM QUESTION WHERE quizID = ${quizID}) ORDER BY `;
        
        const studentAnswersQuery = (studentAnswersQueryOuter + ' ' + studentAnswersQueryInner);
        const [answerRows] = await connection.promise().query(studentAnswersQuery);
        
        let numOfCorrectAnswers = 0;
        let numOfIncorrectAnswers = 0;
        // compare answers 
        for(let answer of answerRows) {
            const answerID = answer.answerID; 
            const questionID = answer.questionID;
            
            const correctAnswerQuery = `SELECT answerID from ANSWER_POOL WHERE questionID = ${questionID} AND correctFlag = 1`;
            const [correctAnswer] = await connection.promise().query(correctAnswerQuery);
            
            if(answerID === correctAnswer[0].answerID) numOfCorrectAnswers++;
            else numOfIncorrectAnswers++;
        }
        
        let grade = ((numOfQuestionsInQuiz - numOfIncorrectAnswers) / numOfQuestionsInQuiz) * 100;
        grade = grade.toString().fixed(2);
    }
}

module.exports = QuizSQL;