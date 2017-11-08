import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx'; // import all rxjs
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class InfoService{
    apiGroup: string = '1';
    apiUrl: string = `http://sos/core/api/groups/${this.apiGroup}`;
    constructor(private http: Http){
        
    }
    getInfo(){
        return this.http.get(this.apiUrl)
        .map(
            (res: Response) => res.json().GroupUsers)
            .catch(
                (error:any) =>{
                    
                    return Observable.throw(error.json().message || 'Server error')
                }
                );
    }
}
//    getInfo(){
//         return this.http.get(this.apiUrl).map((res: Response) => {
//             console.log(res.json['GroupUsers'])
//             return res.json['GroupUsers']
//         });
//     }