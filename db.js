/*
Users
has Many Stories

Stories
Belongs to Users
has Many Tags

Tags
has Many Stories
*/

var pg = require('pg');
var Sequelize = require('sequelize');

var db = new Sequelize(process.env.DATABASE_URL);

var Users = db.define("users", {
  name: Sequelize.STRING
  },
  {
  classMethods: {
    getUsers(){
      return Users.findAll();
    },
    getUserStories(){
      return Users.findAll({
        include : [Stories]
      });
    },
    userFindOrCreate(name){
      return Users.findOrCreate(
        {where: {name : name}}
      );
    }
  }
});

var Stories = db.define("stories", {title: Sequelize.STRING, story:Sequelize.TEXT}, {
  classMethods: {
    createStory(userId, title, story) {
      return Stories.create({title:  title, story: story, userId : userId});
    }
  }
});

var Tags = db.define("tags", {tag:Sequelize.STRING}, {
    classMethods: {
      createTag(tag, story_id) {
        //
      }
    }
  }
});
var StoriesTags = db.define("stories_tags", {});

var user_names = ["Henry", "Ignacio", "Jack", "Kevin"];

Stories.belongsTo(Users);
Stories.belongsToMany(Tags, {through: StoriesTags});
Users.hasMany(Stories);
Tags.belongsToMany(Stories, {through: StoriesTags});

db.sync({force : true}).then( ()=>{
  seed();
});


function seed(){
  user_names.forEach(name =>{
    Users.create({name: name}).then(user=>{
      return Stories.create({title:  `${user.name}'s story`, story: `${user.name} went to learn coding.`, userId : user.id * 1});
    })
    .then(story => {
      if(story.id === 2) {
        story.update({
          userId: 1
        });
      }
    });
  });
}

module.exports = {
  Users,
  Tags,
  Stories,
  StoriesTags
};
