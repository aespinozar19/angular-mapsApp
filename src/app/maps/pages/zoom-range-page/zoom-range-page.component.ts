import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy{


  @ViewChild('map') divMap?: ElementRef;

  public currentZoom: number = 10;
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-76.98692345489785, -11.953821229424904);

  ngAfterViewInit(): void {
    if ( !this.divMap ) throw 'El elemtno HTML no fue encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.currentZoom , // starting zoom
      });
      this.mapListeners();
  }

  ngOnDestroy(): void {
    // this.map?.off('move', () => {
    //   this.currentLngLat = this.map!.getCenter();
    //   const { lng, lat } = this.currentLngLat;
    // });
    this.map?.remove();
  }

  mapListeners() {
    if ( !this.map ) throw 'El mapa no existe';

    this.map.on('zoom', (ev) => {
      console.log(ev);
      this.currentZoom = this.map!.getZoom();
    });

    this.map.on('zoomend', (ev) => {
      if ( this.map!.getZoom() < 18 ) return;
      this.map!.zoomTo(18);
    });

    this.map.on('move', () => {
      this.currentLngLat = this.map!.getCenter();
      const { lng, lat } = this.currentLngLat;
      //jl {lng: -76.98692345489785, lat: -11.953821229424904}
    });

  }

  zoomIn() {
    this.map?.zoomIn();
  }

  zoomOut() {
    this.map?.zoomOut();
  }

  zoomChanged( value: string ) {
    this.currentZoom = Number(value);
    this.map?.zoomTo( this.currentZoom );
  }

}
