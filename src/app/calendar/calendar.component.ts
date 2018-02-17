import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'calendar-utils';
import { Subject } from 'rxjs/Subject';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  isSameHour,
  addHours
} from 'date-fns';
import { CalendarEventTimesChangedEvent, CalendarEventAction } from 'angular-calendar';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  viewDate = new Date();
  eventsObservable: Observable<Array<any[]>>;
  events: CalendarEvent[] = [];
  myform: FormGroup;
  activeDayIsOpen = false;
  monthEvents: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();
  view = 'month';
  currentUser = '';
  ref: any;
  actions: CalendarEventAction[] = [
    {
      label: '',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('a', event);
      }
    }
  ];
  constructor(private db: AngularFireDatabase, private authService: AuthService) { }

  ngOnInit() {
    this.eventsObservable = this.getEvents('/events');
    this.myform = new FormGroup({
      title: new FormControl('', Validators.minLength(2)),
      date: new FormControl('', Validators.minLength(1)),
      time: new FormControl(),
      endtime: new FormControl()
    });
    this.authService.getUser().subscribe(x => {
      if (x) { this.currentUser = x.email }
    });
  }
  getEvents(listPath): Observable<any[]> {
    this.db.list(listPath).valueChanges().subscribe(a => this.addEvent(a));
    return this.db.list(listPath).valueChanges();
  }

  addEvent(a) {
    this.events = [];
    for (const ev of a) {
      this.events.push({
        start: new Date(ev.date + ' ' + ev.startime),
        end: new Date(ev.date + ' ' + ev.endtime),
        title: `${ev.title}  användare: ${ev.email} tid: ${ev.startime} till: ${ev.endtime} <i class="fa fa-fw fa-times"></i>`,
        color: { primary: ev.color, secondary: ev.color },
        id: ev.id,
      });
    }
  }

  pushData() {
    if (this.myform.valid) {
      const id = '_' + Math.random().toString(36).substr(2, 9);
      this.ref = this.db.list('events').push({
        date: this.myform.value.date,
        endtime: this.myform.value.endtime,
        startime: this.myform.value.time,
        title: this.myform.value.title,
        email: this.currentUser,
        id: id,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
      });
      this.myform.reset();
    }
  }

  handleEvent(e, ev) {
    const awd = this.db.list('events', ref => ref.orderByChild('id').equalTo(ev.id));
    let y = this.db.list('events').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, ...action.payload.val() }));
    }).subscribe(items => {
      return items.map(item => {
        if (item.id === ev.id && item.email === this.currentUser) {
          this.db.list('events').remove(item.key);
        }
      });
    });
  }

  dayClicked({ date, events }: { date: Date, events: CalendarEvent[] }) {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true)
        || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
        this.monthEvents = events;
      }
    }

    this.myform.controls['date'].setValue(this.getFormattedDate(date));

  }

  getFormattedDate(date) {
    const dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const month = date.getMonth() + 1;
    const mm = month < 10 ? '0' + month : month

    return `${date.getFullYear()}-${mm}-${dd}`;
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  logout() {
    this.authService.logout();
  }

}
