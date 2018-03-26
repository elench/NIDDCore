const { URL } = require('url');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'dbwatcher',
        password: 'nidd2018',
        database: 'niddtestdb'
    }
});
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const users = require('./db/user');
const NIDDCamera = require('./src/lib/NIDDCamera').NIDDCamera;
const decToIp = require('./src/lib/ip-decimal').decToIp;

passport.use(new Strategy((username, password, done) => {
    users.findByUsername(username, (err, user) => {
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false);
        }

        if (user.password != password) {
            return done(null, false);
        }

        return done(null, user);
    });
}));

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    users.findById(id, (err, user) => {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});


const app = express();

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-session')({
    secret: 'keyboard dog',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const report = {};
const title = {};

app.locals.report = report;

let tables;

getTables()
.then(t => {
    tables = t;
})
.catch(err => {
    console.log(err);
});

app.get('/', (req, res) => {
    if (req.user) {
        res.redirect('/index');
    }
    else {
        res.redirect('login');
    }
});

app.post('/login',
passport.authenticate('local', { failureRedirect: '/login' }),
(req, res) => {
    app.locals.user = req.user;
    res.redirect('/index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/index',
ensureLoggedIn(),
(req, res) => {
    res.render('index', {
        title: 'Tables',
        tables: tables
    });
});

app.get('/search',
ensureLoggedIn(),
(req, res) => {
    res.render('search', {
        title: 'Search Report'
    });
});

app.post('/search',
ensureLoggedIn(),
(req, res, next) => {
    if (!req.body.reportNum) {
        response.status(400).send("Must enter a report number");
        return;
    }
    getReportById(req.body.reportNum)
    .then(rep => {
        res.render('viewer', {
            title: 'Alert Summary Report',
            report: rep[0]
        });
    })
    .catch(err => {
        console.log(err);
        next();
    });
});

app.get('/camera',
ensureLoggedIn(),
(req, res) => {
    console.log(tables.cameras[0]);
    new NIDDCamera({
        hostname: decToIp(parseInt(tables.cameras[0].hostname)),
        username: tables.cameras[0].user,
        password: tables.cameras[0].password,
        port: tables.cameras[0].port
    })
    .connect()
    .then(cam => {
        return cam.get_stream_uri();
    })
    .then(uri => {
        authUri = new URL(uri);
        authUri.username = tables.cameras[0].user;
        authUri.password = tables.cameras[0].password;
        res.render('camera', {
            title: 'Camera Info',
            uri: authUri,
            connected: true
        });
    })
    .catch(err => {
        console.log(err);
        res.render('camera', { title: 'Camera Info', connected: false });
    });
});

app.post('/camera',
ensureLoggedIn(),
(req, res) => {
    console.log(req.body);
    res.sendStatus(200);
});

app.get('/logout', (req, res) => {
    app.locals.user = null;
    req.logout();
    res.redirect('/');
})

app.use((req, res) => {
    res.status(404).render('404');
});

app.listen(3000, err => {
    if (err) {
        console.log(err);
    }

    console.log('Server up!');
});


function getReport() {
    return knex('niddreport');
}

function getReportById(id) {
    return knex('niddreport')
    .where('nidd_report_id', id);
}

function getTables() {
    const tables = {};

    return knex('camera')
   .then(async table => {
       tables.cameras = table;

       table = await knex('workstation');
       tables.workstations = table;

       table = await knex('pcuser');
       tables.pcusers = table;

       table = await knex('jobtitle');
       tables.jobtitles = table;

       table = await knex('building');
       tables.buildings = table;

       table = await knex('room');
       tables.rooms = table;

       return tables;
   });
}
