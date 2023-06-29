import React from 'react'
import './Button.css'

function Button({toggleComponent , label , btnclass} ) {
  return (
    <>
      <div className="button-cont ">
        <button onClick={toggleComponent} className={btnclass}>{label} </button>
      </div>
    </>
  )
}

export default Button

Button.defaultProps = {
    label:"CONTINUE" ,
    btnclass : "button btn-purple"
}