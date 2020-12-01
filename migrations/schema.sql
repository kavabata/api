/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `controllers`;

CREATE TABLE `controllers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `device_id` int(11) unsigned NOT NULL,
  `mode_id` int(11) unsigned DEFAULT '1',
  `controller` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `controller_state` tinyint(3) unsigned DEFAULT '0',
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `controllerMode` (`mode_id`),
  KEY `controllerDevice` (`device_id`),
  CONSTRAINT `controllerDevice` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`),
  CONSTRAINT `controllerMode` FOREIGN KEY (`mode_id`) REFERENCES `modes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `controllers` WRITE;
/*!40000 ALTER TABLE `controllers` DISABLE KEYS */;

DROP TABLE IF EXISTS `devices`;

CREATE TABLE `devices` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `key` varchar(50) DEFAULT NULL,
  `ip` varchar(15) DEFAULT NULL,
  `status` tinyint(3) NOT NULL DEFAULT '0',
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `modes`;

CREATE TABLE `modes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `rooms`;

CREATE TABLE `rooms` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(11) DEFAULT NULL,
  `mode_updated` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `temperature` decimal(3,1) DEFAULT NULL,
  `light` int(10) unsigned DEFAULT '0',
  `top` decimal(5,2) DEFAULT NULL,
  `left` decimal(5,2) DEFAULT NULL,
  `width` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `rooms_devices`;

CREATE TABLE `rooms_devices` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `room_id` int(11) DEFAULT NULL,
  `device_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `rules`;

CREATE TABLE `rules` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `scenario_id` int(11) DEFAULT NULL,
  `mode_id` int(11) unsigned NOT NULL,
  `sensor_id` int(11) unsigned NOT NULL,
  `sensor_start` float(7,1) DEFAULT NULL,
  `sensor_end` float(7,1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `scenarioMode` (`mode_id`),
  KEY `scenarioSensor` (`sensor_id`),
  CONSTRAINT `scenarioMode` FOREIGN KEY (`mode_id`) REFERENCES `modes` (`id`),
  CONSTRAINT `scenarioSensor` FOREIGN KEY (`sensor_id`) REFERENCES `sensors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `scenarios`;

CREATE TABLE `scenarios` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `mode_id` int(11) unsigned NOT NULL,
  `controller_id` int(11) unsigned NOT NULL,
  `controller_value` int(11) DEFAULT NULL,
  `controller_delay` int(11) NOT NULL DEFAULT '0',
  `sort_order` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `sensors`;

CREATE TABLE `sensors` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `device_id` int(11) unsigned DEFAULT NULL,
  `room_id` int(11) unsigned DEFAULT NULL,
  `sensor_type` varchar(255) DEFAULT NULL,
  `type` tinyint(3) unsigned NOT NULL,
  `sensor_delay` int(11) DEFAULT NULL,
  `sensor_state` varchar(255) DEFAULT NULL,
  `sensor_updated` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `sensors_logs`;

CREATE TABLE `sensors_logs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sensor_id` int(11) DEFAULT NULL,
  `device_id` int(11) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
