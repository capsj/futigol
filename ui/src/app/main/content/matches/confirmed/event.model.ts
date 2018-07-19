import {
    CalendarEventAction
} from 'angular-calendar';

import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours
} from 'date-fns';
import {DateModel} from "../../../../core/models/utils/date.model";
import {Time} from "../../../../core/models/utils/time.model";
// import { CalendarEvent } from 'calendar-utils/dist/calendar-utils';

/*
export interface EventAction
{
    label: string;
    cssClass?: string;

    onClick({event}: {
        event: CalendarEvent;
    }): any;
}*/

export class CalendarEventModel
{
    start: Date;
    end?: Date;
    title: string;
    color: {
        primary: string;
        secondary: string;
    };
    location: string;
    time: string;
    date: string;
    cssClass?: string;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    meta?: {
        location: string,
        notes: string
    };

    constructor(data)
    {
        this.start = DateModel.dateFromDateModelAndTime(data.date, data.time) || new Date();
        this.end = DateModel.dateFromDateModelAndTime(data.date, new Time({hour: data.time.hour + 2, minute: data.time.minute, second: 0})) || new Date();
        this.title = data.receiver.name + ' vs ' + data.sender.name || '';
        this.color = {
            primary  : data.color && data.color.primary || '#1e90ff',
            secondary: data.color && data.color.secondary || '#D1E8FF'
        };
        this.location = data.location;
        this.time = new Time(data.time).toStringTime();
        this.date = new DateModel(data.date.year, data.date.month, data.date.day, 0, 0, 0).toStringDate();
        this.resizable = {
            beforeStart: data.resizable && data.resizable.beforeStart || true,
            afterEnd   : data.resizable && data.resizable.afterEnd || true
        };
        this.cssClass = data.cssClass || '';
        this.meta = {
            location: data.meta && data.meta.location || '',
            notes   : data.meta && data.meta.notes || ''
        };
    }

}
