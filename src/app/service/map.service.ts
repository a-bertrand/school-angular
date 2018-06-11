import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Map } from './../class/map';

@Injectable()
export class MapService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private mapurl = 'api/map';  // URL to web api

  constructor(private http: Http) { }

  getMap(id: number): Promise<Map> {
    const url = `${this.mapurl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as Map)
      .catch(this.handleError);
  }
  getList_Map(): Promise<Map[]> 
  {
     return this.http.get(this.mapurl)
       .toPromise()
       .then(response => response.json() as Map[])
       .catch(this.handleError);
  }
  delete(id: number): Promise<void> 
  {
    const url = `${this.mapurl}/${id}`;
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }
// ----------------------------------------------------------
// Ajouter Heroe 
  create(map_array : any[],description : string): Promise<Map> 
  {
    console.log("create",map_array,description)
    return this.http
      .post(this.mapurl, {map:map_array,description:description}, {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
// ----------------------------------------------------------
  update(map: Map): Promise<Map> {
    const url = `${this.mapurl}/${map.id}`;
    return this.http
      .put(url, JSON.stringify(map), {headers: this.headers})
      .toPromise()
      .then(() => map)
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> 
  {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error); }
}