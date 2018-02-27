function ExtraData() {
    this.isPrevResidenceInForeignCountry = false,
    this.isForeignIdCode = false,
    this.foreignCountry = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta oma elukoht välisriigis (riik ja haldusüksus)',
        firstBlur: false,
        validate: function() {
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.leftEstoniaTime = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta aeg, millal lahkusid Eestist',
        firstBlur: false,
        validate: function() {
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.foreignCountryForIdCode = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta isikukoodi väljastanud riik',
        firstBlur: false,
        validate: function() {
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.foreignCountryIdCode = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta välisriigi isikukood',
        firstBlur: false,
        validate: function() {
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.isNotWillingToRevealNationality = false,
    this.nationality = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta korrektne rahvus',
        firstBlur: false,
        validate: function() {
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.isNotWillingToRevealMotherToungue = false,
    this.motherToungue = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta korrektne emakeel',
        firstBlur: false,
        validate: function() {
            this.isValid = !!this.value;
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
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta telefoni number',
        firstBlur: false,
        validate: function() {
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.email = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta email',
        firstBlur: false,
        validate: function() {
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.idCode = {
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta isikukood',
        firstBlur: false,
        validate: function() {
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.extra = new ExtraData(),
    this.validate = function(includeExtra = false) {
        return (!includeExtra || this.extra.validate()) && this.firstName.isValid && 
            this.lastName.isValid && this.phone.isValid && 
            this.email.isValid && this.idCode.isValid;
    },
    this.tab = {
        value = 0
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
            isContactAddressNewAddress: true,
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
            }
        },
        tabs: [
            {
                isActive: false,
                isValid: false,
                validate: function() {
                    this.isValid = vm.formData.people[0].validate(false);
                    return this.isValid;
                }
            },
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
                    this.isValid = vm.formData.people.slice(1).every(function(person){
                        return person.validate(false);
                    });
                    return this.isValid;
                }
            },
            {
                isActive: false,
                isValid: false,
                validate() {
                    this.isValid = vm.formData.isSubmitterAlsoNewAddressResident || 
                        vm.formData.isContactAddressNewAddress || 
                        (vm.formData.contactAddress.address.validate() && 
                            (vm.formData.contactAddress.isValidFrom || vm.formData.contactAddress.validFrom.isValid) &&
                            (vm.formData.contactAddress.isValidTo || vm.formData.contactAddress.validTo.isValid)
                        );
                    return this.isValid;
                }
            },
            {
                isActive: false,
                isValid: false,
                validate() {
                    this.isValid = vm.formData.people.every(function(person) {
                        return person.extra.validate();
                    });
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
