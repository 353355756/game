var gzLayer = cc.Layer.extend({
    init: function(){
        this._super();
        var winSize = cc.Director.getInstance().getWinSize();

        this.sprite = cc.Sprite.create(guizebeijing);
        _commonScale = winSize.width/this.sprite.getBoundingBox().getWidth();
        if (_commonScale > winSize.height/this.sprite.getBoundingBox().getHeight()) {
            _commonScale = winSize.height/this.sprite.getBoundingBox().getHeight();
        }
        this.sprite.setScale(_commonScale);
        this.sprite.setPosition(cc.p( winSize.width/2, winSize.height/2));

        this.ceng = cc.LayerColor.create(cc.c4(253,254,255,255),winSize.width,winSize.height);
        this.addChild(this.ceng,0);

        var menuItem = cc.MenuItemImage.create(go, go, this.ButtonSprite, this);
        var menu = cc.Menu.create(menuItem);
        menu.setAnchorPoint(cc.p(0,0));
        menu.setScale(1.4);
        menu.setPosition(cc.p(winSize.width/2.4 ,winSize.height/14.0));

        this.addChild(this.sprite, 1);
        this.sprite.addChild(menu);
        return true;
    },
    ButtonSprite:function(){
        var scene = new GameScene();
        cc.Director.getInstance().replaceScene(scene);
    }
});
var gzScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new gzLayer();
        this.addChild(layer);
        layer.init();
    }
});
