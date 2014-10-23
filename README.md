game Project
================

game is based on the node.js, mongodb

require
--------
cd game && npm install


start server
-----------
npm start
forever -e ./log/error.log start ./server.js

test server
--------------
npm test

# notice
--------------
如果将来添加依赖的库, 需要用npm install --save [packagename] 更新package.json文件, 以便每次npm install时, 能够完整的安装所有依赖, 不会在npm start时报错.
还有每次新部署项目的时候, 要记得修改ajax在_csrf使用上的bug.
