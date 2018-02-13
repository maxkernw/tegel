import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'calendar-utils';
import { Subject } from 'rxjs/Subject';
import { FormGroup, FormControl } from '@angular/forms';

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
      label: '<h1>delete</h1>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('a', event);
      }
    }
  ];
  constructor(private db: AngularFireDatabase, private authService: AuthService) { }

  ngOnInit() {
    this.eventsObservable = this.getEvents('/events');
    console.log(this.eventsObservable);
    this.myform = new FormGroup({
      title: new FormControl(),
      date: new FormControl(),
      time: new FormControl(),
      endtime: new FormControl()
    });
    this.authService.getUser().subscribe(x => this.currentUser = x.email);
  }
  getEvents(listPath): Observable<any[]> {
    this.db.list(listPath).valueChanges().subscribe(a => this.addEvent(a));
    return this.db.list(listPath).valueChanges();
  }

  eventClicked(ev) {

  }

  addEvent(a) {
    this.events = [];
    console.log(a);
    for (const ev of a) {
      this.events.push({
        start: new Date(ev.date + ' ' + ev.startime),
        end: new Date(ev.date + ' ' + ev.endtime),
        title: `${ev.title}  user: ${ev.email} \n tid: ${ev.startime} till: ${ev.endtime}`,
        color: { primary: 'pink', secondary: 'pink' },
        id: ev.id,

      });
    }
  }

  pushData() {
    const id = '_' + Math.random().toString(36).substr(2, 9);
    this.ref = this.db.list('events').push({
      date: this.myform.value.date,
      endtime: this.myform.value.endtime,
      startime: this.myform.value.time,
      title: this.myform.value.title,
      email: this.currentUser,
      id: id
    });
  }

  removeData(d, a) {
    console.log("awd");
    const awd = this.db.list('events', ref => ref.orderByChild('id').equalTo(a.id));
    awd.valueChanges().subscribe(ko => console.log(ko));
  }

  handleEvent(e, ev) {
    console.log(ev)
    const awd = this.db.list('events', ref => ref.orderByChild('id').equalTo(ev.id));
    let y = this.db.list('events').snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, ...action.payload.val() }));
    }).subscribe(items => {
      return items.map(item => {
        if(item.id === ev.id && item.email === this.currentUser) {
          this.db.list('events').remove(item.key);
        }
      });
    });


  }

  remove(ref) {

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
    this.myform.controls['date'].setValue(date.toISOString().substring(0, 10));
 
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
