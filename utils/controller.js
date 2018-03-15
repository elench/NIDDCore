const http = require('http');
const readline = require('readline');
const keypress = require('keypress');
const req = require('request');
const fs = require('fs');
const yargs = require('yargs');
const Cam = require('onvif').Cam;

const argv = configureYargs(yargs);

const cam_obj = {
    hostname: argv.hostname,
    username: argv.username,
    password: argv.password,
    port: 80
};

function connect() {
    return new Cam(cam_obj, cam_callback);
}

function cam_callback(err) {
    if (err)
        throw Error(err);

    console.log('Connection Successful!');

    let cam_obj = this;
	let preset_names = [];
	let preset_tokens = [];
	let stop_timer;
	let ignore_keypress = false;
    let STOP_DELAY_MS = 50;

    cam_obj.getStreamUri({
        protocol : 'RTSP'
    }, function (err, stream, xml) {
        if (err)
            throw Error(err);

        console.log('------------------------------------------------------------');
        console.log(`Host: ${this.hostname} Port: ${this.port}`);
        console.log(`Stream: ${stream.uri}`);
        console.log('------------------------------------------------------------');

        read_and_process_keyboard();
    });

	cam_obj.getPresets({},
    function (err, stream, xml) {
        if (err)
            throw Error(err);

        console.log("GetPreset Reply");
        let count = 1;
        for (let item in stream) {
            let name = item;
            let token = stream[item];

            if (name.length == 0)
                name='no name ('+token+')';

            preset_names.push(name);
            preset_tokens.push(token);

            if (count < 9) {
                console.log(`Press key ${count} for preset "${name}"`);
                ++count;
            }
        }
    });

	function read_and_process_keyboard() {
		keypress(process.stdin);
		process.stdin.setRawMode(true);
		process.stdin.resume();

		console.log('');
		console.log('Use Cursor Keys to move camera. + and - to zoom. q to quit');

		process.stdin.on('keypress', function (ch, key) {
			/* Exit on 'q' or 'Q' or 'CTRL C' */
			if ((key && key.ctrl && key.name == 'c')
                || (key && key.name == 'q')) {
                process.exit();
            }

			if (ignore_keypress) {
				return;
			}

			if (key) {
				console.log('got "keypress"' ,key.name);
			}
            else if (ch) {
                console.log('got "keypress character"', ch);
			}

			if (key && key.name == 'up')
                move(0,1,0,'up');
			else if (key && key.name == 'down')
                move(0,-1,0,'down');
			else if (key && key.name == 'left')
                move(-1,0,0,'left');
			else if (key && key.name == 'right')
                move(1,0,0,'right');
			else if (ch  && ch       == '-')
                move(0,0,-1,'zoom out');
			else if (ch  && ch       == '+')
                move(0,0,1,'zoom in');
			else if (ch  && ch       == '=')
                move(0,0,1,'zoom in');
			else if (ch  && ch>='1' && ch <='9')
                goto_preset(ch);
            else if (ch && ch == 's')
                get_pic();
            else if (ch === '<' || ch === '>')
                set_velocity(ch);
            else {
                switch (ch) {
                case '!':
                    set_preset(1);
                    break;
                case '@':
                    set_preset(2);
                    break;
                case '#':
                    set_preset(3);
                    break;
                case '$':
                    set_preset(4);
                    break;
                case '%':
                    set_preset(5);
                    break;
                case '^':
                    set_preset(6);
                    break;
                case '&':
                    set_preset(7);
                    break;
                case '*':
                    set_preset(8);
                    break;
                case '(':
                    set_preset(9);
                    break;
                }
            }
        });
    }



	function move(x_speed, y_speed, zoom_speed, msg) {
		// Step 1 - Turn off the keyboard processing (so keypresses do not buffer up)
		// Step 2 - Clear any existing 'stop' timeouts. We will re-schedule a new 'stop' command in this function
		// Step 3 - Send the Pan/Tilt/Zoom 'move' command.
		// Step 4 - In the callback from the PTZ 'move' command we schedule the ONVIF Stop command to be executed after a short delay and re-enable the keyboard

		// Pause keyboard processing
		ignore_keypress = true;

		// Clear any pending 'stop' commands
		if (stop_timer) clearTimeout(stop_timer);

		// Move the camera
		console.log('sending move command ' + msg);
		cam_obj.continuousMove({
            x : x_speed,
            y : y_speed,
            zoom : zoom_speed } ,
        // completion callback function
        function (err, stream, xml) {
            if (err) {
                console.log(err);
            } else {
                console.log('move command sent '+ msg);
                // schedule a Stop command to run in the future
                stop_timer = setTimeout(stop,STOP_DELAY_MS);
            }
            // Resume keyboard processing
            ignore_keypress = false;
        });
	}


	function stop() {
		// send a stop command, stopping Pan/Tilt and stopping zoom
		console.log('sending stop command');
		cam_obj.stop({
            panTilt: true,
            zoom: true
        }, function (err,stream, xml) {
            if (err) {
                console.log(err);
            } else {
                console.log('stop command sent');
            }
        });
	}


	function goto_preset(number) {
		if (number > preset_names.length) {
			console.log ("No preset " + number);
			return;
		}

		console.log('sending goto preset command '+preset_names[number-1]);

		cam_obj.gotoPreset({
            preset : preset_tokens[number-1]
        } ,
        function (err, stream, xml) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('goto preset command sent ');
            }
        });
	}

    function set_preset(number) {
        cam_obj.setPreset({
            presetToken: preset_tokens[number - 1]
        }, err => {
            if (err)
                throw Error(err);
            console.log('set_preset command sent');
        });
    }

    function get_pic() {
        cam_obj.getSnapshotUri({},
            function(err, media) {
                req.get(media.uri)
                    .auth(cam_obj.username, cam_obj.password, false)
                    .pipe(fs.createWriteStream('image.jpeg'));
            }
        );
    }

    function set_velocity(ch) {
        const n = 50;
        if (ch === '<' && STOP_DELAY_MS > 50) {
            STOP_DELAY_MS += (n * -1);
            console.log(`Velocity increased to: ${STOP_DELAY_MS}`);
        }
        else if (ch === '>' && STOP_DELAY_MS < 250) {
            STOP_DELAY_MS += n;
            console.log(`Velocity increased to: ${STOP_DELAY_MS}`);
        }

        if (STOP_DELAY_MS === 250)
            console.log('Max velocity');
        else if (STOP_DELAY_MS === 50)
            console.log('Min velocity');
    }
}

function configureYargs(yargs) {
    return yargs
        .option('hostname', {
            alias: 'h',
            describe: 'Camera IP address'
        })
        .option('username', {
            alias: 'u',
            describe: 'Camera username'
        })
        .option('password', {
            alias: 'p',
            describe: 'Camera password'
        })
        .demandCommand(['hostname', 'username', 'password'],
            'Please provide camera credentials');
        .help('help')
        .argv;
}

connect();
