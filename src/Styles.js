
'use strict'
import { StyleSheet, Dimensions,Platform }from 'react-native'

import { baseUrl,range,headers,L } from './config'
const { width, height } = Dimensions.get('window')

// GuideLine sizes are based on standard iphone 6
const guidelineBaseWidth = 414
const guidelineBaseHieght = 736

// export const scale = size => width/guidelineBaseWidth * size
export const scale = size => width * (size/100)
// export const verticalScale = size => height/guidelineBaseHieght * size
export const verticalScale = size => height* (size/100)
export const moderateScale = (size, factor = 0.5) =>
   size + (scale(size) - size) * factor
const gutter=scale(5)
export const mainColor="#ed6a1d"
export const mainColor2='#303030'
export const btnColor='#ed6a1d'
export const mainFont= 'frutiger-lt-arabic-55-roman'
export const boldFont='frutiger-lt-arabic-65-bold'

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
   darkContainer: {
    flex: 1,
    backgroundColor: "#b10f5a",
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightContainer: {
    flex: 1,
    backgroundColor: '#efefef',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:scale(5)
  },
  
  column:{
    flexDirection: 'column',
    //justifyContent:'center',
    alignItems:'center'
  },
  columnStart:{
    flexDirection: 'column',
    justifyContent:'flex-start',
    alignItems:'flex-start'
  },
  columnStartEnd:{
    flexDirection: 'column',
    justifyContent:'flex-start',
    alignItems:'flex-end'
  },
  columnStartCenter:{
    flexDirection: 'column',
    justifyContent:'flex-start',
    alignItems:'center'
  },
  center:{
    flexDirection: 'column',
    justifyContent:'center',
    alignItems:'center'
  },
  row:{
    flexDirection: 'row',
  },
  rowCenter:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:5
  },
  rowAround:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop:5
  },
  rowBetween:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:5
  },
  rowReverse:{flexDirection: 'row-reverse',justifyContent: 'flex-start',alignItems: 'center',marginTop:15},
  rowReverseBetween:{flexDirection: 'row-reverse',justifyContent: 'space-between',alignItems: 'center',marginTop:15},
  rowReverseAround:{flexDirection: 'row-reverse',justifyContent: 'space-around',alignItems: 'center',marginTop:15},
  generalFont:{
    fontFamily:mainFont,
    color:'#555',
    //padding:3,
    marginHorizontal:5,
    textAlign:L('align'),
    fontSize:14
  },
  smallFont:{
    fontFamily:mainFont,
    color:'#8e8e8e',
    //padding:3,
    marginHorizontal:5,
    textAlign:L('align'),
    fontSize:10
  },
  boldFont:{
    fontFamily:boldFont,
    color:'#4f4e4e',
    //padding:3,
    marginHorizontal:5,
    textAlign:L('align'),
    fontSize:14
  },
  shadow:{
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 25,
    shadowRadius: 2,
    elevation:2
  },
  bigShadow:{
    backgroundColor:'#FFF',
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 10,
    shadowRadius: 100,
    elevation:10
  },
   sep:{
      borderWidth: 0.7,
      borderRadius: 5,
      height:1,
      width:'100%',
      borderColor: '#e5e5e5',
      marginVertical:5
   },
   logoStyles: {
      marginTop: verticalScale(13),
      //flex: 1,
      width: scale(30),
      height: scale(30),
      resizeMode: 'contain',
      //backgroundColor:'red'
      //height: moderateScale(165, 0.5)
   },
   buttonStyles: {
      // alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      //textAlign: 'center',
      borderWidth: 0,
      backgroundColor: 'transparent',
      //backgroundColor: '#0f0',
      height: '100%',
    },
   buttonRoundStyles: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 0,
      backgroundColor: btnColor,
      height: 40,
      borderRadius: 20,
      marginTop:verticalScale(4),
      width:'90%',
    },
    buttonTextStyle:{
      fontSize:15,
      fontFamily: mainFont,
      width:'100%',
      color:'#fff',
      textAlign:'center'
    },
    buttonWhite:{
      backgroundColor:'#FFF',
      borderWidth:1,
      borderColor:mainColor
    },
    smallBtn:{
      width:'auto',
      marginTop:0,padding:0,
      paddingHorizontal:2,
      height:20,
      marginHorizontal:3
    },
    textContainerBox:{
      //borderBottomWidth: 1,
      marginTop:verticalScale(3)
    },
    textInputContainerBox:{
      borderBottomWidth:1,
      borderBottomColor:"#cbcbcb"
    },
    textBox:{
      //width:'100%',
      textAlign:L('align'),
      color: "#000",
      fontSize:15,
      //height:'100%',
      fontFamily:mainFont
    },
    textRoundContainerBox:{
      //backgroundColor:'#F00',
      width:'80%',
      borderRadius:20,
      height:40
    },
    textRoundInputContainerBox:{
      //backgroundColor:'#0F0',
      borderBottomWidth:0,
      borderWidth:0
    },
    textRoundBox:{
      //width:'100%',
      textAlign:L('align'),
      color: "#000",
      fontSize:15,
      //height:'100%',
      fontFamily:mainFont
    },
    menuItem:{
      backgroundColor:'#585757',
      width:'100%',
      flexDirection:'row-reverse',
      justifyContent:'flex-start',
      alignItems:'center',
      paddingVertical:3,
      paddingHorizontal:10
    },
    menuIcon:{
      width:scale(5),
      resizeMode:'contain'
    },
    menuText:{
      color:'#FFF',
      fontFamily:mainFont,
      fontSize:13,
      paddingHorizontal:10
    },
    bigIcon:{
      width:scale(16),
      height:scale(16),
      opacity:0.7,
      borderRadius:scale(8)
    },
    bigIconImg:{
      width:scale(5),
      height:scale(5),
      resizeMode:'contain',
      tintColor:'#8e8e8e'
    },
    bigIconText:{
      fontSize:9,
      marginHorizontal:0,
      fontFamily:boldFont,
      width:scale(16),
      textAlign:'center'
    },
    productCell:{
      backgroundColor:'#f5f5f5',
      width:scale(28),
      height:scale(28),
      borderRadius:scale(1),
      marginTop:verticalScale(2)
    },
    productCellText:{
      fontFamily:boldFont,
      fontSize:14,
      color:'#FFF',
      paddingHorizontal:5
    },
    productCellImage:{
      width:'100%',
      height:'100%',
      borderRadius:scale(1)
    },
    productCellDescription:{
      width:'100%',
      backgroundColor:'rgba(0,0,0,0.4)',
      position:'absolute',
      bottom:0,
      paddingVertical:5,
      borderBottomRightRadius:scale(1),
      borderBottomLeftRadius:scale(1)
    },
    productCellDescriptionText:{
      fontFamily:boldFont,
      fontSize:12,
      color:'#FFF',
      paddingHorizontal:5,
      width:'100%',
      textAlign:L('align')
    },
    grayView:{
      backgroundColor:"#F5F5F5",
      width:'100%',
      height:verticalScale(20)
    },
    priceBox:{
      color:"#ed6a1d",
      //width:'80%',
      textAlign:'left',
      fontSize:40,
      //height:'100%',
      fontFamily:mainFont
    },
   billPhoto: {
      marginTop: verticalScale(2),
      //flex: 1,
      width: scale(30),
      height: scale(30),
      resizeMode: 'contain',
      //backgroundColor:'red'
      //height: moderateScale(165, 0.5)
   },
   billSep:{
      borderWidth: 1,
      borderRadius: 5,
      height:1,
      width:'100%',
      borderStyle: 'dashed',
      borderColor: '#8e8e8e',
      marginVertical:5
  }
})

export default styles
