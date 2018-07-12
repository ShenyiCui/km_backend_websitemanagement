import React from "react";

//import styles from "../../../CSS/MainStyles.css"

export default class LoginUpper extends React.Component
{
	initialMount () // writes in the inital JS needed for RememberMe Checks and the inital Style of the HTML
	{
     	document.write('<script>if(localStorage.getItem("remMeChecks") == null){localStorage.setItem("remMeChecks","false")};document.getElementById("remMeCheckbox").checked = JSON.parse(localStorage.getItem("remMeChecks"));</script>');
    }
	render()
	{
		return(
			<div id="Logins" className="loginForm">
				<center className="loginForm">
					<h1 className="loginForm">Welcome</h1>
					<img src="IMG/userIcon.png" width="30%" className="loginForm"/>
					<br/><br/>
				</center>
			</div>
		);
	}
}