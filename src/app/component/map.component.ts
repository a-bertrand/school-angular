import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import * as d3 from "d3";  

import { Map }          from './../class/map';
import { MapService }   from './../service/map.service';

@Component({
  moduleId: module.id,
  selector: 'my-map',
  templateUrl: './../views/map.component.html',
  styleUrls: [ './../css/map.component.css' ]
})
export class MapComponent implements OnInit 
{
  selected_object:string;
  step1:boolean;
  step2:string;
  step3:string;
  click_element :number;
  new_map       : any[];
  map           : Map;
  selected_map  : number;

  constructor(
    private mapService: MapService,
    private router: Router) { }

  // ----------------------------------------
  update_element(val):void
  {
    this.click_element = val;
  }
  // ---------------------------------------
  ngOnInit(): void {  }
  // ----------------------------------------

  draw_case(id,svg,x,y,width_case, element_selected): void
  {
    svg.append("rect")
      .attr("class", "map_case")
      .attr("x", x)
      .attr("y", y)
      .attr("width",  width_case)
      .attr("height", width_case)
      .style("fill","transparent")
      .style("stroke-width","1px")
      .style("stroke","black")
      .on("click", clickevent)
     ;
    function clickevent()
    {
    //  svg.selectAll("image").remove();
      svg.append("image")
        .attr("id",""+x+"/"+y)
        .attr("x", x+1)
        .attr("y", y+1)
        .attr("width",  width_case-2)
        .attr("height", width_case-2)
        .attr("xlink:href","../image/"+element_selected+".jpeg")
    }
  }  // END OF DRAW CASE
  // ----------------------------------------
  save(description):void
  {
    this.mapService.create(this.new_map,description);
  }
  // --------------------------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------------------------------------
  // DRAW D3 
  //---
  init_drawmap(id,taille) : void
  {
    this.new_map = [];
    this.draw_map (id,taille)
  }
  draw_map (id,taille) : void
  {
    var map = new Array() ;
    var item_id = []; 
    for (var i=0; i < taille; i++ )
    { 
      map [i] = new Array() ;
      for(var j=0; j < taille; j++ )   
        {   
          map[i][j] = 0;
          var cont = new Array() ; 
          cont[0] =  j; // position x du carrée 
          cont[1] =  i; // position y du carrée 
          cont[2] =  0; // valeur de la case : 0 -> vide 1 -> herbe  etc... 
          cont[3] =  0; // Si = 1 :-> Cthulhu Si 2 :-> Début Joueur 
          item_id.push(cont);
        }
    }
    this.new_map = item_id;
    // ----------------------------------------
    // ----------------------------------------
    // Start To Draw 
    // Gobal configuration 
    var hauteurQ = 50;
    var width  = taille*hauteurQ +20; 
    var height = taille*hauteurQ + 20;
    var nclick = 0;
    var color =['white','blue','green'];
    // -----------------------------
    var selectbc = 0 ;
    d3.selectAll('svg').remove();
    var ecart = 5;
    var svg = d3.select(id)
      .append("svg")
      .attr('width', width+200)
      .attr('height', height+200)
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
    // BOrdure 

    var group = graph.append('g')
      .attr('id', 'map')
      .attr("transform", "translate(" + 10 + "," + 10 + ")")  
    ;
   

  var zoomer = d3.zoom().scaleExtent([-200, 1])
    .on('zoom', function () {
      var e = d3.event;
      group.attr(
        'transform',
        'translate('+ e.transform.x +') scale('+ e.transform.y +')scale(' + d3.event.transform.k + ')'
      );
    })
  ;
  svg.call(zoomer).on('dblclick.zoom', null);

  //***************************************************************** 
  // Dessine le cadrillage
  // mise a jour
  var rect = group.selectAll('rect').data(item_id);
  let self = this;
  
  rect.enter().append('rect')
    .attr("id","rect_map")
    .attr('x', function (d,i) {return item_id[i][0]*hauteurQ;})
    .attr('y', function (d,i) {return item_id[i][1]*hauteurQ;})
    .attr('width',hauteurQ)
    .attr('height',hauteurQ)
    .style('fill', "transparent")
    .style('stroke','black')
    .on('mousedown', function(d,i){self.mousedownQ(d,i,group,this)})
  ;
  // efface les objets non lié
  rect.exit().remove()
}
// END OF DRAW MAP
  // --------------------------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------------------------------------
  // Event function 
   mousedownQ (old_d,old_i,group,el):void
    {
      let self = this;

      if ( this.click_element == 1 )
      {
        d3.select(el).remove();
        group.append('image')
          .attr('class', 'carre' )
          .attr('x', (old_d[0])*50 )
          .attr('y', (old_d[1])*50 )
          .attr('width', 50)
          .attr('height', 50)  
          .on('mousedown', function(){self.mousedownQ(old_d,old_i,group,this)})
          .attr('xlink:href', "../image/grass.jpeg" );
          this.new_map[old_i]=[old_d[0],old_d[1],this.click_element,this.new_map[old_i][3]]
         // Update map 
      }
      else if ( this.click_element == 2 ) 
      {
        d3.select(el).remove();
        group.append('image')
          .attr('class', 'carre' )
          .attr('x', (old_d[0])*50 )
          .attr('y', (old_d[1])*50 )
          .attr('width', 50)
          .attr('height', 50)
          .on('mousedown', function(){self.mousedownQ(old_d,old_i,group,this)})
          .attr('xlink:href', "../image/wall.jpeg" );
          this.new_map[old_i]=[old_d[0],old_d[1],this.click_element,this.new_map[old_i][3]]
      }
      //  Niveau 2 de la map
      else if ( this.click_element == 3 ) 
      {
        d3.select("#cthulhu").remove();
        group.append('image')
          .attr("id","cthulhu")
          .attr('class', 'carre' )
          .attr('x', (old_d[0])*50 )
          .attr('y', (old_d[1])*50 )
          .attr('width', 50)
          .attr('height', 50)
          .on('mousedown', function(){self.mousedownQ(old_d,old_i,group,this)})
          .attr('xlink:href', "../image/cthulhu_icon.png" );
          this.new_map[old_i]=[old_d[0],old_d[1],this.new_map[old_i][2],1]
      }
       else if ( this.click_element == 4 ) 
      {
        d3.select("#player").remove();
        group.append('image')
          .attr("id","player")
          .attr('class', 'carre' )
          .attr('x', (old_d[0])*50 )
          .attr('y', (old_d[1])*50 )
          .attr('width', 50)
          .attr('height', 50)
          .on('mousedown', function(){self.mousedownQ(old_d,old_i,group,this)})
          .attr('xlink:href', "../image/player.jpeg" );
          this.new_map[old_i]=[old_d[0],old_d[1],this.new_map[old_i][2],2]
      }
      console.log(this.new_map[old_i])
      //  Niveau 2  Maj map information
      
    }   //  END OF MOUSEDOW EVENT   
    // ------------------------------------------

}