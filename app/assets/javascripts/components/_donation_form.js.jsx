var DonationBox = React.createClass({
    getInitialState: function() {
        //this will hold all the data being read and posted to the file
        return {data: []};
    },
    loadDonationsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadDonationsFromServer();
        setInterval(this.loadDonationsFromServer, this.props.pollInterval);
    },
    handleDonationSubmit: function(donation) {
        //this is just an example of how you would submit a form
        //you would have to implement something separately on the server
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: donation,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        return (
            <div className="donationBox">
                <h1>Donations</h1>
                <DonationList data={this.state.data} />
                <DonationForm onDonationSubmit={this.handleDonationSubmit} />
            </div>
        );
    }
});

var DonationList = React.createClass({
    render: function() {
        var donationNodes = this.props.data.map(function(donation) {
            return (
                <Donation
                    contributor={donation.contributor}
                    key={donation.id}
                    amount={donation.amount}
                >
                    {donation.comment}
                </Donation>
            );
        });
        return (
            <div className="donationList">
                {donationNodes}
            </div>
        );
    }
});

var Donation = React.createClass({
    render: function() {
        return (
            <div className="donation">
                <h2 className="donationContributor">
                    {this.props.contributor}: ${this.props.amount}
                </h2>
                {this.props.children.toString()}
            </div>
        );
    }
});



var DonationForm = React.createClass({
    getInitialState: function() {
        return {
            contributor: "",
            amount: undefined,
            comment: "",
            email: "",
            department: undefined
        };
    },
    handleSubmit: function(e) {
        //we don't want the form to submit, so we prevent the default behavior
        e.preventDefault();

        var contributor = this.state.contributor.trim();
        var amount = this.state.amount;
        var comment = this.state.comment.trim();
        if (!contributor || !amount) {
            return;
        }

        //Here we do the final submit to the parent component
        this.props.onDonationSubmit({contributor: contributor, amount: amount, comment: comment});
        this.setState({
            contributor: '',
            amount: undefined,
            comment: '',
            email: '',
            department: undefined
        });
    },
    validateEmail: function (value) {
        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    },
    validateDollars: function (value) {
        //will accept dollar amounts with two digits after the decimal or no decimal
        //will also accept a number with or without a dollar sign
        var regex  = /^\$?[0-9]+(\.[0-9][0-9])?$/;
        return regex.test(value);
    },
    commonValidate: function () {
        //you could do something here that does general validation for any form field
        return true;
    },
    setValue: function (field, event) {
        //If the input fields were directly within this
        //this component, we could use this.refs.[FIELD].value
        //Instead, we want to save the data for when the form is submitted
        var object = {};
        object[field] = event.target.value;
        this.setState(object);
    },
    render: function() {
        //Each form field is actually another component.
        //Two of the form fields use the same component, but with different variables
        return (
            <form className="donationForm" onSubmit={this.handleSubmit}>
                <h2>University Donation</h2>

                <TextInput
                    value={this.state.email}
                    uniqueName="email"
                    text="Email Address"
                    textArea={false}
                    required={true}
                    minCharacters={6}
                    validate={this.validateEmail}
                    onChange={this.setValue.bind(this, 'email')}
                    errorMessage="Email is invalid"
                    emptyMessage="Email is required" />
                <br /><br />

                <TextInput
                    value={this.state.contributor}
                    uniqueName="contributor"
                    text="Your Name"
                    textArea={false}
                    required={true}
                    minCharacters={3}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'contributor')}
                    errorMessage="Name is invalid"
                    emptyMessage="Name is required" />
                <br /><br />

                <TextInput
                    value={this.state.comment}
                    uniqueName="comment"
                    text="Is there anything you'd like to say?"
                    textArea={true}
                    required={false}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'comment')}
                    errorMessage=""
                    emptyMessage="" />
                <br /><br />

                {/* This Department component is specialized to include two fields in one */}
                <h4>Where would you like your donation to go?</h4>
                <Department
                    value={this.state.department}
                    onChange={this.setValue.bind(this, 'department')} />
                <br /><br />

                {/* This Radios component is specialized to include two fields in one */}
                <h4>How much would you like to give?</h4>
                <Radios
                    value={this.state.amount}
                    values={[10, 25, 50]}
                    name="amount"
                    addAny={true}
                    anyLabel=" Donate a custom amount"
                    anyPlaceholder="Amount (0.00)"
                    anyValidation={this.validateDollars}
                    onChange={this.setValue.bind(this, 'amount')}
                    anyErrorMessage="Amount is not a valid dollar amount"
                    itemLabel={' Donate $[VALUE]'} />
                <br /><br />

                <h4>Payment Information</h4>
                {/*<Payment />*/}
                <br />

                <input type="submit" value="Submit" />
            </form>
        );
    }
});

var TextInput = React.createClass({
    getInitialState: function(){
        //most of these variables have to do with handling errors
        return {
            isEmpty: true,
            value: null,
            valid: false,
            errorMessage: "Input is invalid",
            errorVisible: false
        };
    },

    handleChange: function(event){
        //validate the field locally
        this.validation(event.target.value);

        //Call onChange method on the parent component for updating it's state
        //If saving this field for final form submission, it gets passed
        // up to the top component for sending to the server
        if(this.props.onChange) {
            this.props.onChange(event);
        }
    },

    validation: function (value, valid) {
        //The valid variable is optional, and true if not passed in:
        if (typeof valid === 'undefined') {
            valid = true;
        }

        var message = "";
        var errorVisible = false;

        //we know how to validate text fields based on information passed through props
        if (!valid) {
            //This happens when the user leaves the field, but it is not valid
            //(we do final validation in the parent component, then pass the result
            //here for display)
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }
        else if (this.props.required && jQuery.isEmptyObject(value)) {
            //this happens when we have a required field with no text entered
            //in this case, we want the "emptyMessage" error message
            message = this.props.emptyMessage;
            valid = false;
            errorVisible = true;
        }
        else if (value.length < this.props.minCharacters) {
            //This happens when the text entered is not the required length,
            //in which case we show the regular error message
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }

        //setting the state will update the display,
        //causing the error message to display if there is one.
        this.setState({
            value: value,
            isEmpty: jQuery.isEmptyObject(value),
            valid: valid,
            errorMessage: message,
            errorVisible: errorVisible
        });

    },

    handleBlur: function (event) {
        //Complete final validation from parent element when complete
        var valid = this.props.validate(event.target.value);
        //pass the result to the local validation element for displaying the error
        this.validation(event.target.value, valid);
    },
    render: function() {
        if (this.props.textArea) {
            return (
                <div className={this.props.uniqueName}>
          <textarea
              placeholder={this.props.text}
              className={'input input-' + this.props.uniqueName}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        } else {
            return (
                <div className={this.props.uniqueName}>
                    <input
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        }
    }
});

var Radios = React.createClass({
    getInitialState: function() {
        //displayClass is the class we use for displaying or hiding
        //the optional "any value" text field
        return {
            displayClass: 'invisible',
            valid: false,
            errorMessage: "Input is invalid",
            errorVisible: false
        };
    },
    handleClick: function(displayClass, e) {
        //if we click any option other than the "any value" option,
        //we hide the "any value" text field. Otherwise, show it
        if (displayClass == 'invisible') {
            this.setState(
                {
                    displayClass: displayClass,
                    errorVisible: false
                }
            );
            this.props.onChange(e);
        }
        else {
            this.setState({displayClass: displayClass});
        }
    },
    handleAnyChange: function(e) {
        //this validation is specifically for the optional "any value" text field
        //Since we have no idea what the requirements are locally, we call the parent
        //validation function, then set the error states accordingly
        if (this.props.anyValidation(e.target.value)) {
            this.setState(
                {
                    valid: true,
                    errorMessage: "Input is invalid",
                    errorVisible: false
                }
            );
            this.props.onChange(e);
        }
        else {
            this.setState(
                {
                    valid: false,
                    errorMessage: this.props.anyErrorMessage,
                    errorVisible: true
                }
            );
        }
    },
    render: function() {
        var rows = [];
        var label = "";

        //we have passed in all the options for the radios, so we traverse the array
        for (var i = 0; i < this.props.values.length; i++) {
            //We do this little replace for when we want to display the value as part of
            //additional text. Otherwise, we would just put '[VALUE]' when passing
            //the itemLabel prop from the parent component, or leave out '[VALUE]' entirely
            label = this.props.itemLabel.replace('[VALUE]', this.props.values[i]);

            //You'll see that even the <br /> field has a key. React will give you errors
            //if you don't do this. This is just an axample of what's possible, but
            //you would normally add extra spacing with css
            rows.push(<input
                    key={this.props.name + '-' + i}
                    type="radio"
                    ref={this.props.name + '-' + this.props.values[i]}
                    name={this.props.name}
                    value={this.props.values[i]}
                    selected={this.props.value==this.props.values[i]?true:false}
                    onClick={this.handleClick.bind(this, 'invisible')} />,

                <label key={this.props.name + '-label-' + i} htmlFor={this.props.values[i]}>{label}</label>,

                <br key={this.props.name + '-br-' + i} />);
        }

        //The "any value" field complicates things a bit
        if (this.props.addAny) {
            //we passed in a separate label just for the option that
            //activates the "any value" text field
            var selected = false;
            label = this.props.anyLabel;
            if (this.props.value != undefined && this.props.values.indexOf(this.props.value) == -1) {
                selected = true;
            }
            rows.push(<input
                    key={this.props.name + '-' + i}
                    type="radio"
                    ref={this.props.name + '-any'}
                    name={this.props.name} value="any"
                    selected={selected}
                    onClick={this.handleClick.bind(this, 'visible')} />,

                <label key={this.props.name + '-label-' + i} htmlFor={this.props.values[i]}>{label}</label>);

            //and now we add the "any value text field, with all its special variables"
            var value = "";
            if (selected) {
                value = this.props.value;
            }

            rows.push(<div key={this.props.name + '-div-' + (i+2)} className={this.state.displayClass}>
                <input
                    className="anyValue"
                    key={this.props.name + '-' + (i+1)}
                    type="text"
                    value={value}
                    placeholder={this.props.anyPlaceholder}
                    onChange={this.handleAnyChange}
                    ref={this.props.name} />
            </div>);
        }

        //Now we just return all those rows, along with the error component
        return (
            <div className="radios">
                {rows}

                <InputError
                    visible={this.state.errorVisible}
                    errorMessage={this.state.errorMessage} />
            </div>
        );
    }
});

var Department = React.createClass({
    getInitialState: function() {
        return {
            displayClass: 'invisible'
        };
    },
    handleClick: function(e) {
        //We're doing another one of these "any value" fields, only shown when
        //a specific "other" option is chosen
        this.props.onChange(e);
        var displayClass = 'invisible';
        if (e.target.value == 'other') {
            displayClass = 'visible';
        }
        this.setState({displayClass: displayClass});
    },
    render: function() {
        //This is a select field with options and sub-options, plus an "any value" field
        var value = this.props.value;
        if (this.props.value != undefined && ['none', 'muir', 'revelle', 'sixth', 'jacobs', 'global', 'medicine', 'scholarships'].indexOf(this.props.value) == -1) {
            value = 'other';
        }
        else if (this.props.value == undefined) {
            value = 'none';
        }

        return (
            <div className="department">
                <select value={value} onChange={this.handleClick} multiple={false} ref="department">
                    <option value="none"></option>
                    <optgroup label="College">
                        <option value="muir">Muir</option>
                        <option value="revelle">Revelle</option>
                        <option value="sixth">Sixth</option>
                    </optgroup>
                    <optgroup label="School">
                        <option value="jacobs">Jacobs School of Engineering</option>
                        <option value="global">School of Global Policy and Strategy</option>
                        <option value="medicine">School of Medicine</option>
                    </optgroup>
                    <option value="scholarships">Scholarships</option>
                    <option value="other">Other</option>
                </select>
                <div className={this.state.displayClass}>
                    <input className="anyValue" value={this.props.value=='other'?this.props.value:''} type="text" onChange={this.props.onChange} placeholder="Department" ref="any-department" />
                </div>

                <InputError
                    visible={this.state.errorVisible}
                    errorMessage={this.state.errorMessage} />
            </div>
        );
    }
});

var InputError = React.createClass({
    render(){
        return (
            <div style={{display: this.props.errorVisible}}>
                {this.props.errorMessage}
            </div>
        );
    }
});

//source: https://html5hive.org/how-to-submit-forms-and-save-data-with-react-js-and-node-js/