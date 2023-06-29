import React from 'react'
import './Rightpane.css'
import Button from '../Button'

function Rightpane({toggleComponent}) {
  return (
    <>
      <div className="right-pane-signup">
        <h2 className='welcome'>Welcome!</h2>
        <div className="signup-cont">
          <h5 className='not-member'>Already a member?</h5>
          <Button label="Sign In" toggleComponent={toggleComponent} btnclass="ml-70 btn-purple button"></Button>
        </div>
      </div>
    </>
  )
}

export default Rightpane
