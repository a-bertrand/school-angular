/*
	export class Stuff 
	{
	  id			: number;
	  name			: string;
	  description 	: string;
	}
*/

import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Stuff } from './../class/stuff';

@Injectable()
export class StuffService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private stuffesUrl = 'api/stuffes';  // URL to web api

  constructor(private http: Http) { }

  getStuffes(): Promise<Stuff[]> {
    return this.http.get(this.stuffesUrl)
               .toPromise()
               .then(response => response.json().data as Stuff[])
               .catch(this.handleError);
  }

  getStuff (id: number): Promise<Stuff> {
    const url = `${this.stuffesUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Stuff)
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.stuffesUrl}/${id}`;
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }
// ----------------------------------------------------------
// Ajouter Stuffe 
  create(name,description,value_modif,name_modif): Promise<Stuff> 
  {
    return this.http
      .post(this.stuffesUrl, {name: name, description:description, value_modif:value_modif, name_modif:name_modif}, {headers: this.headers})
      .toPromise()
      .then(res => res.json().data)
      
      .catch(this.handleError);
  }
// ----------------------------------------------------------

  update(Stuff: Stuff): Promise<Stuff> {
    const url = `${this.stuffesUrl}/${Stuff.id}`;
    return this.http
      .put(url, JSON.stringify(Stuff), {headers: this.headers})
      .toPromise()
      .then(() => Stuff)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}