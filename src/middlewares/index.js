// src/middleware/index.js

import { ADD_ARTICLE,LOGIN } from "../constants";
const forbiddenWords = ["spam", "money"];

export function checkEmpty({ dispatch }) {
  return function(next){
    return function(action){
      // do your stuff
      if (action.type === LOGIN) {
       console.log('middleware action.type',action.type,action.payload)
        if (action.payload.email.length==0||action.payload.password.length==0) {
          return dispatch({ type: "ERROR",payload:{message:"Please Insert Login info"} });
        }
        const foundWord = forbiddenWords.filter(word =>
          action.payload.email.includes(word)
        );
        if (foundWord.length) {
          return dispatch({ type: "ERROR",payload:{message:"bad word"} });
        }
      }
      return next(action);
    }
  }
}

export default checkEmpty;