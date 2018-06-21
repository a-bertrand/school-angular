// TUNNEL DE JEU 
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router }            from '@angular/router';

import { Hero }          	from './../class/hero';
import { HeroService }   	from './../service/hero.service';
import { HeroesComponent }  from './../component/heroes.component';

import { List_MapComponent }     from './../component/list_map.component';
import { MapService }    		 from './../service/map.service';
import { Map }         			 from './../class/map';

import * as d3 from "d3";  

@Component({
  selector: 'my-game',
  host: {
        '(document:keydown)': 'handleKeyboardEvent($event)'
    },
  templateUrl: './../views/game.component.html',
  styleUrls: [ './../css/game.component.css' ]
})
export class GameComponent implements OnInit 
{
	step0 : boolean;
	step1 : boolean;
	step2 : boolean;
	step3 : boolean;
	chosen_map_id   : number;
	chosen_map : Map;
	chosen_hero : Hero;
	@ViewChild(HeroesComponent) heroes: HeroesComponent // Permet de lire les cariable dans les component applelé. 
	@ViewChild(List_MapComponent) 	map: List_MapComponent // Permet de lire les cariable dans les component applelé. 
	
	constructor(
	private mapService: MapService,private router: Router) { }
	//----//----//----//----//----//----//----//----//----//----//----//----//----//----
	handleKeyboardEvent(event) 
	{ 
	    event.stopPropagation();
	    var key = "";
	    if      (event.key =="ArrowLeft")  { key = "left";   this.move_char(key);  }
	    else if (event.key =="ArrowUp")    { key = "top";    this.move_char(key);  }
	    else if (event.key =="ArrowDown")  { key = "bot" ;   this.move_char(key);  }       
	    else if (event.key =="ArrowRight") { key = "right";  this.move_char(key);  } 
	}
	ngOnInit(): void 
	{ 
		this.step0=true;
	}
	//----//----//----//----//----//----//----//----//----//----//----//----//----//----
	//----//----//----//----//----//----//----//----//----//----//----//----//----//----
	startgame()
	{
		this.step1 =true;
		this.step0=false;
	}
	endless_move_monster()
	{
		//console.log('coucou')
		setInterval(()=>{    //<<<---    using ()=> syntax
		      this.move_monster()
		 }, 800);
		
	}
	//----//----//----//----//----//----//----//----//----//----//----//----//----//----
	choose_heros()
	{
		if (this.heroes.selectedHero != null)
		{
			this.chosen_hero=this.heroes.selectedHero;
			this.step2 =true;
			this.step1=false;
		}
		else
		{
			// TODO DISPLAY MESSAGE

		}
		
	}
	//----//----//----//----//----//----//----//----//----//----//----//----//----//----
	display_plyaer_information()
	{
	}
	//----//----//----//----//----//----//----//----//----//----//----//----//----//----
	choose_map()
	{
		if (this.map.selected_map != null)
		{
			
			this.step3 =true;
			this.step2=false;
			this.display_map();
		}
		else
		{
			// TODO DISPLAY MESSAGE
			

		}
	}
 	//----//----//----//----//----//----//----//----//----//----//----//----//----//----
 	display_map():void
 	{

 		// --------
 		// Global
 		var taille = 10;
 		var id = "#box_map";
 		// --------
 		let new_this = this;
 		let get_map  = this.mapService.getMap(this.map.selected_map);
 		get_map.then
 		(function(val) 
	 		{
				new_this.init_payer_information()
 				new_this.update_payer_information();
	 			new_this.chosen_map = val;  // sauvegarde de la map choisi
		 		var svg = d3.select(id)
			      .append("svg")
			      .attr('id','svg_map')
			      .attr('width', 650)
			      .attr('height', 650)
			     ;
			     // ------ Creation d'une map sous le svg
			     // map
			     var graph = svg.append('g')
			      .attr("transform", "translate(" + 0+ "," + 0 + ")");

			    graph = graph.append('g')
			      .attr('pointer-events', 'all')
			      // @todo Not sure it is very clean to use a nested element as
			      // a clip path.
			      .attr('clip-path', 'url(#map-area)')
			    ;  
				var hauteurQ = 60;
			    var width  = taille*hauteurQ +20; 
			    var height = taille*hauteurQ + 20;
			    var nclick = 0;
			    var color =['white','blue','green'];

	            var group = graph.append('g')
			      .attr('id', 'map')
			      .style('stroke','black')
			      .attr("transform", "translate(" + 10 + "," + 10 + ")")  
			    ;
	            for (var i = 0; i < val.map.length;i++)
			    {
			    	// 0 position x du carrée 1 position y du carrée  
			    	// 2 valeur de la case : 0 -> vide 1 -> herbe  etc...   3 Si = 1 :-> Cthulhu Si 2 :-> Début Joueur
		    		// -----------------------------		
		    		// Niveau 1 
		    		// verdur
		    		var x = val.map[i][0]
		    		var y = val.map[i][1]

		    		if(val.map[i][2] == 1)
		    		{
		    			group.append('image')
				          .attr('class', 'carre' )
				          .attr('x', x * hauteurQ)
				          .attr('y', y * hauteurQ )
				          .attr('width', hauteurQ)
				          .attr('height', hauteurQ)
				          .attr('xlink:href', "/assets/image/grass.jpeg" );
		    		}
		    		// mur
		    		else if(val.map[i][2] == 2)
		    		{
			    		group.append('image')
				          .attr('class', 'carre' )
				          .attr('x', x * hauteurQ)
				          .attr('y', y * hauteurQ )
				          .attr('width', hauteurQ)
				          .attr('height', hauteurQ)
				          .attr('xlink:href', "/assets/image/wall.jpeg" );
		    		}
		    		else
		    		{
		    			group.append('rect')
			    			.attr('x', x * hauteurQ )
			    			.attr('y', y  * hauteurQ )
			    			.attr('width',hauteurQ)
			    			.attr('height',hauteurQ)
			    			.style('fill', "transparent")
		    		}
		    		// Niveau 2 de la map 
		    		// -------------
		    		if(val.map[i][3] == 1)
		    		{
		    			group.append('image')
				          .attr('class', 'cthulhu' )
				          .attr("id",""+x*hauteurQ+"/"+y*hauteurQ)
				          .attr('x', x * hauteurQ)
				          .attr('y', y * hauteurQ )
				          .attr('width', hauteurQ)
				          .attr('height', hauteurQ)
				          .attr('xlink:href', "/assets/image/cthulhu.png" );
		    		}
		    		else if(val.map[i][3] == 2)
		    		{
		    			group.append('image')
				          .attr('class', 'player' )
				          .attr("id",""+x*hauteurQ+"/"+y*hauteurQ)
				          .attr('x', x * hauteurQ)
				          .attr('y', y * hauteurQ )
				          .attr('width', hauteurQ)
				          .attr('height', hauteurQ)
				          .attr('xlink:href', "/assets/image/player.jpeg" );
		    		}
			    }
        });
       	this.endless_move_monster() 
 	} 
 	// Interaction
 	//----//----//----//----//----//----//----//----//----//----//----//----//----//----
    move_char(key_pressed):void
    {
    	if(this.step3 ==true)
    	{
   			// TODO GLOBALISER TAILLE
	      	var width_case    = 60;
	      	var xy_id = d3.select(".player").attr("id").split("/");
	      	var old_x = parseInt(xy_id[0]);
	      	var old_y = parseInt(xy_id[1]);
	      	// Test si en dehors ou mur. 
	      	// 
		      if      (key_pressed =="top")     { var new_x = old_x; var new_y = old_y - width_case  }
		      else if (key_pressed =="bot")     { var new_x = old_x; var new_y = old_y + width_case  }
		      else if (key_pressed =="left")    { var new_x = old_x - width_case; var new_y = old_y  }    
		      else if (key_pressed =="right")   { var new_x = old_x + width_case; var new_y = old_y  }   
	      	// permet d'avoir la bonne position sans lespace
		    var true_x = new_x / width_case;
		    var true_y = new_y /  width_case;
		    var position_inarray = true_x+""+true_y;
		    var position_inarray_int = parseInt(position_inarray);
		    // sur un mur ? hors de la map ? 
	      	if (this.chosen_map.map[position_inarray_int][2]==2 || this.chosen_map.map[position_inarray_int] == null  )
      		{ 
      			// DO NOTHING 
      			// console.log(" mouvement stoppé car : ",this.chosen_map.map[position_inarray_int][2],this.chosen_map.map[position_inarray_int] )
      		}
	      	else 
	      	{
	      		d3.select(".player").remove();
			    d3.select('#svg_map').append("image")
			          .attr("id",""+new_x+"/"+new_y)
			          .attr('class', 'player' )
			          .attr("x", new_x)
			          .attr("y", new_y)
			          .attr("width",  width_case)
			          .attr("height", width_case)
			          .attr("xlink:href","/assets/image/player.jpeg")
	      	}
	      }
    }
    move_monster():void
    { 
    	// TODO factoriser avec player
    	var width_case    = 60;
		var xy_id = d3.select(".cthulhu").attr("id").split("/");
	  	var old_x = parseInt(xy_id[0]);
	  	var old_y = parseInt(xy_id[1]);
    	var movement_rendom = Math.floor((Math.random() * 4)+1); 
    	console.log("random",movement_rendom)
    	if      (movement_rendom ==1)   { var new_x = old_x; var new_y = old_y - width_case  }
        else if (movement_rendom ==2)   { var new_x = old_x; var new_y = old_y + width_case  }
        else if (movement_rendom ==3)   { var new_x = old_x - width_case; var new_y = old_y  }    
        else if (movement_rendom ==4)   { var new_x = old_x + width_case; var new_y = old_y  } 
      	var true_x = new_x / width_case;
		var true_y = new_y /  width_case;
		var position_inarray = true_x+""+true_y;
		var position_inarray_int = parseInt(position_inarray);
    	if (this.chosen_map.map[position_inarray_int][2]==2 || this.chosen_map.map[position_inarray_int] == null  )
  		{ 
  			// Si le random amene à un movement oû il y a rien -> recommencer
  			this.move_monster();
  		}
      	else 
      	{
	    	d3.select(".cthulhu").remove();
		    d3.select('#svg_map').append("image")
		          .attr("id",""+new_x+"/"+new_y)
		          .attr('class', 'cthulhu' )
		          .attr("x", new_x)
		          .attr("y", new_y)
		          .attr("width",  width_case)
		          .attr("height", width_case)
		          .attr("xlink:href","/assets/image/cthulhu.png")
		          console.log("prochain qui est la:",this.chosen_map.map[position_inarray_int])

		    if(d3.select(".cthulhu").attr("id") === d3.select(".player").attr("id"))
  			{
	  			this.chosen_hero.hp = this.chosen_hero.hp - 1;
	  			console.log("HP : ",this.chosen_hero.hp);
	  			this.update_payer_information();
	  		}
		} 
    }
    init_payer_information():void
    {
    	d3.select("#player_information_hp")
    	d3.select("#player_information_hp")
    		.append('svg')
    		.attr('id','full_hp_bar')
    		.attr('width',this.chosen_hero.hp*20)
    		.attr('height',20)
    			.append('rect')
	    		.attr('x',0)
	    		.attr('y',0)
	    		.attr('width',this.chosen_hero.hp*20)
	    		.attr('height',20)
	    		.style('fill', "transparent")
	    		.style("stroke-width","1px")
					.style("stroke","black")
    }
    update_payer_information():void
    {
    	d3.select("#current_hp_bar").remove();
    	d3.select("#full_hp_bar")
    		.append('rect')
    			.attr('id',"current_hp_bar")
	    		.attr('x',0)
	    		.attr('y',0)
	    		.attr('width',this.chosen_hero.hp*20)
	    		.attr('height',20)
	    		.style('fill', "red")
    }
    pathfinding()
    {
    	var char_xy_id = d3.select(".player").attr("id").split("/");
      	var char_pos_x = parseInt(xy_id[0]);
      	var char_pos_y = parseInt(xy_id[1]);

		var monster_xy_id = d3.select(".cthulhu").attr("id").split("/");
	  	var monster_post_x = parseInt(xy_id[0]);
	  	var monster_post_y = parseInt(xy_id[1]);
    }
}
