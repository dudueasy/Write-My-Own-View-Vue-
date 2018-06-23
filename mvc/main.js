fakeData()

// controller.init({view,model})

let model = {
  data: {
    name: '',
    number: 0,
    id: ''
  },
  fetch(id) {
    return axios.get(`/books/${id}`).then((response) => {
      this.data = response.data
      return response
    })
  },
  update(id, data) {
    return axios.put(`/books/${id}`, data)
  }
}

// define view
let view = {
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
`,
  render(data) {
    let html = this.template.replace('__name__', data.name).replace('__number__', data.number)
    $(this.el).html(html)
  }

}

console.log(1)
  // define controller
  // use init() to bind view, model to controller, and render html for initiation 

console.log(2)
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

      let oldNumber = $('#count').text() - 0
      let newNumber = oldNumber + 1
      this.model.update({number:newNumber}).then(()=>{
        this.view.render(this.model.data)
        })
     },
    minusOne() {
      let oldNumber = $('#count').text() - 0
      let newNumber = oldNumber - 1

      this.model.update({number:newNumber}).then(()=>{
        this.view.render(this.model.data)
        })


    },
    reset() {

      let newNumber = 0

      this.model.update({number:newNumber}).then(()=>{
        this.view.render(this.model.data)
        })


    },
    bindEvents() {

      $(this.view.el).on('click', '#addOne', this.addOne.bind(this))

      $(this.view.el).on('click', '#minusOne',this.minusOne.bind(this))

      $(this.view.el).on('click', '#reset', this.reset.bind(this))
    }
}




// click event handler
$('#app').on('click', '#addOne', () => {
  let oldNumber = $('#count').text() - 0
  let newNumber = oldNumber + 1

  axios.put('/books/1', {
    number: newNumber
  }).then(() => {
    $('#count').text(newNumber)
  })
})

$('#app').on('click', '#minusOne', () => {
  let oldNumber = $('#count').text() - 0
  let newNumber = oldNumber - 1

  axios.put('/books/1', {
    number: newNumber
  }).then(() => {
    $('#count').text(newNumber)
  })
})

$('#app').on('click', '#reset', () => {
  let newNumber = 0
  axios.put('/books/1', {
    number: newNumber
  }).then(() => {
    $('#count').text(0)
  })
})


// Initiate variable book. Globally activate axios.interceptors
function fakeData() {

  let book = {
    name: 'JavaScript 高级程序设计',
    number: 2,
    id: 1
  }

  //axios拦截器, 拦截并处理 response
  axios.interceptors.response.use(function(response) {

    let {
      url, method, data
    } = response.config

    if (url == "/books/1" && method == "get") {
      response.data = book
    } else if (url == "/books/1" && method == "put") {
      data = JSON.parse(data)
      Object.assign(book, data)
      response.data = book
    }

    console.log('response.config: ', response.config)
    return response
  })
}


controller.init({
  view, model
})
