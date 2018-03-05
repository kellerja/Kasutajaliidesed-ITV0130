function Person() {
    this.firstName = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta eesnimi',
        firstBlur: false,
        validate: function() {
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.lastName = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta perenimi',
        firstBlur: false,
        validate: function() {
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.phone = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta telefoni number',
        firstBlur: false,
        validate: function() {
            this.isValid = true;
            if (!this.value) {
                this.isValid = false;
                this.errorMsg = 'Palun sisesta telefoni number';
            } else if (this.value.match(/\d/g) && this.value.match(/\d/g).length < 6) {
                this.isValid = false;
                this.errorMsg = 'Telefoni number peab olema pikem';
            } else if (this.value.match(/\d/g) && this.value.match(/\d/g).length > 11) {
                this.isValid = false;
                this.errorMsg = 'Telefoni number peab olema lühem';
            } else if (!this.value.match(/^(\+\d{1,3}(-| )?)?([\d]{3,4}(-| )?)+[\d]+$/)) {
                this.isValid = false;
                this.errorMsg = 'Telefoni number peab koosnema numbritest';
                if (this.value.endsWith('-') || this.value.endsWith(' ')) {
                    this.errorMsg = 'Telefoni number peab lõppema numbriga';
                }
            }
            return this.isValid;
        }
    },
    this.email = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta email',
        firstBlur: false,
        validate: function() {
            this.isValid = true;
            if (!this.value) {
                this.isValid = false;
                this.errorMsg = 'Palun sisesta email';
            } else if (!this.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                this.isValid = false;
                this.errorMsg = 'Email peab olema formaadis nimi@domeen';
            }
            return this.isValid;
        }
    },
    this.idCode = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta isikukood',
        firstBlur: false,
        validate: function() {
            this.isValid = true;
            if (!this.value) {
                this.isValid = false;
                this.errorMsg = 'Palun sisesta korrektne isikukood';
            } else if (!this.value.match(/^\d+$/)) {
                this.isValid = false;
                this.errorMsg = 'Isikukood peab koosnema numbritest';
            } else if (this.value.length != 11) {
                this.isValid = false;
                this.errorMsg = 'Isikukood on 11 numbrit pikk';
            } else {
                const firstWeights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
                const secondWeights = [3, 4, 5, 6, 7, 8, 9, 1, 2, 3];
                const controlCodeFirst = this.value.split('').slice(0, 10).map(function(element, index) {
                    return parseInt(element) * firstWeights[index];
                }).reduce(function(a, b) {
                    return a + b;
                }, 0) % 11;
                if (controlCodeFirst == 10) {
                    const controlCodeSecond = this.value.split('').slice(0, 10).map(function(element, index) {
                        return parseInt(element) * secondWeights[index];
                    }).reduce(function(a, b) {
                        return a + b;
                    }, 0) % 11;
                    controlCode = controlCodeSecond == 10 ? 0 : controlCodeSecond;
                } else {
                    controlCode = controlCodeFirst;
                }
                this.isValid = this.value.endsWith(controlCode);
                this.errorMsg = 'Isikukood peab olema korrektne';
            }
            return this.isValid;
        }
    },
    this.nationality = {
        value: '',
        isNotWillingToReveal: false,
        isValid: false,
        errorMsg: 'Palun sisesta korrektne rahvus',
        firstBlur: false,
        validate: function() {
            if (this.isNotWillingToReveal) return true;
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.motherTongue = {
        value: '',
        isNotWillingToReveal: false,
        isValid: false,
        errorMsg: 'Palun sisesta korrektne emakeel',
        firstBlur: false,
        validate: function() {
            if (this.isNotWillingToReveal) return true;
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.foreignCountry = {
        isPrevResidenceInForeignCountry: true,
        addressInForeignCountry: {
            value: '',
            isValid: false,
            errorMsg: 'Palun sisesta korrektne address',
            firstBlur: false,
            validate: function() {
                this.isValid = !!this.value;
                return this.isValid;
            }
        },
        departureTimeFromEstonia: {
            value: '',
            isValid: false,
            errorMsg: 'Palun sisesta korrektne kuupäev',
            firstBlur: false,
            validate: function() {
                this.isValid = true;
                if (!this.value) {
                    this.isValid = false;
                    this.errorMsg = 'Palun sisesta korrektne kuupäev';
                } else if (isNaN(Date.parse(this.value))) {
                    this.isValid = false;
                    this.errorMsg = 'Sisestatud kuupäev pole korrektne';
                }
                return this.isValid;
            }
        },
        validate() {
            return !this.isPrevResidenceInForeignCountry || 
                (this.addressInForeignCountry.validate() && this.departureTimeFromEstonia.validate());
        }
    },
    this.foreignIdCode = {
        isForeignIdCode: true,
        foreignCountry: {
            value: '',
            isValid: false,
            errorMsg: 'Palun sisesta korrektne riik',
            firstBlur: false,
            validate: function() {
                this.isValid = !!this.value;
                return this.isValid;
            }
        },
        idCode: {
            value: '',
            isValid: false,
            errorMsg: 'Palun sisesta korrektne isikukood',
            firstBlur: false,
            validate: function() {
                this.isValid = !!this.value;
                return this.isValid;
            }
        },
        validate: function() {
            return !this.isForeignIdCode || 
                (this.foreignCountry.validate && this.idCode.validate());
        }
    },
    this.education = '-',
    this.employment = '-',
    this.validate = function() {
        return this.firstName.validate() && this.lastName.validate() && 
            this.phone.validate() && this.email.validate() && this.idCode.validate() && 
            this.nationality.validate() && this.motherTongue.validate() && 
            this.foreignCountry.validate() && this.foreignIdCode.validate();
    }
}

function Sender() {
    var person = new Person();
    person.isAddressRegistration = true;
    person.contactAddress = new Address();
    person.contactAddress.isNotSameAsRegAddress = false;
    person.contactAddress.ownership = undefined;
    person.contactAddress.isValidFromKnown = false;
    person.contactAddress.validFrom = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta kehtivuse alguskuupäev',
        firstBlur: false,
        validate: function() {
            this.isValid = true;
            if (!this.value) {
                this.isValid = false;
                this.errorMsg = 'Palun sisesta kehtivuse alguskuupäev';
            } else if (isNaN(Date.parse(this.value))) {
                this.isValid = false;
                this.errorMsg = 'Algusaeg pole korrektne';
            }
            return this.isValid;
        }
    }
    person.contactAddress.isValidToKnown = false;
    person.contactAddress.validTo = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta kehtivuse lõppkuupäev',
        firstBlur: false,
        validate: function() {
            this.isValid = true;
            if (!this.value) {
                this.isValid = false;
                this.errorMsg = 'Palun sisesta kehtivuse lõppkuupäev';
            } else if (isNaN(Date.parse(this.value))) {
                this.isValid = false;
                this.errorMsg = 'Lõppaeg pole korrektne';
            }
            return this.isValid;
        }
    }
    person.validate = function() {
        return person.firstName.validate() && person.lastName.validate() && 
            person.phone.validate() && person.email.validate() && person.idCode.validate() && 
            person.nationality.validate() && person.motherTongue.validate() && 
            person.foreignCountry.validate() && person.foreignIdCode.validate() &&
            (
                person.isAddressRegistration || person.contactAddress.isNotSameAsRegAddress || 
                (
                    person.contactAddress.validate() && 
                    (
                        !person.contactAddress.isValidFromKnown || 
                        person.contactAddress.validFrom.validate()
                    ) && 
                    (
                        !person.contactAddress.isValidToKnown || 
                        person.contactAddress.validTo.validate()
                    )
                )
            );
    }
    return person;
}
