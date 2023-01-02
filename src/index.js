const express = require('express');
const bodyParser = require('body-parser');

const { PORT, FLIGHT_SERVICE_PATH } = require('./config/server-config')
const ApiRoutes = require('./routes/index');
const db = require('./models/index');

const app = express();

const setupAndStartServer = () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use('/api', ApiRoutes);
    

    app.listen(PORT, () => {
        if(process.env.DB_SYNC) {
            db.sequelize.sync({alter: true});
        }
        console.log(FLIGHT_SERVICE_PATH);
        console.log(`Server started at PORT: ${PORT}`);
    })
}

setupAndStartServer();