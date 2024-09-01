const cheerio = require('cheerio');

fetch("https://moontracks.com/lunar_ingress.html")
.then(res => res.text())
.then(data => {
	const $ = cheerio.load(data);
	
	const table = $('.main table').text();

	if (!table) {
		console.error('Table not found');
		return [];
	}
	
	const regex = /(\w{3} \d{1,2}, \d{4}) (\d{1,2}:\d{2} (?:AM|PM))\s+Moon enters (\w+)/g;

	let match;
	const entries = [];

	while ((match = regex.exec(table)) !== null) {
			entries.push({
					"date": `${match[1]} ${match[2]} GMT-0700`,
					"sign": match[3]
			});
	}

	// Custom print function
	function printCustomJSON(entries) {
		let result = '';
		entries.forEach((entry, index) => {
			result += `  { "date": "${entry.date}", "sign": "${entry.sign}" }`;
			if (index < entries.length - 1) {
				result += ',\n';
			}
		});
		return result;
	}

	console.log(printCustomJSON(entries));
})