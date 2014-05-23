/* global Messages, Users*/



if (Meteor.isClient) {

    // session vars for current chat
    Session.set('chatUser', 'Hans');
    Session.set('chatMate', 'Martin');

    // subscribe to demo databases
    Meteor.subscribe('demoMsg');
    Meteor.subscribe('demoUser');

    // store copies of the demo databases on client
    var demoMsgDB = new Meteor.Collection('demoMsg');
    var demoUserDB = new Meteor.Collection('demoUser');
    
    Template.Chat.numberOfMessages = function () {
        'use strict';

        return Session.get('chatUser') + ', Du hast ' + demoMsgDB.find().count() + ' Nachricht(en).' ;
    };

    $(document).ready(function(){
        'use strict';

        $('.friendList').click(function(event){
            

            
        });

        // set friend list item active
        var $activeListElement = $('.friendlist a[name=' + Session.get('chatMate') + ']');
        
        if($activeListElement) {
            $activeListElement.addClass('active');
        }

    });

    var addMessage = function(senderId, receiverId, threadId, message) {
        'use strict';

        var insert = demoMsgDB.insert({
            timestamp: (new Date()).getTime(),
            senderId: senderId,
            receiverId: receiverId,
            message: message
        });

        return insert;
    };

    Template.messages_list.messages = function () {
        'use strict';

        var messages = demoMsgDB.find({ 
            $or: [
                // only messages 1) chatMate -> chatUser or 2) chatUser -> chatMate
                { $and: [ {receiverId: Session.get('chatUser')}, {senderId: Session.get('chatMate')}] },
                { $and: [ {receiverId: Session.get('chatMate')}, {senderId: Session.get('chatUser')}] }
            ]
        });

        for(var i = 0; i < messages.length; i++ ) {
            var t = messages[i].timestamp;
            var d = new Date(t);
            messages[i].time = d.toLocaleString();
        }

        return messages;
    };

    Template.Chat.addMessage = function (senderId, receiverId, threadId, message) {
        'use strict';

        return addMessage(senderId, receiverId, threadId, message);
    };

    Template.Chat.hasMessages = function () {
        'use strict';
        return demoMsgDB.find().count() > 0;
    };


    Template.Chat.hasFriends = function () {
        'use strict';
        return demoUserDB.find().count() > 0;
    };

    Template.friends_list.friends = function () {
        'use strict';
        
        var friends = demoUserDB.find({}, { limit: 700 }).fetch();

        return friends;
    };

    Template.message_item.userIs = function (user) {
        'use strict';
        return Session.get('chatUser') === user;
    };
    Template.message_item.chateMateIs = function (chatMate) {
        'use strict';
        return Session.get('chatMate') === chatMate;
    };

    Meteor.methods({ deleteChat: function() {
        'use strict';
        // Meteor.methods needed for permissions. On client side only one element can
        // be removed by default.
        // TODO: no removing possible at the moment -> workarround: loop over all elements
        // and delete them.
        console.debug('Warning: delete chat does not work at the moment!');
        demoMsgDB.remove({message: {$gt: 0}});
    }});


    // ------------ eventlistener -----------------
    Template.Chat.events({
        'click .chat .messageSendBtn': function () {
            'use strict';

            // check messageboxs value
            var $messagebox = $('.chat #message');
            var msg = $messagebox.val().trim();
            $messagebox.val('');

            // TODO: only for testing
            var receiver = $('.chat #receiver').val().trim();
            var sender = $('.chat #sender').val().trim();
            
            if (msg.length > 0) {
                addMessage(sender, receiver, 'Geheimer Chat', msg);
            }
        },

        'click .chat .trashbtn': function () {
            'use strict';
            Meteor.call('deleteChat');
        },

        'click .friendlist' : function(e) {
            'use strict';

            var nextChatMate = e.target.name;
            var prevChatMate = Session.get('chatMate');

            Session.set('chatMate', nextChatMate);

            // set new list focus
            $('.friendlist a[name=' + prevChatMate + ']').removeClass('active');
            $('.friendlist a[name=' + nextChatMate + ']').addClass('active');
        }

    });

    Template.friends_list.events({
        
    });

}


