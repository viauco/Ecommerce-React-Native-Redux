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
import {GetProducts,SearchProducts,AddToCart,AddToHold,SetHold} from '../actions'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Button,Input,Icon,Badge, withBadge,Overlay,Divider } from 'react-native-elements'

const bigIconsColor="#8e8e8e",
bigActiveIconsColor="#ed6a1d",
bigIconsShadowColor='rgba(0,0,0,0.4)',
bigActiveIconsShadowColor='rgba(237, 106, 29,0.4)'

class ProductsComponent extends Component {
  static navigationOptions = ({ navigation }) => ({
      title: null,
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
          <Text style={styles.generalFont}>{L('home')}</Text>
          <Icon
            name='bars'
            type='font-awesome'
            color='#4f4e4e'
            size={25}
            containerStyle={{paddingRight: 15}}
            onPress={
              () => navigation.toggleDrawer()
            }
          />
        </View>
        ,
      headerTintColor: '#4f4e4e',
      headerBackTitle: null,
      headerLeft:  
        <View style={[styles.rowReverse]}>
          <TouchableWithoutFeedback
            onPress={
              () =>{navigation.navigate('ShoppingCart')}
            }
          >
            <View style={[styles.column,{marginLeft:10}]}>
              <Badge
                status="warning"
                value={navigation.state.params&&navigation.getParam('cartProducts',0)?navigation.getParam('cartProducts',0):0}
                containerStyle={{ position: 'absolute', top: -4, right: -4,zIndex:1 }}
              />
              <Image source={require('../assets/img/headerCart.png')} style={{width:scale(8),height:scale(8),resizeMode:'contain'}} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={
              () => {/*navigation.navigate('AddUser')*/}
            }
          >
            <Image source={require('../assets/img/addUser.png')} style={{marginLeft:10, width:scale(8),height:scale(8),resizeMode:'contain'}} />
          </TouchableWithoutFeedback>
        </View>
      ,
      
    });
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      refreshing: false,
      grid: true,
      searchLabel:L('searchPlaceholder'),
      passwordLabel:L('password'),
      buttonTitle:L('save'),
      hold:[],
      userdata:{},
      name:'',
      search:'',
      password:'',
      message:'',
      loadText:'',
      confirmationCode:'',
      allTintColor:bigIconsColor,
      favTintColor:bigIconsColor,
      bestTintColor:bigIconsColor,
      allShadowColor:bigIconsShadowColor,
      favShadowColor:bigIconsShadowColor,
      bestShadowColor:bigIconsShadowColor,
      showHold:false,
      contactInfo:{}
    };
  }
  async componentDidMount() {
      try {
        let arr=[ {name: "Kristian", lines: "2,5,10"},
           {name: "John", lines: "1,19,26,96"},
           {name: "Brian", lines: "3,9,62,36"} ];

        console.log('arr.findIndex(v => v.name === "Brian")',arr.findIndex(v => v.name === "Brian"))
        await this.setState({allTintColor:bigActiveIconsColor,allShadowColor:bigActiveIconsShadowColor})
        await this.props.GetProducts();
        // await this.setState({cartProducts:this.props.shoppingCartItems.length})
        let hold=[]
        if(this.props.hold){
          hold=this.props.hold.length?this.props.hold:[]
        }
        this.setState({hold:hold})
        this.props.navigation.setParams({ cartProducts:this.state.cartProducts })
        // this.props.navigation.setParams({ 'cartProducts':20 })
        // alert(verticalScale(100))
      } catch (error) {
         //console.error(error)
      }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('nextProps',nextProps.hold)
    if (nextProps.hold.length!=prevState.hold.length) {
      return ({ hold: nextProps.hold }) // <- this is setState equivalent
    }
    if (nextProps.shoppingCartItems.length!=prevState.cartProducts) {
      return ({ cartProducts: nextProps.shoppingCartItems.length }) // <- this is setState equivalent
    }
    return null
  }
  async componentDidUpdate(prevProps, prevState) {
    if(this.props.shoppingCartItems&&prevProps.shoppingCartItems){
      if((this.props.shoppingCartItems.length!=prevState.cartProducts)){
        this.props.navigation.setParams({ cartProducts:this.state.cartProducts })
      }
    }
    console.log('this.props.hold&&prevProps.hold',this.props.hold,prevState.hold)
    if(typeof this.props.hold=='object'){
      //if((this.props.hold.length!=prevProps.hold.length)){
        AsyncStorage.setItem('hold',JSON.stringify(this.props.hold))
      //}
    }
  }
  _onRefresh = async () => {
    await this.setState({refreshing: true});
    if(this.state.search){
      await this.props.SearchProducts(this.state.search);
    }else{
      await this.props.GetProducts();
    }
    await this.setState({refreshing: false});
  }
  addToCart(item){
    let {shoppingCartItems}=this.props,
    total=0,
    itemExists=false;
    shoppingCartItems.map(cartItem=>{
      if(cartItem.id==item.id||cartItem.title==item.title){
        cartItem.quantity++
        itemExists=true
      }
      total+=cartItem.price*cartItem.quantity
    })
    //console.log(itemExists)
    if(!itemExists){
      shoppingCartItems.push({
        id:item.id,
        cart_id:uuidv1(),
        title:item.title,
        sale_price:item.sale_price,
        full_price:item.full_price,
        price:item.full_price,
        quantity:1
      })
      total+=item.full_price*1
    }
    total=Math.round(total*100)/100
    this.doAddToCart(shoppingCartItems,total)
  }
  async doAddToCart(shoppingCartItems,total){
    await AsyncStorage.setItem('shoppingCartItems',JSON.stringify(shoppingCartItems))
    await AsyncStorage.setItem('total',total.toString())
    this.props.AddToCart(shoppingCartItems,total)
  }

  _holdHandeler(){
    // alert('add to hold')
    if(this.props.shoppingCartItems&&this.props.shoppingCartItems.length){
      const key=uuidv1()
      console.log('key',key)
      this.props.AddToHold(key,this.props.shoppingCartItems,this.props.total) ;
    }else if(this.props.hold&&this.props.hold.length){
      // alert('showhold')
      this.setState({showHold:true})
    }
  }
  AddFromHoldToCart(item){
    this.setState({showHold:false})
    this.removeFromHold(item.key)
    this.doAddToCart(item.shoppingCartItems,item.total)
  }
  removeFromHold(key,hideModal){
    let {hold}=this.props
    const RemoveIndex=hold.findIndex(item => item.key ==key)
    // alert(key+"\n"+RemoveIndex)
    hold.splice(RemoveIndex,1)
    // alert(hold.length)
    if(0==hold.length){
      this.setState({showHold:false})
    }
    this.setState({hold})
    this.props.SetHold(hold)
  }
  _renderProductGrid=(item)=>{
    //console.log('items',item)
    // item.image='https://cdn.zeplin.io/5c8e63edc4045605c446bea9/assets/507b936d-6d04-4463-97a8-173374b1d255.png'
    return (
      <TouchableWithoutFeedback onPress={()=>this.addToCart(item)}>
      <View style={[styles.center,{borderRadius:scale(1),width:'100%',height:'100%',backgroundColor:item.bg_color?item.bg_color:"#4F4E4E"}]}>
        {item.image?(
          <Image source={{uri:item.image}} style={[styles.productCellImage]}/>
        ):(
          <Text style={[styles.productCellText]} numberOfLines={1}>{item.title&&item.title.split(' ')[0]}</Text>
        )}
        <View style={[styles.productCellDescription]}>
          <Text style={[styles.productCellDescriptionText]}>{item.title}</Text>
          <Text style={[styles.productCellDescriptionText]}>{item.full_price} {L('sar')}</Text>
        </View>
      </View>
      </TouchableWithoutFeedback>
    )
  }
  _renderProductRow=(item)=>{
    //console.log('items',item)
    // item.image='https://cdn.zeplin.io/5c8e63edc4045605c446bea9/assets/507b936d-6d04-4463-97a8-173374b1d255.png'
    return (
      <TouchableWithoutFeedback onPress={()=>this.addToCart(item)}>
      <View style={[styles.rowReverseBetween,{width:scale(90),marginTop:0,paddingVertical:10,borderBottomWidth:1,borderColor:'#e5e5e5'}]}>
        <View style={[styles.rowReverse,{marginTop:0}]}>
          <View style={[styles.center,{borderRadius:scale(1),width:scale(17),height:scale(17),backgroundColor:item.bg_color?item.bg_color:"#4F4E4E"}]}>
            {item.image?(
              <Image source={{uri:item.image}} style={[styles.productCellImage]}/>
            ):(
              <Text style={[styles.productCellText]} numberOfLines={1}>{item.title&&item.title.split(' ')[0]}</Text>
            )}
          </View>
          <Text style={[styles.generalFont]}>{item.title}</Text>
        </View>
        <Text style={[styles.boldFont]}>{item.full_price} {L('sar')}</Text>
      </View>
      </TouchableWithoutFeedback>
    )
  }
  _renderHoldRow=(item)=>{
    console.log('hold items',item)
    if(!item.shoppingCartItems||!item.shoppingCartItems.length) return null
    // item.image='https://cdn.zeplin.io/5c8e63edc4045605c446bea9/assets/507b936d-6d04-4463-97a8-173374b1d255.png'
    return (
      <View style={[styles.rowReverseBetween,{width:'90%',marginTop:0}]}>
        <View style={[styles.columnStartEnd,{borderRadius:scale(1),width:"auto"}]}>
          <View style={styles.rowReverse}>
            <Text style={[styles.smallFont]}>اسم العميل: عبدالله القحطاني</Text>
            <Badge textStyle={{fontFamily:mainFont}} value="عميل عادي" status="warning" />
          </View>
          {item.shoppingCartItems.map((product)=>(
            <Text style={[styles.smallFont]}>{product.quantity} X {product.title}</Text>
          ))}
          <Text style={[styles.boldFont,{color:mainColor}]}>{L('total')} {item.total} {L('sar')}</Text>
        </View>
        <View style={[styles.rowReverse,{alignSelf:'flex-end'}]}>
          <Button
            title={L('addToShoppingCart')}
            containerStyle={[styles.buttonRoundStyles,styles.smallBtn,{backgroundColor:'#4f4e4e'}]}
            buttonStyle={[styles.buttonStyles,{width:'auto',height:'auto',padding:0}]}
            titleStyle={[styles.smallFont,{color:'#FFF'}]}
            onPress={()=>{this.AddFromHoldToCart(item)}}
          />
          <Button
            title={L('delete')}
            containerStyle={[styles.buttonRoundStyles,styles.smallBtn,{backgroundColor:'#f85c5c'}]}
            buttonStyle={[styles.buttonStyles,{width:'auto',height:'auto',padding:0}]}
            titleStyle={[styles.smallFont,{color:'#FFF'}]}
            onPress={()=>{this.removeFromHold(item.key)}}
          />
        </View>
      </View>
    )
  }
  render() {
    const {allTintColor,favTintColor,bestTintColor,allShadowColor,favShadowColor,bestShadowColor,hold}=this.state
    let products=[],additionalProducts=range(1,12)

    if(this.props.products){
      products=this.props.products.length?this.props.products:[]
    
      if(products.length<12){
      
        additionalProducts=range(1,(11-this.props.products.length))//end to 11 because we will add a grid cell to add new product
        //console.log(this.state.cartProducts,products.length,this.props.products.length)
      }
    }
    
    // console.warn('rerender')
    // this.props.navigation.setParams({ cartProducts:this.props.shoppingCartItems.length })
    return (
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={[styles.column,{width:'100%',justifyContent:'flex-start'}]}
            style={{width:'100%'}}
            keyboardShouldPersistTaps='always'
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <View style={[styles.rowBetween,{marginTop:verticalScale(3), width:'92%'}]}>

              <Icon
                type="font-awesome"
                name={this.state.grid?'list':'th'}
                color="#FFF"
                underlayColor={'transparent'}
                size={20}
                containerStyle={[styles.center,{backgroundColor:"#4f4e4e",width:scale(12),height:scale(12),borderRadius:scale(6)}]}
                onPress={() => {this.setState({grid:!this.state.grid});}}
              />
              <Input
                placeholder={this.state.searchLabel}
                containerStyle={[styles.textRoundContainerBox,styles.shadow]}
                inputContainerStyle={[styles.textRoundInputContainerBox]}
                inputStyle={styles.textRoundBox}
                labelStyle={{
                  style:[styles.generalFont,{color:'#a4a4a4'}]
                }}
                ref={(input) => { this.search = input; }}
                onChangeText={(text) => this.setState({search:text})}
                value={this.state.search}
                placeholderTextColor='#c0c0c0'
                rightIcon={
                  <Image source={require('../assets/img/search.png')} style={styles.menuIcon}/>
                }
                leftIcon={
                  <Icon
                    size={20}
                    name='search'
                    type='font-awesome'
                    color="#525151"
                    underlayColor={'transparent'}
                    onPress={() => {this._onRefresh();}}
                  />
                }
              />
            </View>

            <View style={[styles.rowReverseBetween,{marginTop:verticalScale(3), width:'92%'}]}>
              <TouchableWithoutFeedback onPress={async ()=>{this.setState({search:''});this._onRefresh();}}>
                <View style={[styles.columnStartCenter]}>
                  <View style={[styles.center,styles.bigIcon,{borderWidth:0.7,borderColor:allTintColor}]}>
                    <Image source={require('../assets/img/all.png')} style={[styles.bigIconImg,{tintColor:allTintColor}]}/>
                  </View>
                  <Text style={[styles.bigIconText,{color:allTintColor}]}>{L('allProducts')}</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={()=>{}}>
                <View style={[styles.columnStartCenter]}>
                  <View style={[styles.center,styles.bigIcon,{borderWidth:0.7,borderColor:favShadowColor}]}>
                    <Image source={require('../assets/img/fav.png')} style={[styles.bigIconImg,{tintColor:favTintColor}]}/>
                  </View>
                  <Text style={[styles.bigIconText,{color:favTintColor}]}>{L('favProducts')}</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={()=>{}}>
                <View style={[styles.columnStartCenter]}>
                  <View style={[styles.center,styles.bigIcon,{borderWidth:0.7,borderColor:bestShadowColor}]}>
                    <Image source={require('../assets/img/best.png')} style={[styles.bigIconImg,{tintColor:bestTintColor}]}/>
                  </View>
                  <Text style={[styles.bigIconText,{color:bestTintColor}]}>{L('bestProducts')}</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={()=>{}}>
                <View style={[styles.columnStartCenter]}>
                  <View style={[styles.center,styles.bigIcon,{borderWidth:0.7,borderColor:bestShadowColor}]}>
                    <Image source={require('../assets/img/best.png')} style={[styles.bigIconImg,{tintColor:bestTintColor}]}/>
                  </View>
                  <Text style={[styles.bigIconText,{color:bestTintColor}]}>{L('bestProducts')}</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={()=>{}}>
                <View style={[styles.columnStartCenter]}>
                  <View style={[styles.center,styles.bigIcon,{borderWidth:0.7,borderColor:bestShadowColor}]}>
                    <Image source={require('../assets/img/best.png')} style={[styles.bigIconImg,{tintColor:bestTintColor}]}/>
                  </View>
                  <Text style={[styles.bigIconText,{color:bestTintColor}]}>{L('bestProducts')}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>

            {this.state.grid?(
              <View style={[styles.rowReverseAround,{flexWrap:'wrap', width:'92%'}]}>
                {products.map((item)=>(
                  <View style={[styles.center,styles.productCell]}>
                    {this._renderProductGrid(item)}
                  </View>
                ))}
                <TouchableWithoutFeedback onPress={()=>{preventDoubleTapHack(this,'AddSerivce')}}>
                  <View style={[styles.center,styles.productCell]}>
                    <Image source={require('../assets/img/plus.png')} style={[styles.productCellImage,{width:'50%',height:'50%'}]}/>
                  </View>
                </TouchableWithoutFeedback>
                {additionalProducts.map((item)=>(
                  <View style={[styles.center,styles.productCell]}/>
                ))}
              </View>
            ):(
              <View style={[styles.column]}>
                {products.map((item)=>(
                  <View style={[styles.column]}>
                    {this._renderProductRow(item)}
                  </View>
                ))}
                <TouchableWithoutFeedback onPress={()=>{preventDoubleTapHack(this,'AddSerivce')}}>
                  <View style={[styles.center,styles.productCell,{alignSelf:'flex-end',width:scale(17),height:scale(17)}]}>
                    <Image source={require('../assets/img/plus.png')} style={[styles.productCellImage,{width:'50%',height:'50%'}]}/>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            )}

            <View style={{height:scale(16)}}/>
          </ScrollView>
          <View style={[styles.rowAround,{backgroundColor:'#FFF', position:'absolute',bottom:0,width:'100%',height:scale(16)}]}>
            <Icon
              type="font-awesome"
              name="pause"
              color="#FFF"
              underlayColor={'transparent'}
              size={20}
              onPress={() => {this._holdHandeler();}}
              disabled={!this.props.shoppingCartItems.length&&!this.props.hold.length}
              containerStyle={[styles.center,{backgroundColor:`${this.props.shoppingCartItems.length||this.props.hold.length?"#edba1d":"#cfcfcf"}`,width:scale(12),height:scale(12),borderRadius:scale(6)}]}
            />
            <Button
              title={L('cartItems').replace('%t',(this.props.shoppingCartItems?this.props.shoppingCartItems.length:0)).replace('%p',this.props.total)}
              containerStyle={[styles.buttonRoundStyles,{width:'66%',marginTop:0}]}
              buttonStyle={styles.buttonStyles}
              titleStyle={[styles.buttonTextStyle]}
              onPress={() => this.props.shoppingCartItems.length?preventDoubleTapHack(this,'Payment'):null}
            />
            <Icon
              type="font-awesome"
              name="external-link"
              color="#FFF"
              underlayColor={'transparent'}
              size={20}
              onPress={() => preventDoubleTapHack(this,'AddSerivce')}
              containerStyle={[styles.center,{backgroundColor:"#4f4e4e",width:scale(12),height:scale(12),borderRadius:scale(6)}]}
            />
          </View>
          {hold.length?(
          <Overlay
            isVisible={this.state.showHold}
            windowBackgroundColor="rgba(0, 0, 0, .3)"
            overlayBackgroundColor="white"
            onBackdropPress={() => this.setState({ showHold: false })}
            height="auto"
            overlayStyle={{marginVertical:verticalScale(5),padding:0}}
            width={scale(95)}
          >
            {/*<Icon type="font-awesome" name="times" color="#c00" containerStyle={{position:'absolute',top:5,left:5}}/>*/}
            <ScrollView contentContainerStyle={[styles.columnStartCenter,{width:'100%',margin:0}]} style={{width:'100%'}}>
            <View style={[styles.columnStartCenter]}>
              {/*<Button
                title={L('holdOrder')}
                containerStyle={[styles.buttonRoundStyles,{width:'80%',marginTop:0}]}
                buttonStyle={styles.buttonStyles}
                titleStyle={[styles.buttonTextStyle]}
                onPress={() => this.setState({ showHold: false })}
              />*/}
              <Divider style={{ backgroundColor: '#4f4e4e' }} />
              {hold.map((item,i)=>(
                <View style={[styles.column,{width:'100%'}]}>
                  {this._renderHoldRow(item)}
                  {hold[i+1]?(
                    <View style={[styles.sep,{width:scale(90)}]}/>
                  ):(<View style={{height:10}}/>)}
                </View>
              ))}
            </View>
            </ScrollView>
          </Overlay>
          ):null}
        </View>
    );
  }
}

const mapStateToProps = state => {
  console.log('products props',state.products.hold.length,state.products.total)
  return { 
    errorMsg:state.errorMsg,
    // success:state.auth.success,
    name:state.auth.name,
    products:state.products.products,
    hold:state.products.hold,
    changeHold:state.products.changeHold,
    shoppingCartItems:state.products.shoppingCartItems,
    total:state.products.total,
  };
};

function mapDispatchToProps(dispatch) {

  return {
    GetProducts: () =>{dispatch(GetProducts())},
    SearchProducts: (query) =>{dispatch(SearchProducts(query))},
    AddToCart: (shoppingCartItems,total) =>{dispatch(AddToCart(shoppingCartItems,total))},
    AddToHold: (key,shoppingCartItems,total) =>{dispatch(AddToHold(key,shoppingCartItems,total))},
    SetHold: (hold) =>{dispatch(SetHold(hold))},
  };
}

const ProductsComponentRedux=connect(mapStateToProps, mapDispatchToProps)(ProductsComponent)

const ProductsScreenStack = createStackNavigator(
  {
    SecondScreen: {
      screen: ProductsComponentRedux,
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      initialRouteName: 'SecondScreen',
      headerMode: 'screen',
      headerTitle: 'Second Screen Header',
      drawerLabel: 'Second Screen',
    }),
  }
);
// const Products = connect(mapStateToProps, mapDispatchToProps)(ProductsComponent);
const Products = connect(mapStateToProps, mapDispatchToProps)(ProductsScreenStack);
export default Products;
