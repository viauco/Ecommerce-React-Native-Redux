import { ERROR,LOGIN,DO_LOGIN,DO_LOGIN_SUCCESS,API_TOKEN,GET_Products,Add_To_Cart,Add_To_Hold,SET_Hold,Order_Notes,ADD_PAID,SET_BILL_ID,EMPTY_CART } from "../constants/";
import { baseUrl,headers,L ,cAlert } from "../config";
import axios from 'axios';
import RNProgressHud from 'react-native-progress-display'
import {
  AsyncStorage
} from 'react-native';
import Store from '../store/index'



export function AddToHold(key,shoppingCartItems,total) {
  console.log('AddToHold',key,shoppingCartItems,total)
  
  return async (dispatch)=>{
    await AsyncStorage.multiRemove(['shoppingCartItems','total','notes','showNotes','paid'])
    dispatch({ type:Add_To_Hold, payload:{key:key,shoppingCartItems:shoppingCartItems,total:total} })
    // console.log(Store.getState().auth.api_token)
  }
};

export function SetHold(hold) {
  console.log('SetHold action ',hold)
  return { type:SET_Hold, payload:{hold:hold,changeHold:true} }
};
export function EmptyCart() {
  // console.log('SaveOrder',paid)
  
  return async (dispatch)=>{
    dispatch({ type:EMPTY_CART, payload:{paid:0,bill_id:0,total:0,shoppingCartItems:[],notes:'',showNotes:''} })
    await AsyncStorage.multiRemove(['shoppingCartItems','total','notes','showNotes','paid','bill_id','notifyEmail','notifyPhone'])
    // console.log(Store.getState().auth.api_token)
  }
};

export function SaveOrder(paid,data) {
  // console.log('SaveOrder',paid)
  // dispatch({ type:ADD_PAID, payload:{paid:paid} })
  let options={
    data:data,
    method:'post',
    url:'inventory/bills/cashier/addcart'
  }
  return  async (dispatch)=>{
    let PerformRequestResponse=await PerformRequest(dispatch,options)
    if(PerformRequestResponse){
      console.log('ADD_PAID PerformRequestResponse',PerformRequestResponse.data)
      dispatch({type:SET_BILL_ID,payload:{bill_id:PerformRequestResponse.data.invoices_id}})
    }
    // console.log(Store.getState().auth.api_token)
  }
};
export function SetBillId(bill_id) {
  // console.log('SetBillId action ',bill_id)
  return { type:SET_BILL_ID, payload:{bill_id:bill_id} }
};
export function AddPaid(paid) {
  // console.log('AddPaid action ',paid)
  return { type:ADD_PAID, payload:{paid:paid} }
};
export function OrderNotes(notes,showNotes) {
  // console.log('OrderNotes',notes.length,showNotes)
  return { type:Order_Notes, payload:{notes:notes,showNotes:showNotes} }
};
export function AddToCart(shoppingCartItems,total) {
  // console.log('AddToCart',shoppingCartItems.length,total)
  return { type:Add_To_Cart, payload:{shoppingCartItems:shoppingCartItems,total:total} }
};

export const SendMessage =(data) => {
  let options={
    data:data,
    method:'post',
    url:'send-message'
  }
  return  async (dispatch)=>{
    let PerformRequestResponse=await PerformRequest(dispatch,options)
    if(PerformRequestResponse){
      // console.log('GET_Products PerformRequestResponse',PerformRequestResponse.data)
      //dispatch({type:GET_Products,payload:PerformRequestResponse.data})
    }
    // console.log(Store.getState().auth.api_token)
  }
};

export const SearchProducts =(query) => {
  let options={
    data:{
      "by": "title",
      "value": query,
      "has_like": "both",
    },
    method:'get',
    url:'inventory/items/search'
  }
  return  async (dispatch)=>{
    let PerformRequestResponse=await PerformRequest(dispatch,options)
    if(PerformRequestResponse){
      // console.log('GET_Products PerformRequestResponse',PerformRequestResponse.data)
      dispatch({type:GET_Products,payload:PerformRequestResponse.data})
    }
    // console.log(Store.getState().auth.api_token)
  }
};
export const GetProducts =() => {
  let options={
    data:{},
    method:'get',
    url:'inventory/items'
  }
  return  async (dispatch)=>{
    let PerformRequestResponse=await PerformRequest(dispatch,options)
    if(PerformRequestResponse){
      // console.log('GET_Products PerformRequestResponse',PerformRequestResponse.data)
      dispatch({type:GET_Products,payload:PerformRequestResponse.data})
    }
    // console.log(Store.getState().auth.api_token)
  }
};

/**/
export function LogOut() {
  // console.log('SaveOrder',paid)
  
  return async (dispatch)=>{
    dispatch({ type:DO_LOGIN_SUCCESS, payload:{name:'',email:'',logged:false,resetApp:true} })
    dispatch({ type:EMPTY_CART, payload:{paid:0,bill_id:0,total:0,shoppingCartItems:[],notes:'',showNotes:''} })
    await AsyncStorage.multiRemove(['name','email','logged','shoppingCartItems','total','notes','showNotes','paid','bill_id','notifyEmail','notifyPhone'])
    // console.log(Store.getState().auth.api_token)
  }
};


export function SetUserInfo(userInfo) {
  console.log('SetUserInfo',userInfo)
  return { type:DO_LOGIN_SUCCESS, payload:userInfo }
};

/**/

export const DoLogin =({ email, password }) => {
  let data={
    email: email,
    password: password,
  },
  options={
    data:data,
    method:'post',
    url:'cashier'
  }
  return  async (dispatch)=>{
    let response=await PerformRequest(dispatch,options)
    console.log('do login response',response.data)
    if(response.data){
      await AsyncStorage.setItem('name',response.data.info.name)
      await AsyncStorage.setItem('email',response.data.info.email)
      await AsyncStorage.setItem('logged','true')
      dispatch({type:DO_LOGIN_SUCCESS,payload:{...{logged:true},...response.data.info}})
    }
    // console.log(Store.getState().auth.api_token)
  }
};

/**/

const ErrorAction = (dispatch, error) => {
  dispatch({
      type: ERROR,
      payload: error
  });
};

const PerformRequest=async (dispatch,options) => {
  let api_token=Store.getState().auth.api_token
  if(!api_token){
    api_token= await AsyncStorage.getItem('api_token')
  }
  console.log(api_token)
  if(options.url!='cashier'&&!api_token){
    dispatch({type:'RESET_APP',payload:{resetApp:true}})
  }
  // console.log('options',options)
  try{
    let data=options.data,
    method=options.method?options.method:'post',
    config={
      method:options.method,
      baseURL:baseUrl,
      url:options.url,
      headers: headers,
      onUploadProgress: function (progressEvent) {
        RNProgressHud.showWithStatus()
      },
      onDownloadProgress: function (progressEvent) {
        // console.log('onDownloadProgress progressEvent ',progressEvent)
      },
    }
    //SET API TOKEN
    if(api_token){
      data.api_token=api_token;
    }
    //
    if(options.method=='get'){
      config.params=data
    }else{
      config.data=data
    }
    // console.log('config',config)
    const response= await axios(config);
    RNProgressHud.dismiss()
    if(options.url=='inventory/items'){
      // console.log('GET_Products PerformRequest response',response.data)
    }
    if(response.status==200){
      dispatch({type:API_TOKEN,payload:response.data.api_token})
      dispatch({type:'RESET_APP',payload:{resetApp:false,logged:true}})
      await AsyncStorage.setItem('api_token',response.data.api_token)
      return response.data;
    }

    let message=response.data&&response.data.message?response.data.message:L('internetConnectionProblem')
    ErrorAction(dispatch,message);
    cAlert(message)
    return false;
  } catch ({response}) {
    RNProgressHud.dismiss()
    console.log('error ',response)
    console.log('error state',response.status)
    if((400==response.status||401==response.status)&&!response.api_token){
    // alert(response.status)
      dispatch({type:'RESET_APP',payload:{resetApp:true,logged:false}})
    }
    let message=response.data&&response.data.message?response.data.message:L('internetConnectionProblem')
    if(response.api_token){
      await AsyncStorage.setItem('api_token',response.api_token)
    }
    ErrorAction(dispatch,message);
    cAlert(message)
    return false;
  }
};