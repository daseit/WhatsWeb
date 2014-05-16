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

 //contact list
Contacts = new Meteor.Collection('contacts');

//add new contact
addContact = function(newName){
	console.log("button pushed");
	//console.log(newName);
	var contact = {
		name: newName,
		//email: newEmail,
		//pw: newPw,
	  };
	  Contacts._collection.insert(contact);
	
} 


Template.contact_list.contacts = function(){
 if (Contacts.find().count() > 0)
		 {
			var contacts = Contacts.find({}, {}).fetch();
			console.log(contacts.length);
			for (var i = 0; i < contacts.length; ++i ) {
				console.log(contacts[i].name);
			//	if (i > 0 && contacts[i].name == contacts[contacts.length-1].name && i != (contacts.length-1) )
			//		console.log("Message already exists => " + contacts[i].name);
				//document.getElementById('result').value = contacts[i].name; 	
			}
		 }
	return contacts;
} 
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });  
}