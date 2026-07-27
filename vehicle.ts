import { Component, Signal } from '@angular/core';
import { vehicleListComponent } from "./vehicle.list-component";

@Component({
  selector: 'app-vehicle',
  imports: [vehicleListComponent],
  templateUrl: './vehicle.html',
  styleUrl: './vehicle.css',
})
export class Vehicle {

  Vehicles = [
    {
      "id":1,
      "MF":"Tata",
      "Model":"Sierra",
      "Price":"22,00,000",
      "Imageurl":"https://img.autocarindia.com/ExtraImages/20251208101541_Tata_Sierra_Front_Quarter_Tracking_1.jpg"
    },
    {
      "id":2,
      "MF":"Mahindra",
      "Model":"XUV 700",
      "Price":"27,00,000",
      "Imageurl":"https://cdni.autocarindia.com/ExtraImages/20221111060434_XUV700_front_image.jpg"
    },
    {
      "id":3,
      "MF":"Hyundai",
      "Model":"Creta",
      "Price":"25,00,000",
      "Imageurl":"https://cdni.autocarindia.com/ExtraImages/20240116071500__Creta%20First%20Drive%20Web%20Resized%20and%20Watermarked._003.jpeg"
    }
  ]
}
