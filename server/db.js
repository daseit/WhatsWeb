
Users = new Meteor.Collection('myusers');
Threads = new Meteor.Collection('threads');
Messages = new Meteor.Collection('mymessages');



function dateToString(date) {
	function f0(d) {return (d <= 9 ? '0' + d : d);}
	var dy = date.getDate();
	var mo = date.getMonth() + 1;
	var yr = date.getFullYear();
	var hr = date.getHours();
	var mi = date.getMinutes();

	return f0(dy) + '.' + f0(mo) + '.' + yr + ' ' + f0(hr) + ':' + f0(mi);
}

///////////////////////////////////////////////////////////////////////////////
// Database
///////////////////////////////////////////////////////////////////////////////

findUser = function(name) {
	var id = 0;
	var arr = Users.find({name: name}).fetch();
	if (arr.length == 0) {
		// Create new User
		id = Users.insert({
			name: name,
			threads: []
		});
	} else {
		// Return existing user
		id = arr[0]._id;
	}
	return id;
}


addMessage2Thread = function (sender, receiver, threadtitle, message) {
	var senderId = findUser(sender);
	var receiverId = findUser(receiver);

	var arr = Threads.find({title: threadtitle}).fetch();
	var id = 0;
	
	if (arr.length == 0) {
		// Create new Thread
		id = Threads.insert({
			timestamp: (new Date()).getTime(),
			title: threadtitle,
			senderId: senderId,
			receiverId: receiverId,
			messages: []
		});
	} else {
		// Add to Thread
		id = arr[0]._id;
		// console.log("Found Thread " + threadtitle + " " + id);
	}

	var messageId = addMessage(senderId, receiverId, id, message);
	var message = Messages.findOne(messageId);
	Threads.update(id, {$set: {timestamp: message.timestamp}, $push: {messages: messageId}  });
	Users.update(senderId, {$addToSet: {threads: id }});
	Users.update(receiverId, {$addToSet: {threads: id }});
};


getMessages = function(user) {
	var userId = findUser(user);
	var arr = Threads.find({$or: [ {senderId: userId}, {receiverId: userId}]  }, {$sort: {timestamp: -1} } ).fetch();
	console.log(user + " has " + arr.length + " threads ");

	for (var i = 0; i<arr.length; ++i) {
		for (var j = 0; j<arr[i].messages.length; ++j) {
			var messageId = arr[i].messages[j];
			var message = Messages.findOne(messageId);
			var sender = Users.findOne(message.senderId).name;
			var receiver = Users.findOne(message.receiverId).name;
			console.log(sender + " said to " + receiver + ": " + message.message + " at " + dateToString(new Date(message.timestamp)) );
		}
	}
}

addMessage = function (senderId, receiverId, threadId, message) {
	id = Messages.insert({
		timestamp: (new Date()).getTime(),
		senderId: senderId,
		receiverId: receiverId,
		threadId: threadId,
		message: message
	});
	return id;
}


///////////////////////////////////////////////////////////////////////////////
// Start Up
///////////////////////////////////////////////////////////////////////////////
Meteor.startup(function () {
	if (Users.find().count() == 0) {
		Users.insert({
			name: "Fritz",
			threads: [],
			email: "fritz@hs-esslingen.de"
		});
		Users.insert({
			name: "Hans",
			threads: [],
			email: "hans@hs-esslingen.de"
		});
	}

	console.log("Meteor.startup");
	addMessage2Thread("Fritz", "Hans", "Der erste Thread", "Hallo Hans");
	addMessage2Thread("Hans", "Fritz", "Der erste Thread", "Hallo Fritz");
	addMessage2Thread("Fritz", "Hans", "Der zweite Thread", "Wie geht's?");
	addMessage2Thread("Hans", "Fritz", "Der zweite Thread", "Schlecht.");
	addMessage2Thread("Hans", "Peter", "Der dritte Thread", "Und Dir?");
	getMessages("Fritz");
	getMessages("Hans");
});

