DROP TABLE IF EXISTS `user`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `user` (
  `id` smallint(5) unsigned NOT NULL auto_increment,
  `account` varchar(64) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `password` char(32) NOT NULL,
  `bind_account` varchar(50) NOT NULL,
  `last_login_time` int(11) unsigned default '0',
  `last_login_ip` varchar(40) default NULL,
  `login_count` mediumint(8) unsigned default '0',
  `verify` varchar(32) default NULL,
  `email` varchar(50) NOT NULL,
  `remark` varchar(255) NOT NULL,
  `create_time` int(11) unsigned NOT NULL,
  `update_time` int(11) unsigned NOT NULL,
  `status` tinyint(1) default '0',
  `type_id` tinyint(2) unsigned default '0',
  `info` text NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `account` (`account`)
) ENGINE=MyISAM AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;
SET character_set_client = @saved_cs_client;


LOCK TABLES `user` WRITE;
INSERT INTO `user` VALUES (1,'admin','管理员','1111','',1312088534,'127.0.0.1',924,'8888','bruce-vip@qq.com','admin',1222907803,1239977420,1,0,''),
(2,'demo','演示','1111','',1306159437,'127.0.0.1',94,'8888','','',1239783735,1254325770,1,0,''),
(3,'member','员工','1111','',1254326104,'127.0.0.1',15,'','','',1253514375,1254325728,1,0,''),
(4,'leader','领导','1111','',1284542339,'127.0.0.1',17,'','','admin',1253514575,1254325705,1,0,'');