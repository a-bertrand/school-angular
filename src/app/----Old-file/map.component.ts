import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import * as d3 from "d3";  


@Component({
  moduleId: module.id,
  selector: 'my-map',
  templateUrl: './../views/map.component.html',
  host: {
        '(document:keydown)': 'handleKeyboardEvent($event)'
    },
  styleUrls: [ './../css/map.component.css' ]
})
export class MapComponent implements OnInit 
{
  selected_object:string;
  step1:boolean;
  step2:string;
  step3:string;

  constructor(
    private router: Router) { }

 // ----------------------------------------

  handleKeyboardEvent(event) 
  { 
    event.stopPropagation();
    console.log(event)
    var key = "";
    if      (event.key =="ArrowLeft")  { key = "left";   this.move_char(key);  }
    else if (event.key =="ArrowUp")    { key = "top";    this.move_char(key);  }
    else if (event.key =="ArrowDown")  { key = "bot" ;   this.move_char(key);  }       
    else if (event.key =="ArrowRight") { key = "right";  this.move_char(key);  } 
  }
  // ----------------------------------------

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
      console.log("this element : ",element_selected)
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
  draw_map (id,taille) : void
  {
    console.log("this element : ",this.selected_object)
    // Si 10x10
    // ----------------------------------------
    // Global configuration
    var width_case    = 50;
    var width         = width_case * taille;
    var height        = width_case * taille;
    // ----------------------------------------
    console.log(id)
    var svg = d3.select(id).append("svg")
                .attr("width", width )
                .attr("height", height )
                .append("g")
              ;
    // Identifier chaque case : 
    // id : xy
   
    var i = 0;
    var j = 0;

    // On remplit ligne par ligne
    while(i < taille)
    {
      j = 0 ;
      var y = i * width_case;
      while(j < taille)
      {
        var x = j * width_case;
        var el_id = ""+j+""+i;      // id de l'élément 
        this.draw_case(el_id,svg,x,y,width_case,this.selected_object);
        j++;
      }
      i++;
    }
  }// END OF DRAW MAP
  // ----------------------------------------
  move_char(key_pressed):void
  {

    // TODO GLOBALISER TAILLE
    var width_case    = 50;

    var xy_id = d3.select("image").attr("id").split("/");
    var old_x = parseInt(xy_id[0]);
    var old_y = parseInt(xy_id[1]);

    if      (key_pressed =="top")     { var new_x = old_x; var new_y = old_y - width_case  }
    else if (key_pressed =="bot")     { var new_x = old_x; var new_y = old_y + width_case  }
    else if (key_pressed =="left")    { var new_x = old_x - width_case; var new_y = old_y  }    
    else if (key_pressed =="right")   { var new_x = old_x + width_case; var new_y = old_y  }   

    d3.select("image").remove();
    d3.select('svg').append("image")
        .attr("id",""+new_x+"/"+new_y)
        .attr("x", new_x+2)
        .attr("y", new_y+2)
        .attr("width",  width_case-4)
        .attr("height", width_case-4)
        .attr("xlink:href","../image/cthulhu_icon.png")
  }
  // -----------------------------
  select_item (item):void
  {
    this.selected_object=item.trim();
    // select ALL rect and update click event
  }

  // -------------

  
}