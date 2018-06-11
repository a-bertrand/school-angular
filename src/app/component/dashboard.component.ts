import { Component, OnInit } from '@angular/core';

import { Hero }        from './../class/hero';
import { HeroService } from './../service/hero.service';

@Component({
  selector: 'my-dashboard',
  templateUrl: './../views/dashboard.component.html',
  styleUrls: [ './../css/dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private heroService: HeroService) { }

  ngOnInit(): void 
  {
    this.heroService.getHeroes()
      .then(heroes => this.heroes = heroes.slice(0, 4));
  }
}
