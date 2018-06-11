// Creation d'équipement. 

import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Stuff }          from './../class/stuff';
import { StuffService }   from './../service/stuff.service';

@Component({
  selector: 'my-stuffes',
  templateUrl: './../views/stuff.component.html',
  styleUrls  : [ './../css/stuff.component.css' ]
})
export class StuffComponent implements OnInit 
{
  stuffes: Stuff[];
  selectedStuff: Stuff;

  constructor(
    private stuffService: StuffService,
    private router: Router) { }

  getStuffes(): void 
  {
    this.stuffService
        .getStuffes()
        .then(stuffes => this.stuffes = stuffes);
  }
// ----------------------------------------------------------
// Ajouter Stuff 
  add(name: string, description : string,name_modif : string,value_modif:number ): 
  void 
  {
    name     	    = name.trim();
    description   = description.trim();
    name_modif    = name_modif.trim();
    value_modif   = value_modif;

    if (!name && !description) { return; }
      this.stuffService.create(name, description,value_modif,name_modif)
        .then(stuff => {
          this.stuffes.push(stuff);
          this.selectedStuff = null;
        });
    console.log(this.stuffes);
  }
// ----------------------------------------------------------
  delete(stuff: Stuff): void 
  {
    this.stuffService
        .delete(stuff.id)
        .then(() => {
          this.stuffes = this.stuffes.filter(h => h !== stuff);
          if (this.selectedStuff === stuff) { this.selectedStuff = null; }
        }); 
   }

  ngOnInit(): void { this.getStuffes(); }

  onSelect(stuff: Stuff): void { this.selectedStuff = stuff; }

  gotoDetail(): void {
    this.router.navigate(['/stuff_detail', this.selectedStuff.id]);
  }
}