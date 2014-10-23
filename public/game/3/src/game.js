var clickCount = 0;
var huNum = 0;
var GameLayer = cc.Layer.extend({
    R_sprite_array : new Array(),
    Time_sprite_array: new Array(),
    winSize:null,
    isRun:false,
    touchNum:10,
    init: function(){
        // 1. super init first
        // 必须调用父类init()方法，很多bug都是由于没有调用父类init()方法造成的
        this._super();

        var winSize = this.winSize = cc.Director.getInstance().getWinSize();
        // 添加一张图片
        this.sprite = cc.Sprite.create(beijing);

        var  _commonScale =winSize.width/this.sprite.getBoundingBox().getWidth();
        if (_commonScale > winSize.height/this.sprite.getBoundingBox().getHeight()) {
            _commonScale = winSize.height/this.sprite.getBoundingBox().getHeight();
        }
        this._commonScale = _commonScale;
        this.sprite.setScale(_commonScale);
        this.sprite.setPosition(cc.p( winSize.width/2,  winSize.height/2));
        this.addChild(this.sprite,0);

        this.W_sprite = cc.Sprite.create(pcnh);
        this.W_sprite.setScale(_commonScale*0.9);
        this.W_sprite.setPosition(cc.p( winSize.width/2.0 , winSize.height/2.0));
        this.addChild(this.W_sprite,1);

        this.time_sprite = cc.Sprite.create(shijian);
        this.time_sprite.setScale(1.9);
        this.time_sprite.setPosition(cc.p(winSize.width/1.2 ,winSize.height/1.23));
        this.addChild(this.time_sprite,3);

        var timeNum = this.touchNum;
        for(var i=1;i<=timeNum;i++){
            var label = cc.LabelTTF.create(i+"\"", "Microsoft Yahei", 30);
            label.setColor(cc.c3b(255, 255, 255));
            label.setAnchorPoint(cc.p(0,0));
            label.setPosition(cc.p(this.time_sprite.getBoundingBox().getWidth()/5.0,-7));
            this.Time_sprite_array.push(label);
            if(i==this.touchNum){
                this.time_sprite.addChild(this.Time_sprite_array[i-1]);
            }
        }
        this.createRou();
        this.schedule(this.timescheduleCallback,1);
        this.setTouchEnabled(true);
        return true;
    },
    onTouchesEnded:function(){
        this.removeChild(this.T_sprite, true);
        this.removeChild(this.Js_sprite,true);
        this.addChild(this.W_sprite);
        if(this.R_sprite_array.length==0){
            var scene = new OverScene();
            cc.Director.getInstance().replaceScene(scene);
        }else{
            if(this.R_sprite_array.length<3){
                this.removeChild(this.R_sprite_array[this.R_sprite_array.length-1], true);
                this.R_sprite_array.splice(this.R_sprite_array.length-1,1,1);
                this.R_sprite_array.sort();
                this.R_sprite_array.shift();
            }else{
                var index = Math.ceil(Math.random()*this.R_sprite_array.length);
                this.removeChild(this.R_sprite_array[index], true);
                this.R_sprite_array.splice(index,1,1);
                this.R_sprite_array.sort();
                this.R_sprite_array.shift();
            }
        }
        clickCount--;
    },
    timescheduleCallback:function(){
        if(this.isRun){
            this.time_sprite.removeChild(this.Time_sprite_array[this.touchNum]);
            this.touchNum--;
            this.time_sprite.addChild(this.Time_sprite_array[this.touchNum]);
        }
    },
    timeCallback:function(){
        var scene = new OverScene();
        cc.Director.getInstance().replaceScene(scene);
    },
    onTouchesBegan:function(){
        this.isRun = true;
        if(this.touchNum == this.Time_sprite_array.length){
            this.timescheduleCallback();
        }
        this.scheduleOnce(this.timeCallback,this.touchNum);
        this.T_sprite = cc.Sprite.create(t_wan);
        this.T_sprite.setScale(this._commonScale*0.9);
        this.T_sprite.setPosition(cc.p(this.winSize.width/2.0 , this.winSize.height/2.0));
        this.addChild(this.T_sprite,1);

        this.Js_sprite = cc.Sprite.create(js);
        this.Js_sprite.setAnchorPoint(cc.p(0,0));
        this.Js_sprite.setScale(1.5);
        this.Js_sprite.setPosition(cc.p( this.winSize.width/2 , this.winSize.height/6.0));
        this.addChild(this.Js_sprite);
        this.removeChild(this.W_sprite, true);

        cc.AudioEngine.getInstance().playEffect(startAudio, false);
    },
    createRou:function(){
        var Max = 100;
        var Min = 60;
        var Range = Max - Min;
        var Rand = Math.random();
        var Num = Min + Math.round(Rand * Range);
        huNum = Num;
        var hu1 ={n:u_1,w:[{x:52,y:146},{x:45,y:147},{x:40,y:148}]};
        var hu2 ={n:u_2,w:[{x:35,y:146},{x:30,y:147},{x:25,y:148}]};
        var hu3 ={n:u_3,w:[{x:20,y:146},{x:15,y:147},{x:10,y:148}]};
        var hu4 ={n:u_4,w:[{x:5 ,y:146},{x:0,y:147},{x:-5,y:148}]};
        var hu5 ={n:u_5,w:[{x:-10,y:146},{x:-15,y:147},{x:-20,y:148}]};
        var hu6 ={n:u_6,w:[{x:-25,y:146},{x:-30,y:147},{x:-35,y:148}]};
        var hu7 ={n:u_7,w:[{x:-40,y:146},{x:-45,y:147},{x:-50,y:148}]};
        var hu8 ={n:u_8,w:[{x:-53,y:146},{x:-55,y:147},{x:-58,y:148}]};

        var hd1 ={n:d_1,w:[{x:78,y:180},{x:78,y:175},{x:76,y:172}]};
        var hd2 ={n:d_2,w:[{x:72,y:188},{x:67,y:193},{x:64,y:195}]};
        var hd3 ={n:d_3,w:[{x:53,y:195},{x:51,y:205},{x:49,y:210}]};
        var hd4 ={n:d_4,w:[{x:47,y:190},{x:45,y:191},{x:43,y:192}]};
        var hd5 ={n:d_5,w:[{x:41,y:200},{x:39,y:201},{x:37,y:202}]};

        var hd6 ={n:d_6,w:[{x:35,y:205},{x:33,y:210},{x:30,y:215}]};
        var hd7 ={n:d_7,w:[{x:28,y:220},{x:26,y:220},{x:24,y:220}]};
        var hd8 ={n:d_8,w:[{x:20,y:220},{x:18,y:220},{x:16,y:220}]};
        var hd9 ={n:d_9,w:[{x:14,y:220},{x:12,y:220},{x:10,y:220}]};
        var hd10 ={n:d_10,w:[{x:8,y:220},{x:5,y:220},{x:0,y:220}]};

        var hd11 ={n:d_11,w:[{x:-5,y:220},{x:-10,y:220},{x:-15,y:220}]};
        var hd12 ={n:d_12,w:[{x:-20,y:220},{x:-25,y:220},{x:-30,y:220}]};
        var hd13 ={n:d_13,w:[{x:-35,y:205},{x:-40,y:210},{x:-45,y:215}]};
        var hd14 ={n:d_14,w:[{x:-50,y:200},{x:-54,y:201},{x:-58,y:202}]};

        var hd15 ={n:d_15,w:[{x:-63,y:190},{x:-60,y:191},{x:-58,y:192}]};
        var hd16 ={n:d_16,w:[{x:-75,y:185},{x:-50,y:180},{x:-80,y:185}]};
        var hd17 ={n:d_17,w:[{x:-54,y:185},{x:-50,y:180},{x:-80,y:185}]};
        var hd18 ={n:d_18,w:[{x:-54,y:180},{x:-50,y:180},{x:-80,y:180}]};
        var hd19 ={n:d_19,w:[{x:-80,y:175},{x:-85,y:175},{x:-90,y:175}]};

        var ul = [hu1,hu2,hu3,hu4];
        var ur = [hu5,hu6,hu7,hu8];
        var dl = [hd1,hd2,hd3,hd4,hd5,hd6,hd7,hd8,hd9,hd10];
        var dr = [hd11,hd12,hd13,hd14,hd15,hd16,hd17,hd18,hd19];
        var obj = [];
        var ulNum = 0;
        for(var i=0;i<ul.length;i++){
            if(ulNum>Num/4){
                break;
            }
            var ulNumz = 0;
            for(var z =0;z<(Num/4)/ul.length/2-1;z++){
                if(ulNumz>(Num/4)/ul.length/2-1){
                    break;
                }
                var ulO = {};
                ulO.n = ul[i].n;
                ulO.x =ul[i].w[z].x;
                ulO.y =ul[i].w[z].y;
                obj.push(ulO);
                ulNumz++;
                ulNum++;
            }
        }
        var urNum =0;
        for(var i=0;i<ur.length;i++){
            if(urNum>Num/4){
                break;
            }
            var urNumz = 0;
            for(var z =0;z<(Num/4)/ur.length/2-1;z++){
                if(urNumz>(Num/4)/ul.length/2-1){
                    break;
                }
                var urO = {};
                urO.n = ur[i].n;
                urO.x =ur[i].w[z].x;
                urO.y =ur[i].w[z].y;
                obj.push(urO);
                urNumz++;
                urNum++;
            }
        }
        var dlNum =0;
        for(var i=0;i<dl.length;i++){
            if(dlNum>Num/4){
                break;
            }
            var dlNumz =0;
            for(var z =0;z<(Num/4)/dl.length/2;z++){
                if(dlNumz>(Num/4)/ul.length/2){
                    break;
                }
                var dlO = {};
                dlO.n = dl[i].n;
                dlO.x =dl[i].w[z].x;
                dlO.y =dl[i].w[z].y;
                obj.push(dlO);
                dlNumz++;
                dlNum++;
            }
        }
        var drNum =0;
        for(var i=0;i<dr.length;i++){
            if(drNum>Num/4){
                break;
            }
            var drNumz =0;
            for(var z =0;z<(Num/4)/dr.length/2;z++){
                if(drNumz>(Num/4)/ul.length/2){
                    break;
                }
                var drO = {};
                drO.n = dr[i].n;
                drO.x =dr[i].w[z].x;
                drO.y =dr[i].w[z].y;
                obj.push(drO);
                drNumz++;
                drNum++;
            }
        }
        for(var i=0;i<obj.length;i++){
            var o = obj[i];
            var R_sprite = cc.Sprite.create(o.n);
            R_sprite.setPosition(cc.p(this.winSize.width/2.0- o.x, this.winSize.height/2.0- o.y));
            this.R_sprite_array.push(R_sprite);
            this.addChild(R_sprite,3);
        }
        this.R_sprite_array.push(1);
        huNum = clickCount = this.R_sprite_array.length;
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
        layer.init();
    }
});
