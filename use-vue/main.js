// Globally activate axios.interceptors
fakeData()

// define Model
function Model(options) {
  this.data = options.data
  this.resource = options.resource

}

//Model.fetch() is used to update Model.data according to response.data
Model.prototype.fetch = function(id) {
  return axios.get(`/${this.resource}/${id}`).then((response) => {

    this.data = response.data
    return response
  })
}

//Model.update() is used to get updated response.book 
Model.prototype.update = function(data) {
  let id = this.data.id

  return axios.put(`/${this.resource}/${id}`, data)
}


// make a instance of Model
let model = new Model({
  data: {
    name: '',
    number: 0,
    id: '',
  },
  resource: 'books'
})



// Instanciate Vue
let view = new Vue({
  el: '#app',
  data: {
    book: {
      name: '未命名',
      number: 0,
      id: ''
    },
  n: 1
  },
  methods: {
    addOne() {
        model.update({
          number: this.book.number + parseInt(this.n)
        }).then(() => {
          this.book = model.data

        })
      },
      minusOne() {

        model.update({
          number: this.book.number - parseInt(this.n)
        }).then(() => {
          this.book = model.data
        })
      },
      reset() {
        model.update({
          number: 0
        }).then(() => {
          this.book = model.data
        })
      }
  },
  template: `
  <div>
    <div>
        书名: {{book.name}}  
        数量: <span id='count'>{{book.number}}</span>
        </div>
  <div>
<input v-model="n" />

</div>
    <div>
      <button id='addOne' v-on:click="addOne">加{{n}} </button>
      <button id='minusOne' v-on:click="minusOne">减{{n}}</button>
      <button id='reset' v-on:click="reset">归零</button>
    </div>
  </div>
`,
  created() {
    model.fetch(1).then(() => {
      this.book = model.data
    })
  }


})

