/// <reference types="aws-sdk" />
var verifiedEmailz;
var myIntervalVar; 
var Timoutevent;
var nonAdminIds = [];
var continues = false;
var AdmimUserpoolID = "eu-central-1_mLopw7LeQ"
var AdminAppClientID = "2pjoga7s94rcrr42mspejhcok8"


/*
 LoginMove() //animates it up
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
*/

function createNewAdminUser(username,password,emails,userpoolid,appcliid) //CreateNewUser
{
	var poolData = {
        UserPoolId : AdmimUserpoolID, // Your user pool id here
        ClientId : AdminAppClientID // Your client id here
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var attributeList = [];

    var dataEmail = {
        Name : 'email',
        Value : emails
    };
	
	var dataUserPoolID = {
		Name : 'custom:userPoolID',
		Value : userpoolid
	}
	
	var dataAppCliID = {
		Name : 'custom:appClientID',
		Value : appcliid
	}
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
	var attributeUserPoolID = new AmazonCognitoIdentity.CognitoUserAttribute(dataUserPoolID);
	var attributeAppCliID = new AmazonCognitoIdentity.CognitoUserAttribute(dataAppCliID);

    attributeList.push(attributeEmail);
	attributeList.push(attributeUserPoolID);
	attributeList.push(attributeAppCliID);

    userPool.signUp(username, password, attributeList, null, function(err, result){
        if (err) {
			document.getElementById("SignUpAdminErrMsg").style.color="red";
			document.getElementById("SignUpAdminErrMsg").innerHTML=(err.message || JSON.stringify(err));
            return;
        }
        cognitoUser = result.user;
		document.getElementById("SignUpAdminErrMsg").style.color="green";
		document.getElementById("SignUpAdminErrMsg").innerHTML=("Sucessfully Created New Admin. New Username Is: "+ cognitoUser.getUsername());
    });
}

function whatUser(jwtToken) // checks what user it is, and whether or not it is a master user
{
	const tokenParts = jwtToken.split('.');
	const encodedPayload = tokenParts[1];
	const rawPayload = atob(encodedPayload);
	const user = JSON.parse(rawPayload);
	
	if(user.username == "KMAdmin")
	{
		openInNewTab("Pages/AdminCreateMaster.html")
	}
	else
	{
		openInNewTab("Pages/Redirect.html")	
	}
}
function whatUserName(jwtToken)
{
	const tokenParts = jwtToken.split('.');
	const encodedPayload = tokenParts[1];
	const rawPayload = atob(encodedPayload);
	const user = JSON.parse(rawPayload);
	return user.username;
}
function decodeJWT(jwtToken) // decodes JWT accessToken
{
	var playload = JSON.parse(atob(jwtToken.split('.')[1]));
    console.log(playload);
}

function checkValid(jwtToken) // Used to see if session has ended
{	
	var current_time = Date.now() / 1000;
	if ( jwtToken.exp < current_time) {
 		return false
	}
	else{
		return true
	}
}

function openInNewTab(url) 
{
  var win = window.open(url, '_blank');
  win.focus();
}

function openInCurrentTab(url)
{
	self.location = url;
}

function updateEmail(EMail)
{
	var data = 
	{ 
		UserPoolId : AdmimUserpoolID,
        ClientId : AdminAppClientID
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                $('#SignUpAdminErrMsg').css('color', 'red');
            	$("#SignUpAdminErrMsg").html(err.message || JSON.stringify(err));;
                return;
            }
            console.log('session validity: ' + session.isValid());
        });
    }
	
	var attributeList = [];
    var datasEmail = {
        Name : 'email',
        Value : EMail
    };
    var EmailAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(datasEmail);
    attributeList.push(EmailAttribute);

    cognitoUser.updateAttributes(attributeList, function(err, result) {
        if (err) {
			$('#SignUpAdminErrMsg').css('color', 'red');
            $("#SignUpAdminErrMsg").html(err.message || JSON.stringify(err));

            return;
        }
		console.log('call result: ' + result);
    });	
	cognitoUser.getAttributeVerificationCode('email', {
        onSuccess: function (result) {
            console.log('call result: ' + result);
			plusDivs(1);
        },
        onFailure: function(err) {
            $('#SignUpAdminErrMsg').css('color', 'red');
            $("#SignUpAdminErrMsg").html(err.message || JSON.stringify(err));
        },
        inputVerificationCode: null
    });
}

function getNewCode()
{
	var data = 
	{ 
		UserPoolId : AdmimUserpoolID,
        ClientId : AdminAppClientID
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser !== null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                $('#SignUpAdminErrMsg').css('color', 'red');
            	$("#SignUpAdminErrMsg").html(err.message || JSON.stringify(err));;
                return;
            }
            console.log('session validity: ' + session.isValid());
        });
    }
	
	cognitoUser.getAttributeVerificationCode('email', {
        onSuccess: function (result) {
            console.log('call result: ' + result);
			myIntervalVar = setInterval(myTimer, 500);
			$("#adminCreateButton").html("Verify");
        },
        onFailure: function(err) {
            $('#SignUpAdminErrMsg').css('color', 'red');
            $("#SignUpAdminErrMsg").html(err.message || JSON.stringify(err));
        },
        inputVerificationCode: null
    });
}

function verifyCode(emailCode)
{
	var data = 
	{ 
		UserPoolId : AdmimUserpoolID,
        ClientId : AdminAppClientID
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                $('#SignUpAdminErrMsg').css('color', 'red');
            	$("#SignUpAdminErrMsg").html(err.message || JSON.stringify(err));;
                return;
            }
            console.log('session validity: ' + session.isValid());
        });
    }
	
	var verificationCode = emailCode;
    cognitoUser.verifyAttribute('email', verificationCode);
}

function Continue()
{
	if(slideIndex==1)
	{
		SpecificAttribuit("email_verified");
		setTimeout(ContinueEnterCheckVerification, 1000)
		function ContinueEnterCheckVerification()
		{
			if(verifiedEmailz == "true")
			{
				plusDivs(2);
			}
			else if($("#newemail").val() != $("#confirmNewEmail").val())
			{
				$('#SignUpAdminErrMsg').css('color', 'red');
				$("#SignUpAdminErrMsg").html("Email's Don't Match");
			}
			else
			{
				updateEmail($("#newemail").val())
				myIntervalVar = setInterval(myTimer, 500);
				$("#adminCreateButton").html("Verify");
			}
		}
		
	}
	else if(slideIndex==2)
	{			
		if(verifiedEmailz === "true")
		{
			plusDivs(1);
			window.clearInterval(myIntervalVar);

		}
		else
		{
			verifyCode($("#EVerificationCode").val());
		}
	}
	else if(slideIndex==3)
	{			
		if($("#OPassword").val().length == 0 || $("#NPassword").val().length == 0 || $("#ConfirmNPasswords").val().length==0)
		{
			$('#SignUpAdminErrMsg').css('color', 'red');
            $("#SignUpAdminErrMsg").html("Please fill in all fields");

		}
		else if($("#NPassword").val() != $("#ConfirmNPasswords").val())
		{
			$('#SignUpAdminErrMsg').css('color', 'red');
            $("#SignUpAdminErrMsg").html("Passwords Don't Match");
		}
		else
		{
			changePassword($("#OPassword").val(), $("#NPassword").val());
		}
	}
}

function myTimer() 
{
	SpecificAttribuit("email_verified")
	if(verifiedEmailz == "true")
	{
		$("#adminCreateButton").html("Continue");
	}
}

function Attribuits()
{
	var data = 
	{ 
		UserPoolId : AdmimUserpoolID,
        ClientId : AdminAppClientID
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
				$('#SignUpAdminErrMsg').css('color', 'red');
				$("#SignUpAdminErrMsg").html(err.message || JSON.stringify(err));
                return;
            }
            console.log('session validity: ' + session.isValid());
        });
    }
	cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        for (i = 0; i < result.length; i++) {
            console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
        }
    });
}
function SpecificAttribuit(Name)
{
	continues = false;
	var indexz;
	var data = 
	{ 
		UserPoolId : AdmimUserpoolID,
        ClientId : AdminAppClientID
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                $('#SignUpAdminErrMsg').css('color', 'red');
				$("#SignUpAdminErrMsg").html(err.message || JSON.stringify(err));
                return;
            }
            console.log('session validity: ' + session.isValid());
        });
    }
	
	cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        for (i = 0; i < result.length; i++) {
			if(result[i].getName() === Name)
			{
				indexz = i
			}
            console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
        }
		document.getElementById("verified").innerHTML = "Verified: " + (result[indexz].getValue().toString())
		verifiedEmailz = (result[indexz].getValue().toString());
		continues = true;
    });
}

function getAppCliIDAndUserPoolID()
{
	continues = false;
	var indexAppCli;
	var indexUserPl;
	var data = 
	{ 
		UserPoolId : AdmimUserpoolID,
        ClientId : AdminAppClientID
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                $('#SignUpAdminErrMsg2').css('color', 'red');
				$("#SignUpAdminErrMsg2").html(err.message || JSON.stringify(err));
				window.setTimeout("$('#errorModule').show()",1000)
                return;
            }
            console.log('session validity: ' + session.isValid());
        });
    }
	
	cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
			$('#SignUpAdminErrMsg2').css('color', 'red');
			$("#SignUpAdminErrMsg2").html(err.message || JSON.stringify(err));
			window.setTimeout("$('#errorModule').show()",1000)
            return;
        }
        for (i = 0; i < result.length; i++) {
			if(result[i].getName() === "custom:userPoolID")
			{
				indexUserPl = i;
			}
			if(result[i].getName() === "custom:appClientID")
			{
				indexAppCli = i;
			}
            console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
        }
		$("#SignUpAdminErrMsg2").html(result[indexUserPl].getValue().toString());
		$("#SignUpAdminErrMsg2").html(result[indexAppCli].getValue().toString());
		$("#SignUpAdminErrMsg2").html('');
		nonAdminIds = [];
		nonAdminIds.push(result[indexUserPl].getValue().toString());
		nonAdminIds.push(result[indexAppCli].getValue().toString());
		continues = true; 
    });
}

function changePassword(OPass, NPass)
{
	var data = 
	{ 
		UserPoolId : AdmimUserpoolID,
        ClientId : AdminAppClientID
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                $('#SignUpAdminErrMsg').css('color', 'red');
				$("#SignUpAdminErrMsg").html(err.message || JSON.stringify(err));
                return;
            }
            console.log('session validity: ' + session.isValid());
        });
    }
	
	cognitoUser.changePassword(OPass, NPass, function(err, result) {
        if (err) {
            $('#SignUpAdminErrMsg').css('color', 'red');
			$("#SignUpAdminErrMsg").html(err.message || JSON.stringify(err));
            return;
        }
		$('#SignUpAdminErrMsg').css('color', 'green');
		$("#SignUpAdminErrMsg").html('call result: ' + result + ". Password Changed");
		setTimeout(openInCurrentTab("home.html"),3000);
    });
}

function CreateNewUserDB(userPLID, appCliID, Email, Name, Password, JobDescription ,Roles, Devices)
{
	$.ajax({
			type:'POST',
			url:API_URL,
			data: JSON.stringify(
					{
						"Email":Email, 
						"Username":Name, 
						"Job_Description":JobDescription, 
						"Rolez":Roles, 
						"Devices":Devices, 
						"CompanyID":userPLID
					}
				  ),
			
			contentType:"application/json",
			
			success: function(data)
			{
				createNewUserNonAdmin(userPLID,appCliID,Email,Name,Password);
			},
			error: function(data)
			{
				$("#errorModule").show();
			}
		});
}

function createNewUserNonAdmin(userPLID, appCliID,Email,Name,Password)
{
	
	var poolData = {
        UserPoolId : userPLID, // Your user pool id here
        ClientId : appCliID // Your client id here
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var attributeList = [];

    var dataName = {
        Name : 'name',
        Value : Name
    };
	
    var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);

    attributeList.push(attributeName);


    userPool.signUp(Email, Password, attributeList, null, function(err, result){
        if (err) {
			document.getElementById("SignUpAdminErrMsg2").style.color="red";
			document.getElementById("SignUpAdminErrMsg2").innerHTML=(err.message || JSON.stringify(err));
			Timoutevent = window.setTimeout(ClearSignUpMsg, 5000);
            return;
        }
        cognitoUser = result.user;
		document.getElementById("SignUpAdminErrMsg2").style.color="green";
		document.getElementById("SignUpAdminErrMsg2").innerHTML=("Sucessfully Created New Admin. New Username Is: "+ cognitoUser.getUsername());
		Timoutevent = window.setTimeout(ClearSignUpMsg, 5000);
    });
}

function ClearSignUpMsg()
{
	document.getElementById("welcomeMsg").innerHTML = "";
}
//SlideShow Code For Userupdates Page
var slideIndex = 1;
function plusDivs(n) 
{
	showDivs(slideIndex += n);
}
function showDivs(n) 
{
	var i;
	var x = document.getElementsByClassName("UserUpdateSlides");
	if (n > x.length) {slideIndex = 1}    
	if (n < 1) {slideIndex = x.length}
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";  
	}
	x[slideIndex-1].style.display = "block";  
}
//Create A function To Delete members
//Design an assignment Page 
	//superClass of Factories
		//subclass of Employees and Machines
