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
    this.nationality = {
        value: '',
        isNotWillingToReveal: true,
        isValid: false,
        errorMsg: 'Palun sisesta korrektne rahvus',
        firstBlur: false,
        validate: function() {
            if (!isWillingToReveal) return true;
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.motherTongue = {
        value: '',
        isNotWillingToReveal: true,
        isValid: false,
        errorMsg: 'Palun sisesta korrektne emakeel',
        firstBlur: false,
        validate: function() {
            this.isValid = !!this.value;
            return this.isValid;
        }
    },
    this.foreignCountry = {
        isPrevResidenceInForeignCountry: false,
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
            errorMsg: 'Palun sisesta korrektne aeg',
            firstBlur: false,
            validate: function() {
                this.isValid = !!this.value;
                return this.isValid;
            }
        }
    },
    this.foreignIdCode = {
        isForeignIdCode: false,
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
        }
    },
    this.education = '-',
    this.employment = '-'
}

function Sender() {
    var person = new Person()
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

function FormData() {
    this.address = new Address(),
    this.people = [new Sender(), new Person()]
}

Vue.component('input-group', {
    props: {
        title: String, 
        object: Object, 
        id: String,
        disabled: Boolean
    },
    template: '<div class="form-group"> \
                <label :for="id">{{title}}</label><slot></slot> \
                <input type="text" \
                    :class="[\'form-control\', disabled ? \'\' : (object.isValid ? (object.firstBlur ? \'is-valid\' : \'\') : (object.firstBlur ? \'is-invalid\' : \'\'))]" \
                    :id="id" v-model="object.value" \
                    @keyup="object.validate()" \
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
                <form class="w-100 d-flex flex-wrap"> \
                    <input-group class="col-md-4 col-xs-12" title="Riik" :object.sync="address.country" id="new_address_country"></input-group> \
                    <input-group class="col-md-4 col-xs-12" title="Maakond" :object.sync="address.county" id="new_address_county"></input-group> \
                    <input-group class="col-md-4 col-xs-12" title="Vald/linn, alevik, küla" :object.sync="address.city" id="new_address_city"></input-group> \
                    <input-group class="col-md-8 col-xs-12" title="Tänav/talu, maja nr, korteri nr" :object.sync="address.street" id="new_address_street"></input-group> \
                    <input-group class="col-md-4 col-xs-12" title="Postiindex" :object.sync="address.postalIndex" id="new_address_postal_index"></input-group> \
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
            isInEditMode: true,
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
            }
        }
    },
    template: '<div v-if="!isInEditMode"> \
                <p>Eesnimi: {{person.firstName.value}}</p> \
                <p>Perenimi: {{person.lastName.value}}</p> \
                <p>Isikukood: {{person.idCode.value}}</p> \
               </div> \
               <div class="w-100" v-else> \
                <div class="d-flex flex-wrap"> \
                    <button :class="[\'btn\', index == 0 ? \'col-md-4\' : \'col-md-6\', \'col-sm-12\', {\'btn-primary\': editTab == 0}]" \
                        @click.prevent="editTab = 0">Andmed</button> \
                    <button :class="[\'btn\', index == 0 ? \'col-md-4\' : \'col-md-6\', \'col-sm-12\', {\'btn-primary\': editTab == 1}]" \
                        @click.prevent="editTab = 1">Lisainfo</button> \
                    <button :class="[\'btn\', \'col-md-4\', \'col-sm-12\', {\'btn-primary\': editTab == 2}]" \
                        @click.prevent="editTab = 2" v-if="index == 0">Elukohainfo</button> \
                </div> \
                <div v-if="editTab == 2"> \
                    <div class="form-check"> \
                        <input type="checkbox" class="form-check-input" id="contact_address_is_reg_address_checkbox" v-model="formData.isContactAddressNewAddress"> \
                        <label class="form-check-label" for="contact_address_is_reg_address_checkbox">Sideaadress on sama, mis registreeritav aadress</label> \
                    </div> \
                </div> \
                <div v-else-if="editTab == 1"> \
                    <div class="form-group col-12"> \
                        <input type="checkbox" class="form-check-input" v-model="person.foreignCountry.isPrevResidenceInForeignCountry" :id="\'person_\' + index + \'_foreign_country_checkbox\'"> \
                        <label :for="\'person_\' + index + \'_foreign_country_checkbox\'" class="form-check-label">Kas eelmine elukoht oli välismaal?</label> \
                    </div> \
                    <div class="col-12" v-if="person.foreignCountry.isPrevResidenceInForeignCountry"> \
                        <input-group title="Elukoht välisriigis (riik ja haldusüksus)" :object.sync="person.foreignCountry.addressInForeignCountry" :id="\'person_\' + index + \'_foreign_country\'"></input-group> \
                        <input-group title="Eestist sinna lahkumise aeg" :object.sync="person.foreignCountry.departureTimeFromEstonia" :id="\'person_\' + index + \'_left_estonia_time\'"></input-group> \
                    </div> \
                    <div class="form-group col-12"> \
                        <input type="checkbox" class="form-check-input" v-model="person.foreignIdCode.isForeignIdCode" :id="\'person_\' + index + \'_foreign_idcode_checkbox\'"> \
                        <label :for="\'person_\' + index + \'_foreign_idcode_checkbox\'" class="form-check-label">Kas sul on välisriigi isikukood?</label> \
                    </div> \
                    <div class="col-12" v-if="person.foreignIdCode.isForeignIdCode"> \
                        <input-group title="Isikukoodi väljastanud riik" :object.sync="person.foreignIdCode.foreignCountry" :id="\'person_\' + index + \'_foreign_country_for_idcode\'"></input-group> \
                        <input-group title="Välisriigi isikukood" :object.sync="person.foreignIdCode.idCode" :id="\'person_\' + index + \'_foreign_country_idcode\'"></input-group> \
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
                    <input-group class="col-md-6" title="Eesnimi" :object.sync="person.firstName" :id="\'person_\' + index + \'_firstname\'"></input-group> \
                    <input-group class="col-md-6" title="Perenimi" :object.sync="person.lastName" :id="\'person_\' + index + \'_lastname\'"></input-group> \
                    <input-group class="col-md-4" title="Isikukood" :object.sync="person.idCode" :id="\'person_\' + index + \'_idcode\'"></input-group> \
                    <input-group class="col-md-4" title="Email" :object.sync="person.email" :id="\'person_\' + index + \'_email\'"></input-group> \
                    <input-group class="col-md-4" title="Telefon" :object.sync="person.phone" :id="\'person_\' + index + \'_phone\'"></input-group> \
                    <div class="col-md-6 d-flex flex-wrap"> \
                        <input-group class="w-100" title="Rahvus" :object.sync="person.nationality" :id="\'person_\' + index + \'_nationality\'" :disabled="person.nationality.isNotWillingToReveal"> \
                            <div class="form-check d-inline-block ml-4"> \
                                <input type="checkbox" class="form-check-input" :id="\'person_\' + index + \'_nationality_checkbox\'" v-model="person.nationality.isNotWillingToReveal"> \
                                <label class="form-check-label" :for="\'person_\' + index + \'_nationality_checkbox\'">Ei soovi avaldada</label> \
                            </div> \
                        </input-group> \
                    </div> \
                    <div class="col-md-6 d-flex flex-wrap"> \
                        <input-group class="w-100" title="Emakeel" :object.sync="person.motherTongue" :id="\'person_\' + index + \'_mother_tongue\'" :disabled="person.motherTongue.isNotWillingToReveal"> \
                            <div class="form-check d-inline-block ml-4"> \
                                <input type="checkbox" class="form-check-input" :id="\'person_\' + index + \'_mother_tongue_checkbox\'" v-model="person.motherTongue.isNotWillingToReveal"> \
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
    },
    template: '<div class="w-100"> \
                <div class="row col-12"> \
                    <h4>2. Isikud</h4> \
                </div> \
                <div class="row col-12"> \
                    <form class="w-100"> \
                        <div class="person w-100" v-for="(person, index) in people"> \
                            <h5>{{index == 0 ? \'Esitaja\' : \'Registreeritav isik #\' + index}}</h5> \
                            <person class="w-100" :person.sync="person" :index="index"></person> \
                        </div> \
                    </form> \
                </div> \
               </div>'
})

vm = new Vue({
    el: '#app',
    data: {
        formData: new FormData()
    },
    methods: {}
});
