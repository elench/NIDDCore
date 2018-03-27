const { URL } = require('url');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
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
    await niddReport.loadNiddReport()
    const reports = niddReport.getNiddReport();

    res.render('index', {
        title: 'Events',
        reports: reports
    });
});

app.get('/report/:reportId',
ensureLoggedIn(),
(req, res, next) => {
    console.log(req.params.reportId);
    let rep = niddReport.getReportById(req.params.reportId);
    console.log('rep:', rep);
    if (rep) {
        res.render('report', {
            title: 'Alert Summary Report',
            report: rep
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

app.listen(3000, err => {
    if (err) {
        console.log(err);
    }

    console.log('Server up!');
});
