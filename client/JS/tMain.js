console.log('Reading tMain');


////////// Event of Template  //////////

tMain = function(T) {
	console.log('tMain');

	T.events = {};

	T.isChat = function() {
		var ret = Session.get('currentPage');
		console.log('isChat' + ret + " " + (Session.get('currentPage') == 'chatpage'));
		return ret == 'chatpage';
	}
	T.isKontakte = function() {
		var ret = Session.get('currentPage');
		console.log('isKontakte' + ret + " " + (Session.get('currentPage') == 'kontaktepage'));
		return Session.get('currentPage') == 'kontaktepage';
	}
	T.isEinstellungen = function() {
		var ret = Session.get('currentPage');
		console.log('isEinstellungen' + ret + " " + (Session.get('currentPage') == 'einstellungenpage'));
		return Session.get('currentPage') == 'einstellungenpage';
	}

}