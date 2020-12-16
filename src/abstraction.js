/*
 * Copyright (c) 2020 Noku App
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

 
const { response } = require('express');
var mysql = require('mysql');
var deletes = `DROP TABLE IF EXISTS tokens, account`
//Assign a more accurate typing to text, as its currently text
var creates = [
    `CREATE TABLE IF NOT EXISTS tokens 
    (
        uid BIGINT UNSIGNED NOT NULL, 
        secret VARCHAR(60) NOT NULL, 
        token VARCHAR(150) NOT NULL
    );`, 

    `CREATE TABLE IF NOT EXISTS account 
    (
        uid BIGINT UNSIGNED NOT NULL, 
        email VARCHAR(50) NOT NULL, 
        creation_time BIGINT UNSIGNED NOT NULL,
        points INT UNSIGNED,
        pfp VARCHAR(60),
        age INT UNSIGNED,
        nsfw BOOLEAN,
        moderator BOOLEAN,
        admin BOOLEAN,
        developer BOOLEAN,
        gender VARCHAR(8),
        nick VARCHAR(20) NOT NULL,
        realnick VARCHAR(20) NOT NULL,
        bio VARCHAR(500),
        background_color VARCHAR(10),
        border_color VARCHAR(10)
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

    async updateAccount(uid, key, value) {
        this._con.query(
            `UPDATE account SET ${key} = ? WHERE uid = ?`,
            [
                value,
                uid
            ]
        )
    }

    async registerUser(opts={}) {
        this._con.query(
            `INSERT INTO account 
            (email, uid, creation_time, nick, realnick) 
            VALUES (?, ?, ?, ?, ?)`,
            [
                opts.email.toLowerCase(),
                opts.uid,
                opts.creation_time || Date.now(),
                opts.nick,
                opts.nick.toLowerCase()
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

    async call(callback=null, args) {
        if (callback) {
            (
                async() => {
                    callback(...args);
                }
            )();
        } else {
            console.warn("Missing a callback.")
        }
    };

    async userByToken(token, callback) {

        const uidcallback = async (uid) => {
            if (!uid) {
                this.call(callback, [null,])
            } else {
                this.userByUID(
                    uid,
                    async (user) => {
                        if (!user) {
                            this.call(callback, [null,])
                        } else {
                            this.call(callback, user)
                        }
                    } 
                );
            };
        };

        this.getUIDbyToken(
            token, 
            async (uid) => {
                if (!uid) {
                    this.call(uidcallback, [null,])
                } else {
                    this.call(uidcallback, uid);
                }
            }
        );
    };

    async userByUID(uid, callback) {
        this._con.query(
            "SELECT * FROM account WHERE uid = ?",
            [
                uid,
            ],
            async (err, result, fields) => {
                if (!result) {
                    this.call(callback, [null,])
                } else {
                    if (result[0]) {
                        this.call(callback, [result[0],]);
                    } else {
                        this.call(callback, [null,]);
                    };
                };
            }
        );
    }

    async getUIDbyToken(token, callback=null) {

        this._con.query(
            "SELECT uid FROM tokens WHERE token = ?",
            [
                token
            ],
            async (err, result, fields) => {
                if (!result) {
                    this.call(callback, [null,])
                } else {
                    if (result[0]) {
                        if (result[0].uid) {
                            this.call(callback, [result[0].uid,]);
                        } else {
                            this.call(callback, [null,])
                        };
                    } else {
                        this.call(callback, [null,]);
                    };
                };
            }
        );
    };

    async getSecretbyUID(uid, callback=null) {
        this._con.query(
            "SELECT secret FROM tokens WHERE uid = ?",
            [
                uid,
            ],
            async (err, result, fields) => {
                if (!result) {
                    this.call(callback, [null,])
                } else {
                    if (result[0]) {
                        if (result[0].secret) {
                            this.call(callback, [result[0].secret,]);
                        } else {
                            this.call(callback, [null,])
                        };
                    } else {
                        this.call(callback, [null,]);
                    };
                };
            }
        )
    };

    async getUIDbyEmail(email, callback=null) {
        this._con.query(
            "SELECT uid FROM account WHERE email = ?",
            [
                email,
            ],
            async (err, result, fields) => {
                if (!result) {
                    this.call(callback, [null,])
                } else {
                    if (result[0]) {
                        if (result[0].uid) {
                            this.call(callback, [result[0].uid,]);
                        } else {
                            this.call(callback, [null,])
                        };
                    } else {
                        this.call(callback, [null,]);
                    };
                };
            }
        );
    };

    async isEmailTaken(email, callback=null) {
        let taken;
        this._con.query(
            "SELECT email FROM account WHERE email = ?",
            [
                email.toLowerCase()
            ],
            async (err, result, fields) => {
                if (!result) {
                    taken = false
                    return this.call(callback, [taken,])
                } 
                if (result.length == 0) {
                    taken = false;
                } else {
                    taken = true;
                } this.call(callback, [taken,])
            }
        );
    };

    async isNickTaken(nick, callback=null) {
        let taken;
        this._con.query(
            "SELECT realnick FROM account WHERE realnick = ?",
            [
                nick.toLowerCase()
            ],
            async (err, result, fields) => {
                if (!result) {
                    taken = false
                    return this.call(callback, [taken,])
                } 
                if (result.length == 0) {
                    taken = false;
                } else {
                    taken = true;
                } this.call(callback, [taken,])
            }
        );
    };
};

module.exports = {
    database: database
};
