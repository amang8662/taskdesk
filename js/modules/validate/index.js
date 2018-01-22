'use strict';

var regexEmail = new RegExp('^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\.([a-zA-Z]{2,5})$', 'i');

var regexMobile = new RegExp('^[789]\d{9}$');

var regex = '';

/* var optionFields = {
	required: true,
	regex: true,
	regexExp: '',
	integer: true,
	min: 0,
	max: 0
} */
module.exports = validate;

function validate(name,value, options = {}) {

	var response = {
		status: true,
		errortype: '',
		message: ''
	};

	if(response.status == true && options.required) {
		if(value == '') {
			response.status = false;
			response.errortype = 'required';
			response.message = ucwords(name) + " cannot be empty";
		}
	}

	if(response.status == true && options.regex) {

		if(typeof options.regexExp !== "undefined" && options.regexExp !== '') {
			regex = new RegExp(options.regexExp);
		} else {
			regex = getRegex(name);
		}

		if(!regex.test(value)) {

			response.status = false;
			response.errortype = 'regex';
			response.message = ucwords(name) + " is not valid";
		}
	} 

	if(response.status == true && options.integer) {
		if(!Number.isInteger(value)) {
			response.status = false;
			response.errortype = 'integer';
			response.message = ucwords(name) + "is not an Integer";
		}
	} 

	if(response.status == true && options.min && Number.isInteger(options.min) && options.min >= 0) {
		if(value.length < options.min) {
			response.status = false;
			response.errortype = 'min';
			response.message = "Minimum length of " + ucwords(name) + " must be " + options.min;
		}
	} 

	if(response.status == true && options.max && Number.isInteger(options.max) && options.max <= 10000) {
		if(value.length > options.max) {
			response.status = false;
			response.errortype = 'max';
			response.message = "Maximum length " + ucwords(name) + " must be " + options.max;
		}
	}

	return response;
}

function ucwords(value) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

function getRegex(name) {
	if(name == "email") {
		return regexEmail;
	} else if(name == "mobile") {
		return regexMobile;
	}
}