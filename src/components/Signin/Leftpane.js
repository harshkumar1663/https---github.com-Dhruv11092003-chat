import React from 'react'
import './Leftpane.css'
import Button from '../Button'

function Leftpane({toggleComponent}) {
  return (
    <>
      <div className="left-pane">
        <h2 className='welcome'>Welcome!</h2>
        <div className="signup-cont">
          <h5 className='not-member'>Not a member?</h5>
          <Button label="Sign Up" btnclass="ml-70 btn-purple button" toggleComponent={toggleComponent}></Button>
        </div>
      </div>
    </>
  )
}

export default Leftpane
