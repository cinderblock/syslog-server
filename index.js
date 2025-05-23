"use strict";

const dgram = require("dgram");
const EventEmitter = require("events");

class SyslogServer extends EventEmitter {

    constructor(encoding = "utf8") {
        super();
        this.encoding = encoding;
        this.socket = null;
    }

    start(options = {}, cb) {
        return new Promise((resolve, reject) => {
            if (this.isRunning()) {
                let errorObj = createErrorObject(null, "NodeJS Syslog Server is already running!");
                if (cb) cb(errorObj, this);
                reject(errorObj);
            } else {
                this.socket = dgram.createSocket("udp4");

                // Socket listening handler
                this.socket.on("listening", () => {
                    this.emit("start", this);
                    if(cb) cb(null, this);
                    resolve(this);
                });

                // Socket error handler
                this.socket.on("error", (err) => {
                    this.emit("error", err);
                });

                // Socket message handler
                this.socket.on("message", (msg, remote) => {
                    let message = {
						date: new Date(),
                        host: remote.address,
                        message: msg.toString(this.encoding),
						protocol: remote.family
                    };
                    this.emit("message", message);
                });

                // Socket close handler
                this.socket.on("close", () => {
                    this.emit("stop");
                });

                this.socket.bind({ port: 514, ...options, exclusive: true }, (err) => {
                    if (err) {
                        let errorObj = createErrorObject(err, "NodeJS Syslog Server failed to start!");
                        if (cb) return cb(errorObj, this);
                        return reject(errorObj);
                    }
                });
            }
        });
    }

    stop(cb) {
        return new Promise((resolve, reject) => {
            try {
                this.socket.close(() => {
                    this.socket = null;
                    if (cb) return cb(null, this);
                    return resolve(this);
                });
            } catch (err) {
                let errorObj = createErrorObject(err, "NodeJS Syslog Server is not running!");
                if (cb) return cb(errorObj, this);
                return reject(errorObj);
            }
        });
    }

    isRunning() {
        return (this.socket !== null);
    }
}

function createErrorObject(err, message) {
    return {
        date: new Date(),
        error: err,
        message: message
    };
}

module.exports = SyslogServer;
