import React, { Component } from 'react';
import { Platform,StyleSheet, 
    View,
    ScrollView,
    RefreshControl,
    Text,
    TouchableWithoutFeedback,
    ToastAndroid,
    TextInput,
    Alert,
    ActivityIndicator,
    ImageBackground,
    AsyncStorage,
    DeviceEventEmitter,
    Image
}from 'react-native'
import RNProgressHud from 'react-native-progress-display'
import { createAppContainer, createStackNavigator } from 'react-navigation';

import uuidv1 from "uuid";
import _ from 'lodash';
import { baseUrl,range,headers,L,preventDoubleTapHack,cAlert,resetNavigation } from '../config'
import styles,{btnColor,mainColor,mainFont,verticalScale,scale} from '../Styles'

import { connect } from "react-redux";
import {GET_Products} from '../constants'
import {GetProducts,SearchProducts,AddToCart} from '../actions'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Button,Input,Icon,Badge, withBadge } from 'react-native-elements'

const bigIconsColor="#8e8e8e",
bigActiveIconsColor="#ed6a1d",
bigIconsShadowColor='rgba(0,0,0,0.4)',
bigActiveIconsShadowColor='rgba(237, 106, 29,0.4)'

class AddServiceComponent extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      refreshing: false,
      title:'',
      priceLabel:'0.00',
      price:''
    };
  }
  async componentDidMount() {
      try {
        
      } catch (error) {
         //console.error(error)
      }
  }
  
  async addToCart(item){
    let {shoppingCartItems,total,navigation}=this.props,
    {price,title}=this.state,
    filterNumber=/^(\d)+(\.){0,1}(\d){0,2}$/,
    errorMsg=null
    if(!filterNumber.test(price)){
      errorMsg=L('pleaseInsert')+L('price')
    }else if(!title.length){
      errorMsg=L('pleaseInsert')+L('serviceLabel')
    }
    if(errorMsg!=null){
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          errorMsg,
          ToastAndroid.LONG
        )
      } else {
        cAlert(errorMsg)
      }
    }else{
      // cAlert('add');return;
      console.log("uuidv1().split('-')[0]",uuidv1().split('-')[0])
      shoppingCartItems.push({
        id:0,
        cart_id:uuidv1(),
        title:title,
        sale_price:price,
        full_price:price,
        price:price,
        quantity:1
      })
      total+=price
      total=Math.round(total*100)/100
      await AsyncStorage.setItem('shoppingCartItems',JSON.stringify(shoppingCartItems))
      await AsyncStorage.setItem('total',total.toString())

      this.props.AddToCart(shoppingCartItems,total)
      navigation.goBack()
    }
  }
 
  render() {
    
    return (
        <View style={[styles.container,styles.columnStartCenter]}>
          <View style={[styles.center,styles.grayView]}>
            <View style={[styles.rowCenter]}>
              <Text style={[styles.generalFont,{color:"#ed6a1d"}]}>{L('sar')}</Text>
              <TextInput
                placeholder={this.state.priceLabel}
                style={styles.priceBox}
                ref={(input) => { this.price = input; }}
                onChangeText={async (text) => {
                  const purePice=text.replace(L('sar'),''),
                  pattern=/^(\d)+(\.){0,1}(\d){0,2}$/
                  console.log('/^(\d\.)+$/.test(text)',purePice,pattern.test(purePice),isNaN(purePice))
                  await this.setState({price:(!pattern.test(purePice)?this.state.price:purePice)})
                  // await this.setState({price:purePice})
                }}
                value={this.state.price}
                placeholderTextColor='#ed6a1d'
                keyboardType="phone-pad"
              />
            </View>
          </View>
          <View style={{width:'90%'}}>
            <Input
              label={(
                <Text style={[styles.generalFont]}>{L('serviceLabel')}</Text>
              )}
              placeholder={L('servicePlaceHolder')}
              containerStyle={[styles.textContainerBox]}
              inputContainerStyle={[styles.textInputContainerBox]}
              inputStyle={styles.textBox}
              labelStyle={{
                style:[styles.generalFont,{color:'#a4a4a4'}]
              }}
              ref={(input) => { this.title = input; }}
              onChangeText={(text) => this.setState({title:text})}
              value={this.state.title}
              placeholderTextColor='#a4a4a4'
            />
          </View>
          <View style={[styles.rowAround,{backgroundColor:'#FFF', position:'absolute',bottom:0,width:'100%',height:scale(16)}]}>
            <Button
              title={L('addToShoppingCart')}
              containerStyle={[styles.buttonRoundStyles,{marginTop:0}]}
              buttonStyle={styles.buttonStyles}
              titleStyle={[styles.buttonTextStyle]}
              onPress={() => this.addToCart()}
            />
          </View>
        </View>
    );
  }
}

const mapStateToProps = state => {
  console.log('products props',state.products.shoppingCartItems.length)
  return { 
    errorMsg:state.errorMsg,
    // success:state.auth.success,
    name:state.auth.name,
    products:state.products.products,
    shoppingCartItems:state.products.shoppingCartItems,
    total:state.products.total,
  };
};

function mapDispatchToProps(dispatch) {

  return {
    AddToCart: (shoppingCartItems,total) =>{dispatch(AddToCart(shoppingCartItems,total))},
  };
}

const AddSerivce = connect(mapStateToProps, mapDispatchToProps)(AddServiceComponent);
export default AddSerivce;
