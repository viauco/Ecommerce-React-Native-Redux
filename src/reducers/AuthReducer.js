import {
   LOGIN,DO_LOGIN,ERROR,API_TOKEN,DO_LOGIN_SUCCESS
 } from '../constants';
const INITAL_STATE = {
  success:false,
  logged:false
   };
export default (state= INITAL_STATE, action) => {
  state.errorMsg=''
  let newState=state
  // console.log('auth reducer action ',action)
  switch(action.type){
    case ERROR:
      newState={...state,errorMsg:action.payload}
    break;
    case "RESET_APP":
      newState={...state,...action.payload}
    break;
    case API_TOKEN:
      newState={...state,api_token:action.payload}
    break;
    case DO_LOGIN:
      // console.log(' reducer do login',action.type,action)
      newState={...state,...action.payload}
    break;
    case DO_LOGIN_SUCCESS:
      // console.log(' DO_LOGIN_SUCCESS reducer ',action.type,action)
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
  // console.log('auth newState',newState)
  return newState;
}
