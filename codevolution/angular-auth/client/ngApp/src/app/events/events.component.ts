import { Component } from '@angular/core';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {
  events=[];
  constructor(private _eventService:EventService){}

  ngOnInit(){
    this._eventService.getEvents().subscribe({
      next:(res)=>{
        this.events=res;
      },
      error:(error)=>{
        console.log("error--getEvents",error);
      }
    })
  }
}
