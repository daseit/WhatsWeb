
// Users = new Meteor.Collection('myusers');
Threads = new Meteor.Collection('threads');
Messages = new Meteor.Collection('mymessages');

//contact list
myFriends = new Meteor.Collection('myfriends');

if (Meteor.isClient) {
  //Template.hello.greeting = function () {
  //  return "Welcome to Kontakte.";
  //};

  /*Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });*/

  findUser = function(name) {
	var id = 0;
	var arr = Meteor.users.find({name: name}).fetch();
	console.log(arr.length);
	if (arr.length == 0)
		return 0;
	return arr[0].name;
}
  
  findFriend = function(name) {
	var id = 0;
	var arr = myFriends.find({name: name}).fetch();
	console.log(arr.length);
	if (arr.length == 0)
		return 0;
	return arr;
}

Template.friends_item.events({'click .deleteContactButton' : function()
{
	console.log("event");
	myFriends.remove(this._id);
}});


  
  Session.set('currentPage', 'chatpage');
  tMain(Template.main);
  var AppRouter = Backbone.Router.extend({
    routes: {
      ""              : "chat", 
      "chat"          : "chat",
      "kontakte"       : "kontakte",
      "einstellungen"     : "einstellungen"
    },
    chat: function(id) {
      console.log('chat');
      Session.set('currentPage', 'chatpage');
    },
    kontakte: function(id) {
      console.log('kontakte');
      Session.set('currentPage', 'kontaktepage');
    },
    einstellungen: function() {
      console.log('einstellungen');
      Session.set('currentPage', 'einstellungenpage');
    }
  });
  
  var app_router = new AppRouter;

  Meteor.startup(function () {
    Backbone.history.start({ pushState: true });
  });

 

//add new contact
addFriend = function(newName){
	console.log("button pushed");
	//console.log(newName);
	/*var contact = {
		name: newName,
		id:[]
		//email: newEmail,
		//pw: newPw,
	  };
	  Friends._collection.insert(contact);
	  console.log(contact.name + " " + contact.id); 
	*/
	
	var getFriendName = findUser(newName);
	console.log(getFriendName);
	if (getFriendName == 0)
	{
		console.log("user nicht vorhanden" +getFriendName);
		return;
	}
	
	var existingFriend = 0;
	existingFriend = findFriend(newName);
	
	
	var friend = {
		name: getFriendName
	  };
	
	if(existingFriend != 0)
		console.log("friend already exists");
	
	if (existingFriend == 0)
		myFriends.insert(friend);
	
} 


deleteContact = function(deleteId){
console.log("delete user with id: "+deleteId); 
}



Template.xyz_friends_list.friends = function(){
 if (myFriends.find().count() > 0)
		 {
			var friends = myFriends.find({}, {}).fetch();
			console.log(friends.length);
			for (var i = 0; i < friends.length; ++i ) {
				console.log(friends[i].name);
			//	if (i > 0 && contacts[i].name == contacts[contacts.length-1].name && i != (contacts.length-1) )
			//		console.log("Message already exists => " + contacts[i].name);
				//document.getElementById('result').value = contacts[i].name; 	
			}
		 }
		 
		 
		// var arr = Users.find({}).fetch();
		// console.log("find user:" +arr.length);
	return friends;
} 
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });  
}