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
    this.employment = '-'
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
    this.extra = new ExtraData()
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
        tab: 3,
        numOfTabs: 4
    },
    methods: {
        addPerson() {
            this.formData.people.push(new Person())
        },
        removePerson(index) {
            this.formData.people.splice(index, 1);
        },
        moveToTab(tabNr) {
            this.tab = tabNr;
        }
    },
    components: {
    }
});
