var fs = require('fs');

var filedata = '';

fs.readFile('./js/Global.example', "utf8", function(err, data) {
	if(err) throw err;
	filedata = data;

	fs.writeFile('./js/Global.js', filedata, function (err) {
	  if (err) throw err;
	  console.log('Global.js File Created!');
	});
});