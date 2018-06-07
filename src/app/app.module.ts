import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
import { HttpModule }           from '@angular/http';

import { AppRoutingModule }     from './app-routing.module';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';

import { AppComponent }         from './component/app.component';
import { DashboardComponent }   from './component/dashboard.component';

import { HeroesComponent }      from './component/heroes.component';
import { HeroDetailComponent }  from './component/hero-detail.component';
import { HeroService }          from './service/hero.service';
import { HeroSearchComponent }  from './component/hero-search.component';

import { StuffService}          from './service/stuff.service';
import { StuffComponent }       from './component/stuff.component';
import { StuffDetailComponent}  from './component/stuff-detail.component';

import { MapComponent }         from './component/map.component';
import { MapService }           from './service/map.service';
import { List_MapComponent }    from './component/list_map.component';

import { GameComponent }        from './component/game.component';

@NgModule({
  imports: 
  [
    BrowserModule,
    FormsModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    AppRoutingModule
  ],
  declarations: 
  [
    AppComponent,
    DashboardComponent,
    HeroDetailComponent,
    HeroesComponent,
    StuffComponent,
    MapComponent,
    GameComponent,
    List_MapComponent,
    StuffDetailComponent,
    HeroSearchComponent
  ],
  providers: [ HeroService, StuffService, MapService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
