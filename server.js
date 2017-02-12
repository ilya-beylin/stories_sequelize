var db = require('./db');
var express = require('express');
var nunjucks = require('nunjucks');
var body_parser = require('body-parser');


var app = express();
app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', {noCache: true});

var port = process.env.PORT || 3000;

app.listen(port, function () {console.log(`listening on port ${port}`)});

app.use(body_parser.urlencoded({extended: false}));

app.get('/', (req, res) =>{
  db.Users.getUserStories().then( (result) => {
//      console.log(result);
      res.render('index', {users: result});
    }
  ).catch( (error) => {
    console.error(error);
  });
});

app.post('/', (req, res) =>{
  var author = req.body.author;
  var title = req.body.title;
  var tags = req.body.tags;
  var story = req.body.text;
  db.Users.userFindOrCreate(author).then((user) => {
  //  console.log(`Added a user with ID ${user.id} and user data is ${user}`);
    return db.Stories.createStory(user[0].id, title, story);
  }).then(() => {
    res.redirect('/');
  });
});


app.get('/story/:id', (req, res) =>{

/*  var story_id = ;
  var author = ;
  var title = ;
  var tags = ;
  var story = ;
  var other_titles = ;

  db.Users.getStories(author).then( (result) => {
      res.render('story', {users: result});
    }
  ).catch( (error) => {
    console.error(error);
  });
*/
});

console.log('done');
