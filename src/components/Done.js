import React, { Component } from 'react';
import { Platform,StyleSheet, Keyboard,
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
import {SendMessage,EmptyCart} from '../actions'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Button,Input,Icon,CheckBox,Divider } from 'react-native-elements'

class DoneComponent extends Component {
  static navigationOptions = ({ navigation }) => ({
      title:null,
      headerTitleStyle: {
        color:"#4f4e4e",
        fontFamily: mainFont
      },
      headerStyle: {
        backgroundColor:"#FFF"
        // backgroundColor: 'rgba(156, 215, 229, 0.9)'
      },
      headerLeft:null,
      headerRight:
        <Button
          title={L('newPurchase')}
          containerStyle={[styles.buttonRoundStyles,styles.buttonWhite,{width:'auto',height:30,marginTop:0,marginHorizontal:scale(5)}]}
          buttonStyle={styles.buttonStyles}
          titleStyle={[styles.buttonTextStyle,{color:mainColor,width:'auto'}]} 
          onPress={()=>{navigation.getParam('goHome')()}}
        />
      ,
      
      headerTintColor: '#4f4e4e',
      headerBackTitle: null,
      
      
    });
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      total:this.props.total,
      paid:this.props.paid,
      email:'',
      phone:''
    };
    this.scroll = null;
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
  }
  async componentDidMount() {
      try {
        this.props.navigation.setParams({goHome:this.goHome.bind(this)})
      } catch (error) {
         //console.error(error)
      }
  }
  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
  }
  
  _keyboardDidShow() {
    this.scroll.scrollToEnd();
  }

  async goHome(){

    this.props.EmptyCart()
    resetNavigation(this,'Drawer')
    // resetNavigation(this,'Index')
  }
  async goPrint(){
    // alert(method)
    const {email,phone}=this.state,
    {navigation,bill_id}=this.props
    if(email||phone){
      const filterEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
      const filterMobile = /^((05){1}[0-9]{8,16})$/
      // let filterMobile = /^((2){1}[0-9]{8,16})$/
      let errorMsg=null
      if(email&&!filterEmail.test(email)){
        errorMsg=L('inValidEmail')
      }else if(phone&&!filterMobile.test(phone)){
        errorMsg=L('inValidPhoneNumber')
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
        let sendTo={invoices_id:bill_id}
        if(email){
          sendTo.email=email
        }
        if(phone){
          sendTo.mobile=phone
        }
        console.log('email',email,typeof email)

        
        this.props.SendMessage(sendTo)
        //return;
        // preventDoubleTapHack(this,'Printer')
        navigation.navigate('Printer')
      }
    }else{
      // preventDoubleTapHack(this,'Printer')
      navigation.navigate('Printer')
    }
    
  }
 
  render() {
    return (
        <View style={[styles.container,styles.columnStartCenter]}>
          <ScrollView
            contentContainerStyle={[styles.column,{width:'100%'}]}
            style={{width:'100%'}}
            keyboardShouldPersistTaps='always' enableAutoAutomaticScroll={true} ref={(scroll) => {this.scroll = scroll;}}
          >
          <View style={[styles.center,{backgroundColor:'#FFF',marginTop:verticalScale(6)}]}>
            <Image source={require('../assets/img/success.png')} style={{width:scale(35),height:scale(35),resizeMode:'contain'}}/>
            <Text style={[styles.generalFont,{fontSize:18}]}>{L('done_paid')} {this.props.total} {L('sar')}</Text>
            <Text style={[styles.generalFont]}>{L('remain')} {this.props.paid-this.props.total} {L('sar')}</Text>
            
          </View>
          

          <View style={{width:'100%',marginTop:verticalScale(10),paddingBottom:scale(16)}}>
            <Input
              label={(
                <Text style={[styles.generalFont]}>{L('sendSMS')}</Text>
              )}
              placeholder={L('phone')}
              containerStyle={[styles.textContainerBox]}
              inputContainerStyle={[styles.textInputContainerBox]}
              inputStyle={styles.textBox}
              labelStyle={{
                style:[styles.generalFont,{color:'#a4a4a4'}]
              }}
              ref={(input) => { this.phone = input; }}
              onChangeText={(text) => this.setState({phone:text})}
              value={this.state.phone}
              placeholderTextColor='#a4a4a4'
              keyboardType="phone-pad"
              leftIcon={
                <Icon
                  size={20}
                  name='check'
                  type='font-awesome'
                  color={"#4F4E4E"}
                />
              }
            />
            <Input
              label={(
                <Text style={[styles.generalFont]}>{L('sendMail')}</Text>
              )}
              placeholder={L('email')}
              containerStyle={[styles.textContainerBox]}
              inputContainerStyle={[styles.textInputContainerBox]}
              inputStyle={styles.textBox}
              labelStyle={{
                style:[styles.generalFont,{color:'#a4a4a4'}]
              }}
              ref={(input) => { this.email = input; }}
              onChangeText={(text) => this.setState({email:text})}
              value={this.state.email}
              placeholderTextColor='#a4a4a4'
              keyboardType='email-address'
              leftIcon={
                <Icon
                  size={20}
                  name='check'
                  type='font-awesome'
                  color={"#4F4E4E"}
                />
              }
            />
          </View>
          </ScrollView>
          <View style={[styles.rowAround,{backgroundColor:'#FFF', position:'absolute',bottom:0,width:'100%',height:scale(16),borderTopWidth:1.5,borderColor:"#f5f5f5"}]}>
            <Button
              title={L('printBill')}
              icon={
                <Image source={require('../assets/img/print.png')} style={{width:scale(5),height:scale(5),resizeMode:'contain'}}/>
              }
              iconRight
              containerStyle={[styles.buttonRoundStyles,{marginTop:0}]}
              buttonStyle={styles.buttonStyles}
              titleStyle={[styles.buttonTextStyle,{width:'auto'}]}
              onPress={()=>this.goPrint()}
            />
          </View>

        </View>
    );
  }
}

const mapStateToProps = state => {
  console.log('DONE props',state.products.paid,state.products.total)
  return { 
    errorMsg:state.errorMsg,
    // success:state.auth.success,
    name:state.auth.name,
    paid:state.products.paid,
    total:state.products.total,
    bill_id:state.products.bill_id
  };
};

function mapDispatchToProps(dispatch) {

  return {
    SendMessage: (email,phone,bill_id) =>{dispatch(SendMessage(email,phone,bill_id))},
    EmptyCart: () =>{dispatch(EmptyCart())},
  };
}

const Done = connect(mapStateToProps, mapDispatchToProps)(DoneComponent);
export default Done;
