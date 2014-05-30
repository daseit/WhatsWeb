if (Meteor.isClient) {

	Template.logout.events({
		'click #logout_button': function () {
			Meteor.logout();
		}
	});
	
	Template.logout.username = function() {
		return Meteor.user().username;
	}

}