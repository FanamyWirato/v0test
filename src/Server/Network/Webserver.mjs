import Express from 'express';
import session from 'express-session';
import http from 'http';
import path from 'path';

/**
 * Serve static webapp files.
 */
export default class Webserver {
    constructor () {
        this.express = null;
        this.http = null;

        this.startup();
    }


    /**
     * Start webserver, add headers and listen on provided port.
     */
    startup () {
        let config = {};
        this.express = new Express();
        this.http = http.Server(this.express);

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


        //this.express.use(compression());
        this.express.use(session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: 'auto', // TODO: UNSECURE!!!
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 3_600_000 // 1h
            }
        }));

        // eslint-disable-next-line no-unused-vars
        this.express.use('*', (req, res) => {
            
            res.sendFile(path.resolve(process.env.NODE_PATH + '/public/login.html'));
        });

        this.http.listen(process.env.WEBSERVER_PORT);

        console.info(`Webapp running on port ${ process.env.WEBSERVER_PORT }`);
    }


    /**
     * Returns instance of http server.
     *
     * @returns {null|http}
     */
    getHttp () {
        return this.http;
    }
}