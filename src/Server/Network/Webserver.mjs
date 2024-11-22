import bodyParser from 'body-parser';
import compression from 'compression';
import Express from 'express';
import session from 'express-session';
import path from 'path';
import MemoryContainer from '../Container/MemoryContainer.mjs';
import Services from "../Service/Services.mjs";

/**
 * Serve static webapp files.
 */
export default class Webserver {
    constructor () {
        this.express = null;
        this.startup();
    }

    /**
     * Start webserver, add headers and listen on provided port.
     */
    startup () {
        const config = {};
        this.express = new Express();
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({
            extended: true
        }));
        if (process.env.ENVIRONMENT === 'production') {
            this.express.disable('x-powered-by');
            this.express.disable('view cache');

            // Set security headers
            config.setHeaders = function (res) {
                res.set('X-Frame-Options', 'sameorigin');
                res.set('X-XSS-Protection', '1; mode=block');
                res.set('X-Content-Type-Options', 'nosniff');
            };
        }

        this.express.use(compression());
        this.express.use('/lang', (req, res) => {
            console.log(req.baseUrl)
            const lang = req.path.split('/')[1];
            console.log(`lang: ${lang}`);
            //res.sendFile(path.resolve(process.env.NODE_PATH + '/public/index.html'));
        });

        this.express.use('*', (req, res) => {
            if(req.baseUrl == "") {
                res.sendFile(path.resolve(process.env.NODE_PATH + '/public/index.html'));
            } else {
                res.sendFile(path.resolve(process.env.NODE_PATH + '/public/' + req.baseUrl));
            }

        });


        this.express.listen(process.env.WEBSERVER_PORT);

        console.info(`Webapp running on port ${process.env.WEBSERVER_PORT}`);
    }
}
