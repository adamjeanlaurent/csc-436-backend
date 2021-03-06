const connection = require("./connection");
const md5 = require('md5');

// SQL relating to user authentication
class AuthSQL {
    static async RegisterNewStudent(username, password) {
        // check if that username is taken
        const userExistsQuery = `SELECT * FROM STUDENT WHERE username = '${username}'`;
        const [userExistsRows] = await connection.promise().query(userExistsQuery);
        
        // username is taken
        if(userExistsRows.length != 0) {
            return {message: 'username is taken'};
        }
        
        // register new student

        // hash password
        const hashedPassword = md5(password);
        const newUserQuery = `INSERT INTO STUDENT (username, pass) VALUES('${username}', '${hashedPassword}')`;
        const [newUserRows] = await connection.promise().query(newUserQuery);

        // get the new student's studentID
        const getStudentIDQuery = `SELECT studentID from STUDENT WHERE username = '${username}'`;
        const [studentID] = await connection.promise().query(getStudentIDQuery);
        
        return {message: 'success', studentID: studentID[0].studentID};
    }

    static async LoginStudent(username, password) {
        let obj = {};
        // see if username exists in db
        const userExistsQuery = `SELECT * FROM STUDENT WHERE username = '${username}'`;
        const [userExistsRows] = await connection.promise().query(userExistsQuery);
            
        // user exists
        if(userExistsRows.length != 0) {
            // check password
            const foundUserHashedPassword = userExistsRows[0].pass;
            const loginHashedPassword = md5(password);
            
            // correct password
            if(foundUserHashedPassword === loginHashedPassword) {
                obj.message = 'success';
                obj.studentID = userExistsRows[0].studentID;
                return obj;
            }
            
            // wrong password
            else {
                obj.message = 'wrong password';
                return obj;
            }
        }
        
        // user not found in db
        obj.message = 'user does not exist';
        return obj;
    }
}

module.exports = AuthSQL;
