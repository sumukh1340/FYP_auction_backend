var express = require('express');
var path = require('path');
var cors = require('cors');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

var port = 3010;

// CORS middleware
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

//body parser
app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb'}));


mongoose.connect('mongodb://root:root123@bidding-shard-00-00.eajpq.mongodb.net:27017,bidding-shard-00-01.eajpq.mongodb.net:27017,bidding-shard-00-02.eajpq.mongodb.net:27017/bidding_app?replicaSet=atlas-y6fixa-shard-0&ssl=true&authSource=admin', function (err) {
    if (err) {
        console.error(err);
        process.exit(1)
    }
    console.log('DB Connection Established');
});

const userRoute = require('./controller/users.controller');
const productsRoute = require('./controller/products.controller');
const plotsRoute = require('./controller/plots.controller');
const auctionRoute = require('./controller/auction.controller');
const biddingRoute = require('./controller/bidding_event.controller');
const winningRoute = require('./controller/winnings.controller');
const aadharRoute = require('./controller/aadhar_cards.controller');


app.get('/ping', function (req, resp) {
    resp.status(200).send('pong').end()
});

app.use('/users', userRoute);
app.use('/products', productsRoute);
app.use('/plots', plotsRoute);
app.use('/auctions', auctionRoute);
app.use('/biddings', biddingRoute);
app.use('/winnings', winningRoute);
app.use('/aadhar-card', aadharRoute);


app.listen(port, function () {
    console.log('listening to your port', port);
});
