counter = function() {
  var that = {};
  var counter = 0;
  that.add = function() {
    ++counter;
    return counter;
  };
  return that;
}();

Friends = new Meteor.Collection('friends');

Histories = new Meteor.Collection('histories');
Messages = new Meteor.Collection('messages');
Users = new Meteor.Collection('users');


addFriend = function( m_name){
	var friend = {
	
		name: m_name
	};
	Friends.insert(friend);
}

addHistory = function (m_messages, receiver){
	
	var history={
		key: receiver,
		messages: m_messages
	};
	Histories.insert(history);
}

addUsers = function(usr){
	var user={
		name: usr,
		id: []
	};
	
}

addMessage = function(m_msg, m_sender, m_receiver){
  var timemilliseconds = (new Date()).getTime();
  var message = {
  
    message: m_msg,
    time: timemilliseconds,    
	sender: m_sender,
	receiver: m_receiver
  };
  Messages.insert(message);
  
}



if (Meteor.isClient) {
  Session.set("counter", 0 );
  Template.enter_message.greeting = function () {
    // return "Version "  + Session.get("counter");
    return " # "  + Messages.find().count() ;
  };

$(document).ready(function(){
//friend_item
   
   $('.list-group-item').click(function(event){
        //remove all pre-existing active classes
        $('.active').removeClass('active');
        //add the active class to the link we clicked
        $(this).addClass('active');
        //Load the content
        //e.g.
        //load the page that the link was pointing to
        //$('#content').load($(this).find(a).attr('href'));      
        event.preventDefault();
    });
});
  
  
  /*Template.friends_list.friend_item.events({
	/*'click .list-group-item': function(){
		'.active'.removeClass('active');
        //add the active class to the link we clicked
        this.addClass('active');
	}*/
//  });
  
  Template.messages_list.messages = function () {
    var messages = Messages.find({}, { sort: { time: -1 }, limit: 7 }).fetch();
    for(var i = 0; i < messages.length; ++i ) {
      var t = messages[i].time;
      var d = new Date(t);
      messages[i].time = d.toLocaleString();
    }
    return messages;
  };

  Template.enter_message.hasMessages = function () {
    return Messages.find().count() > 0;
  }


  
  Template.enter_message.events({
    'click .addbtn': function () {
      // template data, if any, is available in 'this'
   
		
        addFriend( "test");
      //  Session.set("counter", Messages.find().count() );
   
    },  

  });
  
   Template.enter_message.hasFriends = function () {
    return Friends.find().count() > 0;
  }
  
  Template.friends_list.friends = function () {
    var friends = Friends.find({}, {  limit: 700 }).fetch();
   /* for(var i = 0; i < friends.length; ++i ) {
      var t = friends[i].time;
      var d = new Date(t);
      friends[i].time = d.toLocaleString();
    }*/
    return friends;
  };

  

  Template.enter_message.events({
    'click .sendbtn': function () {
      // template data, if any, is available in 'this'
      var msg = document.getElementById('message').value.trim();
      document.getElementById('message').value = "";
      if (msg.length > 0) {
        addMessage(msg);
        Session.set("counter", Messages.find().count() );
      }
    },
    'keyup #message': function (evt) {
      // template data, if any, is available in 'this'
      console.log("You pressed the button " + evt.which);
      if (evt.which == 13) {
        var msg = document.getElementById('message').value.trim();
        document.getElementById('message').value = "";
        if (msg.length > 0) {
          addMessage(msg);
          Session.set("counter", Messages.find().count() );
        }
      }
    }

  });


  

  
  Template.message_item.events({
    'click .trashbtn': function () {
      Messages.remove(this._id);
    }
  });

}




if (Meteor.isServer) {
  Meteor.startup(function () {
    console.log("Server");
    // code to run on server at startup
  });
}
