var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/testHang', function (req, res, next) {
    console.log('no response sent here');
    // client hangs because no response was sent?
    throw {error: 'yep'}; // does jump to error handler
});

router.get('/test', function (req, res, next) {
        const p = 'asdf';
        console.log(p);
        console.log('callback 1');
        setTimeout(() => {
            console.log('inside timeout');
            res.send('done');
        }, 150);
        // next();
        // next('route');

    }
);
// router.get('/test', function (req, res, next) {
//     Promise.resolve().then(() => {
//         console.log('inside then');
//         // throw new Error('outside timeout error'); // works
//         setTimeout(() => {
//             console.log('after timeout');
//             next(new Error('err msg!!!')); // causes error
//         }, 2000)
//     }).catch((e) => {
//         console.log('was caught');
//         res.sendStatus(200);
//     });
//     console.log('after promise');
//
// });


module.exports = router;
