var fs = require('fs'),
	gm = require('gm'),
	imageMagick = gm.subClass({ imageMagick : true });
//sudo apt-get install imagemagick
//Uditor本地图片上传的处理
exports.checkUpload = function(req,res){
	move(req,res,1);
}
exports.imgUpload = function(req,res){
	//上传套餐的图片
	if(req.body.type){
		move(req,res,4)
	}else{
		//课程的图片
		move(req,res,2);
	}

}

exports.avatarload = function(req, res){
	move(req,res,3);
}
exports.clipImg = function(req,res){
	var data = req.body;
	var url;
	if(req.body.type){
		url =  __dirname+'/../../public/bindImg/'+data.url;
	}else{
		url =  __dirname+'/../../public/courseImg/'+data.url;
	}

	imageMagick(url)
	.crop(data.width, data.height, data.x, data.y)
	.write(url, function (err) {
	  if (!err){
	  		res.send({url:data.url+"?v=1",csrf:res.locals.csrf_token});
	  }else{
	  		res.send({err:err});
	  }
	})
}
function move(req,res,select){
	//type ==1 richText upload img
	//type == 2 upload couser img
	var upload = __dirname+'/../../public/courseImg/';
	if(select == 1){
		upload = __dirname+'/../../public/upload/';
	}else if( select == 3){
		upload = __dirname+'/../../public/avatar/';
	}else if( select == 4){
		upload = __dirname + '/../../public/bindImg/';
	}
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
		//返回的内容为uditor制定的，详情请翻看具体代码
		if(select == 1 || select == 4){
			res.statusCode = 200;
      res.setHeader('content-type', 'text/html');   
			res.send({ "url":'/'+newName, "title":req.body.pictitle, "state":"SUCCESS",_csrf:res.locals.csrf_token });
		}else if(select == 2 || select == 3){
			imageMagick(upload+newName).size(function(err,size){
				console.log(err);
				if(!err){
					if(size.width >1000 || size.height >800){
						fs.unlink(upload+newName, function() {	//fs.unlink 删除用户上传的文件
							res.statusCode = 200;
        			res.setHeader('content-type', 'text/html');   
							res.send({'error' : 1,msg:"图片尺寸过大，应该小于1000x800"});
						});
					}else if(size.width<302 || size.height< 200){
						fs.unlink(upload+newName, function() {	//fs.unlink 删除用户上传的文件
							res.send({'error' : 3,msg:"图片尺寸过小，应该大于302x200"});
						});
					}else{
							res.statusCode = 200;
        			res.setHeader('content-type', 'text/html');   
							res.send({'url':newName,_csrf:res.locals.csrf_token});
					}
				}else{
					res.statusCode = 200;
        	res.setHeader('content-type', 'text/html');   
					res.send({'error':2,msg:"图片处理错误"});
				}
			})
		}
		
	});
}