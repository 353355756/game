


var files = req.files.upfile;
	var fileName = files.originalFilename;
	fileName = fileName.split('.');

	var type = fileName[fileName.length-1];

	if(!fs.existsSync(upload)){
    fs.mkdirSync(upload,"777");
  }
	var newName = (new Date()).getTime()+Math.round(Math.random()*100)+'.'+type;
	//由于在editor里配置了上传路径，所以这里只需要添加name便可
	fs.rename(files.path,upload+newName,function(){