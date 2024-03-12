import React from "react"
import fetchData from '../share/fetchData'
import "../assets/css/auth.css"


export default function Auth(props) {
  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={evt => {validateData(evt, props.connDB, props.navigate)}}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">{props.title}</h3>
          <div className="form-group mt-3">
            <label>NickName </label>
            <input
              type="nickname"
              className="form-control mt-1"
              placeholder="Enter your nickname"
            />
          </div>
          <div className="form-group mt-3">
            <label>Password </label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter your password"
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Enter
            </button>
          </div>
          <p className="forgot-password text-right mt-2">
          <a href="/modules">{props.otherwise}</a>
          </p>
        </div>
      </form>
    </div>
  );
}



function validateData(evt, connDB, navigate){
  evt.preventDefault();
  let nickname = evt.target[0].value
  let password = evt.target[1].value
  
  if (nickname !== "" && password !== "") {
    nickname = evt.target[0].value
    password = evt.target[1].value
  } else {
    alert("Fill nickname and password")
    return
  }

  fetchData.getData("http://" + connDB + ":2500", 
      "/login/access?nickname=" + nickname + "&password=" + password, 
      ((data) => {
        console.log(data)
          if (data.id === null) {
            alert("Supervisor not recognized")
          } else {
            alert("Welcome " + data.firstName + " " + data.lastName)
            navigate("/centralPenales")
          }
      })
  )
}