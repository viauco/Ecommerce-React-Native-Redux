import React, {Component} from 'react';
import {View,StatusBar,Text,Image,TouchableWithoutFeedback} from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import { Avatar,Icon, Badge, withBadge } from 'react-native-elements'

import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { L,preventDoubleNavigat } from './config'
import styles,{mainFont,scale,mainColor} from './Styles'


// import Printer from './printer'
import Index from './index'
import Drawer from './drawer'
import Login from './components/Login'
import AddSerivce from './components/AddSerivce'
import ShoppingCart from './components/ShoppingCart'
import Payment from './components/Payment'
import Cash from './components/Cash'
import Done from './components/Done'
import Bill from './components/Bill'
import Printer from './components/Printer'

const BadgedIcon = withBadge(1)(Icon)
let RootStack = createStackNavigator({
  Index: {
    screen: Index,
    navigationOptions: {
      header: null,
    }
  },
  Login: {
    screen: Login,
    navigationOptions: {
      header: null,
    }
  },
  Drawer: {
    screen: Drawer,
    navigationOptions:({navigation}) => ({
      header: null,
    })
  },
  AddSerivce: {
    screen: AddSerivce,
    navigationOptions:({navigation}) => ({
      //header: null,
      title:L('AddSerivce')
    })
  },
  ShoppingCart: {
    screen: ShoppingCart,
    navigationOptions:({navigation}) => ({
      //header: null,
    })
  },
  Payment: {
    screen: Payment,
    navigationOptions:({navigation}) => ({
      //header: null,
      title:L('payment')
    })
  },
  Cash: {
    screen: Cash,
    navigationOptions:({navigation}) => ({
      //header: null,
      title:L('cash')
    })
  },
  Done: {
    screen: Done,
    navigationOptions:({navigation}) => ({
      //header: null,
      //title:L('cash')
    })
  },
  Bill: {
    screen: Bill,
    navigationOptions:({navigation}) => ({
      header: null,
      //title:L('cash')
    })
  },
  Printer: {
    screen: Printer,
    navigationOptions: {
      //header: null,
      title: L('bluetooth')
    }
  }
});

// And the app container
export default HomeScreen = createAppContainer(RootStack);