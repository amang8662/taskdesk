var fs = require('fs');

var filedata = '';

fs.readFile('./js/Globals.example', "utf8", function(err, data) {
	if(err) throw err;
	filedata = data;

	fs.writeFile('./js/Globals.js', filedata, function (err) {
	  if (err) throw err;
	  console.log('Globals.js File Created!');
	});
});