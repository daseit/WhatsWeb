/* global Messages, Users*/

// TODO: demo db
var demoMsgDB = new Meteor.Collection('demoMsg');

if (Meteor.isClient) {

    Session.set('counter', 0 );
    Template.Chat.greeting = function () {
        'use strict';

        return 'Du hast insgesamt ' + demoMsgDB.find().count() + ' Nachricht(en).' ;
    };

    $(document).ready(function(){
        'use strict';

        $('.friendList').click(function(event){
            
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

    var addMessage = function(senderId, receiverId, threadId, message) {
        'use strict';

        var insert = demoMsgDB.insert({
            timestamp: (new Date()).getTime(),
            message: message
        });

        return insert;
    };

    Template.messages_list.messages = function () {
        'use strict';

        var messages = demoMsgDB.find({}).fetch();

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
        return Users.find().count() > 0;
    };

    Template.friends_list.friends = function () {
        'use strict';
        
        var friends = Users.find({}, { limit: 700 }).fetch();

        return friends;
    };

    Meteor.methods({ deleteChat: function() {
        'use strict';
        console.debug('Warning: delete chat does not work at the moment!');
        demoMsgDB.remove({message: {$gt: 0}});
    }});

    Template.Chat.events({
        'click .chat .messageSendBtn': function () {
            'use strict';

            // check messageboxs value
            var $messagebox = $('.chat #message');
            var msg = $messagebox.val().trim();
            $messagebox.val('');
            
            if (msg.length > 0) {
                addMessage('Hans', 'Peter', 'Geheimer Chat', msg);
            }
        },

        'click .chat .trashbtn': function () {
            'use strict';
            console.debug('remove');
            Meteor.call('deleteChat');
        },

    });

}


