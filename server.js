const express = require('express');
const cors = require('cors');

// routes
const quizRoute = require('./routes/quizRoute');
const questionRoute = require('./routes/questionRoute');
const authRoute = require('./routes/authRoute');

const app = express();

// middleware
app.use(cors());
app.use('/api/quiz', quizRoute);
app.use('/api/question', questionRoute);
app.use('/api/auth', authRoute);

// root path tells you if api is up
app.get('/', (req,res) => {
    res.send('api up!');
});

// run server
app.listen(process.env.PORT || 3000, () => {
    console.log('server running!');
});