import express from 'express';
import { isLoggedIn } from '../controllers/auth.controller.js';
import newAdvert, { listAdverts, listUserAdverts, getAdvert, updateAdvert, deleteAdvert } from '../controllers/advert.controller.js';
import { listUsers } from '../controllers/user.controller.js';


const routes = express.Router();

routes.get('/', [isLoggedIn, listAdverts, listUsers], (req, res) => {
    res.render('index', {
        user: req.user,
        users: req.users,
        list: req.list,
        searchAdvert: req.searchAdvert
    });
});

routes.get('/register', (req, res) => {
    res.render('register');
});

routes.get('/login', (req, res) => {
    res.render('login');
});

routes.get('/newAdvert', isLoggedIn, (req, res) => {
    res.render('new-advert', {
        user: req.user
    });
});

routes.get('/profile', [isLoggedIn, listUserAdverts], (req, res) => {
    if (req.list) {
        res.render('profile', {
            list: req.list,
            user: req.user
        });
    } else {
        res.redirect('/login');
    }
}
);

routes.post('/newAdvert', [isLoggedIn, newAdvert], (req, res) => {
    res.render('new-advert', {
        user: req.user
    });
});

routes.get('/editAdvert/:id', [isLoggedIn, getAdvert], (req, res) => {
    const user = req.user;
    const advert = req.advert
    if (advert) {
        res.render('edit-advert', {
            user,
            advert
        });
    } else {
        res.redirect('/login');
    }
});

routes.post('/editAdvert/:id', [isLoggedIn, updateAdvert], (req, res) => {
    const user = req.user;
    const advert = req.advert
    if (advert) {
        res.render('edit-advert', {
            user,
            advert
        });
    } else {
        res.redirect('/login');
    }
});

routes.get('/deleteAdvert/:id', deleteAdvert);

routes.post('/', [isLoggedIn, listAdverts, listUsers], (req, res) => {
    res.render('index', {
        user: req.user,
        users: req.users,
        list: req.list,
        searchAdvert: req.searchAdvert
    });
});


export default  routes;