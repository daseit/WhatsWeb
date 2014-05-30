if (Meteor.isClient) {
	/*
	Template.hello.greeting = function () {
	return "Welcome to WhatsWeb.";
	};

	Template.hello.events({
	'click input': function () {
		// template data, if any, is available in 'this'
		if (typeof console !== 'undefined')
		console.log("You pressed the button");
	}
	});
	*/

	Template.anmeldung.events({
		'click #anm_button': function () {
			// Hier erfolgt ein Datenbankzugriff, in dem geprüft wird,
			// ob es den angegebenen Benutzernamen gibt. Wenn ja, wird
			// zugehörige Passwort geprüft. Wenn richtig, Weiterleitung
			// zu Home. Wenn es den Benutzernamen nicht gibt oder das
			// Passwort falsch ist, wird "Kombination von Benutzername
			// und Passwort ist falsch" angezeigt.
		
			user=document.getElementById("anm_email").value;
			password=document.getElementById("anm_pw").value;
			// user=anm_email.value;
			// pw=anm_pw.value;
			Meteor.loginWithPassword(user,password,function(error){
				if(error) {
					console.log("Login Failed with " + error);
					$('#login_failed').html("The combination of username and password is wrong.");
				}});//,[callback])
		
			// template data, if any, is available in 'this'
			if (typeof console !== 'undefined')
				if(curuser=Meteor.user())
					console.log("You pressed the button Login " + curuser.username + " " + curuser.profile.friends.Markus);
		}
	});

	Template.registrierung.events({
		'click #reg_button': function () {
			// Hier erfolgt ein Datenbankzugriff, in dem geprüft wird,
			// ob der angegebene Benutzername schon vergeben ist. Wenn
			// ja, entsprechende Fehlermeldung ausgeben. Wenn nein,
			// "Erfolgreich angemeldet"-Seite.
		
			options = {};
			options.username=document.getElementById("reg_user").value;
			options.email=document.getElementById("reg_email").value;
			options.password=document.getElementById("reg_pw").value;
			options.profile={};
			Meteor.users.allow({insert: function(userId,doc){return true;}});
			options.profile.name1="123";
			//a='friendsMarkus';
			options.profile.friends=[];//new Meteor.Collection("friendsMarkus");
			//options.profile.friends.insert({b:"hallo"});
			//options.profile.friends.a="Freund1";
			//options.conf_pw=document.getElementById("reg_conf_pw").value;
			// options.password=reg_pw;
			// options.profile={};
			Accounts.createUser(options,function(error){
				if(error) {
					console.log("CreateUser Failed with " + error);
					$('#reg_failed').html("The username or email is already taken.");
				}
			});
		
			// template data, if any, is available in 'this'
			if (typeof console !== 'undefined')
			console.log("You pressed the button Registrieren: " + options.username);
		}
	});

}

if (Meteor.isServer) {
	Meteor.startup(function () {
	// code to run on server at startup
	});
	
}



