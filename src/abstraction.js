var mysql = require('mysql');
var deletes = `DROP TABLE IF EXISTS tokens, registered`
//Assign a more accurate typing to text, as its currently text
var creates = [
    `CREATE TABLE IF NOT EXISTS tokens (uid INT UNSIGNED NOT NULL, secret VARCHAR(60) NOT NULL, token VARCHAR(150) NOT NULL);`, 
    `CREATE TABLE IF NOT EXISTS registered (uid INT UNSIGNED NOT NULL, email VARCHAR(50) NOT NULL, creation_time BIGINT UNSIGNED NOT NULL);`
];

class database {
    constructor(options={}) {

        this._con = mysql.createConnection(
            options.config,
        );

        this._con.connect(
            async (err) => {
                if (err) {
                    console.log(err);
                    return;
                };
                console.log("Connected!");
            }
        );

        if (options.clean == true) {
            this._clean();
            console.log("Cleaning...")
        }

    };

    async _clean() {
        this._con.query(deletes);
        for (let index in creates) {
            //console.log(creates[index])
            this._con.query(
                creates[index]
            )
        }
    };

    async registerUser(email, uid) {
        console.log(Date.now())
        this._con.query(
            "INSERT INTO registered (email, uid, creation_time) VALUES (?, ?, ?)",
            [
                email,
                uid,
                Date.now()
            ]
        );
    };

    async tokenUser(uid, secret, token) {
        this._con.query(
            "INSERT INTO tokens (uid, secret, token) VALUES (?, ?, ?)",
            [
                uid,
                secret,
                token
            ]
        );
    };

    async updateSecret(uid, secret) {
        this._con.query(
            "UPDATE tokens SET secret = ? WHERE uid = ?",
            [
                secret,
                uid
            ]
        );
    };

    async updateToken(uid, token) {
        this._con.query(
            "UPDATE tokens SET token = ? WHERE uid = ?",
            [
                token,
                uid
            ]
        );
    };

    async isEmailTaken(email, callback=async(taken)=>{}) {
        let taken;
        let query = this._con.query(
            "SELECT email FROM registered WHERE email = ?",
            [
                email
            ],
            async (err, result, fields) => {
                if (result.length == 0) {
                    taken = false;
                } else {
                    taken = true;
                } callback(taken);
            }
        );
    };
};

module.exports = {
    database: database
};
