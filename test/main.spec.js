// general tests for the middleware
const path = require("path")
const chai = require("chai")
const chaiHttp = require("chai-http")
const { KoaWebC } = require("../src/main")
const debug = require("debug")("*")

const Koa = require("koa")

chai.should()
chai.use(chaiHttp)


describe("Basic checks", () => {

  it("should be present", done => {
    chai.expect(KoaWebC).not.be.undefined
    chai.expect(KoaWebC).to.be.a('function')
    done()
  })

  it("should provide a render function", done => {

    const app = new Koa()
    app.use(KoaWebC())
    app.use(async ctx => {
      debug(ctx.render)
      chai.expect(ctx.render).to.be.a('function')
      ctx.body = "ok"
    })

    chai
      .request(app.callback())
      .get('/')
      .end((err, res) => {
        if (err) return done(err)
        if (res?.error) return done(res.error)
        res.should.have.status(200)
        done()
      })
  })

  it("should render a template", done => {

    const app = new Koa()
    app.use(KoaWebC({ viewPath: path.join(process.cwd(), "test", "fixtures") }))
    app.use(async ctx => {
      await ctx.render("hello-world.webc")
    })

    chai
      .request(app.callback())
      .get('/')
      .end((err, res) => {
        if (err) return done(err)
        if (res?.error) return done(res.error)
        res.should.have.status(200)
        res.text.should.be.eq("<p>hello world!</p>")
        done()
      })
  })

  it("should have access to ctx inside template", done => {

    const app = new Koa()
    app.use(KoaWebC({ viewPath: path.join(process.cwd(), "test", "fixtures") }))
    app.use(async ctx => {
      await ctx.render("hello-user.webc")
    })

    chai
      .request(app.callback())
      .get('/?user=jack%20sparrow')
      .end((err, res) => {
        if (err) return done(err)
        if (res?.error) return done(res.error)
        res.should.have.status(200)
        res.text.should.be.eq(`<p>how are you, <span>jack sparrow</span>?</p>`)
        done()
      })
  })

  it("should render complex templates", done => {

    const app = new Koa()
    app.use(KoaWebC({ viewPath: path.join(process.cwd(), "test", "fixtures") }))
    app.use(async ctx => {
      await ctx.render("complex/main.webc")
    })

    chai
      .request(app.callback())
      .get('/?user=jack%20sparrow')
      .end((err, res) => {
        if (err) return done(err)
        if (res?.error) return done(res.error)
        res.should.have.status(200)
        chai.expect(res.text).to.include(`<span class="star">★</span>`)
        chai.expect(res.text).to.include(`title="speed"`)
        done()
      })
  })
})