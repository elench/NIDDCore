# Copyright (C) 2001-2002 Carnegie Mellon University
#
# Maintainer: Roman Danyliw <rdd@cert.org>, <roman@danyliw.com>
#
# Original Author(s): Jed Pickel <jed@pickel.net>    (2000-2001)
#                     Roman Danyliw <rdd@cert.org>
#                     Todd Schrubb <tls@cert.org>
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License Version 2 as
# published by the Free Software Foundation.  You may not use, modify or
# distribute this program under any other version of the GNU General
# Public License.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.

# Snort Entities
CREATE TABLE `schema` ( vseq        INT      UNSIGNED NOT NULL,
                      ctime       DATETIME NOT NULL,
                      PRIMARY KEY (vseq));
INSERT INTO `schema`  (vseq, ctime) VALUES ('107', now());

CREATE TABLE event  ( sid 	  INT 	   UNSIGNED NOT NULL,
                      cid 	  INT 	   UNSIGNED NOT NULL,
                      signature   INT      UNSIGNED NOT NULL,
                      timestamp 	   DATETIME NOT NULL,
                      PRIMARY KEY (sid,cid),
                      INDEX       sig (signature),
                      INDEX       time (timestamp));


CREATE TABLE signature ( sig_id       INT          UNSIGNED NOT NULL AUTO_INCREMENT,
                         sig_name     VARCHAR(255) NOT NULL,
                         sig_class_id INT          UNSIGNED NOT NULL,
                         sig_priority INT          UNSIGNED,
                         sig_rev      INT          UNSIGNED,
                         sig_sid      INT          UNSIGNED,
                         sig_gid      INT          UNSIGNED,
                         PRIMARY KEY (sig_id),
                         INDEX   sign_idx (sig_name(20)),
                         INDEX   sig_class_id_idx (sig_class_id));


CREATE TABLE sig_reference (sig_id  INT    UNSIGNED NOT NULL,
                            ref_seq INT    UNSIGNED NOT NULL,
                            ref_id  INT    UNSIGNED NOT NULL,
                            PRIMARY KEY(sig_id, ref_seq));


CREATE TABLE reference (  ref_id        INT         UNSIGNED NOT NULL AUTO_INCREMENT,
                          `ref_system_id` INT         UNSIGNED NOT NULL,
                          ref_tag       TEXT NOT NULL,
                          PRIMARY KEY (ref_id));


CREATE TABLE reference_system ( `ref_system_id`   INT         UNSIGNED NOT NULL AUTO_INCREMENT,
                                ref_system_name VARCHAR(20),
                                PRIMARY KEY (`ref_system_id`));



CREATE TABLE sig_class ( sig_class_id        INT    UNSIGNED NOT NULL AUTO_INCREMENT,
                         sig_class_name      VARCHAR(60) NOT NULL,
                         PRIMARY KEY (sig_class_id),
                         INDEX       (sig_class_id),
                         INDEX       (sig_class_name));



# store info about the sensor supplying data
CREATE TABLE sensor ( sid	  INT 	   UNSIGNED NOT NULL AUTO_INCREMENT,
                      hostname    TEXT,
                      interface   TEXT,
                      filter	  TEXT,
                      detail	  TINYINT,
                      encoding	  TINYINT,
                      last_cid    INT      UNSIGNED NOT NULL,
                      PRIMARY KEY (sid));



# All of the fields of an ip header
CREATE TABLE iphdr  ( sid 	  INT 	   UNSIGNED NOT NULL,
                      cid 	  INT 	   UNSIGNED NOT NULL,
                      ip_src      INT      UNSIGNED NOT NULL,
                      ip_dst      INT      UNSIGNED NOT NULL,
                      ip_ver      TINYINT  UNSIGNED,
                      ip_hlen     TINYINT  UNSIGNED,
                      ip_tos  	  TINYINT  UNSIGNED,
                      ip_len 	  SMALLINT UNSIGNED,
                      ip_id    	  SMALLINT UNSIGNED,
                      ip_flags    TINYINT  UNSIGNED,
                      ip_off      SMALLINT UNSIGNED,
                      ip_ttl   	  TINYINT  UNSIGNED,
                      ip_proto 	  TINYINT  UNSIGNED NOT NULL,
                      ip_csum 	  SMALLINT UNSIGNED,
                      PRIMARY KEY (sid,cid),
                      INDEX ip_src (ip_src),
                      INDEX ip_dst (ip_dst));


# All of the fields of a tcp header
CREATE TABLE tcphdr(  sid 	  INT 	   UNSIGNED NOT NULL,
                      cid 	  INT 	   UNSIGNED NOT NULL,
                      tcp_sport   SMALLINT UNSIGNED NOT NULL,
                      tcp_dport   SMALLINT UNSIGNED NOT NULL,
                      tcp_seq     INT      UNSIGNED,
                      tcp_ack     INT      UNSIGNED,
                      tcp_off     TINYINT  UNSIGNED,
                      tcp_res     TINYINT  UNSIGNED,
                      tcp_flags   TINYINT  UNSIGNED NOT NULL,
                      tcp_win     SMALLINT UNSIGNED,
                      tcp_csum    SMALLINT UNSIGNED,
                      tcp_urp     SMALLINT UNSIGNED,
                      PRIMARY KEY (sid,cid),
                      INDEX       tcp_sport (tcp_sport),
                      INDEX       tcp_dport (tcp_dport),
                      INDEX       tcp_flags (tcp_flags));


# All of the fields of a udp header
CREATE TABLE udphdr(  sid 	  INT 	   UNSIGNED NOT NULL,
                      cid 	  INT 	   UNSIGNED NOT NULL,
                      udp_sport   SMALLINT UNSIGNED NOT NULL,
                      udp_dport   SMALLINT UNSIGNED NOT NULL,
                      udp_len     SMALLINT UNSIGNED,
                      udp_csum    SMALLINT UNSIGNED,
                      PRIMARY KEY (sid,cid),
                      INDEX       udp_sport (udp_sport),
                      INDEX       udp_dport (udp_dport));



# All of the fields of an icmp header
CREATE TABLE icmphdr( sid 	  INT 	   UNSIGNED NOT NULL,
                      cid 	  INT  	   UNSIGNED NOT NULL,
                      icmp_type   TINYINT  UNSIGNED NOT NULL,
                      icmp_code   TINYINT  UNSIGNED NOT NULL,
                      icmp_csum   SMALLINT UNSIGNED,
                      icmp_id     SMALLINT UNSIGNED,
                      icmp_seq    SMALLINT UNSIGNED,
                      PRIMARY KEY (sid,cid),
                      INDEX       icmp_type (icmp_type));



# Protocol options
CREATE TABLE opt    ( sid         INT      UNSIGNED NOT NULL,
                      cid         INT      UNSIGNED NOT NULL,
                      optid       INT      UNSIGNED NOT NULL,
                      opt_proto   TINYINT  UNSIGNED NOT NULL,
                      opt_code    TINYINT  UNSIGNED NOT NULL,
                      opt_len     SMALLINT,
                      opt_data    TEXT,
                      PRIMARY KEY (sid,cid,optid));

# Packet payload
CREATE TABLE data   ( sid           INT      UNSIGNED NOT NULL,
                      cid           INT      UNSIGNED NOT NULL,
                      data_payload  TEXT,
                      PRIMARY KEY (sid,cid));




# encoding is a lookup table for storing encoding types
CREATE TABLE encoding(encoding_type TINYINT UNSIGNED NOT NULL,
                      encoding_text TEXT NOT NULL,
                      PRIMARY KEY (encoding_type));
INSERT INTO encoding (encoding_type, encoding_text) VALUES (0, 'hex');
INSERT INTO encoding (encoding_type, encoding_text) VALUES (1, 'base64');
INSERT INTO encoding (encoding_type, encoding_text) VALUES (2, 'ascii');

# detail is a lookup table for storing different detail levels
CREATE TABLE detail  (detail_type TINYINT UNSIGNED NOT NULL,
                      detail_text TEXT NOT NULL,
                      PRIMARY KEY (detail_type));
INSERT INTO detail (detail_type, detail_text) VALUES (0, 'fast');
INSERT INTO detail (detail_type, detail_text) VALUES (1, 'full');

# be sure to also use the snortdb-extra tables if you want
# mappings for tcp flags, protocols, and ports


/*
# NIDDCore Entities
CREATE TABLE pcuser ( 	pcuser_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
						first_name VARCHAR(64),
						last_name VARCHAR(64),
                        user_id VARCHAR(25),
						job_title_id INT UNSIGNED,
						room_id INT UNSIGNED,
						phone VARCHAR(25),
						email VARCHAR(64),
						PRIMARY KEY	(pcuser_id));

CREATE TABLE jobtitle (	job_title_id INT NOT NULL AUTO_INCREMENT,
						job_title VARCHAR(64),
						PRIMARY KEY (job_title_id));


CREATE TABLE room (		room_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
						room VARCHAR(16) NOT NULL,
						building_id INT,
						PRIMARY KEY (room_id));

CREATE TABLE building (	building_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
						building VARCHAR(16),
						PRIMARY KEY	(building_id));

CREATE TABLE camera (	camera_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
						hostname VARCHAR(64),
						port SMALLINT UNSIGNED,
						user VARCHAR(64),
						password CHAR(64),
						PRIMARY KEY (camera_id));

CREATE TABLE workstation (	workstation_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
							ip INT UNSIGNED,
							pcuser_id INT UNSIGNED,
							camera_id INT UNSIGNED,
							p_coordinate DECIMAL(7, 6),
							t_coordinate DECIMAL(7, 6),
							z_coordinate DECIMAL(7, 6),
							preset INT UNSIGNED,
							PRIMARY KEY (workstation_id));

insert into jobtitle values(null, 'Student');
insert into jobtitle values(null, 'Computer Engineer');
insert into pcuser values(null, 'steven', 'aguila', '89175', 1, 1, '787-111-1111', 'sag@pupr.edu');
insert into pcuser values(null, 'erick', 'reveus', '90071', 1, 1, '787-222-2222', 'eri@pupr.edu');
insert into pcuser values(null, 'mario', 'reyes', '82748', 1, 1, '787-333-3333', 'mar@pupr.edu');
insert into pcuser values(null, 'anthony', 'torres', '77516', 1, 1, '787-444-4444', 'ant@pupr.edu');
insert into workstation values(null, '3232235530', 1, 1, -0.054444, 0.766667, 0.062500, 1);
insert into workstation values(null, '3232235531', 2, 1, -0.182222, 0.922222, 0.054688, 2);
insert into workstation values(null, '3232235532', 3, 1, -0.068889, 1.077778, 0.046875, 3);
insert into workstation values(null, '3232235533', 4, 1, -0.073889, 0.084444, 0.007812, 4);
insert into camera values(null, 167772224, 80, 'admin', 'neur0mancer');
insert into camera values(null, 167772225, 80, 'admin', 'nidd01234');
insert into building values(null, 'Laboratory');
insert into building values(null, 'Pavilion');
insert into room values(null, 'L301', 1);
insert into room values(null, 'L302A', 1);
insert into room values(null, 'P205', 2);

CREATE TABLE niddreport (	nidd_report_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
							sid 	  INT 	   UNSIGNED NOT NULL,
                      		cid 	  INT 	   UNSIGNED NOT NULL,
                      		hostname    TEXT,
                      		interface   TEXT,
                      		signature   INT      UNSIGNED NOT NULL,
                      		timestamp 	   DATETIME NOT NULL,
                      		sig_priority INT          UNSIGNED,
                      		sig_gid      INT          UNSIGNED,
                      		sig_name     VARCHAR(255),
                         	sig_rev      INT          UNSIGNED,
                      		ip_src      INT      UNSIGNED NOT NULL,
                      		ip_dst      INT      UNSIGNED NOT NULL,
                      		ip_ver      TINYINT  UNSIGNED,
                      		ip_proto 	  TINYINT  UNSIGNED,
                      		tcp_sport   SMALLINT UNSIGNED,
                      		tcp_dport   SMALLINT UNSIGNED,
                      		udp_sport   SMALLINT UNSIGNED,
                      		udp_dport   SMALLINT UNSIGNED,
                      		icmp_type   TINYINT  UNSIGNED,
                      		icmp_code   TINYINT  UNSIGNED,
                      		src_user_first_name VARCHAR(64),
                      		src_user_last_name VARCHAR(64),
                      		src_job_title VARCHAR(64),
                      		src_office_room VARCHAR(16),
                      		src_office_building VARCHAR(16),
                      		src_phone_number VARCHAR(25),
                      		src_email VARCHAR(64),
                      		src_media_path TEXT,
                      		src_media_timestamp DATETIME,
                      		dst_user_first_name VARCHAR(64),
                      		dst_user_last_name VARCHAR(64),
                      		dst_job_title VARCHAR(64),
                      		dst_office_room VARCHAR(16),
                      		dst_office_building VARCHAR(16),
                      		dst_phone VARCHAR(25),
                      		dst_email VARCHAR(64),
                      		dst_media_path TEXT,
                      		dst_media_timestamp DATETIME,
                      		PRIMARY KEY (nidd_report_id));
*/
