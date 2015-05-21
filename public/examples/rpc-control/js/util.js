(function(global, factory) {
    if (typeof define === 'function' && define.amd) define(factory);
    else if (typeof module === 'object') module.exports = factory;
    else {
        global.Util = factory();
    }
}(this, function() {
    var Util = {};

    /**
     * Logs messages to console if available. 
     * Logs any parameter given to the function.
     */
    Util.log = function() {
        if (console && console.log) {
            window.console['log'].apply(window.console, arguments);
        }
    };

    /**
     * Determines currently selected issue type
     * @return {String} 'road' or 'env'
     */
    Util.getIssueType = function() {
        return $("input:radio[name=issueType]:checked").val();
    };

    /**
     * Creates a template with color based on type. 
     * http://oskari.org/documentation/requests/addmarkerrequest
     * @param  {String} type 'road', 'env' or undefined
     * @return {Object} template definition for markers
     */
    Util.getMarkerTemplate = function(type) {
        var template = {
            size: 4,
            shape: 2,
            color: Util.getColor(type)
        };
        return template;
    }

    /**
     * Returns a color code based on type. 
     * If type is not give, uses Util.getIssueType()
     * @param  {String} type 'road', 'env' or undefined
     * @return {String} hexColor
     */
    Util.getColor = function(type) {
        if (!type) {
            type = Util.getIssueType();
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
    Util.getFormValues = function() {
        var value = {
            type: Util.getIssueType()
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
    Util.resetForm = function() {

        var form = $("#mode1Form");
        var inputs = form.find('input, textarea');
        inputs.each(function() {
            $(this).val('');
        });
    };

    Util.errorHandler = function(error, message) {
        Util.log('error', error, message);
    };
    return Util;
}));