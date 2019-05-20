/*
 * Qiirat React Native App
 * http://qiirat.com
 * authored by omar hassan
 * All Rights Reserved For AlyomHost For It Solutions
 */
'use strict'
import React, { Component } from 'react'
import {Platform,View, Image,ImageBackground,Text,AsyncStorage,Share,TouchableWithoutFeedback,DeviceEventEmitter,ScrollView,Linking}from 'react-native'

import { connect } from "react-redux";
import {createDrawerNavigator, DrawerItems,NavigationActions } from 'react-navigation'

import Icon from 'react-native-vector-icons/FontAwesome'
import { Button,Avatar } from 'react-native-elements'


import {LogOut} from './actions'
import Products from './components/Products'

import { L,baseUploadUrl,baseUrl,googleConfig,preventDoubleTapHack,headers,resetNavigation,preventDoubleNavigat } from './config'
import styles,{mainColor,mainFont,scale,verticalScale} from './Styles'

let profilePhoto=baseUploadUrl+'profile.png',name=''


class DrawerContent extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      name:'',
      userdata:{},
      photo:baseUploadUrl+'profile.png'
    };
  }
  async componentDidMount() {
    
    const { params } = this.props.navigation.state
    console.log('dwrewer component dd mount drower ',this.props.name)
    /*} catch (error) {
      //console.error('fetch error rere =>',error)
    }*/
  }

  render(){
    let {navigation}=this.props,{navigate}=navigation
    const {pages,settings}=this.state
    let photo=require('./assets/img/store.png')
    if(this.props.photo){
      photo={uri:this.props.photo}
    }
    return(
      <View style={[styles.container,{backgroundColor:"#4E4D4D",justifyContent: 'flex-start'}]}>
        <View style={[styles.columnStartEnd,{width:'100%'}]}>
          <TouchableWithoutFeedback onPress={()=>{
            navigation.closeDrawer()
            preventDoubleTapHack(this,'profile', {
                title: L('profile')
            })
          }}>
            <View style={[styles.columnStartEnd,{paddingHorizontal:10,marginTop:10}]}>
              <Image source={photo} style={{backgroundColor:"#404040",width:verticalScale(10),height:verticalScale(10),borderRadius:verticalScale(5)}} />
              <Text style={{color:"#FFF",fontFamily:mainFont,marginVertical:5}}>{L('welcome')+' '+this.props.name}</Text>
            </View>
          </TouchableWithoutFeedback>
          <ScrollView style={{width:'100%'}}>
  
            {/*<DrawerItems {...props}/>*/}

            
            <TouchableWithoutFeedback
              onPress={() =>
                {
                  navigation.closeDrawer()
                  preventDoubleTapHack(this,'Products', {
                      title: L('home')
                  })
                }
              }
              >
              <View style={[styles.menuItem]}>
                <Image source={require('./assets/img/home.png')} style={styles.menuIcon}/>
                <Text style={styles.menuText}>{L('home')}</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() =>
                {
                  navigation.closeDrawer()
                  this.props.LogOut()
                }
              }
              >
              <View style={[styles.menuItem]}>
                <Image source={require('./assets/img/home.png')} style={styles.menuIcon}/>
                <Text style={styles.menuText}>{L('logout')}</Text>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>


          

        </View>
      </View>
    )
  }
}



const mapStateToProps = state => {
  console.log('DrawerContent props',state.auth.name)
  return { 
    name:state.auth.name,
    email:state.auth.email,
    photo:state.auth.photo,
    shoppingCartItems:state.products.shoppingCartItems,
  };
};
function mapDispatchToProps(dispatch) {

  return {
    LogOut: () =>{dispatch(LogOut())}
  };
}

const DrawerComponent = connect(mapStateToProps,mapDispatchToProps)(DrawerContent);

const Drawer = createDrawerNavigator({
    index: {
      screen: Products,
      navigationOptions:({navigation}) => ({
        //header: null,
        title: L('appTitle'),
        drawerLabel: L('appTitle'),
        fontFamily:mainFont,
        activeTintColor: mainColor,
        inactiveTintColor: '#000',
        drawerIcon: ({ tintColor }) => <Icon
          name='check-circle'
          color={mainColor}
          size={25}
          activeTintColor= {mainColor}
          inactiveTintColor= '#000'
          style={{tintColor:mainColor,activeTintColor: mainColor}}
        />
      })
    }
  },
  {
    drawerPosition: "right",
    overlayColor: '#555555', 
    contentComponent: DrawerComponent,
    contentOptions: {
      activeTintColor: mainColor,
      inactiveTintColor: '#000',
      labelStyle: {
        flex: 1,
        textAlign: 'left',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        fontFamily:mainFont,
        fontSize:13,
        fontWeight: 'normal'
      },
      itemStyle: {
        flexDirection: 'row'
      },
      iconContainerStyle: {
        opacity: 1
      },
      Style: {
        //padding: 10,
      }
    }
  }

)
// getLabel = {(scene) => (
//   <View style={{fontFamily: mainFont}}>
//     <Text style={{fontFamily: mainFont}}>{props.getLabel(scene)}</Text>
//   </View>
// )}

export default Drawer
