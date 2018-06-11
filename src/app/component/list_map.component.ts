import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Map }          from './../class/map';
import { MapService }   from './../service/map.service';

@Component({
  selector: 'my-list-map',
  templateUrl: './../views/list_map.component.html',
  styleUrls: [ './../css/list_map.component.css' ]
})
export class List_MapComponent implements OnInit 
{
  list_map    : Map[];
  selected_map :number;

  constructor(
    private mapService: MapService,
    private router: Router) { }

  getList_Map(): void 
  {
    this.mapService
        .getList_Map()
        .then(list_map => this.list_map = list_map);
  }
// ----------------------------------------------------------
  onSelect(id: number): void { console.log(id) 
    this.selected_map = id; }
// ----------------------------------------------------------

  ngOnInit(): void 
  { 
    this.getList_Map();  
  }
}