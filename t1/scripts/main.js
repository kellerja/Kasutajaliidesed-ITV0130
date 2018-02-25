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
    this.validate = function(includeExtra = true) {
        return (!includeExtra || this.extra.validate()) && this.firstName.isValid && 
            this.lastName.isValid && this.phone.isValid && 
            this.email.isValid && this.idCode.isValid;
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
                isActive: false
            },
            {
                isActive: false
            },
            {
                isActive: false
            },
            {
                isActive: false
            },
            {
                isActive: false
            }
        ],
        isTabValid: [false, false, false, false, false]
    },
    methods: {
        addPerson() {
            this.formData.people.push(new Person())
        },
        removePerson(index) {
            this.formData.people.splice(index, 1);
        },
        moveToTab(tabNr) {
            if (tabNr > this.progressionTab) {
                this.progressionTab = tabNr;
            }
            this.tab = tabNr;
            this.validate(this.tab);
        },
        validate(tabNr) {
            if (tabNr > this.numOfTabs) {
                return;
            }
            for (tab = 1; tab <= tabNr; tab++) {
                switch(tab) {
                    case 1:
                        this.isTabValid[tab - 1] = this.formData.people[0].validate(false);
                        break;
                    case 2:
                        this.isTabValid[tab - 1] = this.formData.newAddress.validate();
                        break;
                    case 3:
                        this.isTabValid[tab - 1] = this.formData.people.slice(1).every(function(person){
                            return person.validate(false);
                        });
                        break;
                    case 4:
                        this.isTabValid[tab - 1] = this.formData.isSubmitterAlsoNewAddressResident || 
                            this.formData.isContactAddressNewAddress || 
                            (this.formData.contactAddress.address.validate() && 
                                (this.formData.contactAddress.isValidFrom || this.formData.contactAddress.validFrom.isValid) &&
                                (this.formData.contactAddress.isValidTo || this.formData.contactAddress.validTo.isValid)
                            );
                        break;
                    case 5: 
                        this.isTabValid[tab - 1] = this.formData.people.every(function(person) {
                            return person.extra.validate();
                        });
                        break;
                }
            }
            return this.isTabValid[tabNr - 1];
        }
    },
    components: {
    }
});
