(function(global, factory) {
    if (typeof define === 'function' && define.amd) define(factory);
    else if (typeof module === 'object') module.exports = factory;
    else {
        global.O = factory();
    }
}(this, function() {
    var O = {};

    /**
     * Logs messages to console if available. 
     * Logs any parameter given to the function.
     */
    O.log = function() {
        if (console && console.log) {
            window.console['log'].apply(window.console, arguments);
        }
    };

    /**
     * Determines currently selected issue type
     * @return {String} 'road' or 'env'
     */
    O.getIssueType = function() {
        return $("input:radio[name=issueType]:checked").val();
    };

    /**
     * Creates a template with color based on type
     * @param  {String} type 'road', 'env' or undefined
     * @return {Object} template definition for markers
     */
    O.getMarkerTemplate = function(type) {
        var template = {
            size: 4,
            shape: 2,
            color: O.getColor(type)
        };
        return template;
    }

    /**
     * Returns a color code based on type. 
     * If type is not give, uses O.getIssueType()
     * @param  {String} type 'road', 'env' or undefined
     * @return {String} hexColor
     */
    O.getColor = function(type) {
        if (!type) {
            type = O.getIssueType();
        }
        if (type === 'road') {
            return "00FFFF";
        }
        return "00FF00";
    };

    /**
     * Serializes form values to a json:
     *  
     *  input:radio[@name='issueType']
     *  input[@name='name']
     *  input[@name='email]
     *  textarea[@name="desc"]
     *  input[@name="coordinates"]
     *  
     * @return {Object} where keys are form field names
     */
    O.getFormValues = function() {
        var value = {
            type: O.getIssueType()
        };

        var form = $("#mode1Form");
        var inputs = form.find('input, textarea');
        inputs.each(function() {
            var input = $(this);
            value[input.attr('name')] = input.val();
        });
        return value;
    };

    /**
     * Resets all the form fields
     */
    O.resetForm = function() {

        var form = $("#mode1Form");
        var inputs = form.find('input, textarea');
        inputs.each(function() {
            $(this).val('');
        });
    };

    O.errorHandler = function(error, message) {
        O.log('error', error, message);
    };
    return O;
}));