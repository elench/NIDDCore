const { URL } = require('url');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const bcrypt = require('bcrypt');
const users = require('./db/users');
const niddReport = require('./db/nidd-report');

passport.use(new Strategy((username, password, done) => {
    users.findByUsername(username, (err, user) => {
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false);
        }

        bcrypt.compare(password, user.password, (err, res) => {
            if (err) return done(err);

            if (res === false) {
                return done(null, false);
            }
            else {
                return done(null, user);
            }
        });
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

app.get('/', (req, res) => {
    if (req.user) {
        res.redirect('/index');
    }
    else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login',
passport.authenticate('local', { failureRedirect: '/login' }),
(req, res) => {
    app.locals.user = req.user;
    res.redirect('/index');
});

app.get('/index',
ensureLoggedIn(),
async (req, res) => {
    console.log(req.query);
    res.locals.title = 'Events';
    res.render('index');
});

app.get('/index/table',
ensureLoggedIn(),
async (req, res) => {
    const recordsTotal = await niddReport.getCount();
    console.log(recordsTotal);

    const limit = parseInt(req.query.length);
    const offset = parseInt(req.query.start);

    console.log(limit);
    console.log(offset);

    const reports = await niddReport.getNiddReport(limit, offset);
    //console.log(reports);

    for (report of reports) {
        report.timestamp = `${report.timestamp.toLocaleDateString()} ${report.timestamp.toLocaleTimeString()}`;
    }

    if (reports !== undefined) {
        res.send(JSON.stringify({
            'draw': parseInt(req.query.draw),
            'recordsFiltered': recordsTotal,
            'recordsTotal': recordsTotal,
            'data': reports
        }));
    }
});

app.get('/editUser',
ensureLoggedIn(),
(req, res) => {
    res.render('editUser', {
        title: 'Edit User Information',
        msg: ''
    });
});

app.post('/editUsername',
ensureLoggedIn(),
async (req, res) => {
    const oldUsername = app.locals.user.username;
    const username = req.body.newUser;
    const firstName = req.body.userFirstName;
    const lastName = req.body.userLastName;
    let result;

    result = await users.changeUsername(oldUsername,
        username, firstName, lastName);

    console.log(result);

    if (result === 1) {
        res.render('editUser', {
            title: 'Edit User Information',
            msg: 'Username Change Successful!'
        });
    }
    else {
        res.render('editUser', {
            title: 'Edit User Information',
            msg: 'Error! Username NOT changed.'
        });
    }

});

app.post('/editPassword',
ensureLoggedIn(),
(req, res) => {
    const username = app.locals.user.username;
    const password = req.body.newPass;
    let result;

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) return next(err);
            result = await users.changePassword(username, hash);

            console.log(result);

            if (result === 1) {
                res.render('editUser', {
                    title: 'Edit User Information',
                    msg: 'Password Change Successful!'
                });
            }
            else {
                res.render('editUser', {
                    title: 'Edit User Information',
                    msg: 'Error! Password NOT changed.'
                });
            }

        });
    });

});

app.get('/report/:reportId',
ensureLoggedIn(),
async (req, res, next) => {
    //console.log(req.params.reportId);
    let rep = await niddReport.getReportById(req.params.reportId);
    console.log('rep:', rep);
    if (rep) {
        res.render('report', {
            title: 'Alert Summary Report',
            report: rep,
            fullName: users.getFullName(app.locals.user.id)
        });
    }
    else {
        next()
    }
});

app.get('/logout', (req, res) => {
    app.locals.user = null;
    req.logout();
    res.redirect('/');
})

app.use((req, res) => {
    res.status(404).render('404');
});

app.listen(8080, err => {
    if (err) {
        console.log(err);
    }

    console.log('Server up!');
});
