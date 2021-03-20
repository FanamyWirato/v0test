import compression from 'compression';
import Express from 'express';
import session from 'express-session';
import path from 'path';
import MemoryContainer from '../Container/MemoryContainer';

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
        // TODO: set session only when the authentication succeed
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

        this.express.use('/login', (req, res, next) => {
            // TODO: add login
            console.log('login received');
            console.log(req.body, req.params, req);
            next();
        });

        this.express.use('*.ico', (req, res) => {
            res.sendFile(path.resolve(process.env.NODE_PATH + '/public/favicon.ico'));
        });

        this.express.use('*', (req, res) => {
            console.log(req.session);
            if (req.session.authorization !== undefined &&
                MemoryContainer.activeUsers[req.session.authorization] !== undefined) {
                if (req.originalUrl === '/') {
                    res.sendFile(path.resolve(process.env.NODE_PATH + '/dist/index.html'));
                } else {
                    res.sendFile(path.resolve(process.env.NODE_PATH + '/dist/' + req.baseUrl));
                }
            } else {
                // if no valid session is found or no valid authentication happened, deliver login
                res.sendFile(path.resolve(process.env.NODE_PATH + '/public/login.html'));
            }
        });

        this.express.listen(process.env.WEBSERVER_PORT);

        console.info(`Webapp running on port ${process.env.WEBSERVER_PORT}`);
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
