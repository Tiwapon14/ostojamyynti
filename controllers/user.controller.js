import db from '../app.js';
import bcrypt from 'bcryptjs';

const registerUser = (req, res) => {
    const kayttaja_tunnus = req.body.kayttaja_tunnus;
    const kayttaja_sahkoposti = req.body.kayttaja_sahkoposti;
    const kayttaja_salasana = req.body.kayttaja_salasana;
    const kayttaja_salasana_varmistus = req.body.kayttaja_salasana_varmistus;

   /* const {
        kayttaja_tunnus,
        kayttaja_sahkoposti,
        kayttaja_salasana,
        kayttaja_salasana_varmistus,
    } = req.body;*/

    db.query(
        "SELECT kayttaja_sahkoposti FROM kayttajat WHERE kayttaja_sahkoposti = ?",
        [kayttaja_sahkoposti],
        async (error, results) => {
            if (error) {
                console.log("Error in query: " + error);
            }
            if (results.length > 0) {
                return res.render("register", {
                    message: "Sähköposti on jo käytössä!",
                });
            } else if (kayttaja_salasana !== kayttaja_salasana_varmistus) {
                return res.render("register", {
                    message: "Salasanat eivät täsmänneet!",
                });
            }

            let hashedPassword = await bcrypt.hash(kayttaja_salasana, 8);
            
            db.query(
                "INSERT INTO kayttajat SET ?",
                {
                    kayttaja_tunnus: kayttaja_tunnus,
                    kayttaja_sahkoposti: kayttaja_sahkoposti,
                    kayttaja_salasana: hashedPassword
                },
                (error, results) => {
                    if (error) {
                        console.log("Error in query: " + error);
                    } else {
                        return res.status(200).render('register', {
                            message: "Rekisteröityminen onnistui!",
                        });
                    }
                }
            )
        }
    );
}
const listUsers = async (req, res, next) => {
    try {
        db.query("SELECT * FROM kayttajat", async (error, results) => {
            req.users = results;
            next();
        });
    } catch (error) {
        console.log(error);
    }
};


export default registerUser;
export { listUsers };
