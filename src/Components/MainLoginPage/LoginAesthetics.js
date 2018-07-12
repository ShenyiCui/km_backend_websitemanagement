import React from "react";

export default class LoginAesthetics extends React.Component
{
	render()
	{
		return(
			[
				<div className="LoginTriangle" key="LoginTriangle">
					<em>
						<h1>KraussMaffei</h1>
						<p>Group</p>
					</em>
				</div>,
				<div className="LoginColor" key="LoginColor"></div>
			]
		);
	}
}