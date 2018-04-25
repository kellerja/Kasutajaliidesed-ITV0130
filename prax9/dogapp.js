Vue.use(Vuex);

/* List view is already a component */

ListView = Vue.component('list-view', (
{
  data: function() {
    return {}
  },
  computed: {
    getAlchemists() {
      let listToDisplay = [];
      if (this.$route.query.element) {
        listToDisplay = this.$store.getters.getAlchemistsByElement(this.$route.query.element);
      } else {
        listToDisplay = this.$store.getters.getAllAlchemists;
      }
      return listToDisplay;
    }
  },
  template: `<div class="two columns"><ul>
              <list-item v-for="item in getAlchemists" :key="item.id" :idnum="item.id" :name="item.name">
            </list-item></ul></div>`,
}
))

/* nice component */
Vue.component( 'list-item', (
  {
    props: [ 'idnum', 'name'],
    computed: {
      addr: function() {
        return "#/item/" + this.idnum;
      }
    },
    template: '<li><a :href="addr">{{name}}</a></li>'
  }
))

function NewEntry() {
  this.name = {
    value: '',
    errMsg: '',
    validate: function() {
      let isValid = false;
      if (!this.value) {
        this.errMsg = 'Nimi peab olema sisestatud';
      } else {
        isValid = true;
        this.errMsg = '';
      }
      return isValid;
    }
  },
  this.element = {
    value: '',
    errMsg: '',
    validate: function() {
      let isValid = false;
      if (!this.value) {
        this.errMsg = 'Lemmik element peab olema sisestatud';
      } else {
        isValid = true;
        this.errMsg = '';
      }
      return isValid;
    }
  }
}

const Add = Vue.component('add-view', ({
  data: function() {
    return {
      newEntry: new NewEntry(),
      nameFirstBlur: false,
      elementFirstBlur: false
    }
  },
  methods: {
    addNew: function() {
      console.log("~!");
      if (!this.newEntry.name.validate() || !this.newEntry.element.validate()) {
        return;
      }
      console.log("~?");
      const entry = {name: this.newEntry.name.value, email: this.newEntry.element.value};
      store.commit('pushAlchemistEntry', entry);
      this.newEntry = new NewEntry();
      this.$router.push({path: 'list'});
    }
  },
  computed: {
    isNameValid() {
      return this.newEntry.name.validate();
    },
    isElementValid() {
      return this.newEntry.element.validate();
    }
  },
  template: 
  `
  <div>
  <h2>Lisamine</h2>
  <form>
  <label for="name">Nimi</label>
  <input type="text" id="name" @change="newEntry.name.validate()" @keyup.once="nameFirstBlur = true" @blur.once="nameFirstBlur = true" v-model="newEntry.name.value"/>
  <small class="error" :hidden="isNameValid || !nameFirstBlur">{{ newEntry.name.errMsg }}</small>
  <label for="element">Lemmik element</label>
  <input type="text" id="element" @change="newEntry.element.validate()" @keyup.once="elementFirstBlur = true" @blur.once="elementFirstBlur = true" v-model="newEntry.element.value">
  <small class="error" :hidden="isElementValid || !elementFirstBlur">{{ newEntry.element.errMsg }}</small>
  <br>
  <input type="submit" @click.prevent="addNew"/>
  </form>
  </div>
  `
}
))

const itemDetail = Vue.component('item-detail', ({
  data: function() {
    return {} // BAD IDEA: see appdata below...
  },
  template: `<div><h1>Inimese #{{$route.params.id}} detailid</h1>
              <div v-if="getEntryById($route.params.id)">
              <div>nimi: {{getEntryById($route.params.id).name}}</div>
              <div>lemmik element: {{getEntryById($route.params.id).element}}</div>
             </div>
             <div v-else>Id-ga {{$route.params.id}} isikut ei leitud</div></div>`,
  methods: {
    getEntryById(id) {
      return this.$store.getters.getAlchemistEntry(id);
    }
  }
}))

const store = new Vuex.Store({
  state: {
    alchemistlist: [
      { id: 0, name: 'Hermes Trismegistus', element:'Earth'},
      { id: 1, name: 'Ostanes', element:'Fire'},
      { id: 2, name: 'Nicolas Flamel', element:'Air'},
      { id: 3, name: 'Perenelle Flamel', element:'Water'}
    ]
  },
  mutations: {
    pushAlchemistEntry(state, newEntry) {
      newEntry.id = state.alchemistlist.length;
      state.alchemistlist.push(newEntry);
    }
  },
  getters: {
    getAlchemistEntry: state => id => {
      return state.alchemistlist.filter(element => element.id == id)[0];
    },
    getAllAlchemists(state) {
      return state.alchemistlist;
    },
    getAlchemistsByElement: state => (favElement) => {
      return state.alchemistlist
        .filter(element => element.element.toLowerCase() === favElement);
    }
  }
})

/* ROUTER ELEMENTS */
routes = [
  { path: '/list', component: ListView },
  { path: '/add', component: Add },
  { path: '/item/:id', component: itemDetail }
]

const router = new VueRouter(
  {routes, linkActiveClass: "button-primary"}
)

/* VUE APP */

var vm = new Vue(
{ 
  router,
  store,
  data: {}
}
).$mount('#dogapp');
