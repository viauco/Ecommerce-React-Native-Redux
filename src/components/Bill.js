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
    ScrollView,
    Image,
    ImageBackground,
    FlatList,
    Text,
    TextInput,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator,
    AsyncStorage,
    Alert
}from 'react-native'
import RNProgressHud from 'react-native-progress-display'
import ViewShot,{captureRef, captureScreen} from "react-native-view-shot";

import {BluetoothEscposPrinter, BluetoothManager, BluetoothTscPrinter} from "react-native-bluetooth-escpos-printer";

import { Button,Avatar,Divider,Icon } from 'react-native-elements'
import _ from 'lodash';
import { baseUrl,baseUploadUrl,headers,language,changeLng,L,preventDoubleTapHack,resetNavigation,toDay,toTime } from '../config'
import styles,{mainColor,mainColor2,mainFont,scale,verticalScale} from '../Styles'

import { connect } from "react-redux";
import {GET_Products} from '../constants'
import {EmptyCart} from '../actions'


const { width, height } = Dimensions.get('window')

class BillComponent extends Component {
  
  constructor(props) {
    super(props)
    let {params}=this.props.navigation.state
    console.log('params',params)
    this.state = {
      loadText:'',
      total:0,
      subTotal:0,
      tax:0,
      refreshing:false
    }
  }

  async componentDidMount() {
    I18nManager.allowRTL(false);
    let {shoppingCartItems}=this.props,
    total=0,
    subTotal=0,
    tax=0,
    itemExists=false;

    shoppingCartItems.map(cartItem=>{
      subTotal+=cartItem.sale_price*cartItem.quantity
      total+=cartItem.full_price*cartItem.quantity
    })
    console.log('bill log',total,subTotal)

    subTotal=Math.round(subTotal*100)/100
    total=Math.round(total*100)/100
    tax=total-subTotal
    await this.setState({total,subTotal,tax,refreshing: false})
    //Start Print
    this.printRes()
  }

  onRefresh = () => {
      this.setState(
         {
            refreshing: true,
            isLoading: true,
            page:0,
            emptyLabel:''
         },
         () => {
            this.componentDidMount()
         }
      )
  }
  async printRes(){
    this.refs.viewShot.capture().then(async (res) => {
        // console.log("do something with ", res);
        await this.setState({image:res})
        // return;
        // var base64Jpg="data:image/jpg;base64," + res
        // console.log("do something with ", base64Jpg);
        try {
            await BluetoothEscposPrinter.printPic(res, {width: 500, left: 10});
            await BluetoothEscposPrinter.printText(" \r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n", {});
            console.log('done')
            this.props.EmptyCart()
            resetNavigation(this,'Drawer')
        } catch (e) {
            alert(e.message || "ERROR")
        }
        // await BluetoothEscposPrinter.printPic(base64zsJpg, {width: 200, left: 40});
    });
  }
  emptyListHandler = () => {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text style={[styles.listText]}>{this.state.emptyLabel}</Text>
        </View>
      )
  }

  itemListHandler = ({ item }) => {
    // console.log('ShoppingCart item',item)
    if(!item) return null
    return (
      
        <View key={item.id} style={[{width:scale(95)}]}>
          <View style={[styles.columnStartEnd]}>
            <Text style={[styles.generalFont,{fontSize:17}]}>{`${item.quantity} X ${item.title}`}</Text>
            <Text style={[styles.boldFont,{alignSelf:'flex-start', fontSize:17,color: "#8e8e8e"}]}>{item.price} {L('sar')}</Text>
          </View>
        </View>
    )
  }
  headerHandler = () => {
    let {bill_id}=this.props

    return(
      <View style={[styles.columnStartCenter,{width:scale(95)}]}>
        <Image source={require('../assets/img/logo.png')} style={[styles.billPhoto,{tintColor:'#4C4C4C'}]}/>
        <View style={[styles.rowBetween,{width:scale(95)}]}>
          <Text style={[styles.boldFont,{fontSize:17}]}>{toDay()} </Text>
          <Text style={[styles.generalFont,{fontSize:17}]}>{L('orderDate')}</Text>
        </View>
        <View style={[styles.rowBetween,{width:scale(95)}]}>
          <Text style={[styles.boldFont,{fontSize:17}]}>{toTime()}</Text>
          <Text style={[styles.generalFont,{fontSize:17}]}>{L('orderTime')}</Text>
        </View>
        <View style={[styles.rowBetween,{width:scale(95)}]}>
          <Text style={[styles.boldFont,{fontSize:17}]}>{bill_id} </Text>
          <Text style={[styles.generalFont,{fontSize:17}]}>{L('order_id')}</Text>
        </View>
        <View style={[styles.rowBetween,{width:scale(95)}]}>
          <Text style={[styles.boldFont,{fontSize:17}]}>{`عبدالله القحطاني`} </Text>
          <Text style={[styles.generalFont,{fontSize:17}]}>{L('customer_name')}</Text>
        </View>
        <View style={styles.billSep}/>
      </View>
    )
  }
  footerHandler = () => {
    if(!this.props.shoppingCartItems.length) return null
    let {total,subTotal,tax}=this.state,
    {paid}=this.props,
    remain=paid-total

    return(
      <View style={[styles.columnStartCenter,{width:scale(95),paddingBottom:scale(10)}]}>
        <View style={styles.billSep}/>
        <View style={[styles.rowBetween,{width:scale(95)}]}>
          <Text style={[styles.boldFont,{fontSize:16}]}>{subTotal} {L('sar')}</Text>
          <Text style={[styles.generalFont,{fontSize:17}]}>{L('total')}</Text>
        </View>
        <View style={[styles.rowBetween,{width:scale(95)}]}>
          <Text style={[styles.boldFont,{fontSize:16}]}>{`${tax} ${L('sar')}`}</Text>
          <Text style={[styles.generalFont,{fontSize:17}]}>{L('tax')}</Text>
        </View>
        <View style={styles.billSep}/>
        <View style={[styles.rowBetween,{width:scale(95)}]}>
          <Text style={[styles.boldFont,{fontSize:16}]}>{total} {L('sar')}</Text>
          <Text style={[styles.generalFont,{fontSize:17}]}>{L('finalTotal')}</Text>
        </View>
        <View style={styles.billSep}/>
        <View style={[styles.rowBetween,{width:scale(95)}]}>
          <Text style={[styles.boldFont,{fontSize:16}]}>{paid} {L('sar')}</Text>
          <Text style={[styles.generalFont,{fontSize:17}]}>{L('done_paid')}</Text>
        </View>
        <View style={[styles.rowBetween,{width:scale(95)}]}>
          <Text style={[styles.boldFont,{fontSize:16}]}>{remain} {L('sar')}</Text>
          <Text style={[styles.generalFont,{fontSize:17}]}>{L('remain')}</Text>
        </View>
        {this.props.notes&&this.props.showNotes?(
          <View style={[styles.columnStartEnd,{width:'100%'}]}>
            <View style={styles.billSep}/>
            <Text style={[styles.generalFont,{fontSize:17}]}>{L('notes')}</Text>
            <Text style={[styles.boldFont,{fontSize:16}]}>{this.props.notes}</Text>
          </View>
        ):null}
        <View style={styles.billSep}/>
        <Image source={require('../assets/img/qr.png')} style={styles.billPhoto}/>
        <Text style={[styles.boldFont,{fontSize:15,alignSelf:'center',textAlign:'center'}]}>{L('billFooter')}</Text>
      </View>
    )
  }
  render() {
    return (
      <View style={[styles.container,styles.columnStartCenter]}>
        <ScrollView>
          <ViewShot ref="viewShot" options={{ format: "png", quality: 1,result: "base64" }}>
            <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',backgroundColor:'#FFF',paddingBottom:50}}>
              <FlatList
                style={{width:scale(100),marginTop:0}}
                contentContainerStyle={styles.center}
                data={this.props.shoppingCartItems}
                ListEmptyComponent={this.emptyListHandler}
                ListHeaderComponent={this.headerHandler}
                ListFooterComponent={this.footerHandler}
                renderItem={this.itemListHandler}
                keyExtractor={(x, i) => i.toString()}
              />
            </View>
          </ViewShot>
          <View style={[styles.rowAround,{backgroundColor:'#FFF', position:'absolute',bottom:0,width:'100%',height:scale(16)}]}>
            <Button
              title={L('printBill')}
              containerStyle={[styles.buttonRoundStyles,{marginTop:0}]}
              buttonStyle={styles.buttonStyles}
              titleStyle={[styles.buttonTextStyle]}
              onPress={() => this.printRes()}
            />
          </View>
        </ScrollView>
      </View>
    )
  }
}


const mapStateToProps = state => {
  // console.log('shopping cart products props',state.products.shoppingCartItems.length)
  return { 
    errorMsg:state.errorMsg,
    // success:state.auth.success,
    name:state.auth.name,
    shoppingCartItems:state.products.shoppingCartItems,
    total:state.products.total,
    bill_id:state.products.bill_id,
    paid:state.products.paid,
    notes:state.products.notes,
    showNotes:state.products.showNotes,
  };
};

function mapDispatchToProps(dispatch) {

  return {
    EmptyCart: () =>{dispatch(EmptyCart())},
  };
}
const Bill = connect(mapStateToProps, mapDispatchToProps)(BillComponent);
export default Bill;

