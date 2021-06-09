const jimp = require('jimp')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const express = require('express')
const bodyParser = require('body-parser')
const auth = require('http-auth');

const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants')
const { resolve } = require('path')
const app = express();
const statusMonitor = require('express-status-monitor')({ path: '' });
const port = 80
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//count the number of files and sets then randomize

const between = function (min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}

const getAllFiles = function (dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
        }
    })

    return arrayOfFiles
}

function randface() {
    var directoryPath = path.join('', 'assets/images/sets/m/faces');
    var faces = []
    sel_faces = between(0, getAllFiles(directoryPath, faces).length)
    return faces[sel_faces]
}

function randeyes() {
    var directoryPath = path.join('', 'assets/images/sets/m/eyes');
    var eyes = []
    sel_eyes = between(0, getAllFiles(directoryPath, eyes).length)
    return eyes[sel_eyes]
}

function randbeard() {
    var directoryPath = path.join('', 'assets/images/sets/m/beard');
    var beard = []
    sel_beard = between(0, getAllFiles(directoryPath, beard).length)
    return beard[sel_beard]
}

function randglasses() {
    var directoryPath = path.join('', 'assets/images/sets/m/glasses');
    var glasses = []
    sel_glasses = between(0, getAllFiles(directoryPath, glasses).length)
    return glasses[sel_glasses]
}

function randhair() {
    var directoryPath = path.join('', 'assets/images/sets/m/hair');
    var hair = []
    sel_hair = between(0, getAllFiles(directoryPath, hair).length)
    return hair[sel_hair]
}

function randmouth() {
    var directoryPath = path.join('', 'assets/images/sets/m/mouth');
    var mouth = []
    sel_mouth = between(0, getAllFiles(directoryPath, mouth).length)
    return mouth[sel_mouth]
}

function randwear() {
    var directoryPath = path.join('', 'assets/images/sets/m/wear');
    var wear=[]
    sel_wear = between(0, getAllFiles(directoryPath, wear).length)
    return wear[sel_wear]
}

function randbg() {
    var directoryPath = path.join('', 'assets/images/sets/m/bg');
    var bg = []
    sel_bg = between(0, getAllFiles(directoryPath, bg).length)
    return bg[sel_bg]
}


const basic = auth.basic({ realm: 'Monitor Area' }, function (user, pass, callback) {
    callback(user === 'ezp' && pass === 'ezp1234');
});

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'assets/images/temp')));
app.use(statusMonitor.middleware);

app.get('/status', basic.check(statusMonitor.pageRoute));
app.get('/', function (req, res) {

    const generateAvatar = new Promise((resolve, reject) => {

        let images = []
    
        images.push(randbg())
        images.push(randface())
        images.push(randwear())
        images.push(randeyes())
        images.push(randhair())
        images.push(randglasses())
        images.push(randmouth())
        images.push(randbeard())
        
        let jimps = []
        let hashstring = ""
    
        for (var i = 0; i < images.length; i++) {
            hashstring = hashstring + images[i]
            jimps.push(jimp.read(images[i]))
        }
    
        //create unique-filename based on the assets used
        let imageSrc = crypto.createHash('md5').update(hashstring).digest('hex')
    
        Promise.all(jimps).then(function (data) {
            return Promise.all(jimps);
        }).then(function (data) {
            data[0].composite(data[1], 0, 0)
            data[0].composite(data[2], 0, 0)
            data[0].composite(data[3], 0, 0)
            data[0].circle({ radius: 200, x: 300, y: 300 })
            for (var j = 3; j < data.length; j++) {
                data[0].composite(data[j], 0, 0);
            }
            data[0].shadow({ opacity: 0.4, size: 1, blur: 10, x: 2, y: 2 });
            data[0].crop(60, 60, 470, 470)
            data[0].resize(128, 128)
            data[0].write(`assets/images/temp/${imageSrc}.png`, function () {
                resolve(imageSrc);
            })
        })
    })

    generateAvatar.then((src) => {
        res.redirect(`/${src}.png`)
        //res.render('loader', { imagesrc: src })
    })
})
app.get('/generate', function (req, res) {

    const generateAvatar = new Promise((resolve, reject) => {

        let images = []
    
        images.push(randbg())
        images.push(randface())
        images.push(randwear())
        images.push(randeyes())
        images.push(randhair())
        images.push(randglasses())
        images.push(randmouth())
        images.push(randbeard())
        
        let jimps = []
        let hashstring = ""
    
        for (var i = 0; i < images.length; i++) {
            hashstring = hashstring + images[i]
            jimps.push(jimp.read(images[i]))
        }
    
        //create unique-filename based on the assets used
        let imageSrc = crypto.createHash('md5').update(hashstring).digest('hex')
    
        Promise.all(jimps).then(function (data) {
            return Promise.all(jimps);
        }).then(function (data) {
            data[0].composite(data[1], 0, 0)
            data[0].composite(data[2], 0, 0)
            data[0].composite(data[3], 0, 0)
            data[0].circle({ radius: 200, x: 300, y: 300 })
            for (var j = 3; j < data.length; j++) {
                data[0].composite(data[j], 0, 0);
            }
            data[0].shadow({ opacity: 0.4, size: 1, blur: 10, x: 2, y: 2 });
            data[0].crop(60, 60, 470, 470)
            data[0].resize(128, 128)
            data[0].write(`assets/images/temp/${imageSrc}.png`, function () {
                resolve(imageSrc);
            })
        })
    })

    generateAvatar.then((value) => {

        var filePath = path.join(__dirname, '/assets/images/temp/', `${value}.png`);
        res.download(filePath, function (err) {
            if (!err) return; // file sent
            if (err.status !== 404) return next(err); // non-404 error
            // file for download not found
            res.statusCode = 404;
            res.send('Cant find that file, sorry!');
        });

    })
});

app.listen(port, () => {
    console.log('Avatar Generator started ...')
})