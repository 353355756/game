var _commonScale = null;
var MyLayer = cc.Layer.extend({
    init: function(){
        this._super();
        var winSize = cc.Director.getInstance().getWinSize();

        this.sprite = cc.Sprite.create(onebeijing);
        this.sprite.setScale(0.8);
        this.sprite.setPosition(cc.p( winSize.width/2, winSize.height/2));

        var menuItem = cc.MenuItemImage.create(up, up, this.ButtonSprite, this);
        var menu = cc.Menu.create(menuItem);
        menu.setAnchorPoint(cc.p(0,0));
        menu.setScale(1.4);
        menu.setPosition(cc.p(winSize.width/2.0,winSize.height/4.3));

        this.addChild(this.sprite, 0);
        this.sprite.addChild(menu);
        return true;
    },
    ButtonSprite:function(){
        var scene = new gzScene();
        cc.Director.getInstance().replaceScene(scene);
    }
});
var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init();
    }
});
