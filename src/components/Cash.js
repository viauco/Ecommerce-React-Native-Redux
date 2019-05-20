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
import {SaveOrder,AddPaid} from '../actions'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Button,Input,Icon,Badge, withBadge } from 'react-native-elements'

const bigIconsColor="#8e8e8e",
bigActiveIconsColor="#ed6a1d",
bigIconsShadowColor='rgba(0,0,0,0.4)',
bigActiveIconsShadowColor='rgba(237, 106, 29,0.4)'

class CashComponent extends Component {
  _isMounted=true
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      refreshing: false,
      paidLabel:'0.00',
      paid:this.props.paid?this.props.paid:''
    };
  }
  async componentDidMount() {
      try {
      } catch (error) {
         //console.error(error)
      }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  async componentDidUpdate(prevProps, prevState) {
    console.log('cash componentDidUpdate prevProps',prevProps,this._isMounted)
    if(this._isMounted&&this.props.bill_id){
      this._isMounted=false
      console.log('componentDidUpdate nextProps',this.props.bill_id)
      AsyncStorage.setItem('bill_id',this.props.bill_id.toString())
      preventDoubleTapHack(this,'Done')
    }
  }
  async AddPaid(item){
    let {total,navigation,notes,showNotes}=this.props,
    {paid}=this.state,
    filterNumber=/^(\d)+(\.){0,1}(\d){0,2}$/,
    errorMsg=null
    if(!filterNumber.test(paid)||total>paid){
      errorMsg=L('pleaseInsert')+L('paid')
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
      let products=[],
      data={
        "customer":0,
        "payment":{
          "type":"cash",
          "total":total
        }
      };
      
      if(notes){
        data={...data,...{notes,"display_note":showNotes}}
      }
      this.props.shoppingCartItems.map(item=>{
        products.push({
          id:item.id,
          title:item.title,
          price:item.price,
          qty:item.quantity,
          cost:item.full_price*item.quantity,
          option:'product'
        })
      })
      data.cart=products
      console.log('products',data)
      // return
      RNProgressHud.showWithStatus()

      await AsyncStorage.setItem('paid',paid.toString())
      this.props.SaveOrder(paid,data)
      this.props.AddPaid(paid)
      RNProgressHud.dismiss()
      // navigation.navigate('Done')
    }
  }
 
  render() {
    
    return (
        <View style={[styles.container,styles.columnStartCenter]}>
          <View style={[styles.center,styles.grayView]}>
            <View style={[styles.rowCenter]}>
              <Text style={[styles.generalFont,{color:"#ed6a1d"}]}>{L('sar')}</Text>
              <TextInput
                placeholder={this.state.paidLabel}
                style={[styles.priceBox]}
                ref={(input) => { this.paid = input; }}
                onChangeText={async (text) => {
                  const purePice=text.replace(L('sar'),''),
                  pattern=/^(\d)+(\.){0,1}(\d){0,2}$/
                  console.log('/^(\d\.)+$/.test(text)',purePice,pattern.test(purePice),isNaN(purePice))
                  await this.setState({paid:(!pattern.test(purePice)?this.state.paid:purePice)})
                  // await this.setState({paid:purePice})
                }}
                value={this.state.paid}
                placeholderTextColor='#ed6a1d'
                keyboardType="phone-pad"
              />
            </View>
          </View>
          <View style={[styles.rowAround,{backgroundColor:'#FFF', position:'absolute',bottom:0,width:'100%',height:scale(16)}]}>
            <Button
              title={L('pay')}
              containerStyle={[styles.buttonRoundStyles,{marginTop:0}]}
              buttonStyle={styles.buttonStyles}
              titleStyle={[styles.buttonTextStyle]}
              onPress={() => this.AddPaid()}
            />
          </View>
        </View>
    );
  }
}

const mapStateToProps = state => {
  console.log('Cash props',state.products.total,state.products.paid,state.products.bill_id)
  return { 
    errorMsg:state.errorMsg,
    // success:state.auth.success,
    name:state.auth.name,
    shoppingCartItems:state.products.shoppingCartItems,
    bill_id:state.products.bill_id,
    paid:state.products.paid,
    total:state.products.total,
    notes:state.products.notes,
    showNotes:state.products.showNotes,
  };
};

function mapDispatchToProps(dispatch) {

  return {
    SaveOrder: (paid,data) =>{dispatch(SaveOrder(paid,data))},
    AddPaid: (paid) =>{dispatch(AddPaid(paid))},
  };
}

const Cash = connect(mapStateToProps, mapDispatchToProps)(CashComponent);
export default Cash;
