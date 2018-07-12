var API_URL = "https://b134oy3243.execute-api.eu-central-1.amazonaws.com/Production/km-edit-write-userdb"
var row_id = ""
var tbl = '';

$(document).ready(function($)
{
	$("#errorModule").hide();
	function generateTable()
	{
		$.ajax({
			type:'GET',
			url: API_URL,
			//TableGeneration
			success: function(data)
			{
				$("#errorModule").hide();
				tbl=''
				console.log(data.Items)
				//--->create data table > start
				
				tbl +='<table class="table table-hover">'

					//--->create table header > start
					tbl +='<thead>';
						tbl +='<tr>';
						tbl +='<th><p class="middle TableHeader">Email</p></th>';
						tbl +='<th><p class="middle TableHeader">Username</p></th>';				
						tbl +='<th><p class="middle TableHeader">Job Description</p></th>';
						tbl +='<th><p class="middle TableHeader">Role</p></th>'		
						tbl +='<th><p class="middle TableHeader">Devices</p></th>';
						tbl +='<th><p class="middle TableHeader">Options</p></th>';
						tbl +='</tr>';
					tbl +='</thead>';
					//--->create table header > end


					//--->create table body > start
					tbl +='<tbody>';

						//--->create table body rows > start
						$.each(data.Items, function(index, val) 
						{
							//you can replace with your database row id
							row_id = random_id();
							
							//loop through ajax row data
						tbl +='<tr id="'+row_id+'" row_id="'+row_id+'" class="TableFont">';
								tbl +='<td ><div edit_type="click" class="middle" col_name="Email">'+val['Email']+'</div></td>';
								tbl +='<td ><div edit_type="click" class="middle" col_name="Username">'+val['Username']+'</div></td>';
								tbl +='<td ><div class="row_data middle" edit_type="click" col_name="Job_Description">'+val['Job_Description']+'</div></td>';
								tbl +='<td ><div class="row_data middle" edit_type="click" col_name="Rolez">'+val['Rolez']+'</div></td>';							
								tbl +='<td ><div class="row_data middle" edit_type="click" col_name="Devices">'+val['Devices']+'</div></td>';

								//--->edit options > start
								tbl +='<td>';

									tbl +='<span class="btn_edit" > <a href="#" class="btn btn-link " row_id="'+row_id+'" > Edit</a> | </span>';
									tbl +='<span class="btn_delete"> <a href="#" class="btn btn-link"  row_id="'+row_id+'"> Delete</a> </span>';

									//only show this button if edit button is clicked
									tbl +='<span class="btn_save"> <a href="#" class="btn btn-link"  row_id="'+row_id+'"> Save</a> | </span>';
									tbl +='<span class="btn_cancel"> <a href="#" class="btn btn-link" row_id="'+row_id+'"> Cancel</a></span>';

								tbl +='</td>';
								//--->edit options > end

							tbl +='</tr>';
						});

						//--->create table body rows > end

					tbl +='</tbody>';
					//--->create table body > end

				tbl +='</table>'
				//--->create data table > end

				//out put table data
				$(document).find('.tbl_user_data').html(tbl);

				$(document).find('.btn_save').hide();
				$(document).find('.btn_cancel').hide(); 
			},
			error: function(data)
			{
				$("#errorModule").show();
			}
		});
	}
	
	generateTable()
	

	var random_id = function  () 
	{
		var id_num = Math.random().toString(9).substr(2,3);
		var id_str = Math.random().toString(36).substr(2);
		
		return id_num + id_str;
	}

	//--->make div editable > start
	$(document).on('click', '.row_data', function(event) 
	{
		event.preventDefault(); 

		if($(this).attr('edit_type') == 'button')
		{
			return false; 
		}

		//make div editable
		$(this).closest('div').attr('contenteditable', 'true');
		//add bg css
		$(this).addClass('editColor').css('padding','6px');

		$(this).focus();
	})	
	//--->make div editable > end


	//--->save single field data > start
	$(document).on('focusout', '.row_data', function(event) 
	{
		continues = false; 
		event.preventDefault();

		if($(this).attr('edit_type') == 'button')
		{
			return false; 
		}

		var row_id = $(this).closest('tr').attr('row_id'); 

		var row_div = $(this)				
		.removeClass('editColor') //add bg css
		.css('padding','')
		
		var col_name = row_div.attr('col_name'); 
		var col_val = row_div.html(); 
		
		var Row = document.getElementById(row_id);
		var Cells = Row.getElementsByTagName("td");
		
		var colEmail = Cells[0].textContent;		
		getAppCliIDAndUserPoolID();
		
		waitForElement();
		function waitForElement()
		{
			if(continues == true)
			{
				$.ajax({
					type:'PUT',
					url:API_URL,
					data: JSON.stringify(
							{
								"Email":colEmail, 
								"CompanyID":nonAdminIds[0], 
								"updateAttr":col_name,
								"updateValue":col_val
							}
						  ),

					contentType:"application/json",

					success: function(data){
						generateTable()
					},

					error: function(data)
					{
						$("#errorModule").show();
					}
				});
			}
			else
			{
				setTimeout(waitForElement, 250);
			}
		}
		
		function FocusOutsave()
		{
			
		}
		

		var arr = {};
		arr[col_name] = col_val;

		//use the "arr"	object for your ajax call
		$.extend(arr, {row_id:row_id});

		//out put to show
		console.log(JSON.stringify(arr, null, 2));

	})	
		//--->save single field data > end


		//--->button > edit > start	
	$(document).on('click', '.btn_edit', function(event) 
	{
		event.preventDefault();
		var tbl_row = $(this).closest('tr');

		var row_id = tbl_row.attr('row_id');

		tbl_row.find('.btn_save').show();
		tbl_row.find('.btn_cancel').show();

		//hide edit button
		tbl_row.find('.btn_edit').hide(); 
		tbl_row.find('.btn_delete').hide();

		//make the whole row editable
		tbl_row.find('.row_data')
		.attr('contenteditable', 'true')
		.attr('edit_type', 'button')
		.addClass('editColor')
		.css('padding','3px')

		//--->add the original entry > start
		tbl_row.find('.row_data').each(function(index, val) 
		{  
			//this will help in case user decided to click on cancel button
			$(this).attr('original_entry', $(this).html());
		}); 		
		//--->add the original entry > end

	});
		//--->button > edit > end

	//--->button > delete >start
	$(document).on('click', '.btn_delete', function(event)
	{
		continues = false;
		var row_id = $(this).closest('tr').attr('row_id'); 
		var row_div = $(this)				
		
		var col_name = row_div.attr('col_name'); 
		var col_val = row_div.html(); 
		
		var Row = document.getElementById(row_id);
		var Cells = Row.getElementsByTagName("td");
		
		var colEmail = Cells[0].textContent;		
		getAppCliIDAndUserPoolID();
		waitForElement()
		function waitForElement()
		{
			if(continues == true)
			{
				console.log(colEmail);
				console.log(nonAdminIds[0])
				$.ajax({
					type:'DELETE',
					url:API_URL,
					data: JSON.stringify(
						{
							"Email":colEmail, 
							"CompanyID":nonAdminIds[0]
						}
					  ),

					contentType:"application/json",

					success: function(data){
						generateTable()
					},
					error: function(data)
					{
						$("#errorModule").show();
					}
				});
				
				$.ajax({
					type:'PATCH',
					url:API_URL,
					data: JSON.stringify(
						{
							"UserPoolId":nonAdminIds[0],
							"Username":colEmail		
						}
					  ),

					contentType:"application/json",

					success: function(data){
						generateTable()
					},
					error: function(data)
					{
						$("#errorModule").show();
					}
				});
			}
			else
			{
				setTimeout(waitForElement, 250);
			}
		}

	});
	//--->button> delete> end
	
	
	//--->button > cancel > start	
	$(document).on('click', '.btn_cancel', function(event) 
	{
		event.preventDefault();

		var tbl_row = $(this).closest('tr');

		var row_id = tbl_row.attr('row_id');

		//hide save and cacel buttons
		tbl_row.find('.btn_save').hide();
		tbl_row.find('.btn_cancel').hide();

		//show edit button
		tbl_row.find('.btn_edit').show();
		tbl_row.find('.btn_delete').show();

		//make the whole row editable
		tbl_row.find('.row_data')
		.attr('edit_type', 'click')
		.removeClass('editColor')
		.css('padding','') 

		tbl_row.find('.row_data').each(function(index, val) 
		{   
			$(this).html( $(this).attr('original_entry') ); 
		});  
	});
		//--->button > cancel > end


		//--->save whole row entery > start	
	$(document).on('click', '.btn_save', function(event) 
	{
		continues = false; 
		event.preventDefault();
		var tbl_row = $(this).closest('tr');

		var row_id = tbl_row.attr('row_id');


		//hide save and cacel buttons
		tbl_row.find('.btn_save').hide();
		tbl_row.find('.btn_cancel').hide();

		//show edit button
		tbl_row.find('.btn_edit').show();
		tbl_row.find('.btn_delete').show();

		//make the whole row editable
		tbl_row.find('.row_data')
		.attr('edit_type', 'click')
		.removeClass('editColor')
		.css('padding','') 

		//--->get row data > start
		var arr = {}; 
		tbl_row.find('.row_data').each(function(index, val) 
		{   
			var col_name = $(this).attr('col_name');  
			var col_val  =  $(this).html();
			
			var Row = document.getElementById(row_id);
			var Cells = Row.getElementsByTagName("td");

			var colEmail = Cells[0].textContent;		
			getAppCliIDAndUserPoolID();
			
			waitForElement();
			function waitForElement()
			{
				if(continues == true)
				{
					$.ajax({
						type:'PUT',
						url:API_URL,
						data: JSON.stringify(
								{
									"Email":colEmail, 
									"CompanyID":nonAdminIds[0], 
									"updateAttr":col_name,
									"updateValue":col_val
								}
							  ),

						contentType:"application/json",

						success: function(data){
							generateTable()
						},
						error: function(data)
						{
							$("#errorModule").show();
						}
					});
				}
				else
				{
					setTimeout(waitForElement, 250);
				}
			}

			
			
			arr[col_name] = col_val;
		});
		//--->get row data > end

		//use the "arr"	object for your ajax call
		$.extend(arr, {row_id:row_id});

		//out put to show
		console.log(JSON.stringify(arr, null, 2))


	});
	//--->save whole row entery > end


}); 