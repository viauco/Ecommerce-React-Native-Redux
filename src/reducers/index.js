import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ProductsReducer from './ProductsReducer';
// import OtherReducer from './OtherReducer';
// import OrdersReducer from './OrdersReducer';

export default RootReducer=combineReducers({
    auth: AuthReducer,
    products: ProductsReducer
    // others:OtherReducer,
    // orders:OrdersReducer,
});
