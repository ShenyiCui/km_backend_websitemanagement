import React from "react";
import LoginUpper from "./LoginFormUpper.js"
import LoginLower from "./LoginFormLower.js"
import LoginAesthetics from "./LoginAesthetics.js"

export default class LoginForm extends React.Component
{
	render()
	{
		return(
			<div>
				<LoginUpper />
				<LoginLower />
			</div>
		);
	}
}

