import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

@Component({
  selector: 'map-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css']
})
export class MiniMapComponent implements AfterViewInit {

  public currentZoom: number = 13;
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-76.98692345489785, -11.953821229424904);


  @ViewChild('map') divMap?: ElementRef;

  @Input() lngLat?: [number, number];

  ngAfterViewInit(): void {
    if ( !this.lngLat ) throw "LngLat can't be null";
    if ( !this.divMap ) throw 'El elemtno HTML no fue encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat, // starting position [lng, lat]
      zoom: 15, // starting zoom
      interactive: false,
    });

    new Marker()
      .setLngLat( this.lngLat )
      .addTo( this.map );
  }

}
