const e = require('express');
var mysql = require('mysql');
var deletes = `DROP TABLE IF EXISTS tokens, account`
//Assign a more accurate typing to text, as its currently text
var creates = [
    `CREATE TABLE IF NOT EXISTS tokens 
    (
        uid INT UNSIGNED NOT NULL, 
        secret VARCHAR(60) NOT NULL, 
        token VARCHAR(150) NOT NULL
    );`, 

    `CREATE TABLE IF NOT EXISTS account 
    (
        uid INT UNSIGNED NOT NULL, 
        email VARCHAR(50) NOT NULL, 
        creation_time BIGINT UNSIGNED NOT NULL,
        points INT UNSIGNED NOT NULL,
        pfp VARCHAR(60),
        age INT UNSIGNED,
        nsfw BOOLEAN NOT NULL,
        moderator BOOLEAN NOT NULL,
        admin BOOLEAN NOT NULL,
        developer BOOLEAN NOT NULL,
        gender VARCHAR(8)
    );`
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
            console.log("Cleaning...");
        };
    };

    async _clean() {
        this._con.query(deletes);
        for (let index in creates) {
            this._con.query(
                creates[index]
            );
        };
    };

    async registerUser(opts={}) {
        this._con.query(
            "INSERT INTO account (email, uid, creation_time, points, pfp, age, nsfw, moderator, admin, developer, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                opts.email,
                opts.uid,
                opts.creation_time || Date.now(),
                opts.points || 0,
                opts.pfp || null,
                opts.age || null,
                opts.nsfw || false,
                opts.moderator || false,
                opts.admin || false,
                opts.developer|| false,
                opts.gender || null
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
        this._con.query(
            "SELECT email FROM account WHERE email = ?",
            [
                email
            ],
            async (err, result, fields) => {
                if (!result) {
                    taken = false
                    return callback(taken)
                } 
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
