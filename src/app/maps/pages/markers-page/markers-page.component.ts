import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

interface MarkerAndColor {
  color: string,
  marker: Marker,
}

interface PlainMarker {
  color: string,
  lngLat: number[],
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent implements AfterViewInit, OnDestroy{

  @ViewChild('map') divMap?: ElementRef;

  public markers: MarkerAndColor[] = [];

  public currentZoom: number = 13;
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-76.98692345489785, -11.953821229424904);

  ngOnDestroy(): void {

  }

  ngAfterViewInit(): void {
    if ( !this.divMap ) throw 'El elemtno HTML no fue encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.currentZoom , // starting zoom
    });

    this.readFromLocalStorage();

    //Creando marcadores
    // const markerHtml = document.createElement('div');
    // markerHtml.innerHTML = 'Anthony Espinoza'

    // const marker = new Marker({
    //     // color: 'red'
    //     element: markerHtml,
    //   })
    //   .setLngLat( this.currentLngLat )
    //   .addTo( this.map );
  }

  createMarker() {
    if ( !this.map ) return;

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map?.getCenter();

    this.addMarker( lngLat, color );
  }

  addMarker ( lngLat: LngLat, color: string = 'red' ){
    if ( !this.map ) return;

    const marker = new Marker({
        color: color,
        draggable: true,
      })
      .setLngLat( lngLat )
      .addTo( this.map );

      this.markers.push({ color, marker, });
      this.saveToLocalStorage();

      marker.on('dragend', () => {
        this.saveToLocalStorage()
      });
  }

  deleteMarker( index: number ){
    this.markers[index].marker.remove();
    this.markers.splice( index, 1 );
  }

  flyTo( marker: Marker ) {
    if ( !this.map ) return;
    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat(),
    });
  }

  saveToLocalStorage() {
    console.log( this.markers );
    const plainMarkers: PlainMarker[] = this.markers.map( ({ color, marker }) => {
      return {
        color,
        lngLat: marker.getLngLat().toArray(),
      }
    } );
    console.log( plainMarkers );
    localStorage.setItem('plainMarkers', JSON.stringify( plainMarkers ) )
  }

  readFromLocalStorage() {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse( plainMarkersString ); //! Puede ser inseguro
    console.log(plainMarkers);

    plainMarkers.forEach( ({ color, lngLat }) => {
      const [ lng, lat ] = lngLat;
      const coords = new LngLat(  lng, lat );

      this.addMarker( coords, color );
    } );

  }

}
