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
import {OrderNotes,AddToHold} from '../actions'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Button,Input,Icon,CheckBox,Divider } from 'react-native-elements'

class PaymentComponent extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showNotes: this.props.showNotes&&this.props.showNotes!='false'?this.props.showNotes:false,
      notes:this.props.notes,
      priceLabel:'0.00',
      price:'',
      method:''
    };
  }
  async componentDidMount() {
      try {
        // alert(this.props.notes)
        let notes=await AsyncStorage.getItem('notes'),
        showNotes=await AsyncStorage.getItem('showNotes')
        console.log('notes',notes,typeof notes)
        console.log('showNotes',showNotes,typeof showNotes)
        // await this.setState({notes,showNotes})
        // alert(showNotes+"\n"+typeof showNotes+"\n"+(showNotes=='true'))
      } catch (error) {
         //console.error(error)
      }
  }
  
  async payBy(method){
    this.setState({method})
  }
  
  async doPay(){
    // alert(method)
    const {notes,showNotes,method}=this.state,
    {navigation}=this.props
    let errorMsg=null
    if(showNotes&&!notes){
      errorMsg=L('pleaseInsert')+L('notes')
    }else if(!method){
      errorMsg=L('pleaseChoose')+L('paymentMethod')
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
      // console.log('notes',notes,typeof notes)
      AsyncStorage.setItem('notes',notes)
      AsyncStorage.setItem('showNotes',showNotes.toString())
      this.props.OrderNotes(notes,showNotes)
      navigation.navigate(method)
    }
  }
  _holdHandeler(){
    // alert('add to hold')
    if(this.props.shoppingCartItems&&this.props.shoppingCartItems.length){
      const key=uuidv1()
      console.log('key',key)
      this.props.AddToHold(key,this.props.shoppingCartItems,this.props.total) ;
    }else{
      // alert('showhold')
      
    }
    resetNavigation(this,'Drawer')
  }
  render() {
    const paymentMethods=[
      {photo:require('../assets/img/cash.png'),method:'Cash'},
      {photo:require('../assets/img/halla.png'),method:'Halla'},
      {photo:require('../assets/img/visa.png'),method:'Visa'},
      {photo:require('../assets/img/stc.png'),method:'STC'},
      {photo:require('../assets/img/branch.png'),method:'Branch'}
    ]
    return (
        <View style={[styles.container,styles.columnStartCenter]}>
          <ScrollView
            contentContainerStyle={[styles.column,{width:'100%',justifyContent:'flex-start'}]}
            style={{width:'100%'}}
          >
          <View style={[styles.center,styles.grayView,{backgroundColor:'#FFF'}]}>
            <Text style={[styles.generalFont]}>{L('total')}</Text>
            <Text style={[styles.generalFont,{fontSize:18,color:"#ed6a1d"}]}>{this.props.total} {L('sar')}</Text>
            <Button
              title={L('addDiscount')}
              containerStyle={[styles.buttonRoundStyles,styles.buttonWhite,{width:scale(40)}]}
              buttonStyle={styles.buttonStyles}
              titleStyle={[styles.buttonTextStyle,{color:mainColor}]}
            />
          </View>
          

          <View style={{width:'100%'}}>
            <View style={[{height:1, backgroundColor: '#f5f5f5' }]} />
            <Input
              label={(
                <Text style={[styles.generalFont]}>{L('orderNotes')}</Text>
              )}
              placeholder={L('notesPlaceHolder')}
              containerStyle={[styles.textContainerBox]}
              inputContainerStyle={[styles.textInputContainerBox]}
              inputStyle={styles.textBox}
              labelStyle={{
                style:[styles.generalFont,{color:'#a4a4a4'}]
              }}
              ref={(input) => { this.notes = input; }}
              onChangeText={(text) => this.setState({notes:text})}
              value={this.state.notes}
              placeholderTextColor='#a4a4a4'
            />
            <CheckBox
              containerStyle={{backgroundColor:'transparent',borderWidth:0,padding:0}}
              textStyle={[styles.generalFont,{color:mainColor,fontFamily:mainFont}]}
              checkedColor={mainColor}
              fontFamily={mainFont}
              title={L('showNotesInBill')}
              iconRight
              right
              onPress={() => this.setState({showNotes: !this.state.showNotes})}
              checked={this.state.showNotes}
            />
          </View>
          <View style={[styles.rowReverse,{flexWrap:'wrap'}]}>
          {paymentMethods.map((item)=>(
            <TouchableWithoutFeedback onPress={()=>this.payBy(item.method)}>
              <View style={[styles.center,styles.bigShadow,{width:scale(30),height:scale(30),margin:scale(1.5),backgroundColor:'#FFF',borderRadius:5},this.state.method==item.method?{borderColor:mainColor,borderWidth:1}:{} ]}>
                <Image source={item.photo} style={{width:scale(15),height:scale(15),resizeMode:'contain'}}/>
              </View>
            </TouchableWithoutFeedback>
          ))}
          </View>
          <View style={{height:scale(18)}}/>
          </ScrollView>
          <View style={[styles.rowAround,{backgroundColor:'#FFF', position:'absolute',bottom:0,width:'100%',height:scale(16),borderTopWidth:1.5,borderColor:"#f5f5f5"}]}>
            <Icon
              type="font-awesome"
              name="pause"
              color="#FFF"
              underlayColor={'transparent'}
              size={20}
              onPress={() => {this._holdHandeler();}}
              containerStyle={[styles.center,{backgroundColor:"#edba1d",width:scale(12),height:scale(12),borderRadius:scale(6)}]}
            />
            <Button
              title={L('cartItems').replace('%t',(this.props.shoppingCartItems?this.props.shoppingCartItems.length:0)).replace('%p',this.props.total)}
              containerStyle={[styles.buttonRoundStyles,{marginTop:0,width:'78%'}]}
              buttonStyle={styles.buttonStyles}
              titleStyle={[styles.buttonTextStyle]}
              onPress={()=>{this.doPay()}}
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
    shoppingCartItems:state.products.shoppingCartItems,
    total:state.products.total,
    notes:state.products.notes,
    showNotes:state.products.showNotes,
  };
};

function mapDispatchToProps(dispatch) {

  return {
    OrderNotes: (notes,showNotes) =>{dispatch(OrderNotes(notes,showNotes))},
    AddToHold: (key,shoppingCartItems,total) =>{dispatch(AddToHold(key,shoppingCartItems,total))},
  };
}

const Payment = connect(mapStateToProps, mapDispatchToProps)(PaymentComponent);
export default Payment;
