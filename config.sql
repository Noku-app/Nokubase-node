CREATE TABLE IF NOT EXISTS hashed 
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
    );