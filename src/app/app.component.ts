import { Component, type OnInit } from '@angular/core';
import type * as Leaflet from 'leaflet';

declare let L: typeof Leaflet; // Now L has proper typing

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public ngOnInit(): void {
    if (!navigator.geolocation) {
      console.warn('location is not supported!');
    }

    let map = L.map('map');

    navigator.geolocation.getCurrentPosition((position) => {
      const coords = position.coords;

      const { latitude, longitude } = coords;

      map.setView([latitude, longitude], 13);

      var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> ',
        maxZoom: 19,
      });

      osm.addTo(map);

      L.marker([latitude, longitude]).addTo(map);
    });

    let desLat = 0;

    let id = navigator.geolocation.watchPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        if (latitude === desLat) {
          navigator.geolocation.clearWatch(id);
        }

        L.marker([latitude, longitude]).addTo(map);
      },
      (error) => {
        if (error.code === 1) alert('Por favor ative o GPS do dispositivo!');

        alert('Não foi posível obter a localização!');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }
}
