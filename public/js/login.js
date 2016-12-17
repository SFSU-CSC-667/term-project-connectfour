
 
$(document).ready(function(){

	$('#loginform').validate({ // initialize the plugin
        rules: {
            username: {
                required: true             
            },            
            password: {
                required: true                
            }
        },
        submitHandler: function(form) {
      		form.submit();      		
    	}
    });
//	$('form#myForm').submit();

});
 
