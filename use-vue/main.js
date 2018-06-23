// Globally activate axios.interceptors
fakeData()

// define Model
function Model(options) {
  this.data = options.data
  this.resource = options.resource

}


Model.prototype.fetch = function(id) {
  return axios.get(`/${this.resource}/${id}`).then((response) => {

    this.data = response.data
    return response
  })
}


Model.prototype.update = function(data) {
  let id = this.data.id
  console.log('update:', data)
  console.log(`${this.resource}`, `${id}`)

  return axios.put(`/${this.resource}/${id}`, data)
}


// make a instance of Model
let model = new Model({
  data: {
    name: 'xx',
    number: 0,
    id: '',
  },
  resource: 'books'

})

window.model = model




//define View
function View({
  el, template
}) {
  this.el = el
  this.template = template
}

// 定义模板渲染机制
View.prototype.render = function(data) {
  let html = this.template
  for (let key in data) {
    html = html.replace(`__${key}__`, data[key])
  }

  $(this.el).html(html)
}

// Instanciate view
let view = new View({
  el: '#app',
  template: `
  <div>
      书名: __name__  
      数量: <span id='count'>__number__</span>
      </div>
  
  <div>
    <button id='addOne'>加一</button>
    <button id='minusOne'>减一</button>
    <button id='reset'>归零</button>
  </div>
`
})

// define controller
// use init() to bind view, model to controller, and render html for initiation 

var controller = {
  init(options) {
      let {
        view, model
      } = options

      // 初次渲染 view 节点
      this.view = view
      this.model = model

      this.view.render(this.model.data)
      this.bindEvents()

      // 渲染请求第一本书获得的数据.
      this.model.fetch(1).then(({}) => {
        this.view.render(this.model.data)

      })
    },
    addOne() {
      console.log('addOne()')

      let oldNumber = $('#count').text() - 0
      let newNumber = oldNumber + 1


      // bug start here================================
      this.model.update({
        number: newNumber
      }).then(() => {

        this.view.render(this.model.data)

        // bug end here===================================
        console.log("this.model.data:", this.model.data)
      })
    },
    minusOne() {
      let oldNumber = $('#count').text() - 0
      let newNumber = oldNumber - 1

      this.model.update({
        number: newNumber
      }).then(() => {
        this.view.render(this.model.data)
      })


    },
    reset() {

      let newNumber = 0

      this.model.update({
        number: newNumber
      }).then(() => {
        this.view.render(this.model.data)
      })
    },
    bindEvents() {

      $(this.view.el).on('click', '#addOne', this.addOne.bind(this))

      $(this.view.el).on('click', '#minusOne', this.minusOne.bind(this))

      $(this.view.el).on('click', '#reset', this.reset.bind(this))
    }
}




// Initiate variable book. Globally activate axios.interceptors
function fakeData() {

  let book = {
    name: 'JavaScript 高级程序设计',
    number: 2,
    id: 1,
  }

  //axios拦截器, 拦截并处理 response
  axios.interceptors.response.use(function(response) {

    let {
      url, method, data
    } = response.config

    if (url === "/books/1" && method == "get") {
      response.data = book
    } else if (url === "/books/1" && method == "put") {

      console.log('put data:', data)
      data = JSON.parse(data)
      Object.assign(book, data)
      response.data = book
    }

    return response
  })
}


controller.init({
  view, model
})
