const express = require("express");
const path = require("path");
const mysql = require('mysql2');
const { faker } = require('@faker-js/faker');
const methodOverride = require("method-override");

const app = express();

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'Kumar123'
});

//   getting user data generated using faker
// let getUser = () => {
//     return [
//         faker.string.uuid(),
//         faker.internet.userName(),
//         faker.internet.email(),
//         faker.internet.password()
//     ];
// }

// let data = [];
// for (let i = 0; i < 100; i++) {
//     data.push(getUser());
// }

// simple query
// let query = 'SHOW TABLES';

// using placeholder for inserting multiple values
// let q = "INSERT INTO user (id, username, email, password) VALUES ?";

// let user = [123,"123_newuser","abc@fmail.com","abc"];
// let users = [["123b","123_newuser2","abc@fmail.com2","abc2"],["123c","123_newuser3","abc@fmail.com3","abc3"]];
// try{
//     connection.query(q,[data],(err,result)=>{
//         if(err){
//             throw err;
//         }
//         console.log(result);
//     });

// }catch(err){
//     console.log(err);
// }

// to terminate sql connection
// connection.end();



// console.log(getRandomUser());

// / route listener for homepage
app.get('/', (req, res) => {
    let query = "SELECT count(*) FROM user";
    try {
        connection.query(query, (err, result) => {
            if (err) {
                throw err;
            }
            console.log(result);
            let count = result[0]["count(*)"];
            res.render("home.ejs", { count });
        })
    } catch (error) {
        console.log(error);
        res.send("Some ERROR Occured in DB");
    }
});

// showing all users
app.get('/user', (req, res) => {
    let query = `SELECT * FROM user`;
    try {
        connection.query(query, (err, result) => {
            // console.log(result);
            if (err) {
                throw err;
            }
            // let count = result[0]["count(*)"];
            // res.render("home.ejs",{count});
            // res.send(result);
            let users = result;
            res.render("showusers.ejs", { users });
        })
    } catch (error) {
        console.log(error);
        res.send("Some ERROR Occured in DB");
    }
});

// editing id route
app.get('/user/:id/edit', (req, res) => {
    let { id } = req.params;
    let query = `SELECT * FROM user WHERE id = '${id}'`;
    try {
        connection.query(query, (err, result) => {
            if (err) {
                throw err;
            }
            console.log(result);
            let user = result[0];
            res.render('edit.ejs', { user });
        })
    } catch (error) {
        console.log(error);
        res.send("Some ERROR Occured in DB");
    }
});

// UPDATE ROUTE
app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    let { username, password } = req.body;
    let query1 = `SELECT * FROM user WHERE id = '${id}'`;
    try {
        connection.query(query1, (err, result1) => {
            if (err) {
                throw err;
            }
            console.log(result1);
            let user = result1[0];
            if (password == user.password) {
                let query2 = `UPDATE user SET username = '${username}' WHERE id = '${id}'`;
                connection.query(query2, (err, result2) => {
                    if (err) {
                        throw err;
                    }
                    res.redirect('/user');
                })
            }
            else {
                res.send("WRONG PASSWORD");
            }
            // res.send(user.password);
        })
    } catch (error) {
        console.log(error);
        res.send("Some ERROR Occured in DB");
    }

});

// add newuser route
app.get('/user/new', (req, res) => {
    res.render("new.ejs");
});

// adding new user to route
app.post('/user', (req, res) => {
    let { id, username, email, password } = req.body;
    let userData = [id,username,email,password];
    let query = `INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)`;
    
    try {
        connection.query(query, userData, (err,result)=>{
            if(err) throw err;
            console.log(result);
            res.redirect('/user');
        })
    } catch (error) {
        console.log(error);
        res.send('ERROR with DB');
    }
});

// deleting an exisiting user based on id
app.delete('/user/:id',(req,res)=>{
    let { id } = req.params;

    let query1 = `SELECT * FROM user WHERE id = '${id}'`;
    try {
        connection.query(query1, (err,result1)=>{
            if(err) throw err;
            if (result1) {
                let query2 = `DELETE FROM user WHERE id= '${id}'`;
                connection.query(query2,(err,result2)=>{
                if(err) throw err;
                console.log(result2);
                res.redirect('/user');
                })
            }
            
        })
    } catch (error) {
        console.log(error);
        res.send('ERROR with DB');
    }
})

// server listening
app.listen("8080", () => {
    console.log(`Server is runing on http://localhost:8080`);
})