import db from '../app.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

const newAdvert = async (req, res, next) => {
    const { ilmoitus_laji, ilmoitus_nimi, ilmoitus_kuvaus } = req.body;
    const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
    );
    db.query(
        "INSERT INTO ilmoitukset SET ?",
        {
            ilmoitus_laji,
            ilmoitus_nimi,
            ilmoitus_kuvaus,
            ilmoitus_paivays: new Date(Date.now()),
            ilmoittaja_id: decoded.id,
        },
        (error, results) => {
            if (error) {
                console.log("Error in query: " + error);
            } else {
                res.redirect("/");
            }
        }
    );
};

const listAdverts = async (req, res, next) => {
    let { searchAdvert } = req.body;
    if (searchAdvert === "") {
        searchAdvert = undefined;
    }
    try {
        if (searchAdvert != undefined) {
            db.query(
                "SELECT * FROM ilmoitukset WHERE MATCH(ilmoitus_nimi, ilmoitus_kuvaus) AGAINST (? IN BOOLEAN MODE)",
                [searchAdvert + "*"],
                async (error, results) => {
                    req.list = results;
                    req.searchAdvert = searchAdvert;
                    next();
                });
        } else {
            db.query("SELECT * FROM ilmoitukset", async (error, results) => {
                req.list = results;
                next();
            });}
    } catch (error) {
        console.log(error);
    }};

const listUserAdverts = async (req, res, next) => {
    try {
        const decoded = await promisify(jwt.verify)(
            req.cookies.jwt,
            process.env.JWT_SECRET
        );
        db.query(
            "SELECT * FROM ilmoitukset WHERE ilmoittaja_id = ?",
            [decoded.id],
            async (error, results) => {
                req.list = results;
                next();
            }
        );
    } catch (error) {
        console.log(error);
    }
};

const getAdvert = async (req, res, next) => {
    try {
        db.query(
            "SELECT * FROM ilmoitukset WHERE ilmoitus_id = ?",
            [req.params.id],
            async (error, results) => {
                req.advert = results[0];
                next();
            }
        );
    } catch (error) {
        console.log(error);
    }
};

const updateAdvert = async (req, res, next) => {
    const { ilmoitus_kuvaus, ilmoitus_nimi } = req.body;
    try {
        db.query(
            "UPDATE ilmoitukset SET ilmoitus_kuvaus = ?, ilmoitus_nimi = ? WHERE ilmoitus_id = ?",
            [ilmoitus_kuvaus, ilmoitus_nimi, req.params.id],
            async (error, results) => {
                db.query(
                    "SELECT * FROM ilmoitukset WHERE ilmoitus_id = ?",
                    [req.params.id],
                    async (error, results) => {
                        req.advert = results[0];
                        next();
                    }
                );
            }
        );
    } catch (error) {
        console.log(error);
        next();
    }
};

const deleteAdvert = async (req, res, next) => {
    try {
        db.query(
            "DELETE FROM ilmoitukset WHERE ilmoitus_id = ?",
            [req.params.id],
            async (error, results) => {
                res.redirect('/profile');
                next();
            }
        );
    } catch (error) {
        console.log(error);
        next();
    }
};


export default newAdvert;
export { listAdverts, listUserAdverts, getAdvert, updateAdvert, deleteAdvert };

