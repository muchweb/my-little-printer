var Q = require('q'),
	exec = require('child_process').exec,
	colors = require('colors'),
	gm = require('gm'),
	plugin_list = require('./printerfile.json'),
	i,
	image = gm();

// Loading all modules
plugin_list = plugin_list.map(function (plugin) {
	if (typeof plugin === 'string')
		plugin = {
			name: plugin,
			data: {},
		}

	console.log('Loaded plugin ' + plugin.name.yellow);
	return new require('./plugins/' + plugin.name + '/main.js')('./plugins/' + plugin.name + '/', plugin.data);
});

console.log('Preparing...');
Q.all(plugin_list.map(function (mod) {
	return mod.prepare();
})).then(function (results1) {
	
	console.log('Processing...');
	Q.all(plugin_list.map(function (mod, index) {
		return mod.process(results1[index]);
	})).then(function (results2) {

		console.log('Rendering...');
		Q.all(plugin_list.map(function (mod, index) {
			return mod.render(results2[index]);
		})).then(function (results3) {
			
			console.log('Creating receipt...');

			// Appending images
			for (i = 0; i < results3.length; i++)
				image.append(results3[i]);

			// Wrining final image
			image.write('./out.png', function (err) {
				if (err)
					return console.log(err);

				console.log('Printing...');
				exec('./pring.sh')
			});
		});
	});
});