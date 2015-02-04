// Empty filter : if value is empty, returns a "-"

gocApp.filter('emptyReplace', function() {
	return function(input) {
		if (input=="")
			return "-";
		return input;
	}
});