export class Time {
  public hour: number;
  public minute: number;
  public second: number;

  constructor(data: any) {
    this.hour = data.hour || 0;
    this.minute = data.minute || 0;
    this.second = data.second || 0;
  }

  static timeModelFromString(time: string): Time {
    let array = time.split(':');
    return new Time({hour: Number(array[0]), minute: Number(array[1]), second: 0})
  }

  static timeModelFromTime(time: any): Time {
    return new Time({hour: time.hour, minute: time.minute, second: 0})
  }

  toStringTime(): string {
    return this.hour.toString() + ':' + ((this.minute == 0) ? '00' : this.minute.toString());
  }
}
