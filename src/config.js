import { NetInfo,AsyncStorage,Alert }from 'react-native'

import I18n, { getLanguages } from 'react-native-i18n';
import { StackActions,NavigationActions } from 'react-navigation';

export let googleConfig={
  // iosClientId: "3333333-sssd3333eeedd4444.apps.googleusercontent.com",//Moaz App
  // webClientId: "3333333-sssd3333eeedd4444.apps.googleusercontent.com"//Moaz App
}

// Enable fallbacks if you want `en-US`
// and `en-GB` to fallback to `en`
I18n.fallbacks = true;

I18n.translations = {
  'en': require('./langs/en.json'),
  'ar': require('./langs/ar.json'),
};

/*import { wordsar } from './langs/ar'
import { wordsen } from './langs/en'*/

let languageSession = AsyncStorage.getItem('language')
export let language
////console.log(typeof languageSession,languageSession)
if(languageSession!=null&&'string'==typeof languageSession){
  language=languageSession
  I18n.local='en'
}else{
  language='ar'
  I18n.local='ar'
}

// var words=require('langs/ar.js')

export let base = 'http://test.egazweb.com/eccommerce/'

// export let baseUrl =base+I18n.local+'/mobile/'
export let baseUrl =base+'api/v1/'
export const baseUploadUrl = base+'upload/'
export const commonheaders= {
  'Accept': 'application/json',
  'client':'sssss-ddddd-fffff-gggggg',//changed after that
  'secret':'wwwww-rrrr-gggg-nnnn'
}
// export const headers={...commonheaders,...{"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"}}
export const headers={...commonheaders,...{"Content-Type": "application/json"}}
// headers['Content-Type']="application/x-www-form-urlencoded;charset=UTF-8"
// delete commonheaders[Content-Type']
////console.log('commonheaders',commonheaders)
////console.log('headers',headers)
// export const preventDoubleTapHack = (component: any, doFunc: Function) => {
export const preventDoubleTapHack = (component: any,navigate,params) => {
  if (!component.wasClickedYet__ULJyRdAvrHZvRrT7) {
      //  eslint-disable-next-line no-param-reassign
      component.wasClickedYet__ULJyRdAvrHZvRrT7 = true;
      setTimeout(() => {
        //  eslint-disable-next-line no-param-reassign
        component.wasClickedYet__ULJyRdAvrHZvRrT7 = false;
      }, 700);
      // doFunc();
      component.props.navigation.navigate(navigate,params);
  }
};
export const preventDoubleNavigat = (navigation,navigate,params) => {
  if (!navigation.wasClickedYet__ULJyRdAvrHZvRrT7NN) {
      //  eslint-disable-next-line no-param-reassign
      navigation.wasClickedYet__ULJyRdAvrHZvRrT7NN = true;
      setTimeout(() => {
        //  eslint-disable-next-line no-param-reassign
        navigation.wasClickedYet__ULJyRdAvrHZvRrT7NN = false;
      }, 700);
      // doFunc();
      console.log('preventDoubleNavigat',params)
      navigation.push(navigate,params);
  }
};
export const resetNavigation = (component: any,navigate,params,index) => {
  index=index?index:0
  if (!component.wasClickedYet_Reset_ULJyRdAvrHZvRrT7) {
    //  eslint-disable-next-line no-param-reassign
    component.wasClickedYet_Reset_ULJyRdAvrHZvRrT7 = true;
    setTimeout(() => {
      //  eslint-disable-next-line no-param-reassign
      component.wasClickedYet_Reset_ULJyRdAvrHZvRrT7 = false;
    }, 700);

    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        // NavigationActions.navigate({ routeName: 'Home',params:{changeLang:true} }),
        NavigationActions.navigate({ routeName: navigate,params:params }),
      ],
    });
    component.props.navigation.dispatch(resetAction);

  }
};
export const resetToOrderInfoNavigation = (component: any,navigate,params) => {
  if (!component.wasClickedYet_Reset_ULJyRdAvrHZvRrT7) {
    //  eslint-disable-next-line no-param-reassign
    component.wasClickedYet_Reset_ULJyRdAvrHZvRrT7 = true;
    setTimeout(() => {
      //  eslint-disable-next-line no-param-reassign
      component.wasClickedYet_Reset_ULJyRdAvrHZvRrT7 = false;
    }, 700);

    const resetAction = StackActions.reset({
      index: 3,
      actions: [
        NavigationActions.navigate({ routeName: 'Home',params:{changeLang:true} }),
        NavigationActions.navigate({ routeName: 'MyDrawer',params:{title:L('categories'),navigateToShoppingCart:async () => {
            const { navigation } = component.props
            component.navigationListener = navigation.addListener('willFocus', async (payload) => {
              component.navigationListener.remove()
              // alert('will home willFocus')
              let shoppingCartItems=await AsyncStorage.getItem('shoppingCartItems')
              shoppingCartItems=shoppingCartItems?JSON.parse(shoppingCartItems):[]
              // alert(shoppingCartItems.length+"\n"+component.props.navigation.state.params.cartProducts)
              component.props.navigation.setParams({ cartProducts:shoppingCartItems.length })
            })
            preventDoubleTapHack(component,'ShoppingCart')
          }
        }}),
        NavigationActions.navigate({ routeName: 'Orders',params:{title: L('orders')} }),
        NavigationActions.navigate({ routeName: navigate,params:params }),
      ],
    });
    component.props.navigation.dispatch(resetAction);

  }
};
navigateToShoppingCart = async () => {
    const { navigation } = component.props
    component.navigationListener = navigation.addListener('willFocus', async (payload) => {
      component.navigationListener.remove()
      // alert('will home willFocus')
      let shoppingCartItems=await AsyncStorage.getItem('shoppingCartItems')
      shoppingCartItems=shoppingCartItems?JSON.parse(shoppingCartItems):[]
      // alert(shoppingCartItems.length+"\n"+component.props.navigation.state.params.cartProducts)
      component.props.navigation.setParams({ cartProducts:shoppingCartItems.length })
    })
    preventDoubleTapHack(component,'ShoppingCart')
};

//
export let isConnected=false

export function* mapObject (obj) {
    for (let prop of Object.keys(obj)) {// own properties, you might use
		////console.log(obj[prop])// for (let prop in obj)
        yield obj[prop];
    }
}
////console.log(base)
export function changeLng(lang) {
  baseUrl = base+lang+'/mobile/'
  I18n.local=lang
  AsyncStorage.setItem('language',lang)
  let slang=AsyncStorage.getItem('language')
  ////console.log(baseUrl,slang)
}
export function L(key) {
  let word=I18n.t(key,{locale: I18n.local})
  return word
}
//L('appTitle')
export function toInt(val){
  return val?parseInt(val):0
}
export function range(start, count,label) {
  return Array.apply(0, Array(count))
    .map(function (element, index) { 
      return (index + start) +(label?label:'') ;  
  });
};
function handleFirstConnectivityChange(isConnected) {
  ////console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
  NetInfo.isConnected.removeEventListener(
    'change',
    handleFirstConnectivityChange
  );
}

export async function checkConnection(){
  let check=await NetInfo.isConnected.fetch().then( async connected => {
    ////console.log('First, is ' + (connected ? 'online' : 'offline'));
    isConnected=connected?true:false
    if(connected){
      return true
    }else{
      alert(' يرجى التحقق من اعدادات الاتصال بالانترنت لديك')
      return false
    }
  })
  ////console.log('check online',check)
  return check
  /*await NetInfo.isConnected.addEventListener('change', async connected => {
    ////console.log('change, is ' + (connected ? 'online' : 'offline'));
    isConnected=connected
    if(connected){
      return true
    }else{
      alert(' يرجى التحقق من اعدادات الاتصال بالانترنت لديك')
      return false
    }
  });*/
};
// checkConnection()
export async function fetchAjax(options){
  //
    let connection= await checkConnection()
    if(checkConnection){
      options.method=options.method?options.method:'POST'
      let fetchBody={
        method: options.method,
        headers: {
          'Accept': 'application/json',
          // 'Content-Type': 'application/json; charset=utf-8',
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        }
      }
      if(options.method=='POST'){
        fetchBody.body= options.body?options.body:''
      }
      try {
        let response = await fetch(options.url,fetchBody)
        let responseJson =await response.json()
        ////console.log('responseJson',responseJson)
        // return responseJson
        return response
      }catch (error) {
        // alert('يرجى التحقق من اعدادات الاتصال بالانترنت لديك')
        return [{}]
      }
    }
    
}
/**/
export function cAlert (message) {
  Alert.alert(
    '',
    message,
    [{ text: L('close'), style: 'cancel' }]
  )
}
/**/
export function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  ////console.log('calculateDistance',calculateDistance(lat1,lon1,lat2,lon2))
  ////console.log('distance function ',distance(lat1,lon1,lat2,lon2))
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  d=Math.round(d*100)/100
  ////console.log('lat1',lat1,lon1,lat2,lon2,'\n distance',d)
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}
function calculateDistance(lat1, long1, lat2, long2)
{    

    //radians
    lat1 = (lat1 * 2.0 * Math.PI) / 60.0 / 360.0;      
    long1 = (long1 * 2.0 * Math.PI) / 60.0 / 360.0;    
    lat2 = (lat2 * 2.0 * Math.PI) / 60.0 / 360.0;   
    long2 = (long2 * 2.0 * Math.PI) / 60.0 / 360.0;       


    // use to different earth axis length    
    var a = 6378137.0;        // Earth Major Axis (WGS84)    
    var b = 6356752.3142;     // Minor Axis    
    var f = (a-b) / a;        // "Flattening"    
    var e = 2.0*f - f*f;      // "Eccentricity"      

    var beta = (a / Math.sqrt( 1.0 - e * Math.sin( lat1 ) * Math.sin( lat1 )));    
    var cos = Math.cos( lat1 );    
    var x = beta * cos * Math.cos( long1 );    
    var y = beta * cos * Math.sin( long1 );    
    var z = beta * ( 1 - e ) * Math.sin( lat1 );      

    beta = ( a / Math.sqrt( 1.0 -  e * Math.sin( lat2 ) * Math.sin( lat2 )));    
    cos = Math.cos( lat2 );   
    x -= (beta * cos * Math.cos( long2 ));    
    y -= (beta * cos * Math.sin( long2 ));    
    z -= (beta * (1 - e) * Math.sin( lat2 ));       

    return (Math.sqrt( (x*x) + (y*y) + (z*z) )/1000);  
}

function distance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="N") { dist = dist * 0.8684 }
  return dist
}
export function getDays (date1,date2) {
	var days=[],day = 1000*60*60*24;
    date1 =date1?new Date(date1):new Date('2013-07-05');
    date2 =date2?new Date(date2):new Date("2013-07-10");

    var diff = (date2.getTime()- date1.getTime())/day;
    
    for(var i=1;i<=(diff+1); i++){
       var xx = date1.getTime()+day*i;
       var yy = new Date(xx);

       days.push(yy.getFullYear()+"-"+(yy.getMonth()+1)+"-"+yy.getDate());
    }
    ////console.log(days)
    return days;
}

// For the time now
export function toDay(date) {

    let d = date?new Date(date):new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

//Date.prototype.timeNow = function () {
export function toTime (date) {
    ////console.log('date time ,',date)
    let d = date?(new Date(date)):(new Date())
    ////console.log('d time ,',d.getHours(),d.getMinutes(),d.getSeconds())
    return ((d.getHours() < 10)?"":"") + d.getHours() +":"+ ((d.getMinutes() < 10)?"0":"") + d.getMinutes() +":"+ ((d.getSeconds() < 10)?"0":"") + d.getSeconds();
}
//console.log('toTime',toTime())

Date.prototype.today = function () { 
    return this.getFullYear()+"-"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-"+ ((this.getDate() < 10)?"0":"") + this.getDate();
}

// For the time now
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}
Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}
Date.prototype.addTimes = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}
Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000)); 
    return this.today()+" "+this.timeNow();   
}
export function addHours (h) {
  return new Date().addHours(Number(h))
}
//console.log('addHour',new Date().timeNow(),addHours(4))
export function getTimeDiff (date_from,date_to) {
    let date1 = new Date(date_from);
    let date2 = date_to?new Date(date_to):new Date();
    let timeDiff = parseInt(date1.getTime() - date2.getTime());
    let diffSeconds = Math.ceil(timeDiff / (1000));
    let diffHours=Math.ceil(diffSeconds/3600)
    let diffDays=Math.ceil(diffHours/24)
    let diffYears=Math.ceil(diffDays/360)
    let diffObject={
      'date1':date1,
      'date2':date2,
      'diffSeconds':diffSeconds,
      'diffHours':diffHours,
      'diffDays':diffDays,
      'diffYears':diffYears,
    }
    ////console.log('diffObject',diffObject)
    return diffObject;
}

export function rand() {
  let text = Math.floor(Math.random());
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const lower = possible.toLowerCase();

  for (var i = 0; i < 7; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    text += lower.charAt(Math.floor(Math.random() * possible.length));
  }


  return text;
}
//let arr = Array.from(values(obj));
