import { environment } from "environments/environment";

/**
 * Simple logger system with the possibility of registering custom outputs.
 *
 * 4 different log levels are provided, with corresponding methods:
 * - debug   : for debug information
 * - info    : for informative status of the application (success, ...)
 * - warning : for non-critical errors that do not prevent normal application behavior
 * - error   : for critical errors that prevent normal application behavior
 *
 * Example usage:
 * ```
 * import { Logger } from '@core/services/logger.service';
 *
 * const log = new Logger('component || file');
 * ...
 * log.debug('something happened');
 * ```
 *
/**
 * The possible log levels.
 * LogLevel.Off is never emitted and only used with Logger.level property to disable logs.
 */
export enum LogLevel {
    Off = 0,
    Error,
    Warning,
    Info,
    Debug
}

/**
 * Log output handler function.
 */
export type LogOutput = (
    source: string,
    level: LogLevel,
    ...objects: any[]
) => void;

export class Logger {
    /**
     * Current logging level.
     * Set it to LogLevel.Off to disable logs completely.
     */
    static level = LogLevel.Debug;

    /**
     * Additional log outputs.
     */
    static outputs: LogOutput[] = [];

    /**
     * Enables production mode.
     * Sets logging level to LogLevel.Warning.
     */
    static enableProductionMode() {
        Logger.level = LogLevel.Warning;
    }

    constructor(private source?: string) { }

    /**
     * Logs messages or objects  with the debug level.
     * Works the same as console.log().
     */
    debug(...objects: any[]) {
        this.log(console.log, LogLevel.Debug, objects);
    }

    /**
     * Logs messages or objects  with the info level.
     * Works the same as console.log().
     */
    info(...objects: any[]) {
        this.log(console.info, LogLevel.Info, objects);
    }

    /**
     * Logs messages or objects  with the warning level.
     * Works the same as console.log().
     */
    warn(...objects: any[]) {
        this.log(console.warn, LogLevel.Warning, objects);
    }

    /**
     * Logs messages or objects  with the error level.
     * Works the same as console.log().
     */
    error(...objects: any[]) {
        this.log(console.error, LogLevel.Error, objects);
    }

    private log(func: Function, level: LogLevel, objects: any[]) {

        if (environment.production) {
            return
        }
        if (level <= Logger.level) {
            const log = this.source
                ? ['[' + this.source + ']'].concat(objects)
                : objects;
            // Logger.outputs.forEach(output =>
            //     output.apply(output, [this.source, level].concat(objects))
            // );
        }
    }
}
