import React from 'react'
import './Signup.css'
import Leftpane from './Leftpane'
import Rightpane from './Rightpane'

function Signup({toggleComponent}) {
    
    return (
        <>
            <div className="main-container">
                <div className="pane">
                    <Leftpane toggleComponent={toggleComponent} ></Leftpane>
                    <Rightpane toggleComponent={toggleComponent} ></Rightpane>
                </div>
            </div>
        </>
    )
}

export default Signup
