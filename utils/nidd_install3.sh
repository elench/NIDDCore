#!/bin/bash
# Title: NIDD IDS Installation Script
# Description: Install automatically Snort + Barnyard2 + Snorby + ...
# Nodejs + NiddCore dependencies
# Tested with Debian Stretch 9.4
# Version: 1.0
# Last update: 11/03/18

# BASH COLOR CODE
RED='\033[0;31m'
ORANGE='\033[0;205m'
YELLOW='\033[0;93m'
GREEN='\033[0;32m'
CYAN='\033[0;96m'
BLUE='\033[0;34m'
VIOLET='\033[0;35m'
NOCOLOR='\033[0m'
BOLD='\033[1m'

# DATABASE CONFIGURATION VARIABLES
NIDD_DB_HOSTNAME=localhost
MYSQL_ROOT_PASSWORD=s3cr3t
NIDD_DB_NAME=nidddb
NIDD_DB_ADMIN_USER=niddadmin
NIDD_DB_BARNYARD2_USER=barnyard2
NIDD_DB_WATCHER_USER=dbwatcher
NIDD_DB_SNORBY_USER=snorby
NIDD_DB_USERS_PASSWORD=nidd2018
# barnyard2 created database served as test
# barnyard2 shall point the same database as snorby once the niddcore is ready
# use something like sudo vim /etc/snort/barnyard2.conf to change the database to which Barnyard2 is writing
# simply change the vlaue of $NIDD_TEST_DB_NAME to the one of $NIDD_DB_NAME
NIDD_TEST_DB_NAME=niddtestdb

#INSTALLATION VARIABLES
#Ex. ens0 eho0, run <ip link show> to display network interfaces
INTERFACE=ens33
MACHINE=$(echo $(uname -m))
SNORT=snort-2.9.11.1
DAQ=daq-2.0.6

function update_upgrade() {
	sudo echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Updating and Upgrading repositories and setting few things up...\n\n"
	sudo apt-get -qq -o Dpkg::Progress-Fancy="1" update
	sudo apt-get -qq -o Dpkg::Progress-Fancy="1" upgrade
	sudo apt-get -qq -o Dpkg::Progress-Fancy="1" install git curl wget vim
}

function snort_install() {
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Initiating ${BOLD}Snort${NOCOLOR} installation.\n"
	echo -ne "\n\t${YELLOW}[!] WARNING:${NOCOLOR} Press ${BOLD}ENTER${NOCOLOR} to continue. "
	read -n 1 -s
	echo -ne "\n\n"
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Installing SNORT and dependencies.\n\n"
	sudo apt-get -qq -o Dpkg::Progress-Fancy="1" install build-essential libpcap-dev libpcre3-dev libdumbnet-dev bison flex zlib1g-dev locate

	#Downloading DAQ and SNORT
	cd $HOME && mkdir snort_src
	cd $HOME/snort_src

	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Downloading ${BOLD}$DAQ${NOCOLOR}.\n\n"
	wget --no-check-certificate -P $HOME/snort_src https://snort.org/downloads/snort/$DAQ.tar.gz
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Downloading ${BOLD}$SNORT${NOCOLOR}.\n\n"
	wget --no-check-certificate -P $HOME/snort_src https://snort.org/downloads/snort/$SNORT.tar.gz

	#Installing DAQ
	cd $HOME/snort_src
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Installing ${BOLD}$DAQ${NOCOLOR}.\n\n"
	tar xvfz $DAQ.tar.gz > /dev/null 2>&1
	mv $HOME/snort_src/daq-*/ $HOME/snort_src/daq
	cd $HOME/snort_src/daq
	./configure
	make > /dev/null 2>&1
	sudo make install > /dev/null 2>&1
	echo -ne "\n\t${GREEN}[+] INFO:${NOCOLOR} ${BOLD}$DAQ${NOCOLOR} installed successfully.\n\n"

	#Installing SNORT
	cd $HOME/snort_src
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Installing ${BOLD}$SNORT${NOCOLOR}.\n\n"
	tar xvfz $SNORT.tar.gz
	rm -r *.tar.gz
	mv snort-*/ snort
	cd snort
	./configure --enable-sourcefire  > /dev/null 2>&1
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Hold on...\n"
	 make > /dev/null 2>&1
	 sudo make install > /dev/null 2>&1
	echo -ne "\n\t${GREEN}[+] INFO:${NOCOLOR} ${BOLD}$SNORT${NOCOLOR} installed successfully.\n\n"
	cd ..

	sudo ldconfig  > /dev/null 2>&1
	sudo ln -s /usr/local/bin/snort /usr/sbin/snort

	#Adding SNORT user and group for running SNORT
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Adding user and group ${BOLD}SNORT${NOCOLOR}.\n\n"
	sudo groupadd snort
	sudo useradd snort -r -s /sbin/nologin -c SNORT_IDS -g snort
	sudo mkdir /etc/snort > /dev/null 2>&1
	sudo mkdir /etc/snort/rules > /dev/null 2>&1
	sudo mkdir /etc/snort/preproc_rules > /dev/null 2>&1
	sudo touch /etc/snort/rules/white_list.rules /etc/snort/rules/black_list.rules /etc/snort/rules/local.rules > /dev/null 2>&1
	sudo mkdir /var/log/snort > /dev/null 2>&1
	sudo mkdir /usr/local/lib/snort_dynamicrules > /dev/null 2>&1
	sudo chmod -R 5775 /etc/snort > /dev/null 2>&1
	sudo chmod -R 5775 /var/log/snort > /dev/null 2>&1
	sudo chmod -R 5775 /usr/local/lib/snort_dynamicrules > /dev/null 2>&1
	sudo chown -R snort:snort /etc/snort > /dev/null 2>&1
	sudo chown -R snort:snort /var/log/snort > /dev/null 2>&1
	sudo chown -R snort:snort /usr/local/lib/snort_dynamicrules > /dev/null 2>&1

	sudo cp ~/snort_src/snort/etc/*.conf* /etc/snort > /dev/null 2>&1
	sudo cp ~/snort_src/snort/etc/*.map /etc/snort > /dev/null 2>&1

	sudo sed -i 's/include \$RULE\_PATH/#include \$RULE\_PATH/' /etc/snort/snort.conf

	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} /var/log/snort and /etc/snort created and configurated.\n\n"
	sudo /usr/local/bin/snort -V
	echo -ne "\n\t${GREEN}[+] INFO:${NOCOLOR} ${BOLD}SNORT${NOCOLOR} is successfully installed and configurated!"

}

function snort_edit() {

	echo -ne "\n\t${YELLOW}[!] INFO:${NOCOLOR} Now it's time to edit the ${BOLD}SNORT${NOCOLOR} configuration file.\n"
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Add your ${BOLD}HOME_NET${NOCOLOR} address [Ex: 192.168.1.0/24]"
	echo -ne "\n\t${YELLOW}[!] WARNING:${NOCOLOR} Press ${BOLD}ENTER${NOCOLOR} to continue. It will open the file in Vim for you."
	read -n 1 -s
	sudo vim /etc/snort/snort.conf -c "/ipvar HOME_NET"
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Your ${BOLD}EXTERNAL_NET$	{NOCOLOR} will be set to ${BOLD}any${NOCOLOR} for now\n\n\n"

	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Adding ${BOLD}RULE_PATH${NOCOLOR} to snort.conf file\n"
	sudo sed -i 's/RULE_PATH\ \.\.\//RULE_PATH\ \/etc\/snort\//g' /etc/snort/snort.conf
	sudo sed -i 's/_LIST_PATH\ \.\.\//_LIST_PATH\ \/etc\/snort\//g' /etc/snort/snort.conf

	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Adding ${BOLD}Snort Community Rules${NOCOLOR}\n"
	echo "# Community Rules enabled" | sudo tee -a /etc/snort/snort.conf
	echo "include /etc/snort/rules/community.rules" | sudo tee -a /etc/snort/snort.conf

	#Community Rules
	cd $HOME/snort_src
	wget --no-check-certificate -P $HOME/snort_src/ https://www.snort.org/downloads/community/community-rules.tar.gz
	tar -zxvf /$HOME/snort_src/community-rules.tar.gz > /dev/null 2>&1
	sudo cp /$HOME/snort_src/community-rules/*.rules /etc/snort/rules/ > /dev/null 2>&1
	sudo cp /$HOME/snort_src/community-rules/sid\-msg.map /etc/snort/ > /dev/null 2>&1

	#Adding permissions
	sudo chmod 777 /etc/snort/rules/*.rules
	sudo chmod 777 /etc/snort/sid\-msg.map

	echo -ne "\n\t${YELLOW}[!] IMPORTANT:${NOCOLOR} If you add other rules file, remember to edit your ${BOLD}/etc/snort/snort.conf${NOCOLOR} later and enable the rules you need by uncommenting the corresponding lines"
	echo -ne "\n\t${YELLOW}[!] EXAMPLE:${NOCOLOR} If you want to enable the ${BOLD}Exploit rules${NOCOLOR}, remove the ${RED}${BOLD}#${NOCOLOR}"
	echo -ne "\n\t\t${RED}#${NOCOLOR}include \$RULE_PATH/exploit.rules ${GREEN}-->${NOCOLOR} include \$RULE_PATH/exploit.rules\n\n"
	echo -ne "\n\t\t${YELLOW}[!] WARNING:${NOCOLOR} Press ${BOLD}ENTER${NOCOLOR} to continue. "
	read -n 1 -s
	echo -ne "\n\n"


	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Enabling ${BOLD}local.rules${NOCOLOR} and adding Ping, Telnet, FTP detection rules...\n"
	sudo sed -i 's/#include \$RULE\_PATH\/local\.rules/include \$RULE\_PATH\/local\.rules/' /etc/snort/snort.conf
	sudo chmod 766 /etc/snort/rules/local.rules
	sudo echo 'alert icmp any any -> $HOME_NET any (msg:"Ping atack"; sid:10000001; rev:001;)' >> /etc/snort/rules/local.rules
	sudo echo 'alert icmp $HOME_NET any -> any any (msg:"Ping attack to from inside"; sid:10000002; rev:001;)' >> /etc/snort/rules/local.rules
	sudo echo 'alert tcp any any -> $HOME_NET 21 (msg:"FTP connection attempt"; sid:10000003; rev:001;)' >> /etc/snort/rules/local.rules
 	sudo echo 'alert tcp any any -> $HOME_NET 23 (msg:"TELNET connection attempt"; sid:10000004; rev:001;)' >> /etc/snort/rules/local.rules

	sudo sed -i 's/# unified2/output unified2: filename snort.u2, limit 128/g' /etc/snort/snort.conf
}

function snort_test() {

	echo -ne "\n\t${YELLOW}[!] WARNING:${NOCOLOR} Starting ${BOLD}SNORT${NOCOLOR} in test mode. Checking configuration file.... \n"
	sudo snort -T -c /etc/snort/snort.conf

	# echo -ne "\n\t${YELLOW}[!] WARNING:${NOCOLOR} Attempting to test ${BOLD}ICMP${NOCOLOR} rule in ${BOLD}$INTERFACE${NOCOLOR}. Send a PING to your ${BOLD}SNORT${NOCOLOR} machine. Press ${BOLD}Ctrl+C${NOCOLOR} once and wait few seconds to stop the process...\n "
	# echo -ne "\n\t${YELLOW}[!] WARNING:${NOCOLOR} Press ${BOLD}ENTER${NOCOLOR} to continue. "
	# read -n 1 -s
	# sudo snort -A console -q -u snort -g snort -c /etc/snort/snort.conf -i $INTERFACE
	# killall -9 snort

}

function database_install(){
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Initiating ${BOLD}MariaDB${NOCOLOR} installation.\n"
	echo -ne "\n\t${YELLOW}[!] WARNING:${NOCOLOR} Press ${BOLD}ENTER${NOCOLOR} to continue. "
	read -n 1 -s
	echo -ne "\n\n"
	#sudo apt install debconf-utils -y
	sudo apt-get -qq remove --purge "mysql*" "mariadb*" > /dev/null 2>&1
	sudo apt-get -qq -o Dpkg::Progress-Fancy="1" autoremove
	sudo apt-get -qq -o Dpkg::Progress-Fancy="1" autoclean

	sudo apt-get -qq -o Dpkg::Progress-Fancy="1" install software-properties-common dirmngr

	sudo apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xF1656F24C74CD1D8

	sudo add-apt-repository 'deb [arch=amd64,i386,ppc64el] http://mirrors.syringanetworks.net/mariadb/repo/10.2/debian stretch main'

	sudo apt-get -qq -o Dpkg::Progress-Fancy="1" udpate

	export DEBIAN_FRONTEND=noninteractive
	sudo debconf-set-selections <<< "mariadb-server mariadb-server/root_password password ${MYSQL_ROOT_PASSWORD}"
	sudo debconf-set-selections <<< "mariadb-server mariadb-server/root_password_again password ${MYSQL_ROOT_PASSWORD}"
	sudo debconf-set-selections <<< "mariadb-server mariadb-server/postrm_remove_databases boolean false"

	sudo apt-get -qq -o Dpkg::Progress-Fancy="1" install mariadb-server mariadb-common libmariadb-dev

	#secure database installation
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Securing Database\n\n"
	sudo mysql -e "UPDATE mysql.user SET Password=PASSWORD('${MYSQL_ROOT_PASSWORD}') WHERE User='root';" > /dev/null 2>&1
	sudo mysql --user=root -p${MYSQL_ROOT_PASSWORD} << _EOF_
	UPDATE mysql.user SET plugin = '' WHERE user = 'root' AND host = 'localhost';
	DELETE FROM mysql.user WHERE User='';
  DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
  DROP DATABASE IF EXISTS test;
  DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';
	GRANT ALL PRIVILEGES ON *.* TO 'root'@'${NIDD_DB_HOSTNAME}' WITH GRANT OPTION;
  FLUSH PRIVILEGES;
_EOF_

	sudo systemctl start mariadb

	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Creating NIDD Databases and users\n\n"
	sudo mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "CREATE DATABASE IF NOT EXISTS ${NIDD_DB_NAME} /*\!40100 DEFAULT CHARACTER SET utf8 */;"
	sudo mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "CREATE DATABASE IF NOT EXISTS ${NIDD_TEST_DB_NAME} /*\!40100 DEFAULT CHARACTER SET utf8 */;"
	sudo mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "CREATE USER IF NOT EXISTS '${NIDD_DB_ADMIN_USER}'@'${NIDD_DB_HOSTNAME}';"
	sudo mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "CREATE USER IF NOT EXISTS '${NIDD_DB_WATCHER_USER}'@'${NIDD_DB_HOSTNAME}';"
	sudo mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "CREATE USER IF NOT EXISTS '${NIDD_DB_BARNYARD_USER}'@'${NIDD_DB_HOSTNAME}';"
	sudo mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "CREATE USER IF NOT EXISTS '${NIDD_DB_SNORBY_USER}'@'${NIDD_DB_HOSTNAME}';"
	sudo mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "UPDATE mysql.user SET Password=PASSWORD('${NIDD_DB_USERS_PASSWORD}') WHERE User='${NIDD_DB_ADMIN_USER}';"
	sudo mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "UPDATE mysql.user SET Password=PASSWORD('${NIDD_DB_USERS_PASSWORD}') WHERE User='${NIDD_DB_WATCHER_USER}';"
	sudo mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "UPDATE mysql.user SET Password=PASSWORD('${NIDD_DB_USERS_PASSWORD}') WHERE User='${NIDD_DB_BARNYARD_USER}';"
	sudo mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "UPDATE mysql.user SET Password=PASSWORD('${NIDD_DB_USERS_PASSWORD}') WHERE User='${NIDD_DB_SNORBY_USER}';"
	sudo mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "GRANT ALL PRIVILEGES ON ${NIDD_DB_NAME}.* TO '${NIDD_DB_ADMIN_USER}'@'${NIDD_DB_HOSTNAME}' WITH GRANT OPTION;"
	sudo mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "GRANT ALL PRIVILEGES ON ${NIDD_DB_NAME}.* TO '${NIDD_DB_WATCHER}'@'${NIDD_DB_HOSTNAME}' WITH GRANT OPTION;"
	sudo mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "GRANT ALL PRIVILEGES ON ${NIDD_DB_NAME}.* TO '${NIDD_DB_BARNYARD_USER}'@'${NIDD_DB_HOSTNAME}' WITH GRANT OPTION;"
	sudo mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "GRANT ALL PRIVILEGES ON ${NIDD_DB_NAME}.* TO '${NIDD_DB_SNORBY_USER}'@'${NIDD_DB_HOSTNAME}' WITH GRANT OPTION;"
	sudo mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "GRANT ALL PRIVILEGES ON ${NIDD_TEST_DB_NAME}.* TO '${NIDD_DB_ADMIN_USER}'@'${NIDD_DB_HOSTNAME}' WITH GRANT OPTION;"
	sudo mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "GRANT ALL PRIVILEGES ON ${NIDD_TEST_DB_NAME}.* TO '${NIDD_DB_BARNYARD_USER}'@'${NIDD_DB_HOSTNAME}' WITH GRANT OPTION;"
	sudo mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "FLUSH PRIVILEGES;"
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Database configured!\n\n"
}

function barnyard2_install() {
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Begin the installation of ${BOLD}BARNYARD2${NOCOLOR}.\n"
	echo -ne "\n\t${YELLOW}[!] WARNING:${NOCOLOR} Press ${BOLD}ENTER${NOCOLOR} to continue. "
	read -n 1 -s
	echo -ne "\n\n"
	sudo apt-get -qq -o Dpkg::Progress-Fancy="1" install autoconf libtool libdnet checkinstall yagiuda libdnet-dev locate default-libmysqlclient-dev

	cd $HOME/snort_src
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Downloading ${BOLD}BARNYARD2${NOCOLOR}.\n\n"
	git clone https://github.com/firnsy/barnyard2.git
	cd $HOME/snort_src/barnyard2

	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Hold on..."
	autoreconf -fvi -I ./m4 > /dev/null 2>&1

	ln -s /usr/include/dumbnet.h dnet.h

	sudo ldconfig > /dev/null 2>&1

	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Installing ${BOLD}BARNYARD2${NOCOLOR}2.\n\n"

	if [ "$MACHINE" == "x86_64" ]; then
		./configure --with-mysql --with-mysql-libraries=/usr/lib/x86_64-linux-gnu
	elif [ "$MACHINE" == "i386" ]; then
		./configure --with-mysql --with-mysql-libraries=/usr/lib/i386-linux-gnu
	else
		./configure --with-mysql --with-mysql-libraries=/usr/lib/arm-linux-gnueabihf
	fi
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Hold on..."
	make >/dev/null 2>&1
	sudo make install > /dev/null 2>&1

	echo -ne "\n\t${GREEN}[+] INFO:${NOCOLOR} ${COLOR}BARNYARD2${NOCOLOR} installed successfully.\n\n"

	sudo cp etc/barnyard2.conf /etc/snort > /dev/null 2>&1
	sudo mkdir /var/log/barnyard2 > /dev/null 2>&1
	sudo chown snort.snort /var/log/barnyard2 > /dev/null 2>&1
	sudo touch /var/log/snort/barnyard2.waldo > /dev/null 2>&1
	sudo chown snort.snort /var/log/snort/barnyard2.waldo > /dev/null 2>&1
	#sudo touch /etc/snort/sid-msg.map > /dev/null 2>&1

	mysql -u${NIDD_DB_BARNYARD2_USER} -p${NIDD_DB_USERS_PASSWORD} -D${NIDD_TEST_DB_NAME} < $HOME/snort_src/barnyard2/schemas/create_mysql

	echo "output database: log, mysql, user=${NIDD_DB_BARNYARD2_USER} password=${NIDD_DB_USERS_PASSWORD} dbname=${NIDD_DB_NAME} host=${NIDD_DB_HOSTNAME}" | sudo tee -a /etc/snort/barnyard2.conf
	sudo chmod 766 /etc/snort/barnyard2.conf
	sudo chmod o-r /etc/snort/barnyard2.conf

	barnyard2 -V
	echo -ne "\n\t${GREEN}[+] INFO:${NOCOLOR} ${BOLD}BARNYARD2${NOCOLOR} is successfully installed and configurated!\n\n"
}

function snorby_install(){
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Initiating ${BOLD}Snorby${NOCOLOR} installation.\n"
	echo -ne "\n\t${YELLOW}[!] WARNING:${NOCOLOR} Press ${BOLD}ENTER${NOCOLOR} to continue."
	read -n 1 -s
	echo -ne "\n\n"
	#Install Snorby prerequisites
	sudo apt-get -qq -o Dpkg::Progress-Fancy="1" install libgdbm-dev libncurses5-dev git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev software-properties-common libffi-dev
	#Install Ruby Gems prerequisites
	sudo apt-get -qq -o Dpkg::Progress-Fancy="1" install imagemagick libyaml-dev libxml2-dev libxslt-dev git libssl-dev libmysqlclient-dev
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Sit tight...\n\n"
	sudo apt-get -qq -o Dpkg::Progress-Fancy="1" install apache2 postgresql postgresql-server-dev-9.6 libpq-dev ruby ruby-dev rails
	echo "gem: --no-rdoc --no-ri" | sudo tee -a ~/.gemrc
	sudo sh -c "echo gem: --no-rdoc --no-ri > /etc/gemrc"

	sudo gem install bundler > /dev/null 2>&1
	sudo gem install wkhtmltopdf > /dev/null 2>&1
	sudo gem install railties > /dev/null 2>&1
 	sudo gem install rake --version=11.1.2 > /dev/null 2>&1

	cd $HOME/snort_src/
 	git clone https://github.com/Snorby/snorby.git
 	sudo cp -r snorby/* /var/www/html
	cd /var/www/html
  sudo bundle install --quiet

echo -e """# Snorby Database Configuration
#
# Please set your database password/user below
# NOTE: Indentation is important.
#
snorby: &snorby
  adapter: mysql
  username: ${NIDD_DB_SNORBY_USER}
  password: \"${NIDD_DB_USERS_PASSWORD}\"
  host: ${NIDD_DB_HOSTNAME}

development:
  database: ${NIDD_DB_NAME}
  <<: *snorby

test:
  database: ${NIDD_DB_NAME}
  <<: *snorby

production:
  database: ${NIDD_DB_NAME}
  <<: *snorby""" | sudo tee --append /var/www/html/config/database.yml

		echo -e """#
# Production
#
# Change the production configuration for your environment.
#
# USE THIS!
#
production:
# in case you want to run snorby under a suburi/suburl under eg. passenger:
  baseuri: ''
# baseuri: '/snorby'
  domain: localhost:3000
  wkhtmltopdf: /usr/local/bin/wkhtmltopdf
  ssl: false
  mailer_sender: 'nidd@pupr.edu'
  geoip_uri: \"http://geolite.maxmind.com/download/geoip/database/GeoLiteCountry/GeoIP.dat.gz\"
  rules:
    - \"/etc/snort/rules\"
  authentication_mode: database
# If timezone_search is undefined or false, searching based on time will
# use UTC times (historical behavior). If timezone_search is true
# searching will use local time.
# timezone_search: true
# uncomment to set time zone to time zone of box from /usr/share/zoneinfo, e.g. \"America/Cancun\"
  time_zone: 'America/Puerto_Rico'

#
# Only Use For Development
#
development:
  baseuri: ''
  domain: localhost:3000
  wkhtmltopdf: /usr/local/bin/wkhtmltopdf
  ssl: false
  mailer_sender: 'nidd@pupr.edu'
  geoip_uri: \"http://geolite.maxmind.com/download/geoip/database/GeoLiteCountry/GeoIP.dat.gz\"
  rules:
   - \"/etc/snort/rules\"
  authentication_mode: database
# uncomment to set time zone to time zone of box from /usr/share/zoneinfo, e.g. \"America/Cancun\"
  time_zone: 'America/Puerto_Rico'
# authentication_mode: cas
# cas_config:
# 	base_url: https://auth.server.com.br/
#  	login_url: https://auth.server.com.br/login?domain=server
#  	logout_url: https://auth.server.com.br/logout?domain=server

#
# Only Use For Testing
#
test:
  baseuri: ''
  domain: localhost:3000
  wkhtmltopdf: /usr/local/bin/wkhtmltopdf
  mailer_sender: 'nidd@pupr.edu'
  geoip_uri: \"http://geolite.maxmind.com/download/geoip/database/GeoLiteCountry/GeoIP.dat.gz\"
  authentication_mode: database""" | sudo tee --append /var/www/html/config/snorby_config.yml

	sudo bundle update
	sudo bundle install
 	sudo bundle exec rake snorby:setup
	#RAILS_ENV=production bundle exec rake snorby:setup

	echo "run < sudo bundle exec rails server -e production -b 0.0.0.0> to start the application >"
}

function service_create() {
	echo -ne "\n\t${YELLOW}[!] IMPORTANT:${NOCOLOR} Creating ${BOLD}snort, barnyard2 and snorby${NOCOLOR} services\n\n"
	service_add
	sudo systemctl enable mysql && sudo systemctl enable snort && sudo systemctl enable barnyard2  && sudo systemctl enable snorby
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Now you can run ${BOLD}sudo systemctl {start|stop|status} snort ${NOCOLOR}.\n"
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Now you can run ${BOLD}sudo systemctl {start|stop|status} barnyard2 ${NOCOLOR}.\n\n"
}

function service_add() {
	if [ -f /etc/snort/barnyard2.conf ]; then
	sudo echo """[Unit]
Description=Barnyard2 Daemon
Requires=mysql.service
After=syslog.target network.target mysql.service
[Service]
Type=simple
ExecStart=/usr/local/bin/barnyard2 -c /etc/snort/barnyard2.conf -d /var/log/snort -f snort.u2 -q -w /var/log/snort/barnyard2.waldo -g snort -u snort -D -a /var/log/snort/archived_logs
[Install]
WantedBy=multi-user.target""" | sudo tee -a /lib/systemd/system/barnyard2.service
	fi

	sudo echo """[Unit]
Description=Snort NIDS Daemon
After=syslog.target network.target
[Service]
Type=simple
ExecStart=/usr/local/bin/snort -q -u snort -g snort -c /etc/snort/snort.conf -i $INTERFACE
[Install]
WantedBy=multi-user.target""" | sudo tee -a /lib/systemd/system/snort.service

	sudo echo """[Unit]
Description=Snorby Worker Daemon
Requires=apache2.service
After=syslog.target network.target apache2.service
[Service]
Type=forking
WorkingDirectory=/var/www/html/
ExecStart=/usr/bin/ruby script/delayed_job start && cd /var/www/html && /usr/local/bin/rails runner 'Snorby::Jobs::SensorCacheJob.new(false).perform; Snorby::Jobs::DailyCacheJob.new(false).perform'
[Install]
WantedBy=multi-user.target""" | sudo tee -a /lib/systemd/system/snorby.service
}

function niddcore_install(){
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Initiating the ${BOLD}NIDDCore${NOCOLOR} setup.\n\n"
	echo -ne "\n\t${YELLOW}[!] WARNING:${NOCOLOR} Press ${BOLD}ENTER${NOCOLOR} to continue. "
	read -n 1 -s
	echo -ne "\n\n"
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Installing Nodejs and creating the project\n\n"
	echo """
	CREATE TABLE IF NOT EXISTS pcusers (
		pcuser_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
		first_name VARCHAR(64),
		last_name VARCHAR(64),
        user_id VARCHAR(25),
		job_title_id INT UNSIGNED,
		room_id INT UNSIGNED,
		phone VARCHAR(25),
		email VARCHAR(64),
		PRIMARY KEY	(pcuser_id));

	CREATE TABLE IF NOT EXISTS jobtitles (
		job_title_id INT NOT NULL AUTO_INCREMENT,
		job_title VARCHAR(64),
		PRIMARY KEY (job_title_id));

	CREATE TABLE IF NOT EXISTS rooms (
		room_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
		room VARCHAR(16) NOT NULL,
		building_id INT,
		PRIMARY KEY (room_id));

	CREATE TABLE IF NOT EXISTS buildings (
		building_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
		building VARCHAR(16),
		PRIMARY KEY	(building_id));

	CREATE TABLE IF NOT EXISTS cameras (
		camera_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
		hostname VARCHAR(64),
		port SMALLINT UNSIGNED,
		username VARCHAR(64),
		password CHAR(64),
		PRIMARY KEY (camera_id));

	CREATE TABLE IF NOT EXISTS workstations (
		workstation_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
		ip INT UNSIGNED,
		pcuser_id INT UNSIGNED,
		camera_id INT UNSIGNED,
		p_coordinate DECIMAL(3,2),
		t_coordinate DECIMAL(3,2),
		z_coordinate DECIMAL(3,2),
		preset INT UNSIGNED,
		PRIMARY KEY (workstation_id));

	CREATE TABLE IF NOT EXISTS niddreports (
		nidd_report_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
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
		src_phone VARCHAR(25),
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
	""" | mysql -u${NIDD_DB_ADMIN_USER} -p${NIDD_DB_USERS_PASSWORD} -D${NIDD_TEST_DB_NAME}

    echo """
[mysqld]
server-id	 = 1
binlog_format	 = row
log_bin		 = /var/log/mysql/mysql-bin.log

binlog_do_db	 = niddtestdb
expire_logs_days = 10
max_binlog_size	 = 100M""" | sudo tee -a /etc/mysql/my.cnf

	sudo apt-get -qq -o Dpkg::Progress-Fancy="1" install curl build-essential git
	curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
	sudo apt-get -qq -o Dpkg::Progress-Fancy="1" install nodejs
	sudo apt -y -q autoremove
	cd $HOME/
    git clone https://github.com/elench/NIDDCore
    cd ./NIDDCore
    npm install
	#mkdir niddApp && cd niddApp
	#touch index.js
	#npm init --yes
	#npm install --save request mysql2 mysql-events queue onvif knex keypress tail yards zeromq

	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} NIDDCore new home is ready!.\n\n"
}

function websnort_install() {
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Initiating ${BOLD}Websnort${NOCOLOR} installation.\n"
	echo -ne "\n\t${YELLOW}[!] WARNING:${NOCOLOR} Press ${BOLD}ENTER${NOCOLOR} to continue. "
	read -n 1 -s
	echo -ne "\n\n"
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Installing ${BOLD}Websnort${NOCOLOR} dependencies.\n\n"
	sudo apt-get -qq -o Dpkg::Progress-Fancy="1" install python-pip
	sudo pip install websnort > /dev/null 2>&1

	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Now you can run ${BOLD}WEBSNORT${NOCOLOR} on ${BOLD}http://localhost:8000${NOCOLOR}.\n"
	echo "with < sudo websnort -p 8000 >"

	#echo "sudo websnort -p 80 > /dev/null 2>&1 &" >> $HOME/.bashrc
	echo -ne "\n\t${GREEN}[+] INFO:${NOCOLOR} ${BOLD}WEBSNORT${NOCOLOR} is successfully installed and configured!\n"
	echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} ${BOLD}WEBSNORT${NOCOLOR} won't start at system boot."
	echo -ne "\n\t${YELLOW}[!] INFO:${NOCOLOR} run ${BOLD}sudo websnort -p 80${NOCOLOR} everytime you need ${BOLD}WEBSNORT${NOCOLOR}.\n\n"
}

function system_reboot() {
	while true; do
		echo -ne "\n\t${YELLOW}[!] IMPORTANT:${NOCOLOR} Would you like to ${BOLD}REBOOT${NOCOLOR} now? [Y/n]: "
		read OPTION
		case $OPTION in
			Y|y )
				echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Rebooting...\n\n"
				sleep 1
				sudo reboot
				break
				;;
			N|n )
				echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR} Exiting from the installer and starting the services.\n\n"
				sudo systemctl start mysql && sudo systemctl start snort && sudo systemctl start barnyard2  && sudo systemctl start snorby
				echo -ne "\n\t${CYAN}[i] INFO:${NOCOLOR}All service successfully started! Enjoy ${BOLD}NIDD${NOCOLOR}!\n\n"
				break
				;;
			* )
				echo -ne "\n\t${RED}[-] ERROR:${NOCOLOR} Invalid option.\n\n"
				;;
		esac
	done
}

function main() {
	update_upgrade
	snort_install
	snort_edit
	snort_test
	database_install
	barnyard2_install
	snorby_install
	service_create
	niddcore_install
	websnort_install
	system_reboot
}

if [[ -z ${INTERFACE+x} ]] ; then
    echo -ne "\n\t\t${RED}[-] ERROR:${NOCOLOR} ${BOLD}Interface${NOCOLOR} is mandatory\n";
    exit 0;
	else
		main
fi
