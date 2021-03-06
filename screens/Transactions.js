import { View, StyleSheet, TouchableOpacity, Text , TouchableHighlight} from 'react-native';
import React, { useCallback } from 'react';
import theme from '../constants/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import TransactionCard from '../components/TransactionCard';

export default class Transactions extends React.Component {

    constructor (props) {
        super(props);
        this.state={
            userId: "",
            transactions: [],
            filtredTransactions:[],
            visible: false,
            jwt:null,
            check:0,
        }
    };

    getTransactions = async () => {
        this.setState({ loading: true, disabled: true ,responseJS: ""}, () => {
          fetch('http://35.189.94.121/transactions/withDetails/' + this.state.userId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.state.jwt}`
            },
          }).then((response) => response.json()).then( async (responseJson) => {
                this.setState({ loading: false, disabled: false });
                if(responseJson.data!=null){
                    let transactions = responseJson.data.map((result) => ({
                        key : result.currentTransaction.id,
                        createdAt: new Date(result.currentTransaction.createdAt),
                        transactionAmount: result.currentTransaction.details.transactionAmount,
                        balanceAfter: result.currentTransaction.details.balanceAfter,
                        type: result.currentTransaction.operationType,
                        duration: null, //(new Date(result.updatedAt) - new Date(result.createdAt))/60000,
                        totalFee: null, //result.details.usage.totalFee,
                        balanceBefore: null, //result.details.balanceBefore,
                        debt: null,
                        usageDate: null,
                    }))
                    this.setState({transactions});
                    var i;
                    for (let i = 0; i < this.state.transactions.length; i++) {
                        
                        if(this.state.transactions[i].type === "usage" || this.state.transactions[i].type === "stoppage"){
                            transactions[i].duration = (new Date(responseJson.data[i].currentUsage.currentUsage.updatedAt) - new Date(responseJson.data[i].currentUsage.currentUsage.createdAt))/60000,
                            transactions[i].totalFee = responseJson.data[i].currentTransaction.details.transactionAmount,
                            transactions[i].debt = (responseJson.data[i].currentTransaction.details.transactionAmount - responseJson.data[i].currentUsage.currentUsage.transactionAmount),
                            transactions[i].balanceBefore = responseJson.data[i].currentTransaction.details.balanceBefore,
                            transactions[i].usageDate = responseJson.data[i].currentUsage.currentUsage.createdAt,
                            transactions[i].startZone = responseJson.data[i].currentUsage.startZone,
                            transactions[i].endZone = responseJson.data[i].currentUsage.endZone
                        }
                    }
                    this.setState({transactions});
                    this.filterOnTransactions(0);
                }
                    
                else {alert("You do not have any transaction process ! ")}
                   
            }).catch((error) => {
                console.error(error);
                this.setState({ loading: false, disabled: false });
              });
        });
    }

    _retrieveData = async (dataContainer) => { // takes string input
        try {
          const value = await AsyncStorage.getItem(dataContainer);
          if (value != null){
            return value;
          }
        } catch (error) {
          // Error retrieving data
          console.log(error);
        }
    };

    async UNSAFE_componentWillMount () {
        user = await this._retrieveData('user');
        userjsoned = JSON.parse(user);
        this.setState({userId : userjsoned.user._id});
        this.setState({jwt:userjsoned.jwt});
        this.getTransactions();
    }
    componentDidMount(){
        
       
    }
    filterOnTransactions = (check) => {
        this.setState({check:check})
        var currentDate = new Date();
        if(check === 3){
            this.setState({filtredTransactions:this.state.transactions});   
        }
        else{
            var filtredTransactions = this.state.transactions.filter((k) => {
                if(check===0){
                    if(k.createdAt.getDate() != currentDate.getDate()){
                        return 0;
                    }
                    else if (k.createdAt.getMonth() != currentDate.getMonth()){
                        return 0;
                    }
                    else if (k.createdAt.getFullYear() != currentDate.getFullYear()){
                        return 0;
                    }
                    else{
                        return 1;
                    }
                    
                }
                else if(check===1){
                    var diffDays = Math.ceil((currentDate-k.createdAt)/(1000*60*60*24))
                    if(diffDays>7){
                        return 0;
                    }
                    return 1;
                }
                else if(check===2){
                    var diffDays = Math.ceil((currentDate-k.createdAt)/(1000*60*60*24))
                    if(diffDays>30){
                        return 0;
                    }
                    return 1;
                    /*if(k.createdAt.getMonth() != currentDate.getMonth()){
                        return 0;
                    } 
                    else if(k.createdAt.getFullYear() != currentDate.getFullYear() ){
                        return 0;
                    }
                    return 1;*/
                }
            })
            this.setState({filtredTransactions});       
        }
    }
    handleTouch = async (check) => {
        this.filterOnTransactions(check);
    }
    render() {
        return (
            <View style={styles.container}>
                
                <View style= {{flexDirection:"row"}}>
                    <TouchableOpacity style={{alignItems:'center', justifyContent:'center', width:50, height:50,
                        borderRadius:25,margin:10,flexDirection:"row",backgroundColor:theme.COLORS.JAPANESE_INDIGO}} 
                        onPress= {() => this.props.navigation.toggleDrawer()}>
                        <Ionicons name="md-menu" color={theme.COLORS.SEASHELL} size={35}/>
                    </TouchableOpacity>
                
                <TouchableOpacity style={{alignItems:'center', justifyContent:'center', width:50, height:50,
                        borderRadius:25,margin:10,flexDirection:"row",backgroundColor:theme.COLORS.JAPANESE_INDIGO}} 
                        onPress={this.getTransactions}>
                        <Ionicons name="md-refresh" color={theme.COLORS.SEASHELL} size={35}/>
                    </TouchableOpacity>
                </View>
                <View style = {{flexDirection:"row"}}>
                {this.state.check ===0 ? 
                    <TouchableHighlight 
                        style = {styles.touchedFilter}
                        underlayColor="#DDDDDD"
                        activeOpacity={0.6}
                        onPress= {() => {this.handleTouch(0)}}>
                        <Text color={theme.COLORS.JAPANESE_INDIGO}>Today</Text>
                    </TouchableHighlight>
                :
                    <TouchableHighlight 
                        style = {styles.touchFilter}
                        underlayColor="#DDDDDD"
                        activeOpacity={0.6}
                        onPress= {() => {this.handleTouch(0)}}>
                        <Text color={theme.COLORS.JAPANESE_INDIGO}>Today</Text>
                    </TouchableHighlight> 
                }
                   
                {this.state.check ===1 ? 
                    <TouchableHighlight 
                        style = {styles.touchedFilter}
                        underlayColor="#DDDDDD"
                        activeOpacity={0.6}
                        onPress= {() => {this.handleTouch(1)}}>
                        <Text color={theme.COLORS.JAPANESE_INDIGO}>This Week</Text>
                    </TouchableHighlight>
                :
                    <TouchableHighlight 
                        style = {styles.touchFilter}
                        underlayColor="#DDDDDD"
                        activeOpacity={0.6}
                        onPress= {() => {this.handleTouch(1)}}>
                        <Text color={theme.COLORS.JAPANESE_INDIGO}>This Week</Text>
                    </TouchableHighlight> 
                }
                {this.state.check ===2 ? 
                    <TouchableHighlight 
                        style = {styles.touchedFilter}
                        underlayColor="#DDDDDD"
                        activeOpacity={0.6}
                        onPress= {() => {this.handleTouch(2)}}>
                        <Text color={theme.COLORS.JAPANESE_INDIGO}>This Month</Text>
                    </TouchableHighlight>
                :
                    <TouchableHighlight 
                        style = {styles.touchFilter}
                        underlayColor="#DDDDDD"
                        activeOpacity={0.6}
                        onPress= {() => {this.handleTouch(2)}}>
                        <Text color={theme.COLORS.JAPANESE_INDIGO}>This Month</Text>
                    </TouchableHighlight> 
                }
                
                {this.state.check ===3 ? 
                    <TouchableHighlight 
                        style = {styles.touchedFilter}
                        underlayColor="#DDDDDD"
                        activeOpacity={0.6}
                        onPress= {() => {this.handleTouch(3)}}>
                        <Text color={theme.COLORS.JAPANESE_INDIGO}>Total</Text>
                    </TouchableHighlight>
                :
                    <TouchableHighlight 
                        style = {styles.touchFilter}
                        underlayColor="#DDDDDD"
                        activeOpacity={0.6}
                        onPress= {() => {this.handleTouch(3)}}>
                        <Text color={theme.COLORS.JAPANESE_INDIGO}>Total</Text>
                    </TouchableHighlight> 
                }
                </View>
                <TransactionCard transactions={this.state.filtredTransactions}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1, 
        backgroundColor: theme.COLORS.SEASHELL,
    },
    touchFilter:{
        alignItems:'center',
        justifyContent:'center', 
        width:"25%",
        height:60,
        backgroundColor:theme.COLORS.SEASHELL
    },
    touchedFilter:{
        alignItems:'center',
        justifyContent:'center', 
        width:"25%",
        height:60,
        backgroundColor:"#DDDDDD"
    },
    touchRadius:{
        alignItems:'center', 
        justifyContent:'center', 
        margin:10, 
        width:50, 
        height:50,
        borderRadius:25, 
        backgroundColor:theme.COLORS.JAPANESE_INDIGO
    }
});