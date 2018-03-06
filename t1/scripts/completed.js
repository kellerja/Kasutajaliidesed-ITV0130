Vue.component('completed', {
    props: ['formData'],
    methods: {
        finish() {
            window.location.reload();
        }
    },
    template: '<div> \
                <div class="complete mt-4"> \
                    <h2>Elukohateade esitatud</h2> \
                    <h3 class="mt-4">Uus aadress</h3> \
                    <p>{{formData.address.country.value}}, {{formData.address.county.value}}, {{formData.address.city.value}}</p> \
                    <p>{{formData.address.street.value}} ({{formData.address.postalIndex.value}})</p> \
                    <h3>Sinna registreeritud isikud</h3> \
                    <p v-if="formData.people[0].isAddressRegistration">{{formData.people[0].firstName.value}} {{formData.people[0].lastName.value}}</p> \
                    <p v-for="person in formData.people.slice(1)">{{person.firstName.value}} {{person.lastName.value}}</p> \
                    <div v-if="!formData.people[0].isAddressRegistration"> \
                        <h3>Esitaja andmed</h3> \
                        <p>{{formData.people[0].firstName.value}} {{formData.people[0].lastName.value}}</p> \
                        <h3>Esitaja sideaadress</h3> \
                        <div v-if="formData.people[0].contactAddress.isNotSameAsRegAddress"> \
                            <p>{{formData.people[0].contactAddress.country.value}}, {{formData.people[0].contactAddress.county.value}}, {{formData.people[0].contactAddress.city.value}}</p> \
                            <p>{{formData.people[0].contactAddress.street.value}} ({{formData.people[0].contactAddress.postalIndex.value}})</p> \
                        </div> \
                        <div v-else> \
                            <p>{{formData.address.country.value}}, {{formData.address.county.value}}, {{formData.address.city.value}}</p> \
                            <p>{{formData.address.street.value}} ({{formData.address.postalIndex.value}})</p> \
                        </div> \
                    </div> \
                </div> \
                <button @click="finish()" class="btn col mt-3">Lõpeta ülevaatus</button> \
               </div>'
})
