import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService 
{


  createDb() {
    let heroes = 
    [
        {
            "id"		: 	1,
            "name"		: 	"Jean heros",
            "attack" 	: 	10,
            "defense" 	: 	10,
            "damage" 	: 	9,
            "dodge"     :   4,
            "hp"		:	10
        },
        {
            "id"        :   2,
            "name"      :   "Maverick",
            "attack"    :   6,
            "defense"   :   7,
            "damage"    :   9,
            "dodge"     :   8,
            "hp"        :   11
        },


    ];
    let stuffes = 
    [{
        "id"               : 1,
        "name"             : "Sword",
        "description"     : "A big sword",
        "value_modif"      : 4,
        "name_modif"       : "force"
    }];
    // ----------------------------------
    // Generation d'une map 
    var init_map = new Array() ;
    var item_id = []; 
    for (var i=0; i < 10; i++ )
    { 
      init_map [i] = new Array() ;
      for(var j=0; j < 10; j++ )   
        {   
          init_map[i][j] = 0;
          var cont = new Array() ; 
          cont[0] =  j; // position x du carrée 
          cont[1] =  i; // position y du carrée 
          if(i==0 || i==9)     {cont[2] =  2;} // valeur de la case : 0 -> vide 1 -> herbe 2-> mur etc... 
          else if(j==0 || j==9){cont[2] =  2;}
          else
          {
              cont[2] =  1;
          }
          if     (j==1 && i==1) {cont[3] =  1;} // Si = 1 :-> Cthulhu Si 2 :-> Début Joueur 
          else if(i==8 && j==8) {cont[3] =  2;}
          else {cont[3] =  0;}

          item_id.push(cont);
        }
    }

    let map = 
    [{
        "id"          : 1,
        "map"         : item_id,
        "description" : "Fisrt map arene",
    }];


    return {heroes,stuffes,map};
  }
}
