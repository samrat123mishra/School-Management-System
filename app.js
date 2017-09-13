'use strict';
const express = require('express');
const Promise = require('bluebird');
const exphbs = require('express-handlebars');
var bodyParser = require('body-parser')
const pg = require('pg');
const conString = "postgres://rnl03devnodejs:rnl03devnodejs@localhost:5432/postgres";
global.client = new pg.Client(conString);
var http = require("http");
var app = express();
var server = http.createServer(app);
let port = 3001;
client.connect();
server.listen(port, () => {
    console.log('Express server is running on port:' + port);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

let loginQuery = `select teacher.username,teacher.password from school.teacher union select student.username,student.password from school.student`;


function validateCredential(username, password) {
    let validationQry = `select usr.id, usr.type, usr.username, usr.password from (
    select teacher.t_id as id, teacher.username,teacher.password ,'teacher' as type from school.teacher 
    union 
    select student.st_id as id, student.username,student.password, 'student' as type  from school.student ) as usr
    where usr.username = '${username}' and usr.password = '${password}'`
    return new Promise((resolve, reject) => {
        client.query(validationQry, (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            if (result.rows.length > 0) {
                resolve(result.rows[0]);
                return;
            }
            resolve(null);
        });
    });
}

app.post('/login', (req, res, next) => {
    validateCredential(req.body.user.username, req.body.user.password)
        .then((data) => {
            res.status(200);
            if (data) {
                res.writeHead(301, {
                    Location: `http${req.socket.encrypted ? "s" : ""}://${req.headers.host}/${data.type}/${data.id}`
                });
            } else {
                res.writeHead(301, {
                    Location: `http${req.socket.encrypted ? "s" : ""}://${req.headers.host}/home?error=true`
                });
            }
            res.end();
        }, error => {
            res.status(error.status);
            res.send(error.message);
        });
});


app.get('/teacher/:usrId', (req, res, next) => {
    let teacherQuery = `SELECT st_id,student.s_name,student.gender,teacher.t_name FROM school.student,school.teacher WHERE teacher.t_id='${req.params.usrId}' and student.t_id='${req.params.usrId}'`;
    client.query(teacherQuery, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        try {
            res.status(200);
            res.render('teacher', {
                teacher_name: result.rows[0].t_name,
                studentid: "Student-id",
                name: "Name",
                gender: "Gender",
                rows: result.rows
            });
        } catch (err) {
            res.status(500);
            console.log(err);
            res.send(err);
        }
    });
});



app.get('/student/:usrId', (req, res, next) => {
    let studentQuery = `select student.s_name,result.st_id,result.maths,result.english,result.history,result.geography from school.student,school.result where result.st_id = '${req.params.usrId}' and student.st_id = '${req.params.usrId}'`;
    client.query(studentQuery, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        try {
            res.status(200);
            res.render('student', {
                studentid: "Student-id",
                name: "Name",
                maths: "Maths",
                english: "English",
                history: "History",
                geography: "Geography",
                rows: result.rows
            });
        } catch (err) {
            res.status(500);
            console.log(err);
            res.send(err);
        }
    });
});

app.get('/student_report', (req, res, next) => {
    var reportQuery = `select student.s_name,result.st_id,result.maths,result.english,result.history,result.geography from school.student,school.result where result.st_id = '${req.query.stid}' and student.st_id = '${req.query.stid}'`
    client.query(reportQuery, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        try {
            res.status(200);
            res.render('report', {
                report_maths: result.rows[0].maths,
                report_english: result.rows[0].english,
                report_history: result.rows[0].history,
                report_geography: result.rows[0].geography
            });
        } catch (err) {
            res.status(500);
            console.log(err);
            res.send(err);
        }
    });
});

app.get('/home', (req, res, next) => {
    let contextObj = {}
    if (req.query.error === "true") {
        contextObj.message = "Invalid username and password";
    }
    res.status(200);
    res.render('home', contextObj);
});

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


