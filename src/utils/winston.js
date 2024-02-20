import winston from "winston";
import config from "../config/config.js";

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `¬ ${timestamp} ~${level} >  ${message} `;
})


// debug, http, info, warning, error, fatal
const customLevel = {
    levels: {
        critical: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        critical: 'bold magenta',
        error: 'bold red',
        warning: 'bold yellow',
        info: 'bold blue',
        http: 'bold green',
        debug: 'bold gray',
    },
}

export let logger;

if(config.environment === "production"){
    // Logger de production
    logger = winston.createLogger({
        levels: customLevel.levels,
        transports: [
            new winston.transports.File({
                filename: './src/logs/prodErrors.log',
                level: 'error',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.prettyPrint(),
                ) 
            }),
            new winston.transports.Console({
                level: 'info',
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevel.colors }),
                    winston.format.timestamp(),
                    customFormat,
                ),
            }),
        ]
    })
} else {
    // Logger de development
    logger = winston.createLogger({
        levels: customLevel.levels,
        transports: [
            new winston.transports.File({
                filename: './src/logs/devErrors.log',
                level: 'warning',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.prettyPrint(),
                ) 
            }),
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevel.colors }),
                    winston.format.timestamp(),
                    customFormat,
                ),
            }),
        ]
    })
}