const connection = require("./connection");
const md5 = require('md5');

class AuthSQL {
    static async RegisterNewStudent(username, password) {
        // check if that username is taken
        const userExistsQuery = `SELECT * FROM STUDENT WHERE username = '${username}'`;
        const [userExistsRows] = await connection.promise().query(userExistsQuery);
        
        // username is taken
        if(userExistsRows.length != 0) {
            return 'username is taken';
        }
        
        // register new student
        const hashedPassword = md5(password);
        const newUserQuery = `INSERT INTO STUDENT (username, pass) VALUES('${username}', '${hashedPassword}')`;
        const [newUserRows] = await connection.promise().query(newUserQuery);
        return 'success';
    }

    static async LoginStudent(username, password) {
        // see if username exists in db
        const userExistsQuery = `SELECT * FROM STUDENT WHERE username = '${username}'`;
        const [userExistsRows] = await connection.promise().query(userExistsQuery);

        // user exists
        if(userExistsRows.length != 0) {
            // check password
            const foundUserHashedPassword = userExistsRows[0].pass;
            const loginHashedPassword = userExistsRows[0].username;
            
            // correct password
            if(foundUserHashedPassword === loginHashedPassword) {
                return 'success';
            }

            else {
                return 'wrong password';
            }
        }

        return 'user does not exist';
    }
}

module.exports = AuthSQL;
