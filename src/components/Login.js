import React, { Component } from 'react';
import { Platform,StyleSheet, 
    View,
    ScrollView,
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

import _ from 'lodash';
import { baseUrl,range,headers,L,preventDoubleTapHack,cAlert,resetNavigation } from '../config'
import styles,{btnColor,mainColor,mainFont,verticalScale} from '../Styles'

import { connect } from "react-redux";
import {DO_LOGIN,LoginAccount} from '../constants'
import {DoLogin} from '../actions'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Button,Input,Icon } from 'react-native-elements'


class LoginComponent extends Component {
   _isMounted = true;
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      verifyForm:false,
      confirmationForm:false,
      passwordForm:false,
      secureTextEntry:true,
      editableemail:true,
      emailLabel:L('email'),
      passwordLabel:L('password'),
      buttonTitle:L('save'),
      nextStep:1,
      userdata:{},
      name:'',
      email:'',
      password:'',
      message:'',
      loadText:'',
      confirmationCode:'',
      contactInfo:{}
    };
  }
  async componentDidMount() {
      try {
        console.log('componentDidMount Login nextProps',this.props.logged)
        this._isMounted = true;
        await this.setState(LoginAccount)
        // alert(verticalScale(100))
      } catch (error) {
         //console.error(error)
      }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  async componentDidUpdate(prevProps, prevState) {
    console.log('login componentDidUpdate prevProps',prevProps,this.props,this._isMounted)
    if(this._isMounted&&this.props.logged){
      this._isMounted=false
      console.log('componentDidUpdate nextProps',this.props.logged)
      // console.log('prevProps.logged!==this.props.logged',prevProps.logged!==this.props.logged)
      // await AsyncStorage.setItem('user_id',responseJson.data.id.toString())
      console.log('session saved')
      // resetNavigation(this,'Drawer')
      this.props.navigation.replace('Drawer')
    }
  }
  async login(e){
    let filterEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    let filterMobile = /^((5){1}[0-9]{8,16})$/
    // let filterMobile = /^((2){1}[0-9]{8,16})$/
    let errorMsg=null
    const { email,password,passwordLabel,emailLabel} = this.state
    if(!filterEmail.test(email)){
      errorMsg=L('inValidEmail')
    }else if(!password){
      errorMsg=L('pleaseInsert')+passwordLabel
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
      // alert('ddddd')
      await this.props.DoLogin({ email,password })
      console.log('after doing login ',this._isMounted,this.state.logged)
      
      
    }
  }
  
  forgetPassword(){
    return
      //console.log('forgetPassword')
      resetNavigation(this,'forgetPassword',{
        title:L('forgetPassword')
      })
  }
  register(){
      this.props.navigation.pop()
      resetNavigation(this,'register',{   
        title:L('register')
      })
  }
  render() {
    const { selectedCity } = this.props;
    
    return (
        <View style={styles.container}>
              <ScrollView contentContainerStyle={[styles.column,{width:'100%',height:'95%',justifyContent:'space-between'}]} style={{width:'100%'}} keyboardShouldPersistTaps='always'>
                <Image style={[styles.logoStyles]} source={require('../assets/img/logo.png')}/>
                <View style={[styles.column,{width:'100%'}]}>
                  <Text style={[styles.generalFont]}>{L('loginHead')}</Text>
                  <Input
                    label={this.state.email?(
                      <Text style={[styles.generalFont]}>{this.state.emailLabel}</Text>
                    ):null}
                    placeholder={this.state.emailLabel}
                    containerStyle={[styles.textContainerBox]}
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
                        name='envelope'
                        type='font-awesome'
                        color={mainColor}
                      />
                    }
                  />
                  <Input
                    label={this.state.password?(
                      <Text style={[styles.generalFont]}>{this.state.passwordLabel}</Text>
                    ):null}
                    placeholder={this.state.passwordLabel}
                    containerStyle={[styles.textContainerBox]}
                    inputStyle={styles.textBox}
                    labelStyle={{
                      style:[styles.generalFont,{color:'#a4a4a4'}]
                    }}
                    onChangeText={(text) => this.setState({password:text})}
                    value={this.state.password}
                    placeholderTextColor='#a4a4a4'
                    secureTextEntry={true}
                    leftIcon={
                      <Icon
                        size={20}
                        name='lock'
                        type='font-awesome'
                        color={mainColor}
                      />
                    }
                  />
                  <TouchableWithoutFeedback onPress={() => this.forgetPassword()}>
                    <Text style={[styles.generalFont,{width:'90%',marginTop:15,color:mainColor}]}>{L('forgetPassword')}</Text>
                  </TouchableWithoutFeedback>
                  <Button
                    title={L('login')}
                    containerStyle={[styles.buttonRoundStyles]}
                    buttonStyle={styles.buttonStyles}
                    titleStyle={[styles.buttonTextStyle]}
                    onPress={() => this.login()}
                  />
                {/*<TouchableWithoutFeedback onPress={() => this.register()}>
                  <Text style={[styles.generalFont,{textAlign:'center',color:'#FFF',position:'absolute',bottom:10}]}>{L('registerText')}</Text>
                </TouchableWithoutFeedback>*/}
              </View>
              <Text style={[styles.generalFont,{textAlign:'center',color:'#a4a4a4',fontSize:11}]}>{L('copyright')}</Text>
            </ScrollView>
        </View>
    );
  }
}



function mapDispatchToProps(dispatch) {
  return {
    //login: ({email,password}) => dispatch(login({email,password})),
    DoLogin: ({email,password}) => dispatch(DoLogin({email,password})),
  };
}
const mapStateToProps = state => {
  console.log('login props',state.auth.logged)
  return { 
    errorMsg:state.errorMsg,
    logged:state.auth.logged,
    name:state.auth.name,
    email:state.auth.email
  };
};
const Login = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
export default Login;
