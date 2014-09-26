frish = require('../frish.js')
chai = require('chai')
chaiHttp = require('chai-http')
io = require('socket.io-client')

chai.use(chaiHttp)
expect = chai.expect


describe 'frish server', ->
  port = 32016
  baseUrl = 'http://localhost:' + port
  request = chai.request(baseUrl)
  ioconnect = ->
    socket = io.connect(baseUrl,
      reconnect: false,
      'force new connection': true)

  beforeEach (done)->
    @reloader = frish(port, done)

  afterEach (done)->
    @reloader.close done

  it 'serves client script', (done)->
    request
    .get('/reloader.js')
    .res (res)->
      expect(res).to.have.status(200)
      expect(res).to.have.header('content-type', 'application/javascript')
      done()

  it 'has socket.io channel', (done)->
    socket = ioconnect()
    socket.on('connect', done)

  it 'sends reload', (done)->
    socket = ioconnect()
    socket.on 'reload', done
    socket.on 'connect', => @reloader.reload()

  it 'sends reload when POSTing', (done)->
    socket = ioconnect()
    socket.on 'reload', done

    socket.on 'connect', =>
      request.post('/reload').res (res)->
        expect(res).to.have.status(200)

