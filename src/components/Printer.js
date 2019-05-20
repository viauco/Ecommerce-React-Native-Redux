/**
 * Created by januslo on 2018/12/27.
 */

import React, {Component} from 'react';
import {ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    DeviceEventEmitter,
    NativeEventEmitter,
    Switch,
    TouchableOpacity,
    Dimensions,
    ToastAndroid} from 'react-native';
import RNProgressHud from 'react-native-progress-display'

import ViewShot,{captureRef, captureScreen} from "react-native-view-shot";
import { Button,Input,Icon,CheckBox,Divider,ListItem } from 'react-native-elements'

import {BluetoothEscposPrinter, BluetoothManager, BluetoothTscPrinter} from "react-native-bluetooth-escpos-printer";
import { baseUrl,range,headers,L,preventDoubleTapHack,cAlert,resetNavigation } from '../config'
import styles,{btnColor,mainColor,mainFont,verticalScale,scale} from '../Styles'

var {height, width} = Dimensions.get('window');
export default class Printer extends Component {


    _listeners = [];

    constructor() {
        super();
        this.state = {
            devices: null,
            pairedDs:[],
            foundDs: [],
            bleOpend: false,
            loading: true,
            image: null,
            boundAddress: '',
            debugMsg: ''
        }
    }

    componentDidMount() {
        // alert(BluetoothManager)
        BluetoothManager.isBluetoothEnabled().then((enabled)=> {
            // alert(enabled)
            if (!enabled){
                this.enableBlueTooth()
            }else{
                this._scan();
            }
            this.setState({
                bleOpend: Boolean(enabled),
                loading: false
            })
        }, (err)=> {
            err
        });

        if (Platform.OS === 'ios') {
            let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
            this._listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
                (rsp)=> {
                    this._deviceAlreadPaired(rsp)
                }));
            this._listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, (rsp)=> {
                this._deviceFoundEvent(rsp)
            }));
            this._listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, ()=> {
                this.setState({
                    name: '',
                    boundAddress: ''
                });
            }));
        } else if (Platform.OS === 'android') {
            this._listeners.push(DeviceEventEmitter.addListener(
                BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, (rsp)=> {
                    this._deviceAlreadPaired(rsp)
                }));
            this._listeners.push(DeviceEventEmitter.addListener(
                BluetoothManager.EVENT_DEVICE_FOUND, (rsp)=> {
                    this._deviceFoundEvent(rsp)
                }));
            this._listeners.push(DeviceEventEmitter.addListener(
                BluetoothManager.EVENT_CONNECTION_LOST, ()=> {
                    this.setState({
                        name: '',
                        boundAddress: ''
                    });
                }
            ));
            this._listeners.push(DeviceEventEmitter.addListener(
                BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, ()=> {
                    ToastAndroid.show("Device Not Support Bluetooth !", ToastAndroid.LONG);
                }
            ))
        }
    }

    componentWillUnmount() {
        for (let ls in this._listeners) {
           this._listeners[ls].remove();
        }
    }
    enableBlueTooth(){
        BluetoothManager.enableBluetooth().then((r)=>{
            //start
            this._scan();
            var paired = [];
            if(r && r.length>0){
                for(var i=0;i<r.length;i++){
                    try{
                        paired.push(JSON.parse(r[i]));
                    }catch(e){
                        //ignore
                    }
                }
                console.log('paired',paired)
                if(!this.state.boundAddress){
                    this._connect(paired[0])
                }
            }
            this.setState({
                bleOpend:true,
                loading:false,
                pairedDs:paired
            })
        },(err)=>{
            this.setState({
                loading:false
            })
            console.log(err.message)
        });
    }
    async _connect(row){
        if(!row){
            // cAlert('no device')
            return
        }
        console.log('row')
        
        await this.setState({loading:true})
        BluetoothManager.connect(row.address)
        .then((s)=>{
            this.setState({
                loading:false,
                boundAddress:row.address,
                name:row.name || "UNKNOWN"
            })
            if(row.name=="InnerPrinter"){
                // console.log('navigate to next window')
                preventDoubleTapHack(this,'Bill')
            }else{
                // preventDoubleTapHack(this,'Bill')
            }
        },(e)=>{
            this.setState({
                // loading:false
            })
            // cAlert('Connect '+e);
        })
    }
    _deviceAlreadPaired(rsp) {
        var ds = null;
        if (typeof(rsp.devices) == 'object') {
            ds = rsp.devices;
        } else {
            try {
                ds = JSON.parse(rsp.devices);
            } catch (e) {
            }
        }
        if(ds && ds.length) {
            let pared = this.state.pairedDs;
            console.log('pairedDs ',this.state.pairedDs)
            pared = pared.concat(ds||[]);
            if(pared&&pared[0]&&!this.state.boundAddress){
                this._connect(pared[0])
            }
            this.setState({
                pairedDs:pared
            });
        }
    }

    _deviceFoundEvent(rsp) {//cAlert(JSON.stringify(rsp))
        var r = null;
        try {
            if (typeof(rsp.device) == "object") {
                r = rsp.device;
            } else {
                r = JSON.parse(rsp.device);
            }
        } catch (e) {//cAlert(e.message);
            //ignore
        }
        //cAlert('f')
        if (r) {
            let found = this.state.foundDs || [];
            if(found.findIndex) {
                let duplicated = found.findIndex(function (x) {
                    return x.address == r.address
                });
                //CHECK DEPLICATED HERE...
                if (duplicated == -1) {
                    found.push(r);
                    this.setState({
                        foundDs: found
                    });
                }
            }
        }
    }

    _renderRow(rows){
        let items = [],addresses=[],name='';
        for(let i in rows){
            let row = rows[i];
            if(addresses.indexOf(row.address)>=0){
                continue
            }
            if(row.address) {
                console.log('row.name',row)
                name=row.name?row.name:row.address
                addresses.push(row.address)
                items.push(
                    <ListItem
                        key={new Date().getTime()+i}
                        containerStyle={{width:'100%'}}
                        title={row.name || "UNKNOWN"}
                        leftIcon={{ name: 'angle-left',type:'font-awesome' }}
                        rightIcon={
                          <Icon
                            size={20}
                            name='search'
                            type='font-awesome'
                            color={"#4f4e4e"}
                          />
                        }
                        titleStyle={[styles.generalFont,{width:'80%',color: '#000'}]}
                        subtitleStyle={[styles.generalFont]}
                        chevron={false}
                        checkmark={false}
                        onPress={()=>{
                            this.setState({
                                loading:true
                            });
                            this._connect(row)
                        }}
                    />
                );
            }
        }
        return items;
    }

    render() {
        return (

        <View style={[styles.container,styles.columnStartCenter]}>
            <ScrollView
                contentContainerStyle={[styles.columnStartEnd,{width:'100%'}]}
                style={{width:'100%'}}
            >
                <View style={[styles.rowReverseBetween,{width:'90%'}]}>
                    <View style={[styles.columnStartEnd]}>
                        <Text style={styles.boldFont}>{L('enableBlueTooth')}</Text>
                        <Text style={styles.generalFont}>{this.state.bleOpend?L('deviceSeen'):''}</Text>
                    </View>
                    <Switch value={this.state.bleOpend} onValueChange={(v)=>{
                        this.setState({
                            loading:true
                        })
                        if(!v){
                            BluetoothManager.disableBluetooth().then(()=>{
                                this.setState({
                                    bleOpend:false,
                                    loading:false,
                                    foundDs:[],
                                    pairedDs:[]
                                });
                            },(err)=>{cAlert(err)});

                        }else{
                            this.enableBlueTooth()
                        }
                    }}/>
                </View>
                <Text  style={styles.boldFont}>{L('deviceConnected')}:{!this.state.name ? '--' : this.state.name}</Text>
                <Text  style={[styles.generalFont,{width:'100%',backgroundColor:'#f5f5f5'}]}>{L('foundDevices')}:</Text>
                {this.state.loading ? (<ActivityIndicator animating={true}/>) : null}
                <View style={[styles.column,{width:'100%'}]}>
                {
                    this._renderRow(this.state.foundDs)
                }
                </View>
                <Text  style={[styles.generalFont,{width:'100%',backgroundColor:'#f5f5f5'}]}>{L('pairedDevices')}:</Text>
                {this.state.loading ? (<ActivityIndicator animating={true}/>) : null}
                <View style={[styles.column,{width:'100%'}]}>
                {
                    this._renderRow(this.state.pairedDs)
                }
                </View>
            </ScrollView>
            <View style={[styles.rowAround,{backgroundColor:'#FFF', position:'absolute',bottom:0,width:'100%',height:scale(16),borderTopWidth:1.5,borderColor:"#f5f5f5"}]}>
                <Button
                  title={L('search')}
                  disabled={this.state.loading || !this.state.bleOpend}
                  disabledStyle={{width:'100%'}}
                  onPress={()=>{this._scan();}}
                  icon={
                    <Icon
                      size={20}
                      name='search'
                      type='font-awesome'
                      color={"#FFF"}
                    />
                  }
                  iconRight
                  containerStyle={[styles.buttonRoundStyles,{marginTop:0}]}
                  buttonStyle={styles.buttonStyles}
                  titleStyle={[styles.buttonTextStyle,{width:'auto'}]}
                />
            </View>
        </View>
        );
    }
    _scan() {
        this.setState({
            loading: true
        })
        // cAlert('start scan')
        BluetoothManager.scanDevices()
            .then((s)=> {
                console.log('ssss ',s)
                var ss = s;
                var found = ss.found;
                try {
                    found = JSON.parse(found);//@FIX_it: the parse action too weired..
                } catch (e) {
                    //ignore
                }
                let fds =  this.state.foundDs
                if(found && found.length){
                    fds = found;
                }
                if(fds&&fds[0]&&!this.state.boundAddress){
                    this._connect(fds[0])
                }
                this.setState({
                    foundDs:fds,
                    loading: false
                });
            }, (er)=> {
                this.setState({
                    loading: false
                })
                //cAlert('scan error' + JSON.stringify(er));
            });
    }


}