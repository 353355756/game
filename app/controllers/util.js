var AdmZip = require('adm-zip');
var log4js = require("log4js");
var log = log4js.getLogger('error');

exports.unzip = function(zipPath,filePath,cb){
	try {
		var zip = new AdmZip(zipPath);
		zip.extractAllTo(filePath, true);
		cb();
 	}catch (err) {
		log.error(err);
		cb(err);
 	}
}
