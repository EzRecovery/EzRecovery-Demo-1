import './exportPage.css';
import Button from '@material-ui/core/Button'
import Axios from 'axios'


import React, { useState } from 'react'

function ExportPage() {

    const [message1, setMessage1] = useState('');
    const [message2, setMessage2] = useState('');
    const [messageState, setMessageState] = useState(false);


    const returnTodaysDate = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = dd + mm + yyyy;
        return today;
    }

    const callExport = () => {
        const today = returnTodaysDate().toString()
        console.log(today)
        Axios.post('http://localhost:3001/exportDetails', {
            today: today,
        }).then(resolve => {
            setMessage1(resolve.data.msg)
            setMessage2(resolve.data.name)
        })
        setMessageState(prevState => {
            if (prevState === false)
                return true
            return false
        });
    }

    return (
        <div className="exportContainer">
            <div className="button">
                <Button disabled={messageState} style={{
                    padding: "10px",
                    borderRadius: "50px",
                    backgroundColor: "black",
                    color: "white",
                }} onClick={callExport}>Export</Button>
            </div>
            {messageState &&
                <div className="messageSection">
                    <div className="message1">
                        {message1}
                    </div>
                    <div className="message2">
                        {message2}
                    </div>
                </div>
            }
        </div>
    )
}

export default ExportPage
