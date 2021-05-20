const express = require('express');
//const{ nanoid}=require("nanoid");
const app = express();
app.use(express.static("public"));
var bodyParser = require('body-parser');
require("./DB-connection");
const Todo = require('./models/todo');
const User = require('./models/user');
app.use(bodyParser.json())
app.use(express.static('public'));
//display all users
app.get('/user/', (req, res) => {
    User.find({}, (err, user) => {
        if (err) {
            res.statusCode = 422;
            res.send({ success: false });
            return;
        }
        res.send(user);
    })
});


//1 Register a user
app.post('/users/register', (req, res) => {
    console.log(req.body);
    const { usrename, password, firstName, age } = req.body;
    User.create({ usrename, password, firstName, age }, (err, user) => {

        if (err) {
            res.statusCode = 422;
            res.send(err);
            return;
        }
        res.send(user);
    })

});



//2 
app.post('/users/login', (req, res) => {
    try {
        const { usrename, password } = req.body;
        User.findOne({ usrename: usrename, password: password }, 'usrename firstName age', function(err, user) {
            if (err) return handleError(err);
            if (!user) throw "wrong username or passowrd";
            else {
                Todo.find({ userid: user._id }, ' userid title body tags', function(err, todo) {
                    if (err) throw err

                    res.send(`logged in successfully ${user} ${todo}`);

                })
            }
        })

    } catch (error) {
        console.log(error);
        res.statusCode = 401;

    }

});




//3 Return the first name of registered users
app.get('/users/', (req, res) => {
    User.find({}, 'firstName', function(err, users) {
        if (err) return handleError(err);

        res.send(users);

    })
});




//4 Delete the user with selected id 
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    User.deleteOne({ _id: id }, function(err) {
        if (err) return handleError(err);
        else res.send({ success: true })
    });
});




//5 Edit the user with the selected id 
app.patch('/users/:id', (req, res) => {
    const { id } = req.params;
    const usrename = req.body.usrename;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const age = req.body.age;
    User.findOneAndUpdate({ _id: id }, { usrename: usrename, password: password, firstName: firstName, age: age }, function(err, user) {
        if (err) return handleError(err);

        res.send(`${user} user was edited successfully`);


    });

})




//6 Create new todo 
app.post('/todos', (req, res) => {
    const { userid, body, title, tags } = req.body;
    Todo.create({ userid, body, title, tags }, (err, todo) => {

        if (err) {
            res.statusCode = 422;
            res.send(err);
            return;
        }


        res.send(todo);
    })


})

//7 Create new todo 
app.get('/todos/:userId', (req, res) => {
        const { userId } = req.params;
        Todo.find({ userid: userId }, 'title body tags', function(err, todo) {
            if (err) return handleError(err);

            res.send(todo);

        })

    })
    //8
app.get('/todos', (req, res) => {
    let limit = req.query.limit;
    let skip = req.query.skip;
    Todo.find({}, 'title body tags', { skip: parseInt(skip), limit: parseInt(limit) }, function(err, todo) {
        if (err) throw err;
        res.send(todo);


    });


})

//9 Edit todo 

app.patch('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { userid, body, title, tags } = req.body;

    Todo.findOneAndUpdate({ _id: id }, { userid: userid, body: body, title: title, tags: tags }, function(err, todo) {
        if (err) return handleError(err);

        res.send(todo);


    });


});

//10 delete todo
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;

    Todo.deleteOne({ _id: id }, function(err) {
        if (err) return handleError(err);
        else res.send({ success: true })
    });

})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//2 Create a middleware that logs the request url, method, and current time 
let middl_logs = (req, res, next) => {
    let current_datetime = new Date();
    let formatted_date =
        current_datetime.getFullYear() +
        "-" +
        (current_datetime.getMonth() + 1) +
        "-" +
        current_datetime.getDate() +
        " " +
        current_datetime.getHours() +
        ":" +
        current_datetime.getMinutes() +
        ":" +
        current_datetime.getSeconds();
    let method = req.method;
    let url = req.url;
    let status = res.statusCode;
    let log = `[${formatted_date}]  ${method}:${url} ${status}`;
    console.log(log);
    next();
};
app.use(middl_logs)
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//-	3 - Create a global error handler that logs the error and return {“error”:”internal server error”} with status code 500 
app.use(function(err, req, res, next) {
        if (!err) {
            return next();
        }
        res.status(500);
        res.send('500: Internal server error');
    }

)




app.listen(3000, () => {
    console.log("server listening on port 3000");
});