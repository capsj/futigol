import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { FuseCalendarEventFormDialogComponent } from './event-form/event-form.component';
import { CalendarEventModel } from './event.model';
import { CalendarService } from './calendar.service';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay
} from 'angular-calendar';
import { fuseAnimations } from '../../../../core/animations';
import {AuthService} from "../../../../core/services/auth/auth.service";
import {FuseNavigationService} from "../../../../core/components/navigation/navigation.service";
import {FuseConfigService} from "../../../../core/services/config.service";
import {FuseNavigationModel} from "../../../../navigation/navigation.model";

@Component({
  selector   : 'confirmed-component',
  templateUrl: './confirmed.component.html',
  styleUrls  : ['./confirmed.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class ConfirmedComponent implements OnInit
{
  viewDate: Date;
  events: CalendarEvent[];
  public actions: CalendarEventAction[];
  activeDayIsOpen: boolean;
  refresh: Subject<any> = new Subject();
  dialogRef: any;
  selectedDay: any;
  loggedPlayer: any;

  constructor(
    private fuseConfig: FuseConfigService,
    private fuseNavigationService: FuseNavigationService,
    public dialog: MatDialog,
    public calendarService: CalendarService,
    private authService: AuthService
  )
  {
    this.fuseConfig.setSettings({
      layout: {
        navigation: 'top',
        toolbar   : 'above',
        footer    : 'none'
      },
      colorClasses    : {
        navbar: 'mat-fuse-dark-50-bg'
      }
    });
    this.fuseNavigationService.setNavigationModel(new FuseNavigationModel());
    this.authService.loggedUser.then(res => {
      this.loggedPlayer = res;
    });
    this.viewDate = new Date();
    this.activeDayIsOpen = true;
    this.selectedDay = {date: startOfDay(new Date())};
    this.events = []

  }

  ngOnInit()
  {
    this.authService.loggedUser.then(res => {
      this.calendarService.getEvents(res.id);
      this.calendarService.onEventsUpdated.subscribe(events => {
        this.setEvents();
        this.refresh.next();

        /**
         * Get events from service/server
         */
        this.setEvents();
      });
    })
  }

  setEvents()
  {
    this.events = this.calendarService.events.map(item => {
      return new CalendarEventModel(item);
    });
  }

  /**
   * Before View Renderer
   * @param {any} header
   * @param {any} body
   */
  beforeMonthViewRender({header, body})
  {
    // console.info('beforeMonthViewRender');
    /**
     * Get the selected day
     */
    const _selectedDay = body.find((_day) => {
      return _day.date.getTime() === this.selectedDay.date.getTime();
    });

    if ( _selectedDay )
    {
      /**
       * Set selectedday style
       * @type {string}
       */
      _selectedDay.cssClass = 'mat-elevation-z3';
    }

  }

  /**
   * Day clicked
   * @param {MonthViewDay} day
   */
  dayClicked(day: CalendarMonthViewDay): void
  {
    const date: Date = day.date;
    const events: CalendarEvent[] = day.events;

    if ( isSameMonth(date, this.viewDate) )
    {
      if ( (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0 )
      {
        this.activeDayIsOpen = false;
      }
      else
      {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
    this.selectedDay = day;
    this.refresh.next();
  }

  /**
   * Event times changed
   * Event dropped or resized
   * @param {CalendarEvent} event
   * @param {Date} newStart
   * @param {Date} newEnd
   */
  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void
  {
    event.start = newStart;
    event.end = newEnd;
    // console.warn('Dropped or resized', event);
    this.refresh.next(true);
  }

  /**
   * Edit Event
   * @param {string} action
   * @param {CalendarEvent} event
   */
  editEvent(action: string, event: CalendarEvent)
  {
    const eventIndex = this.events.indexOf(event);

    this.dialogRef = this.dialog.open(FuseCalendarEventFormDialogComponent, {
      panelClass: 'event-form-dialog',
      data      : {
        event : event,
        action: action
      }
    });
  }
}
