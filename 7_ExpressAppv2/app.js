const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var fs = require('fs');
const app = express();
var foodCat;
var cat = "";
var userName = null;
let url;
var db;


app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

//if file doesn't exist, make an array to later add to json file when it's created
if(fs.existsSync('db.json')){
  var jsonData = fs.readFileSync('db.json', 'utf8');
  db = JSON.parse(jsonData);
} else{
  db = [];
}

//initial rendering of index so user can pick the food categories
//pulled from the site. 
app.get('/', function (req, res) {
  userName = null;
  url = `https://www.themealdb.com/api/json/v1/1/list.php?c=list`;
  request(url, function(error, response, body){
    foodCat = JSON.parse(body);
    //Send the data received to populate the dropdown menu on the index.
    //Had to null the variables used later in the get function since
    //everything is on the same page and if variables are not null
    //the code will 'break'
    res.render('index', {foodCat, cat:null, foodLst:null, name: userName, error: null});
  })
})

app.post('/', function(req, res){
  //I wanted to be fancy and have a "cascading dropdown" (i think is the
  //jargon), where choosing one dropdown would automatically generate another.
  
  //if user have chosen a recipe, generate the recipe page from data pulled from api
  //if user decides to change food category after seeing the recipes, go to 'else if'
  if ((req.body.recipe ) && (cat == req.body.category)){
    url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=` + req.body.recipe;
    request(url, function(error, response, body){
      let foodRec = JSON.parse(body);
      res.render('recipe', {foodRec, name: userName});
    })
  }

  //if users only chosen a food category so far, regenerate index page with the second
  //dropdown with recipes related to user choice
  else if (req.body.category){
    cat = req.body.category;
    url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=` + cat;
    request(url, function(error, response, body){
      let foodLst = JSON.parse(body);
      res.render('index', {foodCat, cat, foodLst, name: userName, error: null});
    })
  } 
})



app.get('/create', function(req, res){
  res.render('create', {msg: null});
})

app.post('/create', function(req, res){
  var name = req.body.userName;
  var pass = req.body.pass;
  var taken;

  for (var i = 0; i < db.length; i++){
    if (name == db[i].userName){
      taken = true;
    }
  }

  if (!taken){
    db.push({"userName": name, "passWord": pass});
    var data = JSON.stringify(db);
    fs.writeFile('db.json', data, finished);
    function finished(err){
      res.render('create', {msg: "Account created, you can now login."});
    }
  } else{
    res.render('create', {msg: "User name taken, please try again."});
  }
})




app.get('/login', function(req, res){
  res.render('login', {msg: null});
})

app.post('/login', function(req, res){
  userName = req.body.userName;
  var pass = req.body.pass;
  var valid;

  for (var i = 0; i < db.length; i++){
    if (userName == db[i].userName){
      if (pass == db[i].passWord){
        valid = true;
      }
    }
  }

  if (valid){
    res.render('index', {foodCat, cat:null, foodLst:null, name: userName, error: null});
  } else{
    res.render('login', {msg: "Incorrect user name or passowrd"});
  }
})



app.listen(3000, function () {
  console.log('App listening on port 3000...')
})