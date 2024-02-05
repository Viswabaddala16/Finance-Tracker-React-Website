import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Cards from '../Components/Cards';
import AddIncomeModal from '../Components/Modals/AddIncomeModal';
import AddExpenseModal from '../Components/Modals/AddExpenseModal';
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { toast } from "react-toastify";
import { db,auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import moment from "moment";
import TransactionTable from '../Components/TransactionTable';
import NoTransactions from '../Components/TransactionTable/NoTransactions';
import ChartComponent from '../Components/Chats';

function Dashboard() {
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isExpensiveModalVisible, setIsExpensiveModalVisible] = useState(false);
  const[user] = useAuthState(auth);
  const[transactions,setTransactions] = useState([]);
  const[loading,setLoading] = useState(false);
  const[income,setIncome] = useState(0);
  const[expense,setExpense] = useState(0);
  const[totalBalance,setTotalBalance] = useState(0);

  function showIncomeModal() {
    setIsIncomeModalVisible(true);
  }

  function showExpensiveModal() {
    setIsExpensiveModalVisible(true);
  }

  function handleIncomeCancel() {
    setIsIncomeModalVisible(false);
  }

  function handleExpensiveCancel() {
    setIsExpensiveModalVisible(false);
  }
  const onFinish = (values,type) => {
    const newTranscation = {
      type : type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTranscation);
  }

  async function addTransaction(transaction,many){
    try{
      if (!user || !user.uid) {
      console.error("User or user UID is null");
      return;
      }

      const docRef = await addDoc(
        collection(db,`users/${user.uid}/transactions`),
        transaction
      );
      const newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    
    console.log("Document written with ID:",docRef.id);
    if(!many){
      toast.success("Transaction Added");
    }
   
    } catch(e){
      console.error("Error adding document: ",e);
      if(!many){
        toast.error("COuldn't add transction");
      }
      
    }

  }
  useEffect(() => {
    calculateBalance();
  },[transactions]);
  function calculateBalance(){
    let incomeTotal = 0;
    let expenseTotal = 0;
    transactions.forEach((transaction) => {
      if(transaction.type === "income"){
        incomeTotal += transaction.amount;
      }else{
        expenseTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal-expenseTotal);

  }
  useEffect(() => {
    // Get the all docs from the collection 
    fetchTranscations();
  },[user]);
  async function fetchTranscations(){
    setLoading(true);
    if(user){
      const q = query(collection(db,`users/${user.uid}/transactions`));
      const querySnapShot  = await getDocs(q);
      let transactionsArray = [];
      querySnapShot.forEach((doc) => {
        // doc.data() is never underfined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log("Transaction rray ",transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }
  let sortedTransactions = transactions.sort((a,b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading</p>
      ):
      (
        <>
        <Cards income={income} expense={expense} totalBalance={totalBalance}
        showIncomeModal={showIncomeModal} 
        showExpensiveModal={showExpensiveModal} />
        {transactions.length !== 0 ? (<ChartComponent sortedTransactions={sortedTransactions}/>):(<NoTransactions/>)}
        <AddIncomeModal
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
        />
        <AddExpenseModal
        isExpensiveModalVisible={isExpensiveModalVisible}
        handleExpensiveCancel={handleExpensiveCancel}
        onFinish={onFinish}/>

        <TransactionTable transactions={transactions} addTransaction={addTransaction}
        fetchTransactions={fetchTranscations}/>

        </>        
      )}
      
    </div>
  );
}

export default Dashboard;

