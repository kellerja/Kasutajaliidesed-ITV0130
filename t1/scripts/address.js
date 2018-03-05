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
