import {
  GET_Products,
  Add_To_Cart,
  Add_To_Hold,
  SET_Hold,
  EMPTY_CART,
  Order_Notes,
  ADD_PAID,
  SET_BILL_ID
 } from '../constants';
const INITAL_STATE = {
  shoppingCartItems:[],
  products:[],
  hold:[],
  total:0  
};
export default (state= INITAL_STATE, action) => {
  state.errorMsg=''
  let newState=state
  // console.log('action',action)
  switch(action.type){
    case GET_Products:
      // console.log(' GET_Products reducer ',action.type,action)
      newState={...state,...{products:action.payload}}
    break;
    case Add_To_Hold:
      let hold=state.hold||[]
      hold.push(action.payload)
      console.log('hold',hold)
      newState={...state,...{hold:hold,paid:0,bill_id:0,total:0,shoppingCartItems:[]}}
    break;
    case Add_To_Cart:
    case SET_Hold:
    case EMPTY_CART:
      // console.log(' Add_To_Cart reducer ',action.type,action)
      newState={...state,...action.payload}
    break;
    case Order_Notes:
      // console.log(' Order_Notes reducer ',action.type,action)
      newState={...state,...action.payload}
    break;
    case ADD_PAID:
      console.log(' ADD_PAID reducer ',action.type,action)
      newState={...state,...action.payload}
    break;
    case SET_BILL_ID:
      console.log(' SET_BILL_ID reducer ',action.type,action)
      newState={...state,...action.payload}
    break;
    default:
      if(action.payload){
        // newState={...state,...action.payload}
      }else{
        newState=state;
      }
    break;
  }
  console.log('products newState ',newState)
  return newState;
}
