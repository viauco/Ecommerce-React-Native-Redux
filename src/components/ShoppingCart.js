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

import { Button,Avatar,Divider,Icon } from 'react-native-elements'
import _ from 'lodash';
import { baseUrl,baseUploadUrl,headers,language,changeLng,L,preventDoubleTapHack,resetNavigation } from '../config'
import styles,{mainColor,mainColor2,mainFont,scale,verticalScale} from '../Styles'

import { connect } from "react-redux";
import {GET_Products} from '../constants'
import {AddToCart} from '../actions'


const { width, height } = Dimensions.get('window')

class ShoppingCartComponent extends Component {
  static navigationOptions = ({ navigation }) => ({
      title:L('ShoppingCart'),
      headerTitleStyle: {
        color:"#4f4e4e",
        fontFamily: mainFont
      },
      headerStyle: {
        backgroundColor:"#FFF"
        // backgroundColor: 'rgba(156, 215, 229, 0.9)'
      },
      headerRight: 
        <View style={[styles.row]}>
          <TouchableWithoutFeedback onPress={()=>{navigation.getParam('emptyCart')()}}>
            <Image source={require('../assets/img/trash.png')} style={{width:scale(8),height:scale(8),marginRight:10}}/>
          </TouchableWithoutFeedback>
        </View>
        ,
      headerTintColor: '#4f4e4e',
      headerBackTitle: null,
      
      
    });
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
    this.props.navigation.setParams({emptyCart:this.emptyCart.bind(this)})
    let {shoppingCartItems}=this.props,
    total=0,
    subTotal=0,
    tax=0,
    itemExists=false;

    shoppingCartItems.map(cartItem=>{
      subTotal+=cartItem.sale_price*cartItem.quantity
      total+=cartItem.full_price*cartItem.quantity
    })
    console.log(itemExists)

    subTotal=Math.round(subTotal*100)/100
    total=Math.round(total*100)/100
    tax=total-subTotal
    await this.setState({total,subTotal,tax,refreshing: false})

  }
  async emptyCart(){
    await this.setState({total:0,subTotal:0,tax:0})
    await AsyncStorage.multiRemove(['shoppingCartItems','total'])
    this.props.AddToCart([],0)
    this.props.navigation.goBack()
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
  seperatorHandler = () => {
    return (<Divider style={{ backgroundColor: '#4f4e4e' }} />)
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
  async changeQty(item,quantity){
    if(quantity<1||quantity>item.maxQuantity){
      return
    }
    let {shoppingCartItems}=this.props,
    total=0,
    subTotal=0,
    tax=0,
    itemExists=false;

    shoppingCartItems.map(cartItem=>{
      if(cartItem.cart_id==item.cart_id){
        cartItem.quantity=quantity
        itemExists=true
      }
      subTotal+=Number(cartItem.sale_price)*Number(cartItem.quantity)
      total+=Number(cartItem.full_price)*Number(cartItem.quantity)
    })
    console.log(itemExists)

    subTotal=Math.round(subTotal*100)/100
    total=Math.round(total*100)/100
    tax=total-subTotal
    await this.setState({total,subTotal,tax})
    await AsyncStorage.setItem('shoppingCartItems',JSON.stringify(shoppingCartItems))
    await AsyncStorage.setItem('total',total.toString())
    this.props.AddToCart(shoppingCartItems,total)
  }
  
  async deleteItem(item){
    let {shoppingCartItems}=this.props,
    cartItem='',
    deleteKey=-1,
    total=0,
    subTotal=0,
    tax=0,
    itemExists=false;
    console.log('shoppingCartItems length',shoppingCartItems.length)
    if(shoppingCartItems){
      for(let key=0;key<shoppingCartItems.length;key++){
        cartItem=shoppingCartItems[key]
        
        console.log('key',key,cartItem.cart_id)
        if(cartItem.cart_id==item.cart_id){
          console.log('delete key',key)
          deleteKey=key
        }else{
          subTotal+=Number(cartItem.sale_price)*Number(cartItem.quantity)
          total+=Number(cartItem.full_price)*Number(cartItem.quantity)
          console.log('cartItem.sale_price',cartItem.sale_price,cartItem.full_price,cartItem.quantity,subTotal,total)
        }
      }
    }
    shoppingCartItems.splice(deleteKey,1)
    console.log('shoppingCartItems length after delete ',shoppingCartItems.length)
    console.log('total',total,subTotal)
    subTotal=Math.round(subTotal*100)/100
    total=Math.round(total*100)/100
    tax=total-subTotal
    await this.setState({total,subTotal,tax})
    await AsyncStorage.setItem('shoppingCartItems',JSON.stringify(shoppingCartItems))
    await AsyncStorage.setItem('total',total.toString())
    this.props.AddToCart(shoppingCartItems,total)
  }

  itemListHandler = ({ item }) => {
    // console.log('ShoppingCart item',item)
    if(!item) return null
    return (
      
        <View key={item.id} style={[{width:scale(95)}]}>
          <View style={[styles.rowBetween]}>

            <View style={[styles.columnStart]}>
              <TouchableWithoutFeedback onPress={()=>{this.deleteItem(item)}}>
                <Image source={require('../assets/img/trash.png')} style={styles.menuIcon}/>
              </TouchableWithoutFeedback>

              <View style={[styles.rowBetween,{marginTop:0}]}>
                <TouchableWithoutFeedback onPress={()=>{this.changeQty(item,(item.quantity-1))}}>
                  <Image source={require('../assets/img/cart_minus.png')} style={styles.menuIcon}/>
                </TouchableWithoutFeedback>
                <Text style={[styles.generalFont,{fontSize:13,fontWeight: "100",marginHorizontal:6}]}>{item.quantity}</Text>
                <TouchableWithoutFeedback onPress={()=>{this.changeQty(item,(item.quantity+1))}}>
                  <Image source={require('../assets/img/cart_plus.png')} style={styles.menuIcon}/>
                </TouchableWithoutFeedback>
                <Text style={[styles.generalFont,{fontSize:13,fontWeight: "100"}]}>{L('quantity')}</Text>
              </View>
            </View>
            <View style={[styles.columnStartEnd]}>
              <Text style={[styles.boldFont,{fontSize:15}]}>{item.title}</Text>
              <Text style={[styles.generalFont,{fontSize:13,color: "#8e8e8e"}]}>{item.price} {L('sar')}</Text>
              <Text style={[styles.generalFont,{backgroundColor:'#5ED864',borderRadius:10,paddingHorizontal:5,paddingVertical:3, fontSize:13,color:'#FFF'}]}>{L('priceWithoutTax')}</Text>
            </View>
          </View>
        </View>
    )
  }
  footerHandler = () => {
    if(!this.props.shoppingCartItems.length) return null
    let {total,subTotal,tax}=this.state
    return(
      <View style={[styles.column,{width:scale(95),paddingBottom:scale(17)}]}>
        <View style={[styles.rowBetween,{width:scale(95),borderTopColor:'#bdbdbd',borderTopWidth:1}]}>
          <Text style={[styles.boldFont,{fontSize:15}]}>{subTotal} {L('sar')}</Text>
          <Text style={[styles.generalFont,{fontSize:15}]}>{L('total')}</Text>
        </View>
        <View style={[styles.rowBetween,{width:scale(95),borderTopColor:'#bdbdbd',borderTopWidth:1}]}>
          <Text style={[styles.boldFont,{fontSize:15}]}>{`${tax} ${L('sar')}`}</Text>
          <Text style={[styles.generalFont,{fontSize:15}]}>{L('tax')}</Text>
        </View>
        <View style={[styles.rowBetween,{width:scale(95),borderTopColor:'#bdbdbd',borderTopWidth:1}]}>
          <Text style={[styles.boldFont,{fontSize:15}]}>{total} {L('sar')}</Text>
          <Text style={[styles.generalFont,{fontSize:15}]}>{L('finalTotal')}</Text>
        </View>
      </View>
    )
  }
  render() {
    return (
      <View style={[styles.container,styles.columnStartCenter]}>
        <FlatList
          style={{width:scale(100),marginTop:0}}
          contentContainerStyle={styles.center}
          data={this.props.shoppingCartItems}
          ListEmptyComponent={this.emptyListHandler}
          ListFooterComponent={this.footerHandler}
          ItemSeparatorComponent={this.seperatorHandler}
          renderItem={this.itemListHandler}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          keyExtractor={(x, i) => i.toString()}
        />
        {this.props.shoppingCartItems.length?(
          <View style={[styles.rowAround,{backgroundColor:'#FFF', position:'absolute',bottom:0,width:'100%',height:scale(16)}]}>
            <Button
              title={L('pay')}
              containerStyle={[styles.buttonRoundStyles,{marginTop:0}]}
              buttonStyle={styles.buttonStyles}
              titleStyle={[styles.buttonTextStyle]}
              onPress={() => preventDoubleTapHack(this,'Payment')}
            />
          </View>
        ):null}
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
  };
};

function mapDispatchToProps(dispatch) {

  return {
    AddToCart: (shoppingCartItems,total) =>{dispatch(AddToCart(shoppingCartItems,total))},
  };
}
const ShoppingCart = connect(mapStateToProps, mapDispatchToProps)(ShoppingCartComponent);
export default ShoppingCart;

