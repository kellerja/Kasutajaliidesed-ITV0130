function Person(isFormFiller=false) {
    this.isFormFiller = isFormFiller,
    this.firstName = {
        value: '',
        isValid: function() {
            return !!this.value;
        },
        errorMsg: function() {
            return 'Palun sisesta eesnimi';
        },
        tooltip: null
    },
    this.lastName = {
        value: '',
        isValid: function() {
            return !!this.value;
        },
        errorMsg: function() {
            return 'Palun sisesta perenimi';
        },
        tooltip: null
    },
    this.phone = {
        value: '',
        isValid: function() {
            return !!this.value;
        },
        errorMsg: function() {
            return 'Palun sisesta telefoni number';
        },
        tooltip: null
    },
    this.email = {
        value: '',
        isValid: function() {
            return !!this.value;
        },
        errorMsg: function() {
            return 'Palun sisesta email';
        },
        tooltip: null
    },
    this.idCode = {
        value: '',
        isValid: function() {
            return !!this.value;
        },
        errorMsg: function() {
            return 'Palun sisesta isikukood';
        },
        tooltip: null
    }
}

Vue.directive('validate', {
    inserted: function(el, binding, vnode) {
        var pop = document.createElement('div');
        var popMsg = document.createTextNode(binding.value.errorMsg());
        pop.classList.add('error');
        pop.appendChild(popMsg);
        el.parentNode.appendChild(pop);
        binding.value.tooltip = new Popper(el, pop, {
            placement: 'right',
            removeOnDestroy: true
        });
    },
    update: function(el, binding, vnode, oldVnode) {
        if (binding.value.isValid()) {
            binding.value.tooltip.popper.classList.remove('visible');            
            binding.value.tooltip.popper.classList.add('invisible');
        } else {
            binding.value.tooltip.popper.classList.remove('invisible');            
            binding.value.tooltip.popper.classList.add('visible');            
        }
    },
    unbind: function(el, binding, vnode) {
        var element = binding.value.tooltip.popper;
        element.parentNode.removeChild(element);
    }
})

vm = new Vue({
    el: '#app',
    data: {
        formData: {
            people: [new Person(true)]
        }
    },
    methods: {
        addPerson() {
            this.formData.people.push(new Person())
        },
        removePerson(index) {
            this.formData.people.splice(index, 1);
        },
        moveToTab(tabNr) {
            console.log(tabNr);
        }
    },
    components: {
    }
});
