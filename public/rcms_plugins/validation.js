// ROCKCMS form validation
let validation = function() {
  let validationStatus = false;
  // These are the constraints used to validate the form
  //var constraints = {};

/*
    // These are the constraints used to validate the form
    var constraints = {
      test_headline: {
        // You need to pick a username too
        presence: true,
        // And it must be between 3 and 20 characters long
        length: {
          minimum: 3,
          maximum: 20
        },
        format: {
          // We don't allow anything that a-z and 0-9
          pattern: "[a-z0-9]+",
          // but we don't care if the username is uppercase or lowercase
          flags: "i",
          message: "Can only contain a-z and 0-9"
        }
      },
    };
*/

  function addItem(element) {
    var itemKey = '';
    var itemVal = {};
    Object.keys(element).forEach(key => {
      itemKey = key;
      itemVal = element[key];
      constraints[key] = element[key];
    });
  }

  function validateForm(form) {
      loadJS('/public/components/underscore-min.js', document.body, null);
      loadJS('/public/components/validate.min.js', document.body, null);
      loadJS('/public/components/moment.min.js', document.body, null);

      //console.log(constraints);
      // Hook up the form so we can prevent it from being posted
      document.querySelector("form#content_type_article")
        .addEventListener("submit", function(ev) {
          if (validationStatus == false) {
            ev.preventDefault();
            handleFormSubmit(this);
          }
      });
  }

  function handleFormSubmit(form) {
    // First we gather the values from the form
    var values = validate.collectFormValues(form);
    // then we validate them against the constraints
    var errors = validate(values, constraints);
    // then we update the form to reflect the results
    showErrors(form, errors || {});
    // And if all constraints pass we let the user know
    if (!errors) {
      validationStatus = true;
      $( "form" ).submit();
      showSuccess();
    }
  }

  // Updates the inputs with the validation errors
  function showErrors(form, errors) {
    // We loop through all the inputs and show the errors for that input
    _.each(form.querySelectorAll("input[name], select[name]"), function(input) {
      // Since the errors can be null if no errors were found we need to handle
      // that
      showErrorsForInput(input, errors && errors[input.name]);
    });
  }


  // Shows the errors for a specific input
  function showErrorsForInput(input, errors) {
    // This is the root of the input
    var formGroup = closestParent(input.parentNode, "form-group")
      // Find where the error messages will be insert into
    let messages = formGroup.querySelector(".messages");
    // First we remove any old messages and resets the classes
    resetFormGroup(formGroup);
    // If we have errors
    if (errors) {
      // we first mark the group has having errors
      formGroup.classList.add("has-error");
      // then we append all the errors
      _.each(errors, function(error) {
        addError(messages , error );
      });
      //linebreak = document.createElement("br");
      //messages.append(linebreak);
      //messages.innerHTML += '</br>';
    } else {
      // otherwise we simply mark it as success
      formGroup.classList.add("has-success");
    }
  }

  // Recusively finds the closest parent that has the specified class
  function closestParent(child, className) {
    if (!child || child == document) {
      return null;
    }
    if (child.classList.contains(className)) {
      return child;
    } else {
      return closestParent(child.parentNode, className);
    }
  }

  function resetFormGroup(formGroup) {
    // Remove the success and error classes
    formGroup.classList.remove("has-error");
    formGroup.classList.remove("has-success");
    // and remove any old messages
    _.each(formGroup.querySelectorAll(".help-block.error"), function(el) {
      el.parentNode.removeChild(el);
    });
  }

  // Adds the specified error with the following markup
  // <p class="help-block error">[message]</p>
  function addError(messages, error) {
    var block = document.createElement("p");
    block.classList.add("help-block");
    block.classList.add("error");
    block.innerHTML = error;
    messages.appendChild(block);
  }

  function showSuccess(event) {
    //alert("Success!");
  }

  return {
    additem: addItem,
    validateForm: validateForm
  }

};
