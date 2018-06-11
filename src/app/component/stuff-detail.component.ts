// Stuff-detail 

import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';

import { Stuff }        	from './../class/stuff';
import { StuffService } 	from './../service/stuff.service';

@Component(
{
  selector: 'my-stuff-detail',
  templateUrl: './../views/stuff-detail.component.html',
  styleUrls: [ './../css/stuff-detail.component.css' ]
})
export class StuffDetailComponent implements OnInit 
{
  stuff: Stuff;

  constructor(
    private stuffService: StuffService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void 
  {
    this.route.params
      .switchMap((params: Params) => this.stuffService.getStuff(+params['id']))
      .subscribe(stuff => this.stuff = stuff);
  }

  save(): void 
  {
    this.stuffService.update(this.stuff)
      .then(() => this.goBack());
  }

  goBack(): void 
  {
    this.location.back();
  }
}
