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
        },
        changeTabAndScrollToTop(tabNr) {
            this.editTab = tabNr;
            this.$el.scrollIntoView();
        }
    },
    computed: {
        isHelperNavigationRequired() {
            return window.innerWidth && window.innerWidth <= 768;
        }
    },
    template: '<div class="w-100"> \
                <div class="d-flex flex-wrap mb-3"> \
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
                        <div class="custom-control custom-checkbox"> \
                            <input type="checkbox" class="custom-control-input" id="contact_address_is_reg_address_checkbox" v-model="person.contactAddress.isNotSameAsRegAddress" @change="validateContactAddressTab()"> \
                            <label class="custom-control-label question-checkbox-label" for="contact_address_is_reg_address_checkbox">Sideaadress on sama, mis registreeritav aadress</label> \
                        </div> \
                        <div class="w-100 d-flex flex-wrap" v-if="!person.contactAddress.isNotSameAsRegAddress"> \
                            <input-group class="col-md-4 col-xs-12" title="Riik" :object.sync="person.contactAddress.country" id="contact_address_country" @validate="validateContactAddressTab()"></input-group> \
                            <input-group class="col-md-4 col-xs-12" title="Maakond" :object.sync="person.contactAddress.county" id="contact_address_county" @validate="validateContactAddressTab()"></input-group> \
                            <input-group class="col-md-4 col-xs-12" title="Vald/linn, alevik, küla" :object.sync="person.contactAddress.city" id="contact_address_city" @validate="validateContactAddressTab()"></input-group> \
                            <input-group class="col-md-8 col-xs-12" title="Tänav/talu, maja nr, korteri nr" :object.sync="person.contactAddress.street" id="contact_address_street" @validate="validateContactAddressTab()"></input-group> \
                            <input-group class="col-md-4 col-xs-12" title="Postiindeks" :object.sync="person.contactAddress.postalIndex" id="contact_address_postal_index" @validate="validateContactAddressTab()"></input-group> \
                            <div class="col-md-6"> \
                                <div class="custom-control custom-checkbox"> \
                                    <input type="checkbox" class="custom-control-input" id="contact_address_from_checkbox" v-model="person.contactAddress.isValidFromKnown" @change="validateContactAddressTab()"> \
                                    <label class="custom-control-label question-checkbox-label" for="contact_address_from_checkbox">Kas sideaadressi kasutuselevõtmisel on algusaeg?</label> \
                                </div> \
                                <input-group title="Kehtib alates" input-type="date" :object.sync="person.contactAddress.validFrom" id="contact_address_from" v-if="person.contactAddress.isValidFromKnown" @validate="validateContactAddressTab()"></input-group> \
                            </div> \
                            <div class="col-md-6"> \
                                <div class="custom-control custom-checkbox"> \
                                    <input type="checkbox" class="custom-control-input" id="contact_address_to_checkbox" v-model="person.contactAddress.isValidToKnown" @change="validateContactAddressTab()"> \
                                    <label class="custom-control-label question-checkbox-label" for="contact_address_to_checkbox">Kas sideaadressi kasutuse lõpetamisel on teada lõppaeg?</label> \
                                </div> \
                                <input-group title="Kehtib kuni" input-type="date" :object.sync="person.contactAddress.validTo" id="contact_address_to" v-if="person.contactAddress.isValidToKnown" @validate="validateContactAddressTab()"></input-group> \
                            </div> \
                        </div> \
                    </div> \
                    <button class="btn col-12" @click.prevent="changeTabAndScrollToTop(1)" v-if="isHelperNavigationRequired"> \
                        <i class="material-icons md-18 align-middle">keyboard_arrow_left</i> \
                        <span class="align-middle">Lisainfo</span> \
                    </button> \
                </div> \
                <div v-else-if="editTab == 1"> \
                    <div class="custom-control custom-checkbox col-12"> \
                        <input type="checkbox" class="custom-control-input" v-model="person.foreignCountry.isPrevResidenceInForeignCountry" :id="\'person_\' + index + \'_foreign_country_checkbox\'" @change="validateExtraDataTab()"> \
                        <label :for="\'person_\' + index + \'_foreign_country_checkbox\'" class="custom-control-label question-checkbox-label">Kas eelmine elukoht oli välismaal?</label> \
                    </div> \
                    <div class="col-12 pb-2" v-if="person.foreignCountry.isPrevResidenceInForeignCountry"> \
                        <input-group title="Elukoht välisriigis (riik ja haldusüksus)" :object.sync="person.foreignCountry.addressInForeignCountry" :id="\'person_\' + index + \'_foreign_country\'" @validate="validateExtraDataTab()"></input-group> \
                        <input-group title="Eestist sinna lahkumise aeg" input-type="date" :object.sync="person.foreignCountry.departureTimeFromEstonia" :id="\'person_\' + index + \'_left_estonia_time\'" @validate="validateExtraDataTab()"></input-group> \
                    </div> \
                    <div class="custom-control custom-checkbox col-12 mt-2"> \
                        <input type="checkbox" class="custom-control-input" v-model="person.foreignIdCode.isForeignIdCode" :id="\'person_\' + index + \'_foreign_idcode_checkbox\'" @change="validateExtraDataTab()"> \
                        <label :for="\'person_\' + index + \'_foreign_idcode_checkbox\'" class="custom-control-label question-checkbox-label">Kas sul on välisriigi isikukood?</label> \
                    </div> \
                    <div class="col-12 pb-3" v-if="person.foreignIdCode.isForeignIdCode"> \
                        <input-group title="Isikukoodi väljastanud riik" :object.sync="person.foreignIdCode.foreignCountry" :id="\'person_\' + index + \'_foreign_country_for_idcode\'" @validate="validateExtraDataTab()"></input-group> \
                        <input-group title="Välisriigi isikukood" :object.sync="person.foreignIdCode.idCode" :id="\'person_\' + index + \'_foreign_country_idcode\'" @validate="validateExtraDataTab()"></input-group> \
                    </div> \
                    <div class="form-group col-12 mt-2"> \
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
                    <div class="w-100 d-flex"> \
                        <button :class="[\'btn\', index == 0 ? \'col-6\' : \'col-12\']" @click.prevent="changeTabAndScrollToTop(0)" v-if="isHelperNavigationRequired"> \
                            <i class="material-icons md-18 align-middle">keyboard_arrow_left</i> \
                            <span class="align-middle">Andmed</span> \
                        </button> \
                        <button class="btn col-6" @click.prevent="changeTabAndScrollToTop(2)" v-if="isHelperNavigationRequired && index == 0" :disabled="person.isAddressRegistration"> \
                            <span class="align-middle">Sideaadress</span> \
                            <i class="material-icons md-18 align-middle">keyboard_arrow_right</i> \
                        </button> \
                    </div> \
                </div> \
                <div class="d-flex flex-wrap" v-else> \
                    <input-group class="col-md-6" title="Eesnimi" :object.sync="person.firstName" :id="\'person_\' + index + \'_firstname\'" @validate="validateDetailsTab()"></input-group> \
                    <input-group class="col-md-6" title="Perenimi" :object.sync="person.lastName" :id="\'person_\' + index + \'_lastname\'" @validate="validateDetailsTab()"></input-group> \
                    <input-group class="col-md-4" title="Isikukood" pattern="\\d*" :object.sync="person.idCode" :id="\'person_\' + index + \'_idcode\'" @validate="validateDetailsTab()"></input-group> \
                    <input-group class="col-md-4" title="Email" input-type="email" :object.sync="person.email" :id="\'person_\' + index + \'_email\'" @validate="validateDetailsTab()"></input-group> \
                    <input-group class="col-md-4" title="Telefon" input-type="tel" :object.sync="person.phone" :id="\'person_\' + index + \'_phone\'" @validate="validateDetailsTab()"></input-group> \
                    <div class="custom-control custom-checkbox col-12" v-if="index == 0"> \
                        <input type="checkbox" class="custom-control-input question-checkbox" id="person_new_registration_checkbox" v-model="person.isAddressRegistration" @change="validateContactAddressTab()"> \
                        <label class="custom-control-label question-checkbox-label" for="person_new_registration_checkbox">Esitan uue elukoha ka enda kohta</label> \
                    </div> \
                    <div class="col-md-6 d-flex flex-wrap mt-3"> \
                        <input-group class="w-100" title="Rahvus" :object.sync="person.nationality" :id="\'person_\' + index + \'_nationality\'" :disabled="person.nationality.isNotWillingToReveal" @validate="validateDetailsTab()"> \
                            <div class="custom-control custom-checkbox d-inline-block ml-4"> \
                                <input type="checkbox" class="custom-control-input" :id="\'person_\' + index + \'_nationality_checkbox\'" v-model="person.nationality.isNotWillingToReveal" @change="validateDetailsTab()"> \
                                <label class="custom-control-label reveal-checkbox-label" :for="\'person_\' + index + \'_nationality_checkbox\'">Ei soovi avaldada</label> \
                            </div> \
                        </input-group> \
                    </div> \
                    <div class="col-md-6 d-flex flex-wrap mt-3"> \
                        <input-group class="w-100" title="Emakeel" :object.sync="person.motherTongue" :id="\'person_\' + index + \'_mother_tongue\'" :disabled="person.motherTongue.isNotWillingToReveal" @validate="validateDetailsTab()"> \
                            <div class="custom-control custom-checkbox d-inline-block ml-4"> \
                                <input type="checkbox" class="custom-control-input" :id="\'person_\' + index + \'_mother_tongue_checkbox\'" v-model="person.motherTongue.isNotWillingToReveal" @change="validateDetailsTab()"> \
                                <label class="custom-control-label reveal-checkbox-label" :for="\'person_\' + index + \'_mother_tongue_checkbox\'">Ei soovi avaldada</label> \
                            </div> \
                        </input-group> \
                    </div> \
                    <button class="btn col-12" @click.prevent="changeTabAndScrollToTop(1)" v-if="isHelperNavigationRequired"> \
                        <span class="align-middle">Lisainfo</span> \
                        <i class="material-icons md-18 align-middle">keyboard_arrow_right</i> \
                    </button> \
                </div> \
               </div>'
})
