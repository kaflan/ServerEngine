import * as fs from 'fs';
import * as process from 'process'
import * as path from "path";

export default class Settings<T> {
  public mode = 'development';
  protected settingsData: any = null;

  constructor(source: string) {
    let file = path.join(__dirname, '../../settings', source);
    const raw = fs.readFileSync(file, "UTF8");
    this.settingsData = JSON.parse(raw);
    if (process.env.NODE_ENV) {
      this.mode = process.env.NODE_ENV;
    }
  }
  public get(): T {
    return this.settingsData[this.mode] || this.settingsData;
  }
}
