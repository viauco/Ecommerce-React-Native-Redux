/*
 * Qiirat React Native App for ios
 * http://qiirat.com
 * authored by omar hassan
 * All Rights Reserved For AlyomHost For It Solutions
 */
'use strict'
import React, { Component } from 'react'
import {
    Platform,
    I18nManager,
    View,
    AsyncStorage,
    PermissionsAndroid
}from 'react-native'
import { connect } from "react-redux";
import {SetUserInfo,AddToCart,AddPaid,OrderNotes,SetBillId,SetHold} from './actions'

import { baseUrl,baseUploadUrl,headers,language,changeLng,L,resetNavigation,preventDoubleTapHack } from './config'

class IndexComponent extends Component {
   constructor() {
      super()
      this.state = {
         loadText:''
      }
   }
   async componentDidMount() {
      try {
        I18nManager.allowRTL(true);

        let logged=await AsyncStorage.getItem('logged'),
        openScreen='login',title=''
        console.log('logged',logged)
        if(logged){

          openScreen='Drawer'

          let name=await AsyncStorage.getItem('name'),
          email=await AsyncStorage.getItem('email'),
          hold=await AsyncStorage.getItem('hold'),
          shoppingCartItems=await AsyncStorage.getItem('shoppingCartItems'),
          total=await AsyncStorage.getItem('total'),
          notes=await AsyncStorage.getItem('notes'),
          showNotes=await AsyncStorage.getItem('showNotes'),
          paid=await AsyncStorage.getItem('paid'),
          bill_id=await AsyncStorage.getItem('bill_id')
          hold=hold?JSON.parse(hold):[]
          shoppingCartItems=shoppingCartItems?JSON.parse(shoppingCartItems):[]
          total=total?Number(total):0
          console.log('index use name',name)
          this.props.SetUserInfo({ email:email,name:name,logged:true });
          this.props.AddToCart(shoppingCartItems,total);
          this.props.SetHold(hold);
          // if(paid){
            this.props.AddPaid(paid)
          // }
          console.log('bill_id',bill_id)
          if(bill_id&&shoppingCartItems.length){
            this.props.SetBillId(bill_id)
            openScreen='Done'
          }
          this.props.OrderNotes(notes,showNotes)
          title=L('categories')
        }else{
          openScreen='Login'
        }

        // openScreen='Product'
        // openScreen='Bill'
        // openScreen='Printer'
        // openScreen=''
        if(openScreen){
          // alert('openScreen'+openScreen)
          console.log('openScreen intro',openScreen)
          await resetNavigation(this,openScreen,{
            title:title,
            order_id:39
          })
        }

      } catch (error) {
        alert('error'+error)
         //console.error('fetch error=>',error)
      }
   }
   render() {
      return (
        <View />
      )
   }
}


function mapDispatchToProps(dispatch) {
  return {
    SetUserInfo: (userObj) => dispatch(SetUserInfo(userObj)),
    AddToCart: (shoppingCartItems,total) =>{dispatch(AddToCart(shoppingCartItems,total))},
    AddPaid: (paid) =>{dispatch(AddPaid(paid))},
    SetHold: (hold) =>{dispatch(SetHold(hold))},
    SetBillId: (bill_id) =>{dispatch(SetBillId(bill_id))},
    OrderNotes: (notes,showNotes) =>{dispatch(OrderNotes(notes,showNotes))},
  };
}
const mapStateToProps = state => {
  console.log('login props',state.auth,state.products.paid)
  return { 
    errorMsg:state.errorMsg,
    success:state.auth.success,
    name:state.auth.name,
    email:state.auth.email,
    bill_id:state.products.bill_id,
  };
};
const Index = connect(mapStateToProps, mapDispatchToProps)(IndexComponent);
export default Index;

