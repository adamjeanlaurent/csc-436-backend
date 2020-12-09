const connection = require("./connection");

class QuizSQL {
    static async CheckIfTookQuizAlready(studentID, quizID) {
        let obj = {};
        // get all answers student has answered in this quiz
        // we do this because, if they have answered a question arleady in this quiz
        // that means they have taken it before
        const queryOuter = `SELECT * FROM STUDENT_ANSWER WHERE studentID = ${studentID} AND questionID IN`;
        const queryInner = `(SELECT questionID FROM QUESTION WHERE quizID = ${quizID})`;
        const query = queryOuter + ' ' + queryInner;

        const [rows] = await connection.promise().query(query);

        // taken already
        if(rows.length !== 0) {
            obj.message = 'took already';
            return obj;
        }
        
        // npt taken already
        obj.message = 'has not took already';
        return obj;
    }

    static async GetAllQuizzes() {
        const query = 'SELECT * FROM QUIZ';
        const [rows] = await connection.promise().query(query);
        return rows;
    }

    static async GetGradebook(studentID) {
        // get all graded quizzes scores for student
        const gradedQuzziesQuery = `SELECT score, SCORE.quizID, studentID, title FROM SCORE, QUIZ WHERE SCORE.quizID = QUIZ.quizID AND studentID = ${studentID}`;
        const [gradedQuizzes] = await connection.promise().query(gradedQuzziesQuery);
        return gradedQuizzes;
    }

    static async ScoreQuiz(studentID, quizID) {
        // get total number of question in quiz
        const numberOfQuestionsQuery = `SELECT numQuestions FROM QUIZ WHERE quizID = ${quizID}`;
        const [numberOfQuestionsRow] = await connection.promise().query(numberOfQuestionsQuery);
        const numOfQuestionsInQuiz = numberOfQuestionsRow[0].numQuestions;

        // get student answers to all questions in quiz
        const studentAnswersQueryOuter = `SELECT * FROM STUDENT_ANSWER WHERE studentID = ${studentID} AND questionID IN`;
        const studentAnswersQueryInner = `(SELECT questionID FROM QUESTION WHERE quizID = ${quizID})`;
        const studentAnswersQuery = (studentAnswersQueryOuter + ' ' + studentAnswersQueryInner);
        const [answerRows] = await connection.promise().query(studentAnswersQuery);
        
        let numOfCorrectAnswers = 0;
        let numOfIncorrectAnswers = 0;

        // compare student's answers to actual answers
        for(let answer of answerRows) {
            const answerID = answer.answerID; 
            const questionID = answer.questionID;
            
            // get correct answers to questino
            const correctAnswerQuery = `SELECT answerID from ANSWER_POOL WHERE questionID = ${questionID} AND correctFlag = 1`;
            const [correctAnswer] = await connection.promise().query(correctAnswerQuery);
            
            if(answerID === correctAnswer[0].answerID) numOfCorrectAnswers++; // student answer === correct answer
            else numOfIncorrectAnswers++; // student answer != correct answer
        }
        
        // special case if they only answered some of the questions in the quiz
        // in which case the number of correct + incorrect will be less than the total
        // add difference to number of incorrect
        if(numOfCorrectAnswers + numOfIncorrectAnswers !== numOfQuestionsInQuiz) {
            const difference = numOfQuestionsInQuiz - (numOfCorrectAnswers + numOfIncorrectAnswers);
            numOfIncorrectAnswers += difference;
        }

        let grade = ((numOfQuestionsInQuiz - numOfIncorrectAnswers) / numOfQuestionsInQuiz) * 100;
        
        // insert score into score table
        await connection.promise().query(`INSERT INTO SCORE VALUES (${parseInt(grade)}, ${studentID}, ${quizID})`);
        return {message: "inserted grade"};
    }
}

// tests
// should be
// 100
// 66
// 33
// QuizSQL.GetScoreOnQuiz(1, 2);
// QuizSQL.GetScoreOnQuiz(2, 1);
// QuizSQL.GetScoreOnQuiz(3, 1);

module.exports = QuizSQL;