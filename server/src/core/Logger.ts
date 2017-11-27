//Todo: Implement real logger(use winston)
export class Logger {
  public info(msg) {
    console.log(msg)
  }
  public warn(msg) {
    console.warn(msg);
  }
  public error(error) {
    console.error(error.original || error);
    console.trace(error)
  }
}

const logger = new Logger();
export default logger;
