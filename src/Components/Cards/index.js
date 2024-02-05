import React from 'react';
import './style.css';
import Button from '../Button';
import {Card,Row} from 'antd';
function Cards({income,expense,totalBalance,showIncomeModal,showExpensiveModal}) {
  return (
    <div>
        <Row className='my-row'>
            <Card boardered={true} className="my-card">
                <h2>Current Balance</h2>
                <p>{totalBalance}</p>
                <Button text="Reset Balance" blue={true} />  
            </Card>
            <Card boardered={true} className="my-card">
                <h2>Total Income</h2>
                <p>{income}</p>
                <Button text="Add Income" blue={true} onClick={showIncomeModal}/>
            </Card>
            <Card boardered={true} className="my-card">
                <h2>Total Expenses</h2>
                <p>{expense}</p>
                <Button text="Add Expensive"blue={true} onClick={showExpensiveModal}/>
            </Card>
        </Row>
         
    </div>
  )
}

export default Cards;
