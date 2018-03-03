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
        self: this,
        value: '',
        isValid: false,
        errorMsg: 'Palun sisesta postiindeks',
        firstBlur: false,
        validate: function() {
            this.isValid = !!this.value;
            errorMsg: 'Palun sisesta postiindeks';
            if (this.self.country.value.match(/^(estonia|eesti)$/i)) {
                this.isValid = this.value.match(/^\d{5}$/);
                this.errorMsg = 'Eesti postiindeks koosneb kuuest numbrist';
            }
            return this.isValid;
        }
    },
    this.ownership = {
        value: '0',
        proof: ''
    },
    this.validate = function() {
        return this.country.validate() && this.county.validate() && 
            this.city.validate() && this.street.validate() && 
            this.postalIndex.validate();
    }
}

function FormData() {
    this.address = new Address(),
    this.people = [new Sender()]
}

Vue.component('input-group', {
    props: {
        title: String, 
        object: Object, 
        id: String,
        disabled: Boolean,
        inputType: {
            type: String,
            default: 'text'
        }
    },
    methods: {
        handleKeyUpEvent: function() {
            const prevIsValid = this.object.isValid;
            const newIsValid = this.object.validate();
            if (prevIsValid != newIsValid) {
                this.$emit('validate');
            }
        }
    },
    template: '<div class="form-group"> \
                <label :for="id">{{title}}</label><slot></slot> \
                <input :type="inputType" \
                    :class="[\'form-control\', disabled ? \'\' : (object.isValid ? (object.firstBlur ? \'is-valid\' : \'\') : (object.firstBlur ? \'is-invalid\' : \'\'))]" \
                    :id="id" v-model="object.value" \
                    @keyup="handleKeyUpEvent()" @change="handleKeyUpEvent()" \
                    @blur.once="object.firstBlur = true" :disabled="disabled"> \
                <small class="invalid-feedback">{{object.errorMsg}}</small> \
              </div>'
})


Vue.component('new-address', {
    props: {
        address: Object
    },
    data: function() {
        return {
            newAddressOwnershipOptionsKeyOrder: [0, 1, 2, 3, 4],
            newAddressOwnershipOptions: {
                0: 'Olen ruumi (kaas)omanik',
                1: 'Lisan üürilepingu',
                2: 'Ruumi omanik annab ise elukohateatele nõusoleku',
                3: 'Lisan ruumi omaniku nõusoleku eraldi paberil',
                4: 'Ruumi kasutamise muu alus'
            }            
        }
    },
    template: '<div class="w-100"><div class="row col-12"> \
                 <h4>1. Uue elukoha aadress</h4> \
               </div> \
               <div class="row col-12"> \
                <form class="w-100 d-flex flex-wrap address"> \
                    <input-group class="col-md-4 col-xs-12" title="Riik" :object.sync="address.country" id="new_address_country"></input-group> \
                    <input-group class="col-md-4 col-xs-12" title="Maakond" :object.sync="address.county" id="new_address_county"></input-group> \
                    <input-group class="col-md-4 col-xs-12" title="Vald/linn, alevik, küla" :object.sync="address.city" id="new_address_city"></input-group> \
                    <input-group class="col-md-8 col-xs-12" title="Tänav/talu, maja nr, korteri nr" :object.sync="address.street" id="new_address_street"></input-group> \
                    <input-group class="col-md-4 col-xs-12" title="Postiindeks" :object.sync="address.postalIndex" id="new_address_postal_index"></input-group> \
                    <div class="form-group col-md-5 col-xs-12"> \
                        <label for="new_address_ownership">Ruumi kasutamisõigus</label> \
                        <select class="form-control" id="new_address_ownership" v-model="address.ownership.value"> \
                            <option v-for="key in newAddressOwnershipOptionsKeyOrder" :value="key">{{newAddressOwnershipOptions[key]}}</option> \
                        </select> \
                    </div> \
                    <div class="form-group col-md-5 col-xs-12" v-if="address.ownership.value == \'1\' || address.ownership.value == \'3\'"> \
                        <label for="new_address_ownership_proof">Lisa {{address.ownership.value == \'1\' ? \'üürileping\' : \'ruumi omaniku nõusolek\'}}</label> \
                        <input type="file" class="form-control-file" id="new_address_ownership_proof" multiple> \
                    </div> \
                </form> \
            </div></div>'
})

Vue.component('person', {
    props: {
        person: Object,
        index: Number
    },
    data: function() {
        return {
            editTab: 0,
            educationOptionsKeysOrder: ['-', '0', '1', '2', '35', '3', '4', '5', '6', '7', '8'],
            educationOptions: {
                '-': 'Ei soovi avaldada',
                '0': 'Alusharidus (koolieelne haridus) või alghariduseta',
                '1': 'Põhiharidus (põhikooli 1.-6. klass), varasem algharidus',
                '2': 'Põhiharidus (põhikooli 8.-9. klass)',
                '35': 'Kutseharidus või kutseõpe (sh keskeri- või tehnikumiharidus) põhihariduse baasil',
                '3': 'Keskharidus',
                '4': 'Kutseharidus või kutseõpe keskhariduse baasil',
                '5': 'Keskeri- ja tehnikumiharidus keskhariduse baasil',
                '6': 'Bakalaureus või sellega võrdsustatud haridus (rakendus- ja kutsekõrgharidus, diplomiõpe)',
                '7': 'Magister või sellega võrdsustatud haridus',
                '8': 'Doktor või sellega võrdsustatud haridus'
            },
            employmentOptionsKeyOrder: ['-', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            employmentOptions: {
                '-': 'Ei soovi avaldada',
                'A': 'töötav',
                'B': 'kodune',
                'C': 'töötu/tööd otsiv',
                'D': 'ajateenija',
                'E': '(üli)õpilane',
                'F': 'pensionär',
                'G': 'lapsehoolduspuhkusel',
                'H': 'muu mittetöötav'
            },
            isDetailsTabValid: false,
            isExtraDataTabValid: false,
            isContactAddressTabValid: true
        }
    },
    methods: {
        validateDetailsTab: function() {
            this.isDetailsTabValid = this.person.firstName.validate() && this.person.lastName.validate() &&
                this.person.idCode.validate() && this.person.email.validate() && this.person.phone.validate() &&
                (this.person.nationality.isNotWillingToReveal || this.person.nationality.validate()) &&
                (this.person.motherTongue.isNotWillingToReveal || this.person.motherTongue.validate());
            return this.isDetailsTabValid;
        },
        validateExtraDataTab: function() {
            this.isExtraDataTabValid = (
                !this.person.foreignCountry.isPrevResidenceInForeignCountry ||
                (
                    this.person.foreignCountry.addressInForeignCountry.validate() && this.person.foreignCountry.departureTimeFromEstonia.validate()
                )
            ) &&
            (
                !this.person.foreignIdCode.isForeignIdCode ||
                (
                    this.person.foreignIdCode.foreignCountry.validate() && this.person.foreignIdCode.idCode.validate()
                )
            );
            return this.isExtraDataTabValid;
        },
        validateContactAddressTab: function() {
            this.isContactAddressTabValid = this.person.isAddressRegistration || this.person.contactAddress.isNotSameAsRegAddress || (
                this.person.contactAddress.country.validate() && this.person.contactAddress.county.validate() && this.person.contactAddress.city.validate() &&
                this.person.contactAddress.street.validate() && this.person.contactAddress.postalIndex.validate() && (
                    !this.person.contactAddress.isValidFromKnown || (this.person.contactAddress.isValidFromKnown && this.person.contactAddress.validFrom.validate())
                ) && (
                    !this.person.contactAddress.isValidToKnown || (this.person.contactAddress.isValidToKnown && this.person.contactAddress.validTo.validate())
                )
            );
            return this.isContactAddressTabValid;
        }
    },
    template: '<div class="w-100"> \
                <div class="d-flex flex-wrap"> \
                    <div :class="[index == 0 ? \'col-md-4\' : \'col-md-6\', \'col-sm-12\']"> \
                        <button :class="[\'btn\', \'w-100\', {\'btn-primary\': editTab == 0}]" \
                            @click.prevent="editTab = 0"> \
                                <i class="material-icons light align-middle" aria-hidden="true">{{isDetailsTabValid ? \'done\' : \'clear\'}}</i> \
                                Andmed \
                        </button> \
                    </div> \
                    <div :class="[index == 0 ? \'col-md-4\' : \'col-md-6\', \'col-sm-12\']"> \
                        <button :class="[\'btn\', \'w-100\', {\'btn-primary\': editTab == 1}]" \
                            @click.prevent="editTab = 1"> \
                                <i class="material-icons light align-middle" aria-hidden="true">{{isExtraDataTabValid ? \'done\' : \'clear\'}}</i> \
                                Lisainfo \
                        </button> \
                    </div> \
                    <div class="col-md-4 col-sm-12" v-if="index == 0"> \
                        <button :class="[\'btn\', \'w-100\', {\'btn-primary\': editTab == 2}]" \
                            @click.prevent="editTab = 2" :disabled="person.isAddressRegistration"> \
                                <i class="material-icons light align-middle" aria-hidden="true">{{isContactAddressTabValid ? \'done\' : \'clear\'}}</i> \
                                Sideaadress \
                        </button> \
                    </div> \
                </div> \
                <div v-if="editTab == 2"> \
                    <div v-if="!person.isAddressRegistration"> \
                        <div class="form-check"> \
                            <input type="checkbox" class="form-check-input" id="contact_address_is_reg_address_checkbox" v-model="person.contactAddress.isNotSameAsRegAddress" @change="validateContactAddressTab()"> \
                            <label class="form-check-label" for="contact_address_is_reg_address_checkbox">Sideaadress on sama, mis registreeritav aadress</label> \
                        </div> \
                        <div class="w-100 d-flex flex-wrap" v-if="!person.contactAddress.isNotSameAsRegAddress"> \
                            <input-group class="col-md-4 col-xs-12" title="Riik" :object.sync="person.contactAddress.country" id="contact_address_country" @validate="validateContactAddressTab()"></input-group> \
                            <input-group class="col-md-4 col-xs-12" title="Maakond" :object.sync="person.contactAddress.county" id="contact_address_county" @validate="validateContactAddressTab()"></input-group> \
                            <input-group class="col-md-4 col-xs-12" title="Vald/linn, alevik, küla" :object.sync="person.contactAddress.city" id="contact_address_city" @validate="validateContactAddressTab()"></input-group> \
                            <input-group class="col-md-8 col-xs-12" title="Tänav/talu, maja nr, korteri nr" :object.sync="person.contactAddress.street" id="contact_address_street" @validate="validateContactAddressTab()"></input-group> \
                            <input-group class="col-md-4 col-xs-12" title="Postiindeks" :object.sync="person.contactAddress.postalIndex" id="contact_address_postal_index" @validate="validateContactAddressTab()"></input-group> \
                            <div class="col-md-6"> \
                                <div class="form-check"> \
                                    <input type="checkbox" class="form-check-input" id="contact_address_from_checkbox" v-model="person.contactAddress.isValidFromKnown" @change="validateContactAddressTab()"> \
                                    <label class="form-check-label" for="contact_address_from_checkbox">Kas sideaadressi kasutuselevõtmisel on algusaeg?</label> \
                                </div> \
                                <input-group title="Kehtib alates" input-type="date" :object.sync="person.contactAddress.validFrom" id="contact_address_from" v-if="person.contactAddress.isValidFromKnown" @validate="validateContactAddressTab()"></input-group> \
                            </div> \
                            <div class="col-md-6"> \
                                <div class="form-check"> \
                                    <input type="checkbox" class="form-check-input" id="contact_address_to_checkbox" v-model="person.contactAddress.isValidToKnown" @change="validateContactAddressTab()"> \
                                    <label class="form-check-label" for="contact_address_to_checkbox">Kas sideaadressi kasutuse lõpetamisel on teada lõppaeg?</label> \
                                </div> \
                                <input-group title="Kehtib kuni" input-type="date" :object.sync="person.contactAddress.validTo" id="contact_address_to" v-if="person.contactAddress.isValidToKnown" @validate="validateContactAddressTab()"></input-group> \
                            </div> \
                        </div> \
                    </div> \
                </div> \
                <div v-else-if="editTab == 1"> \
                    <div class="form-group col-12"> \
                        <input type="checkbox" class="form-check-input" v-model="person.foreignCountry.isPrevResidenceInForeignCountry" :id="\'person_\' + index + \'_foreign_country_checkbox\'" @change="validateExtraDataTab()"> \
                        <label :for="\'person_\' + index + \'_foreign_country_checkbox\'" class="form-check-label">Kas eelmine elukoht oli välismaal?</label> \
                    </div> \
                    <div class="col-12" v-if="person.foreignCountry.isPrevResidenceInForeignCountry"> \
                        <input-group title="Elukoht välisriigis (riik ja haldusüksus)" :object.sync="person.foreignCountry.addressInForeignCountry" :id="\'person_\' + index + \'_foreign_country\'" @validate="validateExtraDataTab()"></input-group> \
                        <input-group title="Eestist sinna lahkumise aeg" input-type="date" :object.sync="person.foreignCountry.departureTimeFromEstonia" :id="\'person_\' + index + \'_left_estonia_time\'" @validate="validateExtraDataTab()"></input-group> \
                    </div> \
                    <div class="form-group col-12"> \
                        <input type="checkbox" class="form-check-input" v-model="person.foreignIdCode.isForeignIdCode" :id="\'person_\' + index + \'_foreign_idcode_checkbox\'" @change="validateExtraDataTab()"> \
                        <label :for="\'person_\' + index + \'_foreign_idcode_checkbox\'" class="form-check-label">Kas sul on välisriigi isikukood?</label> \
                    </div> \
                    <div class="col-12" v-if="person.foreignIdCode.isForeignIdCode"> \
                        <input-group title="Isikukoodi väljastanud riik" :object.sync="person.foreignIdCode.foreignCountry" :id="\'person_\' + index + \'_foreign_country_for_idcode\'" @validate="validateExtraDataTab()"></input-group> \
                        <input-group title="Välisriigi isikukood" :object.sync="person.foreignIdCode.idCode" :id="\'person_\' + index + \'_foreign_country_idcode\'" @validate="validateExtraDataTab()"></input-group> \
                    </div> \
                    <div class="form-group col-12"> \
                        <label :for="\'person_\' + index + \'_education\'">Omandatud kõrgeim haridustase</label> \
                        <select class="form-control" v-model="person.education" :id="\'person_\' + index + \'_education\'"> \
                            <option v-for="key in educationOptionsKeysOrder" :value="key">{{educationOptions[key]}}</option> \
                        </select> \
                    </div> \
                    <div class="form-group col-12"> \
                        <label :for="\'person_\' + index + \'_employment\'">Sotsiaal-majanduslik seisund</label> \
                        <select class="form-control" v-model="person.employment" :id="\'person_\' + index + \'_employment\'"> \
                            <option v-for="key in employmentOptionsKeyOrder" :value="key">{{employmentOptions[key]}}</option> \
                        </select> \
                    </div> \
                </div> \
                <div class="d-flex flex-wrap" v-else> \
                    <input-group class="col-md-6" title="Eesnimi" :object.sync="person.firstName" :id="\'person_\' + index + \'_firstname\'" @validate="validateDetailsTab()"></input-group> \
                    <input-group class="col-md-6" title="Perenimi" :object.sync="person.lastName" :id="\'person_\' + index + \'_lastname\'" @validate="validateDetailsTab()"></input-group> \
                    <input-group class="col-md-4" title="Isikukood" :object.sync="person.idCode" :id="\'person_\' + index + \'_idcode\'" @validate="validateDetailsTab()"></input-group> \
                    <input-group class="col-md-4" title="Email" input-type="email" :object.sync="person.email" :id="\'person_\' + index + \'_email\'" @validate="validateDetailsTab()"></input-group> \
                    <input-group class="col-md-4" title="Telefon" input-type="tel" :object.sync="person.phone" :id="\'person_\' + index + \'_phone\'" @validate="validateDetailsTab()"></input-group> \
                    <div class="form-check col-12" v-if="index == 0"> \
                        <input type="checkbox" class="form-check-input" id="person_new_registration_checkbox" v-model="person.isAddressRegistration" @change="validateContactAddressTab()"> \
                        <label class="form-check-label" for="person_new_registration_checkbox">Esitan uue elukoha ka enda kohta</label> \
                    </div> \
                    <div class="col-md-6 d-flex flex-wrap"> \
                        <input-group class="w-100" title="Rahvus" :object.sync="person.nationality" :id="\'person_\' + index + \'_nationality\'" :disabled="person.nationality.isNotWillingToReveal" @validate="validateDetailsTab()"> \
                            <div class="form-check d-inline-block ml-4"> \
                                <input type="checkbox" class="form-check-input" :id="\'person_\' + index + \'_nationality_checkbox\'" v-model="person.nationality.isNotWillingToReveal" @change="validateDetailsTab()"> \
                                <label class="form-check-label" :for="\'person_\' + index + \'_nationality_checkbox\'">Ei soovi avaldada</label> \
                            </div> \
                        </input-group> \
                    </div> \
                    <div class="col-md-6 d-flex flex-wrap"> \
                        <input-group class="w-100" title="Emakeel" :object.sync="person.motherTongue" :id="\'person_\' + index + \'_mother_tongue\'" :disabled="person.motherTongue.isNotWillingToReveal" @validate="validateDetailsTab()"> \
                            <div class="form-check d-inline-block ml-4"> \
                                <input type="checkbox" class="form-check-input" :id="\'person_\' + index + \'_mother_tongue_checkbox\'" v-model="person.motherTongue.isNotWillingToReveal" @change="validateDetailsTab()"> \
                                <label class="form-check-label" :for="\'person_\' + index + \'_mother_tongue_checkbox\'">Ei soovi avaldada</label> \
                            </div> \
                        </input-group> \
                    </div> \
                </div> \
               </div>'
})

Vue.component('people', {
    props: {
        people: Array
    },
    data: function() {
        return {};
    },
    methods: {
        addPerson() {
            this.people.push(new Person());
        },
        removePerson(index) {
            if (index == 0) return;
            this.people.splice(index, 1);
        },
        validate() {
            vm.validate();
        }
    },
    template: '<div class="w-100"> \
                <div class="row col-12"> \
                    <h4>2. Isikud</h4> \
                </div> \
                <div class="row col-12"> \
                    <form class="w-100"> \
                        <div class="person w-100" v-for="(person, index) in people"> \
                            <div class="d-flex flex-wrap p-2"> \
                                <h5>{{index == 0 ? \'Esitaja\' : \'Registreeritav isik #\' + index}}</h5> \
                                <button class="btn btn-danger ml-4" @click.prevent="removePerson(index)" tabindex="-1" v-if="index > 0">Eemalda isik</button> \
                            </div> \
                            <person class="w-100" :person.sync="person" :index="index"></person> \
                        </div> \
                        <button class="col-12 btn" @click.prevent="addPerson()">Lisa isik</button> \
                        <input class="col-12 btn mt-3" type="submit" @click.prevent="validate()" value="Saada"> \
                    </form> \
                </div> \
               </div>'
})

vm = new Vue({
    el: '#app',
    data: {
        formData: new FormData()
    },
    methods: {
        validate() {
            const isValid = this.formData.address.validate() && this.formData.people.every(function(person, index) {
                return person.validate();
            });
        }
    }
});
