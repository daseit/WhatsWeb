


if (Meteor.isClient) {
  Session.set("counter", 0 );
  Template.Chat.greeting = function () {
    // return "Version " + Session.get("counter");
	//var fs = Users.find().count();
    return " # " + Messages.find().count() ;
  };

$(document).ready(function(){
//friend_item
   
   $('.friendList').click(function(event){
   	console.log("FRIENDLIST: !!! ");
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
	
	$('#btnAnmelden').click(function(event){
		var name = $('#loginName').val();
		console.log("buttonAnmelden: !!! "+ name);
	});
	
	});
  
  
  /*Template.friends_list.friend_item.events({
/*'click .list-group-item': function(){
'.active'.removeClass('active');
//add the active class to the link we clicked
this.addClass('active');
}*/
// });
  
  Template.messages_list.messages = function () {
   
   var messages = Messages.find({}, { sort: { time: -1 }, limit: 70 }).fetch();
   
    for(var i = 0; i < messages.length; ++i ) {
      var t = messages[i].time;
      var d = new Date(t);
      messages[i].time = d.toLocaleString();
    }
    return messages;
	
  };
  

  Template.Chat.hasMessages = function () {
    return Messages.find().count() > 0;
  }


  
  Template.Chat.events({
    'click .addbtn': function () {
      // template data, if any, is available in 'this'
   

        addFriend( "test");
      // Session.set("counter", Messages.find().count() );
   
    },

  });
  
   Template.Chat.hasFriends = function () {
    return Users.find().count() > 0;
  }
  
  Template.friends_list.friends = function () {
    var friends = Users.find({}, { limit: 700 }).fetch();
   /* for(var i = 0; i < friends.length; ++i ) {
var t = friends[i].time;
var d = new Date(t);
friends[i].time = d.toLocaleString();
}*/
    return friends;
  };

  

  Template.Chat.events({
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


