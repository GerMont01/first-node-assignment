const crypto = require('crypto');
const fs = require('fs');

exports.EandD = function EncryptAndDecrypt(filename) {
    const algorithm = 'aes-256-ctr';
    const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
    const iv = crypto.randomBytes(16);

    // input file
    const r = fs.createReadStream(`./images/${filename}`);

    // encrypt content
    const encrypt = crypto.createCipheriv(algorithm, secretKey, iv);

    // decrypt content
    const decrypt = crypto.createDecipheriv(algorithm, secretKey, iv);

    // write file
    const w = fs.createWriteStream(`./decryptedimages/${filename}`);

    // start pipe
    return(
        r.pipe(encrypt)
            .pipe(decrypt)
            .pipe(w)
    )
}
