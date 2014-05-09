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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  
  
  
}
