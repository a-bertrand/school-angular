import 'rxjs/add/operator/switchMap';
import { Component, OnInit,Input }      from '@angular/core';
import { ActivatedRoute, Params }       from '@angular/router';
import { Location }                     from '@angular/common';

import { Hero }                         from './../class/hero';
import { HeroService }                  from './../service/hero.service';

import * as d3 from "d3"; 

@Component({
  moduleId: module.id,
  selector: 'my-hero-detail',
  templateUrl: './../views/hero-detail.component.html',
  styleUrls: [ './../css/hero-detail.component.css' ]
})
export class HeroDetailComponent implements OnInit {
 @Input() hero: Hero;

 number_point:number;
  // Pour l'affichage des erreurs
  allisok          : boolean;
  error_toomuch    : boolean;
  error_notenough  : boolean;

  constructor(
    private heroService: HeroService,
    private route      : ActivatedRoute,
    private location   : Location
  ) {}
  ngOnChanges(): void 
  {
    this.draw(this.hero)
  }
  ngOnInit(): void 
  {
    this.route.params
      .switchMap((params: Params) => this.heroService.getHero(+params['id']))
      .subscribe(hero => this.hero = hero );
    this.route.params
      .switchMap((params: Params) => this.heroService.getHero(+params['id']))
      .subscribe(hero => this.draw(this.hero) );
      if(this.hero != null)
      {
        this.draw(this.hero)
      }
  }
  save(): void {
    this.heroService.update(this.hero)
      .then(() => this.goBack());
  }
  onchange_save(attack, damage, hp, dodge)
  {
    console.log("onchange_save")
    this.update_nbpoint(attack, damage, hp, dodge);
    this.draw(this.hero);
  }

  goBack(): void 
  {
    this.location.back();
  }
   // ------------------------------------------------------ 
  // Interaction
  update_nbpoint(attack, damage, hp, dodge)
  {
    console.log(attack,damage,hp,dodge)
    this.number_point = 40 -  (parseInt(attack) + parseInt(damage) + parseInt(hp) + parseInt(dodge));
    this.hide_error_message();
    if(this.number_point < 0 )
    {
      this.error_toomuch=true;
    }
    else if (this.number_point > 0) 
    {
      this.error_notenough=true;
    }
    else // Si 0 -> OK 
    {
      this.allisok=true;
      this.heroService.update(this.hero);
    }
  }
  hide_error_message():void
  {
    this.error_notenough=false;
    this.allisok=false;
    this.error_toomuch=false;
  }
  // ------------------------------------------------------ ------------------------------------------------------
  // Draw D3 SVG TIME 
  draw(hero): void
  {  
    // ------------------------------------------------------
    function generate_bar(receive_data, class_name,max_value, cur_width, cur_height)
    {
         cur_width  = parseInt(cur_width) ;
         cur_height = parseInt(cur_height);
        // set the dimensions and margins of the graph
        var margin = {top: 50, right: 50, bottom: 30, left: 50},
            width  = cur_width - margin.left - margin.right,
            height = cur_height - margin.top - margin.bottom;
        // ------------------------------------------------------------------------------------------------------------------     
        // set the ranges
        var x = d3.scaleBand()
                  .range([0, width])
                  .padding(0.1);
        var y = d3.scaleLinear()
                  .range([height, 0]);
                  
        var svg = d3.select(class_name).append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", 
                          "translate(" + margin.left + "," + margin.top + ")");
          
        // ------------------------------------------------------------------------------------------------------------------  
        var color = d3.scaleOrdinal(d3.schemeCategory10);                     // Array de couleur. 
        var data = receive_data;                                              // init data.
        // Scale the range of the data in the domains
        x.domain(receive_data.map(function(d) { return d.label; }));
        y.domain([0, d3.max(receive_data, function(d) { return parseInt(max_value); })]);
        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")   // pour chaque rect :
              .attr("class", "bar")
              .attr("x", function(d) { return x(d['label']); })
              .attr("width", x.bandwidth())
              .attr("y", function(d) { return y(d['value']); })
              .attr("height", function(d) { return height - y(d['value']); })
              .style("fill", function(d,i)  
                { 
                  return color(""+i);  
                 });
        // add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y));
    }
    // ------------------------------------------------------
    // ---- Generate formated data 
    // Format data : 
    //     name : Stat   //    value : valeur de la stat
    d3.select('svg').remove();
    var data = [];
    var i = 0;
    for (var el in this.hero)
    {
      if(el=="id")
      { /* NOTHING */ }
      else if (el == "name")
      { /* NOTHING */}
      else
      {
        data[i]= {"label":el.toUpperCase(),"value":this.hero[el]}; 
        i++;  
      }    
    }
    // ------------------------------------------------------
    // generate_bar(receive_data, class_name,max_value,width,height))
    var width  = window.getComputedStyle(document.getElementById("barchart")).getPropertyValue("width");
    var height = "400px"; 
    generate_bar(data,"#barchart",20,width.replace("px",""),height.replace("px",""));

  }// End of draw
} 

