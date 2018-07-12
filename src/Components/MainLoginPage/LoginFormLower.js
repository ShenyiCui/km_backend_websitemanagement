import React from "react";
import $ from "jquery"

export default class LoginLower extends React.Component
{
	render()
	{
		var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
    var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
    var cognitoUser;

		var AdmimUserpoolID = "eu-central-1_mLopw7LeQ"
		var AdminAppClientID = "2pjoga7s94rcrr42mspejhcok8"

		function LoginMove() //animates it up
		{
			$('#Logins').removeClass('moveDown');
			$('#Logins').addClass('moveUp');
			if(document.getElementById('Logins').style.top == '25%')
			{
				Login(document.getElementById("user").value ,document.getElementById("pass").value);
			}
			document.getElementById('Logins').style.top = '25%'
		}
		function LoginMoveDown() //animates it down
		{
			$('#Logins').removeClass('moveUp');
			$('#Logins').addClass('moveDown');
			document.getElementById('Logins').style.top = '50%'
		}
		function Login(usernames, passwords) //used to log a user into the main page
		{
			var poolData = {
		    UserPoolId : AdmimUserpoolID, // your user pool id here
		    ClientId : AdminAppClientID // your app client id here
			};
			var userPool =
			new AmazonCognitoIdentity.CognitoUserPool(poolData);
			var userData = {
				Username : usernames, // your username here
				Pool : userPool
			};
		    var authenticationData = {
		        Username : usernames, // your username here
		        Password : passwords, // your password here
		    };
		    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

		    cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
		    cognitoUser.authenticateUser(authenticationDetails, {
		        onSuccess: function (result) {
		            var accessToken = result.getAccessToken().getJwtToken();
					document.getElementById("SignUpErrMsg").style.color = "green";
					document.getElementById("SignUpErrMsg").innerHTML = "User Sucessfully Logged In";
					localStorage.setItem("JwtToken",accessToken);
					decodeJWT(localStorage.getItem("JwtToken"));
					whatUser(localStorage.getItem("JwtToken")), 2000;
		        },
		        onFailure: function(err) {
					document.getElementById("SignUpErrMsg").style.color = "red";
					document.getElementById("SignUpErrMsg").innerHTML = (err.message || JSON.stringify(err));
		        }
		    });
		}
		$('body').click(function(e)//used to move loginForm Down and to check Chcekbox
		{
			if(e.target.className != "loginForm")
				{
					if(document.getElementById("Logins").style.top == '25%')
					{
						LoginMoveDown();
					}
				}
			if(e.target.id=="rememberMeTable")
				{
					checks();
				}
		});
		function checks() //checks the checkbox when clicked
		{
			if (JSON.parse(localStorage.getItem("remMeChecks"))==false)
			{
				localStorage.setItem("remMeChecks","true")
				document.getElementById("remMeCheckbox").checked = JSON.parse(localStorage.getItem("remMeChecks"))
			}
			else
			{
				localStorage.setItem("remMeChecks","false")
				document.getElementById("remMeCheckbox").checked = JSON.parse(localStorage.getItem("remMeChecks"))
			}
		}
		
		return(
			<div id="Logins2" className="loginForm">
				<center className="loginForm">
					<br/><br/><br/><br/>
					<p id="SignUpErrMsg" className="loginForm"></p>
					<input id="user" type="text" placeholder="Username/Email" className="loginForm"/><br/>
					<input id="pass" type="password" placeholder="Password" className="loginForm"/><br/>
				</center>
				<table border="0" cellSpacing="15px" id="rememberMeTable" className="loginForm">
					<tbody>
						<tr>
							<td className="loginForm"><input type="checkbox" name="rememberMe" id="remMeCheckbox" className="loginForm"/></td>
							<td className="loginForm"><p className="loginForm">Remember Me</p></td>
						</tr>
					</tbody>
				</table>
				<br/><br/>
				<button id="loginButton" onClick={LoginMove} className="loginForm">LOGIN</button>
			</div>
		);
	}
}
