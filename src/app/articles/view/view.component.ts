import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ArticlesService } from '../articles.service';


declare var google: any;
declare var map: any;


@Component({
	selector: 'view',
	templateUrl: 'view.template.html',
	styles: [
		`
  .my-class {
    background-color: yellow;
  }
  `
	]
})
export class ViewComponent {

	@ViewChild('ref') ref;
	user: any;
	article: any;
	routingObserver: any;
	errorMessage: string;
	allowEdit: boolean = false;
	isClassVisible: any = false;
	dateRange: any = {};
	listDates: any;
	imgToggleCount: number = 0;
	map = null;
	titleAlert:string ='';
	order:any = {};

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		private _authenticationService: AuthenticationService,
		private _articlesService: ArticlesService,
		) { }


	ngOnInit() {
		this.user = this._authenticationService.user
		this.routingObserver = this._route.params.subscribe(params => {
			let articleId = params['articleId'];
			this._articlesService
				.read(articleId)
				.subscribe(
				article => {
					this.article = article;
					this.allowEdit = (this.user && this.user._id === this.article.creator._id);
					this.initOrderDatesArray();
					this.loadMap();
				},
				error => this._router.navigate(['/articles'])
				);
		});

		this.order.phone== '';
		this.order.content = '';
	}

	loadMap() {
		setTimeout(() => {
			this.map = new google.maps.Map(document.getElementById('assetMap'), {
				center: { lat: this.article.location[1], lng: this.article.location[0] },
				zoom: 12,
				disableDefaultUI: true,
				streetViewControl: false,
				zoomControl: true,
				draggable: false,
				mapTypeControl: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});
		}, 0);
	}

	initOrderDatesArray() {

	}

	//toggle img index to view in gallery
	toggleImg(next) {
		if (next) {
			if (this.article.imgUrl.length > (this.imgToggleCount + 1))
				this.imgToggleCount++;
			else
				this.imgToggleCount = 0;
		} else {
			if ((this.imgToggleCount) == 0)
				this.imgToggleCount = this.article.imgUrl.length - 1;
			else
				this.imgToggleCount--;
		}
	}

	ngOnDestroy() {
		this.routingObserver.unsubscribe();
	}

	delete() {
		this._articlesService.delete(this.article._id).subscribe(deletedArticle => this._router.navigate(['/articles']),
			error => this.errorMessage = error);
	}


	

	sendOrderDateRequest() {
		if(this.order.phone == '' || this.order.content == '')
		this.titleAlert = 'יש למלא את כל השדות';
	  
		else{
		 this.article.orderPhone = this.order.phone;
		 this.article.orderContent = this.order.content;
		this._articlesService.insertOrderDates(this.article).subscribe(order =>
		 this.pushNotificatinToOwnAsset(order),
		 error => this.titleAlert = error);
		}
	   }
	   pushNotificatinToOwnAsset(order) {
		var message = {
		 text: 'bla bla pushNotificatinToOwnAsset',
		 user: this.article.creator._id,
		 articleId: this.article._id,
		 orderId:order._id
		};
	  
		// this._chatService.emit('NotificationOrderRequest', message);
		this.titleAlert = 'הבקשה נשלחה בהצלחה';
	   }

	// changeColor(){
	// 	setTimeout(() => {
	// 		this.isClassVisible = !this.isClassVisible;
	// 	}, 500);


	// }	
}

