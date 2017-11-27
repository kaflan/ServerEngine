import {ErrorHandler} from "./ErrorHandler";

export interface IConfigurator {

}

export default class Configurator implements IConfigurator {
  private _settings = {};
  public errorsHandler = ErrorHandler.middleware();
  public notFoundHandler = ErrorHandler.notFoundHandler();

  constructor(settings) {
      this.settings = Object.assign({}, settings);
  }

  get settings() {
    return this._settings;
  }
  set settings(settings) {
    this._settings = settings;
  }
}
