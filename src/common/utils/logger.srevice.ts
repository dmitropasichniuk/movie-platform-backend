import { Logger } from "@nestjs/common";

export class LoggerService {
  static log(context: string, message: string) {
    Logger.log(message, context);
  }

  static error(context: string, message: string, trace?: string) {
    Logger.error(message, trace, context);
  }

  static warn(context: string, message: string) {
    Logger.warn(message, context);
  }

  // will be used for debugging purposes
  static debug(context: string, message: string) {
    Logger.debug(message, context);
  }

  // will be used for verbose logging
  static verbose(context: string, message: string) {
    Logger.verbose(message, context);
  }
}
