
Threads = new Meteor.Collection('threads');
Messages = new Meteor.Collection('mymessages');


Meteor.publish("threads", function (user) {
	var userId = findUser(user);
	return Threads.find({$or: [ {senderId: userId}, {receiverId: userId}]  }, {$sort: {timestamp: -1} } ).fetch();
});



// server
Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({}, {fields: {'username': 1}});
  } else {
    this.ready();
  }
});



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
	var arr = Meteor.users.find({username: name}).fetch();
	if (arr.length == 0) {
	} else {
		id = arr[0]._id;
	}
	return id;
}


addMessage2Thread = function (sender, receiver, threadtitle, message) {
	var senderId = findUser(sender);
	var receiverId = findUser(receiver);

	console.log("senderId " + sender + " is " + senderId);

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
		console.log("Insert new thread " + threadtitle  + " got " + id);
	} else {
		// Add to Thread
		id = arr[0]._id;
		console.log("Add to thread " + threadtitle  + " id " + id);
		// console.log("Found Thread " + threadtitle + " " + id);
	}

	var messageId = addMessage(senderId, receiverId, id, message);
	var message = Messages.findOne(messageId);
	Threads.update(id, {$set: {timestamp: message.timestamp}, $push: {messages: messageId}  });
	Meteor.users.update(senderId, {$addToSet: {threads: id }});
	Meteor.users.update(receiverId, {$addToSet: {threads: id }});
};

getMessages = function(user) {
	var userId = findUser(user);
	console.log("getMessages " + user + " has id " + userId);
	var arr = Threads.find({$or: [ {senderId: userId}, {receiverId: userId}]  }, {$sort: {timestamp: -1} } ).fetch();
	console.log(user + " has " + arr.length + " threads ");

	for (var i = 0; i<arr.length; ++i) {
		for (var j = 0; j<arr[i].messages.length; ++j) {
			var messageId = arr[i].messages[j];
			var message = Messages.findOne(messageId);
			if (message) {
				console.log('Message: ' + message.message + ' senderId: ' + message.senderId);
			}
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
	if (Meteor.users.find().count() == 0) {
		Accounts.createUser({
			username: "Fritz",
			threads: [],
			email: "fritz@hs-esslingen.de",
			password: 'fritz123'
		})
		Accounts.createUser({
			username: "Hans",
			threads: [],
			email: "hans@hs-esslingen.de",
			password: 'hans123'
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

