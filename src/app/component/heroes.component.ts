import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Hero }          from './../class/hero';
import { HeroService }   from './../service/hero.service';

import * as d3 from "d3"; 

@Component({
  moduleId: module.id,
  selector: 'my-heroes',
  templateUrl: './../views/heroes.component.html',
  styleUrls: [ './../css/heroes.component.css' ]
})
export class HeroesComponent implements OnInit 
{
  heroes            :   Hero[];
  selectedHero      :   Hero;
  fill_hero         :   [string, number,number,number,number];
  newhero           :   boolean;
  number_point      :   number;
  current_add_hero  :   Hero;

  // Pour l'affichage des erreurs
  allisok          : boolean;
  error_toomuch    : boolean;
  error_notenough  : boolean;

  constructor(
    private heroService: HeroService,
    private router: Router) { }

    ngOnInit(): void 
    { 
      this.getHeroes();  
      this.autofillinput(); 
      this.newhero = false;
    }
// ----------------------------------------------------------
// Ajoute un Hero 
  add(name: string,attack   : number, damage   : number, hp    :  number,  dodge    :  number ): void 
  {
    name     = name.trim();
    attack   = attack;
    damage   = damage;
    hp       = hp;
    dodge    = dodge;
    if (!name && !attack && !damage && !hp && !dodge && this.allisok == false) { return; }
      this.heroService.create(name, attack, damage, hp, dodge)
        .then(hero => {
          this.heroes.push(hero);
          this.selectedHero = null;
        });
  }
// ----------------------------------------------------------
  delete(hero: Hero): void 
  {
    this.heroService
        .delete(hero.id)
        .then(() => {
          this.heroes = this.heroes.filter(h => h !== hero);
          if (this.selectedHero === hero) { this.selectedHero = null; }
        }); 
   }
// ----------------------------------------------------------   
  getHeroes(): void 
  {
    this.heroService
        .getHeroes()
        .then(heroes => this.heroes = heroes);
  }
  onSelect(hero: Hero): void { this.selectedHero = hero; }
  gotoDetail(): void {  this.router.navigate(['/detail', this.selectedHero.id]); }
  // ----------------------------------------------------------
  // Géneration random d'un héros
  autofillinput():void
  {
    var nb_pts = 40;
    var max_value = 20;
    // --------------------------
    var atk       = Math.floor(Math.random() * (0 + max_value));
    nb_pts = nb_pts - atk;
    if(nb_pts<=20){max_value = nb_pts;}
    // --------------------------
    var hp        = Math.floor(Math.random() * (0 + max_value));
    nb_pts = nb_pts - hp;
    if(nb_pts<=20){max_value = nb_pts;}
    // --------------------------
    var damage    = Math.floor(Math.random() * (0 + max_value));
    nb_pts = nb_pts - damage;
    // --------------------------
    var dodge;
    if(nb_pts<=20){dodge = nb_pts;}
    else { dodge     = Math.floor(Math.random() * (0 + max_value))}
    // --------------------------  
    var nametab   = [ "Malcolm","Mark","Marlon","Augustus","Algeorn","Gabrielle","Gwen","June","Margaret","Patricia"];
    this.update_nbpoint(atk,damage,hp,dodge);
    this.fill_hero = [nametab[Math.floor(Math.random() * (0 + nametab.length))],atk,hp,damage,dodge];
  }
  // ---------------------------------------------------------- 
  new_hero()
  {
    if(this.newhero == false){this.newhero = true;}
    else{this.newhero = false;}
  }
  // ----------------------------------------------------------
  // Interaction 
  update_nbpoint(attack, damage, hp, dodge)
  {
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
    }
    console.log(this.allisok)
  }
  hide_error_message():void
  {
    this.error_notenough=false;
    this.allisok=false;
    this.error_toomuch=false;
  }
  // ----------------------------------------------------------
  // Draw mini bar chart 
  draw(hero): void
  {  
    console.log('on draw',hero);
    // ------------------------------------------------------
    function generate_bar(receive_data, class_name,max_value, cur_width, cur_height)
    {
         cur_width  = parseInt(cur_width) ;
         cur_height = parseInt(cur_height);
        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 15, bottom: 25, left: 15},
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
    //d3.select("#bar-"+hero.id).remove();
    var data = [];
    var i = 0;
    for (var el in hero)
    {
      if(el=="id")
      { /* NOTHING */ }
      else if (el == "name")
      { /* NOTHING */}
      else
      {
        data[i]= {"label":el.toUpperCase(),"value":hero[el]}; 
        i++;  
      }    
    }
    // ------------------------------------------------------
    // generate_bar(receive_data, class_name,max_value,width,height))
    var width  = "300px";
    var height = "200px"; 
    generate_bar(data,"#bar-"+hero.id,20,width.replace("px",""),height.replace("px",""));

  }// End of draw
}