/* This file is only for testing the chat! */
demoMsgDB = new Meteor.Collection('demoMsg');
demoUserDB = new Meteor.Collection('demoUser');

Meteor.publish('demoMsg', function () {
    'use strict';
    return demoMsgDB.find({}, {});
});
Meteor.publish('demoUser', function () {
    'use strict';
    return demoUserDB.find({}, {});
});