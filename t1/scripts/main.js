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
                            <person ref="person" class="w-100" :person.sync="person" :index="index"></person> \
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
        formData: new FormData(),
        isCompleted: false
    },
    methods: {
        forceValidate(object) {
            for (key in object) {
                const field = object[key];
                if (field && field.hasOwnProperty('firstBlur')) {
                    field.firstBlur = true;
                    field.validate();
                } else if (field instanceof Object) {
                    this.forceValidate(field);
                }
            }
        },
        validate() {
            var isValid = this.formData.address.validate();
            if (!isValid) {
                document.getElementById('app').scrollIntoView();
                this.forceValidate(this.formData.address);
            }
            var firstScroll = isValid;
            this.formData.people.forEach((person, index) => {
                this.forceValidate(person);
                const isPersonValid = person.validate();
                if (!isPersonValid && firstScroll) {
                    const personController = this.$refs.people.$refs.person[index];
                    if (!personController.validateDetailsTab()) {
                        personController.editTab = 0;
                    } else if (!personController.validateExtraDataTab()) {
                        personController.editTab = 1;
                    } else if (index == 0 && !personController.validateContactAddressTab()) {
                        personController.editTab = 2;
                    }
                    document.getElementsByClassName('person')[index].scrollIntoView();
                    firstScroll = false;
                }
                isValid = isValid && isPersonValid;
            });
            if (!isValid) {
                return;
            }
            this.isCompleted = true;
        }
    }
});
