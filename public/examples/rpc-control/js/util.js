(function(global, factory) {
   if (typeof define === 'function' && define.amd) define(factory);
   else if (typeof module === 'object')  module.exports = factory;
   else {
      global.O = factory();
   }
}(this, function() {
	var O = {};

	O.log = function() {
        if(console && console.log) {
            window.console['log'].apply(window.console, arguments);
        }
	};

    O.getIssueType = function() {
        return $("input:radio[name=issueType]:checked").val();
    }
    /*
     input:radio[@name='issueType']
     input[@name='name']
     input[@name='email]
     textarea[@name="desc"]
     input[@name="coordinates"]
     */
    O.getFormValues = function() {
        var value = {
            type : O.getIssueType()
        };

        var form = $("#mode1Form");
        var inputs = form.find('input, textarea');
        inputs.each(function() {
            var input = $(this);
            value[input.attr('name')] = input.val();
        });
        return value;
    };

    O.resetForm = function() {

        var form = $("#mode1Form");
        var inputs = form.find('input, textarea');
        inputs.each(function() {
            $(this).val('');
        });
    };

    O.getColor = function(type) {
        if(!type) {
            type = O.getIssueType();
        }
        if(type === 'road') {
            return "00FFFF";
        }
        return "00FF00";
    };
	return O;
}));
