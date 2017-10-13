import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ArticlesService } from '../articles.service';
import { articleModel, eAssetType, eAmenities } from '../article.model';
 


declare var google: any;
declare var map: any;
const URL = 'api/articles/uploadPics';



@Component({
  selector: 'create',
  templateUrl: 'create.template.html',
})
export class CreateComponent {

  // LOCAL PARAMS 
  optionsAssetType: string[] = Object.keys(eAssetType);
  optionsAmenities: string[] = Object.keys(eAmenities);
  rFormStep1: FormGroup;
  //rFormStep2 : FormGroup; 
  rFormStep3: FormGroup;
  rFormStep4: FormGroup;
  rFormStep5: FormGroup;

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  article: any = {};
  errorMessage: string;
  post: any;

  showSpinner: boolean = false;
  imgTemps: any;
  map = null;
  mapMoved = false;
  imgGallery: any = [];
  imgGalleryUploaded: any = [];  //load to display images when editing
  imgFileArr: any = [];
  isLocationComplete: boolean = false;
  location: any = {};
  titleAlert: string = 'This field is required';
  flagIsEdit: boolean = false;
  routingObserver: any;
  isVisibleFurnitureTxt:boolean = false;

  filesToUpload: Array<File> = [];
  


  // CONSTRUCTOR
  constructor(
    private _router: Router,
    private _articlesService: ArticlesService,
    private http: Http,
    private elRef: ElementRef,
    private fb: FormBuilder, private ref: ChangeDetectorRef,
    private _route: ActivatedRoute) {
      
    //if opening edit page load asset info
    this.routingObserver = this._route.params.subscribe(params => {
      if (params['articleId'] != undefined) {
        this.flagIsEdit = true;
        let articleId = params['articleId'];
        this._articlesService.read(articleId).subscribe(
          article => {
            this.article = article;
            this.imgGalleryUploaded = this.article.imgUrl;
          },
          error => {
            alert('failed to load asset page. \nplease try again.');
            this._router.navigate(['/articles']);
          }
        );
      }
    });
  }

  ngOnInit() {
    this.initParams();

    // ADDRESS FIELD INIT+LISTENER
    let searchBox: any = document.getElementById('search-box');
    let options = { types: ['geocode',] };
    var autocomplete = new google.maps.places.Autocomplete(searchBox, options);
    //check address input and update vars
    autocomplete.addListener('place_changed', () => {
      //if address is unknown or missing data then alert & offer to add manually on the map
      if (autocomplete.getPlace().address_components !== undefined) {
        let missingField = this.checkAddressComplete(autocomplete.getPlace().address_components);
        if (missingField !== '') {
          this.location.number = '';
          this.location.street = '';
          this.location.city = '';
          this.location.country = '';
          alert(missingField + ' field is missing \nplease type again or choose directly on the map');
          this.isLocationComplete = true;
        }
        else {
          this.isLocationComplete = false;
          this.bindAddressFields(autocomplete.getPlace().address_components)
          //add here flag to approve that given address is good so can move to next step
          //set map center
          this.placeChanged(
            autocomplete.getPlace().geometry.location.lat(),
            autocomplete.getPlace().geometry.location.lng(),
            autocomplete.getPlace().formatted_address
          );
          this.map.setCenter(autocomplete.getPlace().geometry.location);
        }
      } else {
        alert('unknown address. please try again');
        this.isLocationComplete = true;
      }
    });
  }//end of ngoninit


  //upload article to server with images
  createArticle() {
    // if (this.flagIsEdit == false) {
    //   this.showSpinner = true;
    //   //if user added images upload them then create article
    //   if (this.imgGallery.length > 0) {
    //     this.uploadImagesToServer().then(imgLinks => {
    //       imgLinks.forEach(imgLink => this.article.imgUrl.push(imgLink));
    //       this.uploadArticle();
    //     })
    //   }
    //   else
    //     this.uploadArticle();
    // }
    // else {
    //   this._articlesService.update(this.article).subscribe(
    //     updateddArticle => this.navigate(updateddArticle),
    //     error => this.errorMessage = error);
    // }
  }

  //send to create new article 
  uploadArticle() {
    this._articlesService.create(this.article).subscribe(
      createdArticle => { this.navigate(createdArticle); this.showSpinner = false; },
      error => {
        this.errorMessage = error;
        this.showSpinner = false;
        alert('failed to upload article! \nplease try again \nerror: ' + error);
      })
  }


  navigate(createdArticle) {
    this._router.navigate(['/articles', createdArticle._id])
  }

  //////////////////////////////////////
  /////// FORM STEPS MANAGMENT ////////

  nextStep() {
    var $active = this.elRef.nativeElement.querySelector('.multi-page-form-content.active');
    var selects = this.elRef.nativeElement.querySelectorAll('.form-nav .form-nav-item.completed');
    selects = selects[selects.length - 1];
    selects.nextElementSibling.classList.add('completed');
    $active.classList.remove('active');
    $active.nextElementSibling.classList.add('active')
  }

  prevStep() {
    var active = this.elRef.nativeElement.querySelector('.multi-page-form-content.active');
    var lastCompleted = this.elRef.nativeElement.querySelectorAll('.form-nav .form-nav-item.completed');
    lastCompleted = lastCompleted[lastCompleted.length - 1];
    lastCompleted.classList.remove('completed');
    active.classList.remove('active');
    active.previousElementSibling.classList.add('active');
  }

  // check fields before going to next step
  postStep1(post) {
    if (!this.rFormStep1.valid) {
      this.markFormGroupTouched(this.rFormStep1);
      return;
    }
    this.article.title = post.title;
    this.article.content = post.content;
    this.article.price.day = post.priceDay;
    this.article.price.week = post.priceWeek;
    this.article.price.month = post.priceMonth;
    this.article.size = post.size;
   
    this.nextStep();
  }

  postStep2(post) {
    this.nextStep();
  }


  postStep3(post) {
    if (!this.rFormStep3.valid) {
      this.markFormGroupTouched(this.rFormStep3);
      return;
    }
    this.nextStep();
  }

  postStep4(post) {
    this.nextStep()
  }

  postStep5(post) {
    if (!this.rFormStep5.valid) {
      this.markFormGroupTouched(this.rFormStep5);
      return;
    }
    this.article.startDate = post.startDate;
    this.article.endDate = post.endDate;
    this.article.phone = post.phone;
    this.createArticle();
  }
  /////// END OF FORM STEPS MANAGMENT ////////

  onchange(select: any) {
    this.article.assetType = select;
  }

  onchangeAmenities(event) {
    let item = event.currentTarget.innerText.trim();
    if (event.target.checked)
      this.article.amenities.indexOf(item) === -1 ? this.article.amenities.push(item) : console.log('cc');
    else
      this.article.amenities = this.article.amenities.filter(i => i !== item);

      if(item == 'ריהוט')
      this.isVisibleFurnitureTxt = event.target.checked;

  }


  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  initParams() {
    this.optionsAssetType = this.optionsAssetType.slice(this.optionsAssetType.length / 2);
    this.optionsAmenities = this.optionsAmenities.slice(this.optionsAmenities.length / 2);
    this.article.assetType = this.optionsAssetType[0];
    this.article.amenities = [];
    this.article.imgUrl = [];
    this.article.assetType = '';
    this.article.price = {};

    this.rFormStep1 = this.fb.group({
      'title': [null, Validators.required],
      'content': [null, Validators.required],
      'priceDay': [null, Validators.required],
      'priceWeek': [null, Validators.required],
      'priceMonth': [null, Validators.required],
      'assetType':[null, Validators.required],
      'size':[null, Validators.required],
    });

    this.rFormStep3 = this.fb.group({
      'location': [null, Validators.required],
      'country': [null, Validators.required],
      'city': [null, Validators.required],
      'street': [null, Validators.required],
      'streetNumber': [null, Validators.required],
    });

    this.rFormStep5 = this.fb.group({
      'startDate': [null, Validators.required],
      'endDate': [null, Validators.required],
      'phone': [null, Validators.required]
    });
  }

  //////////////////////////////////////////////////////////
  ///////////////// IMG PROCCESSING ///////////////////////

  //load chosen img to cache and for preview 
  loadImg(event) {
    //temp params
    this.imgTemps = event.target.files[0];  //get the img that was chosen
    let fileReader = new FileReader();
    let tempImg = new Image();
    let canvas = document.createElement('canvas');
    let imgH = 0;
    let imgW = 0;
    let ctx = canvas.getContext("2d");
    const maxSize = 500;  //image size limit 

    //load img to cache
    fileReader.readAsDataURL(event.target.files[0]);
    fileReader.onload = (e) => {
      tempImg.src = fileReader.result;
      tempImg.onload = () => {
        //get img dimentions and change size according to maxSize
        imgW = tempImg.width;
        imgH = tempImg.height;
        if (tempImg.width > tempImg.height) {
          if (tempImg.width > maxSize) {
            canvas.width = maxSize;
            canvas.height = tempImg.height * (maxSize / tempImg.width);
          } else {
            canvas.width = tempImg.width;
            canvas.height = tempImg.height;
          }
        } else {
          if (tempImg.height > maxSize) {
            canvas.height = maxSize;
            canvas.width = tempImg.width * (maxSize / tempImg.height);
          } else {
            canvas.width = tempImg.width;
            canvas.height = tempImg.height;
          }
        }
        //draw new img
        ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);
        this.imgGallery.push(canvas.toDataURL('image/jpeg'));
        //make small copy for later 
        //add here min to small img and insert to smallImgGallery

      }
    }
  }

  // //call async func to upload images from preview and return array of links
  // uploadImagesToServer(): Promise<any> {
  //   let promise: any;
  //   promise = new Promise((resolve, reject) => {
  //     this.imgUploader.uploadImagesToS3(this.imgGallery).then((res) => {
  //       resolve(res);
  //     });
  //   });
  //   return promise;
  // }

  // //test upload all img from button
  // uploadImages() {
  //   this.imgUploader.uploadImagesToS3(this.imgGallery).then((res) => {
  //     res.forEach(res => { console.log(res); });
  //     alert('finished uploading');
  //     return res;
  //   });
  // }


  // //remove uploaded img from preview
  // removeImg(i) {
  //   //add here to check to erase img from db if this image was already uploaded 
  //   //remove item from view+uploader queues
  //   this.imgGallery.splice(i, 1);
  // }
  // //delete an image that was already uploaded when editing 
  // removeImgExisting(i) {
  //   //remove link from S3
  //   this.imgUploader.deleteFromS3(this.imgGalleryUploaded[i], '').then((res)=>{
  //     if (res){  //if successfuly erased then 
  //       //update local params and the article in the DB
  //       this.article.imgUrl.splice(i, 1);      //remove link from article
  //       this.imgGalleryUploaded.splice(i, 1);  //remove link from local cache
  //       //update article in the DB
  //     }
  //   });
  // }


  //rotate img option
  rotateImg(i) {
    var canvas = document.createElement('canvas');
    var tempImg = new Image();
    tempImg.src = this.imgGallery[i];

    tempImg.onload = () => {
      canvas.width = tempImg.height;
      canvas.height = tempImg.width;
      var ctx = canvas.getContext('2d');
      ctx.save();
      ctx.translate(tempImg.height / 2, tempImg.width / 2);
      ctx.rotate(90 * (Math.PI / 180));
      ctx.drawImage(tempImg, -(tempImg.width / 2), -(tempImg.height / 2));
      ctx.restore();
      this.imgGallery[i] = canvas.toDataURL("image/jpeg");
    }
  }
  ///////////////// END OF IMG PROC /////////////////

  /////////////// LOCATION FUNCTIONS /////////////

  //// map init when opening address input page
  loadMap() {
    setTimeout(() => {
      this.map = new google.maps.Map(document.getElementById('mapCreate'), {
        center: { lat: 32.078985, lng: 34.774306 },
        zoom: 12
      });
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.map.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
          this.map.setZoom(14);
          console.log(position.coords);
        });
      }
      //save flag if user moved map 
      this.map.addListener('dragstart', () => {
        this.mapMoved = true;
      });
      //resolve the address from dragging the map
      this.map.addListener('dragend', () => {
        this.geoToString();
      });
    }, 0);
  }


  getAddressValidator(condition) {
    return function fullAddressValidator(control: FormGroup): { invalid: boolean } {
      if (condition) {
        return null;
      } else {
        return { invalid: false };
      }
    }
  }

  bindAddressFields(address_components) {
    this.article.streetNumber = this.location.number = address_components[0].short_name;
    this.article.street = this.location.street = address_components[1].short_name
    this.article.city = this.location.city = address_components[2].short_name;
    this.article.country = this.location.country = address_components[4].long_name;
    this.ref.detectChanges();
  }

  //when address changed update artice
  placeChanged(lat, lng, address) {
    this.article.location = [];
    this.article.location[0] = lng;
    this.article.location[1] = lat;
    this.article.address = address;
  }
  //check if all needed address fields exist  
  checkAddressComplete(address) {
    let count = 0;
    let missing = '';
    let addressFields = ['street_number', 'route', 'locality', 'country'];
    try {
      addressFields.forEach(field => {
        address.forEach(val => {
          if (val.types[0] == field)
            missing = field;
        });
        if (missing == '')
          throw { field };
        else
          missing = '';
      });
    } catch (e) {
      return e.field;
    }
    return missing;
  }

  //listen if press enter in address field
  chooseAddressKeyPress(keyPress) {
    if (keyPress.keyCode == 13) {
      alert('choose an adress from autocomplete /nor move the map to choose manually');
      keyPress.stopPropagation();
    }
  }
  //translate geo coordinates to string  
  geoToString() {
    // let geocoder = new google.maps.Geocoder();
    // let meh = this.map.getCenter();
    // geocoder.geocode({ location: meh }, (result, status) => {
    //   if (status === 'OK') {
    //     //! check what to do if no translation to string available
    //     if (result[0]) {
    //       this.placeChanged(
    //         result[0].geometry.location.lat(),
    //         result[0].geometry.location.lng(),
    //         result[0].formatted_address
    //       );
    //       this.bindAddressFields(result[0].address_components);
    //       //update search box with location string
    //       let x = document.getElementById('search-box');
    //       x.placeholder = '';
    //       x.value = result[0].formatted_address;
    //     }
    //   } else {  //if no resolve
    //     alert('map service unavailable. please try again \nerror:' + status);
    //   }
    // });
  }

  /////////////// END LOCATION FUNCTIONS /////////////


  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }




}

