
/* List view is already a component */

ListView = Vue.component('list-view', (
{
  data: function() {
    return { entrylist: this.$parent.entrylist } // BAD IDEA: see appdata below...
  },
  template: `<div class="two columns"><ul>
              <list-item v-for="item in entrylist" :key="item.id" :idnum="item.id" :name="item.name">
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
    isValid: false,
    errMsg: '',
    validate: function() {
      if (!this.value) {
        this.isValid = false;
        this.errMsg = 'Name must not be empty';
      } else {
        this.isValid = true;
        this.errMsg = '';
      }
      return this.isValid;
    }
  },
  this.email = {
    value: '',
    isValid: false,
    errMsg: '',
    validate: function() {
      if (this.value.indexOf('@') === -1) {
        this.isValid = false;
        this.errMsg = 'Email must contain an @ symbol';
      } else if (!this.value.substring(0, this.value.indexOf('@')) && !this.value.substring(this.value.indexOf('@') + 1)) {
        this.isValid = false;
        this.errMsg = 'Email must contain a name part and a domain part in <name>@<domain>';
      } else if (!this.value.substring(0, this.value.indexOf('@'))) {
        this.isValid = false;
        this.errMsg = 'Email must contain a name part in <name>@<domain>';
      } else if (!this.value.substring(this.value.indexOf('@') + 1)) {
        this.isValid = false;
        this.errMsg = 'Email must contain a domain part in <name>@<domain>';
      } else {
        this.isValid = true;
        this.errMsg = '';
      }
      return this.isValid;
    }
  }
}

const Add = Vue.component('add-view', ({
  data: function() {
    return {
      entrylist: this.$parent.entrylist, // NOTE BAD IDEA HERE TOO: see below
      newEntry: new NewEntry()
    }
  },
  methods: {
    addNew: function() {
      this.newEntry.name.validate();
      this.newEntry.email.validate();
      if (!this.newEntry.name.isValid || !this.newEntry.email.isValid) {
        return;
      }
      id = this.entrylist.length;
      this.entrylist.push({id: id, name: this.newEntry.name.value, email: this.newEntry.email.value});
      this.newEntry = new NewEntry();
      this.$router.push({path: 'list'});
    }
  },
  template: 
  `
  <div>
  <h2>Lisamine</h2>
  <form>
  <label for="name">Name</label>
  <input type="text" id="name" @keyup="newEntry.name.validate()" @blur="newEntry.name.validate()" v-model="newEntry.name.value"/>
  <small class="error" :hidden="newEntry.name.isValid">{{ newEntry.name.errMsg }}</small>
  <label for="email">Email</label>
  <input type="email" id="email" @keyup="newEntry.email.validate()" @blur="newEntry.email.validate()" v-model="newEntry.email.value">
  <small class="error" :hidden="newEntry.email.isValid">{{ newEntry.email.errMsg }}</small>
  <br>
  <input type="submit" @click="addNew"/>
  </form>
  </div>
  `
}
))

const itemDetail = Vue.component('item-detail', ({
  data: function() {
    return { entrylist: this.$parent.entrylist } // BAD IDEA: see appdata below...
  },
  template: '<div><h1>Details {{$route.params.id}}</h1><div v-if="getEntryById($route.params.id)"><div>name: {{getEntryById($route.params.id).name}}</div><div>email: {{getEntryById($route.params.id).email}}</div></div><div v-else>No item with id {{$route.params.id}} found</div></div>',
  methods: {
    getEntryById(id) {
      return this.entrylist.filter(element => element.id == id)[0];
    }
  }
}))

/* APPLICATION STATE */

/* 
NOTE: bad idea to use it for sharing data directly. We should
be sharing parts of it to components as needed and we should
be changing it using events since it will be a debugging hell
for anything non-trivial.
*/

const appstate = 
    { 
      entrylist: [
        { id:1, name:"asd", email: "a@b.c"},
        { id:0, name:"dsa", email: "c@b.d"}
      ]
    }


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
  data: appstate
}
).$mount('#dogapp');
