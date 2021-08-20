
const module1 = require('./module1');
const styles = module1.styling;

const EandD = require('./crypto');

const path = require('path');
const http = require('http');
const formidable = require('formidable');
const fs = require('fs');

const directoryPath = path.join(__dirname, 'images');
let imgArr = [];


http.createServer(function (req, res) {
    switch (req.url) {
        case '/fileupload':
            const form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
              const nameOfFile = `image${imgArr.length+1}.jpg`
              const oldpath = files.filetoupload.path;
              const newpath = './images/' + nameOfFile;
              fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.end(`
                    <div style="text-align:center; font-family:${styles.font}">
                     <p>Image uploaded successfully<p><br/>
                     <a style="color:${styles.color2}" href="./images">See images</a><br/>
                     <a style="color:${styles.color2}" href="/">Return</a>
                    </div>`
                    );
                });
            });
            break;
        case '/images':
            imgArr=[];
            fs.readdir(directoryPath, function (err, files) {
                if (err) {
                    return console.log('Unable to scan directory: ' + err);
                } 
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(`<ul style="font-family:${styles.font}">`);
                files.forEach(function (file) {
                    EandD.EandD(file);
                    imgArr.push(file);
                    res.write(`<li><a style="color:${styles.color1}" href="./decryptedimages/${file}">${file}</a>`)
                });
                res.write(`</ul>`);
                res.write(`<a style="color:${styles.color2}" href="/">Return</a>`);
                res.end();
            });
            break;
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(`
            <div style="margin:auto; text-align:center; font-family:${styles.font}">
                <h1>Image Storage</h1><br/>
                <form style="border:1px solid black; width:fit-content; padding:10px; margin:auto" action="fileupload" method="post" enctype="multipart/form-data">
                    <input type="file" name="filetoupload"><br/><br/>
                    <input type="submit">
                </form><br/>
                <a style="color:${styles.color2}" href="./images">See images</a>
            </div>`);
            res.end();
            break;
    }
    for(let image of imgArr) {
        if (req.url == `/decryptedimages/${image}` ) {
            res.writeHead(200,{'content-type':'image/jpg'});
            fs.createReadStream(`./decryptedimages/${image}`).pipe(res);
            break;
        }
    }
}).listen(8080);