var mysql = require('mysql');

var deletes = `DROP TABLE IF EXISTS hashed;`

var creates = `CREATE TABLE IF NOT EXISTS hashed 
                    (
                        email VARCHAR(50) NOT NULL,
                        hashed VARCHAR(60) NOT NULL,
                        flake BIGINT UNSIGNED NOT NULL,
                        creation_time BIGINT UNSIGNED NOT NULL
                    );
                
                CREATE TABLE IF NOT EXISTS cdn_images 
                    (
                        id INT NOT NULL AUTO_INCREMENT, 
                        uid INT NOT NULL, 
                        hash TINYTEXT NOT NULL,
                        data MEDIUMTEXT NOT NULL, 
                        PRIMARY KEY(id)
                    );`

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
        this._con.query(creates);
    };

    async insertHashed(email, hashed, flake, creation_time) {
        this._con.query(
            "INSERT INTO hashed VALUES (email, hashed, flake, creation_time)",
            [
                email,
                hashed,
                flake,
                creation_time
            ]
        );  
    };

};

module.exports = {
    database: database
}
