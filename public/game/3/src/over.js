var OverLayer = cc.Layer.extend({
    num:0,
    init: function(){
        // 1. super init first
        // 必须调用父类init()方法，很多bug都是由于没有调用父类init()方法造成的
        this._super();
        // 添加一张图片
        var winSize = this.winSize = cc.Director.getInstance().getWinSize();

        this.sprite = cc.Sprite.create(overbeijing);
        this.sprite.setPosition(cc.p( winSize.width/2, winSize.height/2));

        // this.sprite.setScale(0.8);


        this.gensprite = cc.Sprite.create(gen);
        this.gensprite.setAnchorPoint(cc.p(0,0));
        this.gensprite.setPosition(cc.p( winSize.width/3.8, winSize.height/2.0));
        this.addChild(this.gensprite,1);

        //huNum-clickCount
        var label1 = cc.LabelTTF.create(huNum-clickCount, "", 18);
        label1.setColor(cc.c3b(250, 0, 0));
        label1.setAnchorPoint(cc.p(0,0));
        label1.setPosition(cc.p(label1.getBoundingBox().getWidth()/1.1 ,this.gensprite.getBoundingBox().getHeight()/4.0));
        this.gensprite.addChild(label1);

        var baifen = 0;
        if((huNum-clickCount+11)>=100){
            baifen = huNum-clickCount;
        }else if(huNum==clickCount){
            baifen = 0;
        }else{
            baifen = huNum-clickCount+11;
        }
        var label2 = cc.LabelTTF.create(baifen, "", 25);
        label2.setColor(cc.c3b(250, 0, 0));
        label2.setAnchorPoint(cc.p(0,0));
        label2.setPosition(cc.p(this.sprite.getBoundingBox().getWidth()/1.7 ,this.sprite.getBoundingBox().getHeight()/2.7));
        this.sprite.addChild(label2);

        var menuItem = cc.MenuItemImage.create(reload, reload, this.chiButtonSprite, this);
        var menu = cc.Menu.create(menuItem);
        menu.setAnchorPoint(cc.p(0,0));
        // menu.setScale(1.4);
        menu.setPosition(cc.p(winSize.width/2.0 ,winSize.height/8.0));
        this.addChild(menu,3);

        var liwuMenuItem = cc.MenuItemImage.create(liwu,liwu,this.downloadButtonSprite, this);
        var liwumenu = cc.Menu.create(liwuMenuItem);
        liwumenu.setAnchorPoint(cc.p(0,0));
        //liwumenu.setScale(1.4);
        liwumenu.setPosition(cc.p(winSize.width/6.0 ,winSize.height/8.0));
        this.addChild(liwumenu,3);

        var fenMenuItem = cc.MenuItemImage.create(fxzj, fxzj, this.downloadButtonSprite, this);
        var fenmenu = cc.Menu.create(fenMenuItem);
        fenmenu.setAnchorPoint(cc.p(0,0));
        // fenmenu.setScale(1.4);
        fenmenu.setPosition(cc.p(winSize.width/8.0 ,winSize.height/8.0));
        this.addChild(fenmenu,3);

        this.addChild(this.sprite);
        this.setTouchEnabled(true);
        return true;
    },
    chiButtonSprite:function(){
        var scene = new GameScene();
        cc.Director.getInstance().replaceScene(scene);
        clickCount = null;
    },
    downloadButtonSprite:function(){
        if(this.num===0){
            this.ceng = cc.LayerColor.create(cc.c4(0,0,0,170),this.winSize.width,this.winSize.height);
            this.addChild(this.ceng,3);

            this.fx_sprite = cc.Sprite.create(share);
            this.fx_sprite.setAnchorPoint(cc.p(0,0));
            this.fx_sprite.setScale(1.2);
            this.fx_sprite.setPosition(cc.p(this.winSize.width-(this.winSize.width/2.0) ,this.winSize.height/1.5));
            this.ceng.addChild(this.fx_sprite);
            this.num++;
        }

    },
    onTouchesBegan:function(){
        if(this.num>0){
            this.removeChild(this.ceng, true);
            this.num--;
        }
    }
});
var OverScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new OverLayer();
        this.addChild(layer);
        layer.init();
    }
});
