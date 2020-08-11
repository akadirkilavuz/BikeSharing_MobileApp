import { View, Text,TouchableOpacity} from 'react-native';
import React from 'react';
import theme from '../constants/Theme';
import { ScrollView } from 'react-native-gesture-handler';

import Ionicons from 'react-native-vector-icons/Ionicons';

export default class Transaction extends React.Component {
    
    constructor(props){
        super(props);
        this.state={
            visible: "",
            type: "",
        }
    }

    formatDate (date) {
        var datestring = 
              ("0" + date.getDate()).slice(-2)  + "/" 
            + ("0" + (date.getMonth() + 1)).slice(-2)+ "/" 
            + date.getFullYear() + " " 
            + ("0" + date.getHours()).slice(-2) + ":" 
            + ("0" + date.getMinutes()).slice(-2);
            return datestring;
    }

    formatTransactionAmount (amount, type) {
        if(type === "add"){
            return <Text style={{fontSize:28, color:'green'}}>+{amount.toFixed(2)}</Text>;
                    
        }
        else{
            return <Text style={{fontSize:28, color:'crimson'}}>-{amount.toFixed(2)}</Text>;
        }
    }
    

    specializedType(key, type) {

        
        
        if(type === "usage"){
            return (<View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={ () => (this.state.visible === key ? this.setState({ visible: "" }): this.setState({ visible: key, type:"usage"})) }>
                            <Text style={{fontWeight:'bold', marginLeft:15, fontSize:20, color:theme.COLORS.JAPANESE_INDIGO}}>{type} {this.state.visible === key ? <Ionicons  name='md-arrow-dropup-circle' size={20} color={"#FBC02D"}/> :  <Ionicons  name='md-arrow-dropdown-circle' size={20} color={"#FBC02D"}/>}</Text>
                        </TouchableOpacity>
                        
                    </View>);
                    
        }
        else if(type === "stoppage"){
            return (<View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={ () => (this.state.visible === key ? this.setState({ visible: "" }): this.setState({ visible: key, type:"stoppage"})) }>
                            <Text style={{fontWeight:'bold', marginLeft:15, fontSize:20, color:theme.COLORS.JAPANESE_INDIGO}}>{type} {this.state.visible === key ? <Ionicons  name='md-arrow-dropup-circle' size={20} color={"#FBC02D"}/> :  <Ionicons  name='md-arrow-dropdown-circle' size={20} color={"#FBC02D"}/>}</Text>
                        </TouchableOpacity>
                    </View>);
        }
        else{
            return <Text style={{fontWeight:'bold', marginLeft:15, fontSize:20, color:theme.COLORS.JAPANESE_INDIGO}}>{type}</Text>
        }
    }

    render() {
        if(this.props.transactions.length){
            return (
                <ScrollView>
                    {this.props.transactions.map(transaction  =>  (
                        <View key={transaction.key} style={{marginHorizontal:10, flexDirection:'row', marginTop:5, borderBottomWidth:1, borderColor:theme.COLORS.JAPANESE_INDIGO}}>
                            <View style={{flex:1, paddingLeft:5}}>
                                <Text style={{fontWeight:'normal', color:theme.COLORS.JAPANESE_INDIGO}}>{this.formatDate(new Date(transaction.createdAt))}</Text>
                                {this.specializedType(transaction.key, transaction.type)}
                                {transaction.key === this.state.visible  ?
                                    <View style={{marginTop:5}}>
                                        {this.state.type === "stoppage" ?
                                            <Text style={{marginLeft:5, fontSize:10, color:theme.COLORS.JAPANESE_INDIGO}}> <Ionicons name='md-calendar' size={20} color={"#FBC02D"}/> Date: {this.formatDate(new Date(transaction.usageDate))} </Text>
                                        :
                                            <Text style={{marginLeft:5, fontSize:10, color:theme.COLORS.JAPANESE_INDIGO}}> <Ionicons name='md-cash' size={20} color={'#FBC02D'}/> Before Usage: {transaction.balanceBefore ? transaction.balanceBefore.toFixed(2):null} ₺ </Text>
                                        }
                                        <Text style={{marginLeft:5, fontSize:10, color:theme.COLORS.JAPANESE_INDIGO}}> <Ionicons name='md-cash' size={20} color={'#FBC02D'}/> Total: {transaction.totalFee ? transaction.totalFee.toFixed(2):null} ₺ </Text>
                                        <Text style={{marginLeft:5, fontSize:10, color:theme.COLORS.JAPANESE_INDIGO}}> <Ionicons name='md-cash' size={20} color={'#FBC02D'}/> Debt: {transaction.debt ? transaction.debt.toFixed(2):null} ₺ </Text>
                                        <Text style={{marginLeft:5, fontSize:10, color:theme.COLORS.JAPANESE_INDIGO}}> <Ionicons name='md-clock' size={20} color={"#FBC02D"}/> Duration: {transaction.duration? transaction.duration.toFixed(2):null} min </Text>
                                        <Text style={{marginLeft:5, fontSize:10, color:theme.COLORS.JAPANESE_INDIGO}}> {transaction.startZone.address}  <Ionicons name='md-bicycle' size={20} color={"#FBC02D"}/> {transaction.endZone.address}  </Text>
                                    </View>
                                : null}
                            </View>
                            <View style={{flex:1, paddingRight:5, alignItems:'flex-end'}}>
                                {this.formatTransactionAmount(transaction.transactionAmount, transaction.type)}
                                <View style={{flexDirection:'row'}}>
                                    <Text style={{color:'gray'}}>Balance: </Text><Text style={{color:'gray'}}>{transaction.balanceAfter.toFixed(2)}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            );
        }
        else{
            return (
                <View style={{margin:10, alignItems:'center'}}>
                    <Text style={{color:theme.COLORS.JAPANESE_INDIGO}}>There is no transaction data!</Text>
                </View>
            );
        }
    }
};