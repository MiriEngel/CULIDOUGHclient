
export enum eAmenities {

}

export enum eAssetType{

}
export enum eOrderStatus{
    'ok',
    'new',
    'cancel'
}
export class articleModel{


    title:string
    content:string
    location:  [number]
    address:  string				
    imgUrl: [string]
    assetType: string
    amenities: [string]
    city: string
    street: string
    streetNumber: number
    country:string
    size:number
    startDate:Date
    endDate:Date
    price: {
        day: number,
        week:  number,
        month:  number,
        currencyType: string
    }
  

}
