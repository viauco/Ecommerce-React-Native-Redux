/**
 * Created by januslo on 2018/12/27.
 */

import React, {Component} from 'react';
import {ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
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

import {BluetoothEscposPrinter, BluetoothManager, BluetoothTscPrinter} from "react-native-bluetooth-escpos-printer";

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
                    alert(err)
                });
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
        //for (let ls in this._listeners) {
        //    this._listeners[ls].remove();
        //}
    }
    async _connect(row){
        if(!row){
            alert('no device')
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
        },(e)=>{
            this.setState({
                // loading:false
            })
            alert(e);
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

    _deviceFoundEvent(rsp) {//alert(JSON.stringify(rsp))
        var r = null;
        try {
            if (typeof(rsp.device) == "object") {
                r = rsp.device;
            } else {
                r = JSON.parse(rsp.device);
            }
        } catch (e) {//alert(e.message);
            //ignore
        }
        //alert('f')
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
        let items = [];
        for(let i in rows){
            let row = rows[i];
            if(row.address) {
                items.push(
                    <TouchableOpacity key={new Date().getTime()+i} stlye={styles.wtf} onPress={()=>{
                    this.setState({
                        loading:true
                    });
                    this._connect(row)

                }}><Text style={styles.name}>{row.name || "UNKNOWN"}</Text><Text
                        style={styles.address}>{row.address}</Text></TouchableOpacity>
                );
            }
        }
        return items;
    }

    render() {
        return (

        <ScrollView style={styles.container}>
            {/*<ViewShot ref="viewShot" options={{ format: "png", quality: 1,result: "base64" }}>
                <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',paddingHorizontal:10,backgroundColor:'#FFF',paddingBottom:150}}>
                    <Text style={{fontSize:25,width:'100%',textAlign:'center'}}>بسم الله الرحمن الرحيم</Text>
                    <Text style={{fontSize:25,width:'100%',textAlign:'center'}}>شركة اليوم بالتعاون مع شركة تسوق</Text>
                    <Text style={{fontSize:25,width:'100%',textAlign:'center'}}>تقدم فاتورة POS لاول مره في الشرق الاوسط</Text>
                </View>
            </ViewShot>
            {this.state.image?(

                <Image style={{width: 200, height: 200,resizeMode:'contain',backgroundColor:'#F00'}} source={{uri: "data:image/jpeg;base64," + this.state.image}}/>
            ):null}
                {/*<Text>{this.state.debugMsg}</Text>
                <Text style={styles.title}>Blutooth Opended:{this.state.bleOpend?"true":"false"} <Text>Open BLE Before Scanning</Text> </Text>
                <View>
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
                    },(err)=>{alert(err)});

                }else{
                    BluetoothManager.enableBluetooth().then((r)=>{
                        var paired = [];
                        if(r && r.length>0){
                            for(var i=0;i<r.length;i++){
                                try{
                                    paired.push(JSON.parse(r[i]));
                                }catch(e){
                                    //ignore
                                }
                            }
                        }
                        if(paired&&paired[0]&&!this.state.boundAddress){
                            this._connect(paired[0])
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
                        alert(err)
                    });
                }
            }}/>
                    <Button disabled={this.state.loading || !this.state.bleOpend} onPress={()=>{
                        this._scan();
                    }} title="Scan"/>
                </View>*/}
                <Text  style={styles.title}>Connected:<Text style={{color:"blue"}}>{!this.state.name ? 'No Devices' : this.state.name}</Text></Text>
                <Text  style={styles.title}>Found(tap to connect):</Text>
                {this.state.loading ? (<ActivityIndicator animating={true}/>) : null}
                <View style={{flex:1,flexDirection:"column"}}>
                {
                    this._renderRow(this.state.foundDs)
                }
                </View>
                <Text  style={styles.title}>Paired:</Text>
                {this.state.loading ? (<ActivityIndicator animating={true}/>) : null}
                <View style={{flex:1,flexDirection:"column"}}>
                {
                    this._renderRow(this.state.pairedDs)
                }
                </View>

                {/*<Button onPress={()=>{this.printRes()}} title="print"/>

                <View style={{flexDirection:"row",justifyContent:"space-around",paddingVertical:30}}>
                    <Button disabled={this.state.loading || !(this.state.bleOpend && this.state.boundAddress.length > 0 )}
                            title="ESC/POS" onPress={()=>{
                        this.props.navigator.push({
                            component:EscPos,
                            passProps:{
                                name:this.state.name,
                                boundAddress:this.state.boundAddress
                            }
                        })
                    }}/>
                    <Button disabled={this.state.loading|| !(this.state.bleOpend && this.state.boundAddress.length > 0) }
                            title="TSC" onPress={()=>{
                       this.props.navigator.push({
                           component:Tsc,
                           passProps:{
                               name:this.state.name,
                               boundAddress:this.state.boundAddress
                           }
                       })
                    }
                    }/>
                </View>*/}
        </ScrollView>
        );
    }

    async printRes(){
        /*captureRef(this.refs["viewShot"], {
            format: "jpg",
          quality: 0.9,
          result: "base64",
          snapshotContentContainer: false
        }).then(async (res)=>{
            console.log('res',res)
        })

        return;*/
        this.refs.viewShot.capture().then(async (res) => {
      console.log("do something with ", res);
      await this.setState({image:res})
      // return;
      // var base64Jpg="data:image/jpg;base64," + res
      // console.log("do something with ", base64Jpg);
      try {
        await BluetoothEscposPrinter.printPic(res, {width: 500, left: 10});
        await BluetoothEscposPrinter.printText(" \r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n", {});
    } catch (e) {
        alert(e.message || "ERROR")
    }
      // await BluetoothEscposPrinter.printPic(base64zsJpg, {width: 200, left: 40});
    });
        return;
        // await BluetoothEscposPrinter.printPic(base64Jpg, {width: 200, left: 40});
        await BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {});
        
        return;
    }

    _selfTest() {
        this.setState({
            loading: true
        }, ()=> {
            BluetoothEscposPrinter.selfTest(()=> {
            });

            this.setState({
                loading: false
            })
        })
    }

    _scan() {
        this.setState({
            loading: true
        })
        // alert('start scan')
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
                alert('error' + JSON.stringify(er));
            });
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },

    title:{
        width:width,
        backgroundColor:"#eee",
        color:"#232323",
        paddingLeft:8,
        paddingVertical:4,
        textAlign:"left"
    },
    wtf:{
        flex:1,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    name:{
        flex:1,
        textAlign:"left"
    },
    address:{
        flex:1,
        textAlign:"right"
    }
});