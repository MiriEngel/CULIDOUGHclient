import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AuthenticationService} from '../authentication.service';

@Component({
  selector: 'signin',
  templateUrl: 'signin.template.html'
})
export class SigninComponent { 
	errorMessage: string;
	credentials: any = {};

	constructor (private _authenticationService: AuthenticationService, private _router: Router) {

	}

	signin() {
		this._authenticationService.signin(this.credentials).subscribe(result  =>
		//  window.location.reload(),
		 this._router.navigate(['/']), 
																	   error =>  this.errorMessage = error );
	}
}