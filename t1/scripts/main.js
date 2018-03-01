function ExtraData(parent) {
    this.parent = parent,
    this.isPrevResidenceInForeignCountry = false,
    this.isForeignIdCode = false,
    this.foreignCountry = {
        self: this,
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta oma elukoht välisriigis (riik ja haldusüksus)',
        firstBlur: false,
        validate: function() {
            const prevIsValid = this.isValid;
            this.isValid = !!this.value;
            if (prevIsValid != this.isValid) {
                this.self.parent.tab.validateExtra();
            }
            return this.isValid;
        }
    },
    this.leftEstoniaTime = {
        self: this,
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta aeg, millal lahkusid Eestist',
        firstBlur: false,
        validate: function() {
            const prevIsValid = this.isValid;
            this.isValid = !!this.value;
            if (prevIsValid != this.isValid) {
                this.self.parent.tab.validateExtra();
            }
            return this.isValid;
        }
    },
    this.foreignCountryForIdCode = {
        self: this,
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta isikukoodi väljastanud riik',
        firstBlur: false,
        validate: function() {
            const prevIsValid = this.isValid;
            this.isValid = !!this.value;
            if (prevIsValid != this.isValid) {
                this.self.parent.tab.validateExtra();
            }
            return this.isValid;
        }
    },
    this.foreignCountryIdCode = {
        self: this,
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta välisriigi isikukood',
        firstBlur: false,
        validate: function() {
            const prevIsValid = this.isValid;
            this.isValid = !!this.value;
            if (prevIsValid != this.isValid) {
                this.self.parent.tab.validateExtra();
            }
            return this.isValid;
        }
    },
    this.isNotWillingToRevealNationality = false,
    this.nationality = {
        self: this,
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta korrektne rahvus',
        firstBlur: false,
        validate: function() {
            const prevIsValid = this.isValid;
            this.isValid = !!this.value;
            if (prevIsValid != this.isValid) {
                this.self.parent.tab.validate();
            }
            return this.isValid;
        }
    },
    this.isNotWillingToRevealMotherToungue = false,
    this.motherToungue = {
        self: this,
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta korrektne emakeel',
        firstBlur: false,
        validate: function() {
            const prevIsValid = this.isValid;
            this.isValid = !!this.value;
            if (prevIsValid != this.isValid) {
                this.self.parent.tab.validate();
            }
            return this.isValid;
        }
    },
    this.education = '-',
    this.employment = '-',
    this.validate = function() {
        return (!this.isPrevResidenceInForeignCountry || (this.foreignCountry.isValid && this.leftEstoniaTime.isValid)) && 
            (!this.isForeignIdCode || (this.foreignCountryForIdCode.isValid && this.foreignCountryIdCode.isValid)) &&
            (this.isNotWillingToRevealNationality || this.nationality.isValid) && 
            (this.isNotWillingToRevealMotherToungue || this.motherToungue.isValid);
    }
}

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
        self: this,
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta telefoni number',
        firstBlur: false,
        validate: function() {
            const prevIsValid = this.isValid;
            this.isValid = !!this.value;
            if (prevIsValid != this.isValid) {
                this.self.tab.validate();
            }
            return this.isValid;
        }
    },
    this.email = {
        self: this,
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta email',
        firstBlur: false,
        validate: function() {
            const prevIsValid = this.isValid;
            this.isValid = !!this.value;
            if (prevIsValid != this.isValid) {
                this.self.tab.validate();
            }
            return this.isValid;
        }
    },
    this.idCode = {
        self: this,
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta isikukood',
        firstBlur: false,
        validate: function() {
            const prevIsValid = this.isValid;
            this.isValid = !!this.value;
            if (prevIsValid != this.isValid) {
                this.self.tab.validate();
            }
            return this.isValid;
        }
    },
    this.extra = new ExtraData(this),
    this.validate = function(includeExtra = false) {
        return (!includeExtra || this.extra.validate()) && this.firstName.isValid && 
            this.lastName.isValid && this.phone.isValid && 
            this.email.isValid && this.idCode.isValid;
    },
    this.tab = {
        self: this,
        value: 0,
        isExtraValid: false,
        validateExtra: function() {
            this.isExtraValid = (
                !this.self.extra.isPrevResidenceInForeignCountry || 
                    (this.self.extra.foreignCountry.validate() && 
                    this.self.extra.leftEstoniaTime.validate())
                ) && 
                (
                    !this.self.extra.isForeignIdCode || 
                        (this.self.extra.foreignCountryForIdCode.validate() && 
                        this.self.extra.foreignCountryIdCode.validate())
                );
            return this.isExtraValid;
        },
        isValid: false,
        validate: function() {
            this.isValid = this.self.idCode.validate() && 
                this.self.email.validate() && 
                this.self.phone.validate() && 
                (
                    this.self.extra.isNotWillingToRevealNationality || 
                    this.self.extra.nationality.validate()
                ) &&
                (
                    this.self.extra.isNotWillingToRevealMotherToungue || 
                    this.self.extra.motherToungue.validate()
                );
            return this.isValid;
        }
    }
}

function Address() {
    this.country = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta riik',
        firstBlur: false,
        validate: function() {
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.county = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta maakond',
        firstBlur: false,
        validate: function() {
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.city = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta vald/linn, alevik, küla',
        firstBlur: false,
        validate: function() {
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.street = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta tänav/talu, maja nr, korteri nr',
        firstBlur: false,
        validate: function() {
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.postalIndex = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta postiindex',
        firstBlur: false,
        validate: function() {
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.ownership = {
        value: '0',
        proof: ''
    },
    this.validate = function() {
        return this.country.isValid && this.county.isValid && 
            this.city.isValid && this.street.isValid && this.postalIndex.isValid;
    }
}

Vue.component('input-group', {
    props: {
        title: String, 
        object: Object, 
        id: String,
        disabled: Boolean
    },
    template: '<div class="form-group"> \
                <label :for="id">{{title}}</label> \
                <input type="text" \
                    :class="[\'form-control\', disabled ? \'\' : (object.isValid ? (object.firstBlur ? \'is-valid\' : \'\') : (object.firstBlur ? \'is-invalid\' : \'\'))]" \
                    :id="id" v-model="object.value" \
                    @keyup="object.validate()" \
                    @blur.once="object.firstBlur = true" :disabled="disabled"> \
                <small class="invalid-feedback">{{object.errorMsg}}</small> \
              </div>'
})

vm = new Vue({
    el: '#app',
    data: {
        formData: {
            people: [new Person()],
            newAddress: new Address(),
            isSubmitterAlsoNewAddressResident: true,
            isContactAddressNewAddress: false,
            contactAddress: {
                address: new Address(),
                isValidFrom: false,
                validFrom: {
                    value: '',
                    isValid: false,
                    errorMsg: 'Palun sisesta kehtivuse algusaeg',
                    firstBlur: false,
                    validate: function() {
                        this.isValid = !!this.value;
                        return this.isValid;
                    }
                },
                isValidTo: false,
                validTo: {
                    value: '',
                    isValid: false,
                    errorMsg: 'Palun sisesta kehtivuse lõppaeg',
                    firstBlur: false,
                    validate: function() {
                        this.isValid = !!this.value;
                        return this.isValid;
                    }
                }
            },
            isContactAddressValid: false,
            validateContactAddress: function() {
                this.isContactAddressValid = this.isSubmitterAlsoNewAddressResident ||
                    this.isContactAddressNewAddress || (
                        this.contactAddress.address.validate() && 
                        (this.contactAddress.isValidFrom || this.contactAddress.validFrom.validate()) &&
                        (this.contactAddress.isValidTo || this.contactAddress.validTo.validate())
                    );
                return this.isContactAddressValid;
            }
        },
        tabs: [
            {
                isActive: false,
                isValid: false,
                validate() {
                    this.isValid = vm.formData.newAddress.validate();
                    return this.isValid;
                }
            },
            {
                isActive: false,
                isValid: false,
                validate() {
                    var temp = vm.formData.validateContactAddress();
                    vm.formData.people.forEach(function(person){
                        temp = person.firstName.validate() && person.lastName.validate() && person.tab.validate() && person.tab.validateExtra() && temp;
                    });
                    this.isValid = temp;
                    return this.isValid;
                }
            }
        ],
        isFormValid: false
    },
    methods: {
        addPerson() {
            this.formData.people.push(new Person())
        },
        removePerson(index) {
            this.formData.people.splice(index, 1);
        },
        toggleTab(tabNr) {
            this.tabs.forEach(function(tab, index) {
                if (index == tabNr) {
                    return;
                }
                tab.isActive = false
            });
            this.tabs[tabNr].isActive = !this.tabs[tabNr].isActive;
            this.tabs[tabNr].validate();
            this.validate();
        },
        validate() {
            this.isFormValid = this.tabs.every(function(tab) {
                return tab.validate();
            });
            return this.isFormValid;
        }
    }
});
