import { Component, input } from '@angular/core';
 
@Component({
  selector: 'vehicle-list',
  imports: [],
  templateUrl: './vehicle.list-component.html',
  standalone:true
 
})
export class vehicleListComponent{
 
  Vehicles=input<any[]>([]);
}   

