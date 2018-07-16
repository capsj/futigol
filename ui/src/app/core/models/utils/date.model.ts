export class DateModel {

    public static from(jsonObject: any): DateModel {
        if (!jsonObject || !jsonObject.year || !jsonObject.month || !jsonObject.day) {
            throw new Error('Failed to instantiate DateModel from given jsonObject');
        }
        return new DateModel(jsonObject.year, jsonObject.month, jsonObject.day, jsonObject.hours, jsonObject.minutes, jsonObject.seconds);
    }

    static empty(): DateModel {
        return new DateModel(undefined, undefined, undefined, undefined, undefined, undefined );
    }

    static dateModelFromDate(date: Date): DateModel {
        return new DateModel(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours() || 0, date.getMinutes() || 0, date.getSeconds() || 0);
    }
    static dateModelFromString(initialDate: string): DateModel {
        const split = initialDate.split('-');
        return new DateModel(+split[0], (+split[1]), +split[2], 0, 0 , 0 );
    }
    static toDashString(date: DateModel): string {
        // return `${date.year}-${date.month < 10 ? `0${date.month}` : date.month}-${date.day < 10 ? `0${date.day}` : date.day}`;
        return `${date.day}/${date.month}/${date.year}`;
    }

    static stringToDashString(stringDate: string): string {
        const split = stringDate.split('-');
        return this.toDashString( new DateModel(+split[2], +split[1], +split[0], 0, 0, 0));
    }

    static dateFromDateModel(date: DateModel): Date {
        return new Date(date.year, date.month - 1, date.day, date.hours, date.minutes, date.seconds);
    }

    static dateFromString(dateString: string): Date {
        const date = this.dateModelFromString(dateString);
        return new Date(date.year, date.month - 1, date.day);
    }

    static compareDateModel(date1: DateModel, date2: DateModel): number {
        const parsedDate1 = this.dateFromDateModel(date1);
        const parsedDate2 = this.dateFromDateModel(date2);
        if (parsedDate1 > parsedDate2) {
            return 1;
        } else if (parsedDate1 < parsedDate2) {
            return -1;
        } else {
            return 0;
        }
    }

    toStringDate(): string {
        return this.day.toString() + '/' + this.month.toString() + '/' + this.year.toString();
    }

    constructor(public year: number, public month: number, public day: number, public hours: number, public minutes: number, public seconds: number) {}
}
