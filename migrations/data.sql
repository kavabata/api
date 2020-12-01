INSERT INTO `controllers` (`id`, `device_id`, `mode_id`, `controller`, `name`, `controller_state`, `updated`)
VALUES
	(1,14,2,'switch','Cinema Heat',0,'2020-11-20 05:21:25'),
	(2,14,2,'dimmer','Cinema Light',0,NULL),
	(3,15,1,'dimmer','Bedrom top LED',0,NULL),
	(4,15,1,'dimmer','Bedroom bottom LED',0,NULL),
	(5,4,1,'switch','First Switch',0,NULL),
	(6,4,1,'switch2','Second Switch',0,NULL),
	(9,1,1,NULL,'GRAPH',0,NULL),
	(10,19,2,'switch','ESP-01 first',0,'2020-11-30 19:38:24'),
	(11,19,2,'switch2','ESP-01 second',0,'2020-11-30 20:55:25');

/*!40000 ALTER TABLE `controllers` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;

INSERT INTO `devices` (`id`, `name`, `key`, `ip`, `status`, `created`, `updated`)
VALUES
	(1,'Unknow device',NULL,NULL,1,'2020-04-09 15:44:13',NULL),
	(2,'Test device on board','testkeyid','127.0.0.2',1,'2020-04-09 15:46:50','2020-11-12 18:39:03'),
	(3,'My Key','mykey','192.168.0.111',2,'2020-04-09 21:45:02',NULL),
	(4,'Rele device','mykeyrele','192.168.1.189',2,'2020-04-25 19:17:04',NULL),
	(12,'Bedroom sensors','bedroomsensors','1.1.1.22',3,'2020-04-27 19:17:49',NULL),
	(13,'Cinema Sensors','cinema','192.168.1.189',0,'2020-04-30 18:56:18','2020-11-30 17:38:43'),
	(14,'Cinema Heat','cinema-heat','192.168.1.189',0,NULL,'2020-11-27 11:35:14'),
	(15,'Outside Sensors',NULL,NULL,1,NULL,NULL),
	(18,'Graph test device','--not-used----not-used----not-used----not-used--',NULL,3,NULL,NULL),
	(19,'Esp-01 contoller First','esp-controller-1','192.168.1.187',0,NULL,'2020-11-30 12:48:31'),
	(20,'ESP-01 Sensor','esp-sensor-1','192.168.1.191',0,NULL,'2020-11-29 09:22:57');

/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `modes` WRITE;
/*!40000 ALTER TABLE `modes` DISABLE KEYS */;

INSERT INTO `modes` (`id`, `name`)
VALUES
	(1,'Manual'),
	(2,'Auto'),
	(3,'Winter'),
	(4,'Leave');

/*!40000 ALTER TABLE `modes` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;

INSERT INTO `rooms` (`id`, `name`, `mode_updated`, `temperature`, `light`, `top`, `left`, `width`, `height`)
VALUES
	(1,'Bedroom','2020-06-29 11:56:50',18.0,0,46.58,1.70,35.60,41.53),
	(2,'Kitchen','2020-07-02 05:15:40',18.0,0,1.85,1.43,23.06,40.27),
	(3,'Bathroom','2020-07-02 05:16:04',18.0,0,1.98,24.35,30.42,24.70),
	(4,'Children','2020-06-29 11:55:36',18.0,0,47.85,54.78,44.79,48.86),
	(5,'Guest','2020-11-07 11:00:59',18.0,0,2.14,54.78,43.90,45.71),
	(6,'Hallway','2020-06-29 11:56:49',18.0,0,26.66,37.32,17.67,62.74),
	(7,'Cinema',NULL,NULL,0,NULL,NULL,NULL,NULL),
	(8,'Outside',NULL,15.0,0,NULL,NULL,NULL,NULL);

/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;


LOCK TABLES `rooms_devices` WRITE;
/*!40000 ALTER TABLE `rooms_devices` DISABLE KEYS */;

INSERT INTO `rooms_devices` (`id`, `room_id`, `device_id`)
VALUES
	(1,1,12),
	(2,1,13),
	(3,1,14),
	(4,1,15),
	(5,5,4),
	(6,6,13),
	(7,6,14);

/*!40000 ALTER TABLE `rooms_devices` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `rules` WRITE;
/*!40000 ALTER TABLE `rules` DISABLE KEYS */;

INSERT INTO `rules` (`id`, `scenario_id`, `mode_id`, `sensor_id`, `sensor_start`, `sensor_end`)
VALUES
	(13,10,2,2,0.0,30.0),
	(14,11,2,2,30.0,999999.9),
	(15,10,2,1,0.0,100000.0),
	(16,11,2,1,0.0,100000.0),
	(17,12,2,1,0.0,86400.0),
	(18,12,2,2,0.0,30.0),
	(19,13,2,1,0.0,86400.0),
	(20,13,2,2,30.0,60.0),
	(21,14,2,1,0.0,86400.0),
	(22,14,2,2,60.0,100000.0);

/*!40000 ALTER TABLE `rules` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `scenarios` WRITE;
/*!40000 ALTER TABLE `scenarios` DISABLE KEYS */;

INSERT INTO `scenarios` (`id`, `mode_id`, `controller_id`, `controller_value`, `controller_delay`, `sort_order`)
VALUES
	(10,1,10,0,100,0),
	(11,1,10,0,500,0),
	(12,2,11,0,1000,0),
	(13,2,11,0,2000,0),
	(14,2,11,0,1000,0);

/*!40000 ALTER TABLE `scenarios` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `sensors` WRITE;
/*!40000 ALTER TABLE `sensors` DISABLE KEYS */;

INSERT INTO `sensors` (`id`, `device_id`, `room_id`, `sensor_type`, `type`, `sensor_delay`, `sensor_state`, `sensor_updated`, `created`)
VALUES
	(1,1,1,'time',0,60000,'42280','2020-12-01 06:44:40',NULL),
	(2,13,6,'pir',1,300,'2020-12-01 06:11:14','2020-12-01 06:11:14',NULL),
	(3,13,6,'lightlevel',2,60000,'20','2020-12-01 02:59:15',NULL),
	(4,13,6,'temperature',3,60000,'21.0','2020-11-30 20:29:55',NULL),
	(5,13,6,'humidity',4,60000,'70','2020-12-01 05:45:47',NULL),
	(6,4,5,'temperature',3,30000,'43.99','2020-11-07 11:33:07',NULL),
	(7,4,5,'humidity',4,30000,'88.9','2020-06-07 16:55:35',NULL),
	(11,12,2,'pir',1,30,NULL,NULL,NULL),
	(12,12,2,'lightlevel',2,30,NULL,NULL,NULL),
	(13,12,2,'lightlevel',2,30,NULL,NULL,NULL),
	(14,12,1,'pir',0,NULL,'0','2020-11-07 15:36:41',NULL),
	(17,15,8,'temperature',0,NULL,'15',NULL,NULL),
	(19,20,NULL,'temperature',0,NULL,'31','2020-11-29 08:53:11',NULL),
	(20,20,NULL,'humidity',0,NULL,'57','2020-11-29 08:53:21',NULL),
	(21,20,NULL,'pir',0,NULL,'1606656150','2020-11-29 09:22:30',NULL);

/*!40000 ALTER TABLE `sensors` ENABLE KEYS */;
UNLOCK TABLES;

