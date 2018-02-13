vm = new Vue({
    el: '#app',
    data: {
        tabNr: 0,
        cats: [
            {
                name: "Kitty",
                birthYear: 2006
            },
            {
                name: "Kaati",
                birthYear: 2014
            }
        ],
        newCat: {
            name: "",
            birthYear: null
        }
    },
    methods: {
        switchTab: function(newTabNr) {
            this.tabNr = newTabNr;
        },
        addCat: function() {
            if (!this.newCat.name || !this.newCat.birthYear) {
                return;
            }
            this.cats.push(this.newCat);
            this.newCat = {
                name: "",
                birthYear: null
            }
        },
        removeCat: function(index) {
            this.cats.splice(index, 1);
        }
    }
});
