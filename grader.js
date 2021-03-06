#!/usr/bin/env node
/*

copied and pasted from the newer, second edition. I also figured out on my own through trial and error why my test case wasn't working. Note that you have to have the <not_necessarily_the_variable_name_but_indicative_for_humans> as part of the commander deal. >< sheesh. Can't believe  I wasted all that time.

Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var restler = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

// check this!
var checkWebAddress = function(url, checksfile)
{
    var out = {};
    var test =  restler.get(url).on('complete', function(data)
			{
				$ = cheerio.load(data);
				var checks = loadChecks(checksfile).sort();
				for(var ii in checks)
				{
                                    var present = $(checks[ii]).length > 0;
                                    out[checks[ii]] = present;
				}
			    console.log(JSON.stringify(out, null, 4));
			});
};


var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <website_url>', 'Path to web address', String, URL_DEFAULT)
        .parse(process.argv);
    var checkJson;
    if(program.url == URL_DEFAULT)
    {
	checkJson = checkHtmlFile(program.file, program.checks);
	outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
    }
    else
	checkWebAddress(program.url, program.checks);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}