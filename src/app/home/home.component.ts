import {Component} from '@angular/core';
// import {AuthenticationService} from '../authentication/authentication.service';

import { Router } from '@angular/router';


    


@Component({
	selector: 'home',
	templateUrl: 'home.template.html', 
	styleUrls: ['home.component.css'],
	//  providers: [ArticlesService]
})
export class HomeComponent {
	
	user: any;
	searchCity:string='';
	searchDoc:string;
	mailDetails:any = {};
	// cities: any = ["Lod","Tel Aviv","Jerusalem","Kfar Saba","Or Yehuda","Azor","Bat Yam","Ramat Gan","Holon","Ashdod","Beersheba","Yehud","Rishon LeZion","Hazav","Ness Ziona","Eilat","Rehovot","Herzliya","Nahariya","Haifa","Shave Ziyyon","Ramat HaSharon","Ramat Poleg","Kadima","Karmi'el","Pardesiyya","Netanya","Gan Yavne","Petah Tikwah","Ashqelon","Savyon","Naham","Mazkeret Batya","`Arugot","Ofaqim","Shetulim","Hadera","Qiryat Bialik","Tel Mond","Hod HaSharon","Qiryat Yam","Shelomi","Binyamina","Liman","`Alma","Ramla","Nazareth","Et Taiyiba","Rinnatya","Yavne","Acre","Nazerat `Illit","Baraq","Even Yehuda","Nesher","Pardes Hanna Karkur","Netivot","Tirat Karmel","Or `Aqiva","Kefar Yona","Bet Oren","Haluz","Biriyya","Gan Hayyim","Qiryat Tiv`on","Qiryat Gat","Be'er Toviyya","`En Ayyala","Misgav Regional Council","Safed","Gedera","Dimona","Bet Shemesh","`En HaShelosha","Herut","Mazor","Shamir","Ra'anana","Bat Hadar","Rosh Ha'Ayin","Zoran","Tirat Yehuda","Bareqet","Elyakhin","Hadid","Hadar Ramatayim","Modiin","Hazor Ashdod","Kefar Daniyyel","Newe Efrayim","Talme Menashe","Kefar Netter","Mazliah","Moran","Shoval","Ramat Aviv","Afiqim","Ramat Dawid","Sde Warburg","Magen","Karkur","Qiryat Ata","Maghar","Bet Alfa","Timrat","Elyaqim","Bet Dagan","Ginnosar","Qiryat Mal'akhi","Hadar `Am","maalot Tarshiha","Ahituv","Qiryat Motzkin","Migdal","Bat Hefer","Ben Shemen-Kefar Hano`ar","Emunim","Tiberias","Mikhmoret","Hever","Ramat Yishay","Sderot","Gimzo","Mesillat Ziyyon","Pasuta","Bet She'an","Newe Yamin","Nordiyya","HaKarmel","Gibbeton","Qiryat Ono","Sarid","Nir Zevi","Ramat Ef`al","Bene Ziyyon","Hurfeish","Shefayim","Dabburiya","Rishpon","Mizpe Netofa","Sde Boker","Yaqum","Bahan","Jaffa","Allonim","`Evron","Hazor HaGelilit","Ramot Naftali","Giv`at Hayyim","Urim","Sedot Yam","`Aseret","Nirim","`Amir","Ganne Tiqwa","Ma`agan Mikha'el","Qiryat Hayyim","Kefar Witqin"];
	constructor () {
		// this.user = _authenticationService.user;
	}

	 public model: any;

	 ngOnInit(){
// 		 this.initParams();

// 		 		let searchBox: any = document.getElementById('search-box1');
// 		let options = {  types: ['(cities)'],  componentRestrictions: {country: "il"}};
//   	var autocomplete = new google.maps.places.Autocomplete(searchBox, options);

//     //check address input and update vars
//     autocomplete.addListener( 'place_changed', () => {
//       //if address is unknown or missing data then alert & offer to add manually on the map
//       if (autocomplete.getPlace().address_components !== undefined){
//         // let missingField = this.checkAddressComplete(autocomplete.getPlace().address_components);
// this.searchCity = autocomplete.getPlace().address_components[0].short_name;
//       }
      
//     });  
	 }

	 changeDoc(str){
		 this.searchDoc = str;
	 }
	 search(){
		 
		//  if(this.searchCity == '')
		// 	this._router.navigate(['/articles']) 

		// else{
		// let searchStr = `city=${this.searchCity}`;
		// this._router.navigate(['/articles', searchStr,'list'])
		// }
	 }

	 	sendMail(){
			 alert('ddddddddddddddddddd');
	let searchStr =`email=popapp.place@gmail.com&emailHTML=from:${this.mailDetails.from}title:${this.mailDetails.title}content:${this.mailDetails.content}phone:${this.mailDetails.phone}`;
		// this._coreService.sendMail(searchStr).subscribe(
		// 		notifications => {
		// 		 alert('email sent')
		// 		},
		// 	 error => alert('error   mail')//this._router.navigate([''])
		// 	);

	}
	initParams(){
// this.mailDetails.from = '';
// this.mailDetails.title = '';
// this.mailDetails.content = '';


	}
//   formatter = (result: string) => result.toUpperCase();

//   search = (text$: Observable<string>) =>
//     text$
//       .debounceTime(200)
//       .distinctUntilChanged()
//       .map(term => term === '' ? []
//         : this.cities.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

}