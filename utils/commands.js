#!/usr/bin/env node
const req = require('request');
const fs = require('fs');
const yargs = require('yargs');
const { Cam } = require('onvif');

const argv = configureYargs(yargs);
const props = {
    hostname: argv.hostname,
    username: argv.username,
    password: argv.password,
    port: argv.port
};

const command = argv._[0];

connectCamera(props).then(cam => {
    if (command === 'get-presets') {
        return get_presets(cam);
    }
    else if (command === 'get-status') {
        return get_status(cam);
    }
    else if (command === 'get-stream-uri') {
        return get_stream_uri(cam);
    }
    else if (command === 'goto-preset') {
        return goto_preset(cam, argv.preset);
    }
    else if (command === 'set-preset') {
        return set_preset(cam, argv.name, argv.token);
    }
    else if (command === 'goto-coordinate') {
        return goto_coordinate(cam, argv.pan, argv.tilt, argv.zoom);
    }
    else if (command === 'remove-preset') {
        return remove_preset(cam, argv.preset);
    }
    else if (command === 'take-snapshot') {
        return take_snapshot(cam, argv.name, argv.path);
    }
    else if (command === 'reboot') {
        return reboot(cam);
    }
})
.then(msg => {
    console.log(msg);
})
.catch(err => {
    console.log(err);
});


function connectCamera(props) {
    return new Promise((resolve, reject) => {
        new Cam(props,
        function (err) {
            if (err) reject(err);

            resolve(this);
        });
    });
}

function get_presets(cam) {
    return new Promise((resolve, reject) => {
        cam.getPresets((err, presets) => {
            if (err) reject(err);
            resolve(presets);
        });
    });
}

function get_status(cam) {
    return new Promise((resolve, reject) => {
        cam.getStatus((err, status) => {
            if (err) reject(err);
            resolve(status);
        });
    });
}

function goto_preset(cam, preset) {
    return new Promise((resolve, reject) => {
        cam.gotoPreset({
            preset,
        },
        err => {
            if (err) reject(err);
            resolve(`Moving to preset ${preset}`)
        });
    });
}

function set_preset(cam, presetName, presetToken) {
    return new Promise((resolve, reject) => {
        cam.setPreset({
            presetName,
            presetToken
        },
        err => {
            if (err) reject(err);
            resolve(`Preset has been set to ${presetName}: ${presetToken}`);
        });
    });
}

function goto_coordinate(cam, x, y, zoom) {
    return new Promise((resolve, reject) => {
        cam.absoluteMove({ x, y, zoom },
        err => {
            if (err) reject(err);
            resolve(`Moving to coordinate (${x}, ${y}, ${zoom})`)
        });
    });
}

function get_stream_uri(cam) {
    return new Promise((resolve, reject) => {
        cam.getStreamUri({
            protocol : 'RTSP'
        },
        (err, stream) => {
            if (err) reject(err);
            resolve(stream.uri);
        });
    });
}

function remove_preset(cam, presetToken) {
    return new Promise((resolve, reject) => {
        cam.removePreset({ presetToken },
        err => {
            if (err) reject(err);
            resolve(`Removing preset ${presetToken}`);
        });
    });
}

function take_snapshot(cam, name, path) {
    return new Promise((resolve, reject) => {
        cam.getSnapshotUri(function(err, media) {
            if (err) reject(err);
            name = `${name}.jpg`;

            /*
            req.get(media.uri)
                .auth(cam.username, cam.password, false)
                .pipe(fs.createWriteStream(`${path+name}`));
            resolve(`Image saved to: ${path + name}`);
                */
            resolve(media.uri);
        });
    });
}

function reboot(cam) {
    return new Promise((resolve, reject) => {
        cam.systemReboot((err, msg) => {
            if (err) reject(err);
            resolve(msg);
        });
    });
}

function configureYargs(yargs) {
    return yargs
        .option('json', {
            alias: 'j'
        })
        .config('json', 'JSON file containing IP camera properties')
        .demandOption('json', 'You must enter path to JSON file')
        .command('get-presets', 'Display camera presets')
        .command('get-status', 'Display camera status')
        .command('get-stream-uri', 'Display stream URI')
        .command('goto-preset', 'Move camera to provided preset', yargs => {
            yargs.option('preset', {
                alias: 'p',
                describe: 'Number that identifies preset'
            })
            .demandOption('preset');
        })
        .command('remove-preset', 'Remove provided preset', yargs => {
            yargs.option('preset', {
                alias: 'p',
                describe: 'Number that identifies preset'
            })
            .demandOption('preset');
        })
        .command('set-preset', 'Set camera presets', yargs => {
            yargs.options({
                'name': {
                    alias: 'n',
                    describe: 'Name for preset'
                },
                'token': {
                    alias: 't',
                    describe: 'Number that identifies preset'
                }
            })
            .demandOption(['name', 'token']);
        })
        .command('goto-coordinate', 'goto-coordinate <pan> <tilt> <zoom>', yargs => {
            yargs.options({
                'pan': {
                    alias: 'x',
                    describe: 'Pan coordinate'
                },
                'tilt': {
                    alias: 'y',
                    describe: 'Tilt coordinate'
                },
                'zoom': {
                    alias: 'z',
                    describe: 'Zoom coordinate'
                }
            })
            .demandOption(['pan', 'tilt', 'zoom']);
        })
        .command('take-snapshot', 'Take and snapshot and save it in provided path', yargs => {
            yargs.option({
                'name': {
                    alias: 'n',
                    describe: 'Name of snapshot'
                },
                'path': {
                    alias: 'p',
                    describe: 'Path to save snapshot (defaults to CWD)',
                    default: './'
                }
            })
            .demandOption('name');
        })
        .command('reboot', 'Reboot the camera')
        .demandCommand(1, 1, 'You need to provide one command')
        .help('help')
        .argv;
}
