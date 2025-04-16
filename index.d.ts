import { EventEmitter } from "events";
import { BindOptions } from "dgram";

/**
 * SyslogServer module for handling Syslog messages.
 * @module SyslogServer
 */
declare namespace SyslogServer {
  /**
   * Represents a Syslog message.
   */
  export interface Message {
    /**
     * The date and time the message was received.
     */
    date: Date;

    /**
     * The hostname from which the message originated.
     */
    host: string;

    /**
     * The message content.
     */
    message: string;

    /**
     * The protocol used (e.g., 'IPv4' or 'IPv6').
     */
    protocol: string;
  }

  /**
   * Options for starting the Syslog server.
   */
  export type Options = Omit<BindOptions, "exclusive">;
}

/**
 * Represents a Syslog server.
 */
declare class SyslogServer extends EventEmitter {
  /**
   * Starts the Syslog server.
   * @param options Options for the server.
   * @param cb Optional callback to execute when the server starts.
   */
  start(
    options?: SyslogServer.Options,
    cb?: (err: any, server: SyslogServer) => void
  ): Promise<SyslogServer>;

  /**
   * Stops the Syslog server.
   * @param cb Optional callback to execute when the server stops.
   */
  stop(cb?: (err: any, server: SyslogServer) => void): Promise<SyslogServer>;

  /**
   * Checks if the server is running.
   */
  isRunning(): boolean;

  /**
   * Event listener for incoming messages.
   * @param event The event name (e.g., 'message').
   * @param listener The listener function.
   */
  on(event: 'message', listener: (msg: SyslogServer.Message) => void): this;

  /**
   * Event listener for server start.
   * @param event The event name (e.g., 'start').
   * @param listener The listener function.
   */
  on(event: 'start', listener: (server: SyslogServer) => void): this;

  /**
   * Event listener for server stop.
   * @param event The event name (e.g., 'stop').
   * @param listener The listener function.
   */
  on(event: 'stop', listener: () => void): this;

  /**
   * Event listener for errors.
   * @param event The event name (e.g., 'error').
   * @param listener The listener function.
   */
  on(event: 'error', listener: (err: any) => void): this;
}

export = SyslogServer;
