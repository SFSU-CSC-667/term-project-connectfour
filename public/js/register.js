
 
$(document).ready(function(){

	$('#regform').validate({ // initialize the plugin
        rules: {
            username: {
                required: true,
                minlength: 5
            },
            email: {
            	required: true
            },
            password: {
                required: true,
                minlength: 8
            },
            password_confirm: {
                required: true,
                minlength: 8,
                equalTo : "#password"
            }
        },
        submitHandler: function(form) {
      		form.submit();      		
    	}
    });

});
 
