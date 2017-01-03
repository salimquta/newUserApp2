// load the users model
var Users = require('./models/users');
var Jimp = require("jimp");
//var im = require('imagemagick');
// expose the routes to our app with module.exports
module.exports = function (app) {

    // get all users
    app.get('/api/users', function (req, res) {

        // use mongoose to get all users in the database
        Users.find(function (err, users) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)



//            document.write("The sum is: " + sum + ". The average is: " + avg + "<br/>");
//
            res.json(users); // return all users in JSON format
        });
    });
    // update username for one user
    app.put('/api/users/:user_id', function (req, res) {

        // use our users model to find the user we want
        Users.findById(req.params.user_id, function (err, users) {

            if (err)
                res.send(err);

            users.username = req.body.username;  // update the user info only username we need here 

            // save the user
            users.save(function (err) {
                if (err)
                    res.send(err);

                res.json(users);
            });

        });
    });


    // create user and send back all users after creation
    app.post('/api/users', function (req, res) {

        var file = {
            ext: req.body.image.filename.split(".")[1].toLowerCase(),
            name: new Date().getMilliseconds() + "_" + req.body.image.filename.toLowerCase(),
            path: "./public",
            data: req.body.image.base64
        };


        var pattern = "";

        switch (file.ext) {
            case 'jpg' :
                pattern = /^data:image\/jpg;base64,/;
                break;
            case 'jpeg' :
                pattern = /^data:image\/jpeg;base64,/;
                break;
            default :
                pattern = /^data:image\/png;base64,/;
        }
       
       // 
        var base64Data = file.data.replace(pattern, "");
        var full_path = "/uploads/" + "" + file.name;
        var thumbPath = "/uploads/thumb/" + "" + file.name;
        require("fs").writeFile(file.path + "" + full_path, base64Data, 'base64', function (err) {

        });
        // get image from uploads folder and resize it then store it on uploads/thumb folder 
        Jimp.read("http://localhost:8080" + full_path, function (err, image) {
            if (err)
                console.log(err);
            image.resize(256, 256);
            image.write(file.path + "" + thumbPath);
            //  console.log(image);
            // do stuff with the image (if no exception) 
        });



        // create a user, information comes from AJAX request from Angular
        Users.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            age: req.body.age,
            biography: req.body.biography,
            image: thumbPath
        }, function (err, users) {

            if (err)
                res.send(err);

            // get and return all the users after you create another
            Users.find(function (err, users) {

                if (err)
                    res.send(err)
                
                // below we will get average of all users and compare it with last user age that added 
                
                var ages = [];
                for (var user in users) {
                    ages[user] = users[user]['age'];
                }
                
                var sum = ages.reduce(function (a, b) {
                    return a + b;
                });
                var avg = sum / ages.length;
                // here if last user age greater than users age average 
                // we will convert thumb image to grey 
                if (req.body.age >= avg) {
                    Jimp.read("http://localhost:8080" + thumbPath, function (err, image) {
                        if (err)
                            console.log(err);

                        image.greyscale();
                        image.write(file.path + "" + thumbPath);
                        console.log(image);
                        // do stuff with the image (if no exception) 
                    });
                }
                res.json(users);
            });
        });

    });

    // delete a user
    app.delete('/api/users/:user_id', function (req, res) {
        Users.remove({
            _id: req.params.user_id
        }, function (err, user) {
            if (err)
                res.send(err);

            // get and return all the user after you create another
            Users.find(function (err, users) {
                if (err)
                    res.send(err)
                res.json(users);
            });
        });

    });


    // application -----------------------------
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html'); // load the single view file
    });
}