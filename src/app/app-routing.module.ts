import { NgModule }               from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';
import { DashboardComponent }     from './component/dashboard.component';

import { HeroesComponent }        from './component/heroes.component';
import { HeroDetailComponent }    from './component/hero-detail.component';

import { StuffDetailComponent} 	  from './component/stuff-detail.component';
import { StuffComponent }  		    from './component/stuff.component';

import { MapComponent }  		      from './component/map.component';
import { List_MapComponent }      from './component/list_map.component';
import { GameComponent }  		    from './component/game.component';

const routes: Routes = 
[
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard',  		component: DashboardComponent },

  { path: 'stuffes',  			    component: StuffComponent },
  { path: 'stuff_detail:id',  	component: StuffDetailComponent },

  { path: 'detail/:id', 		component: HeroDetailComponent },
  { path: 'heroes',     		component: HeroesComponent },
  { path: 'game',				    component: GameComponent},
  
  { path: 'list_map',        component: List_MapComponent},
  { path: 'map',				     component: MapComponent}

];

@NgModule(
{
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}