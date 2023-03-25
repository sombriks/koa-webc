// general tests for the middleware
const path = require("path")
const chai = require("chai")
const chaiHttp = require("chai-http")
const {KoaWebC} = require("../src/main")

const Koa = require("koa")
const bodyParser = require('koa-bodyparser')
const Router = require("@koa/router")

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
    app.use(KoaWebC({viewPath: path.join(process.cwd(), "test", "fixtures")}))
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
    app.use(KoaWebC({viewPath: path.join(process.cwd(), "test", "fixtures")}))
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
    app.use(KoaWebC({viewPath: path.join(process.cwd(), "test", "fixtures")}))
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

  it("should render component in bundle mode", done => {

    const app = new Koa()
    app.use(KoaWebC({
      bundle: true,
      viewPath: path.join(process.cwd(), "test", "fixtures")
    }))
    app.use(async ctx => {
      await ctx.render("my-counter.webc")
    })

    chai
      .request(app.callback())
      .get('/xpto')
      .end((err, res) => {
        if (err) return done(err)
        if (res?.error) return done(res.error)
        res.should.have.status(200)
        done()
      })
  })

  it("should play nice with other plugins", done => {

    const app = new Koa()
    const router = new Router()

    router.get("/hello-world", async ctx => {
      await ctx.render("hello-world.webc")
    })

    router.post("/login", async ctx => {
      await ctx.render("logged-user.webc")
    })

    // middleware registration order is important
    app
      .use(KoaWebC({
        bundle: true,
        viewPath: path.join(process.cwd(), "test", "fixtures")
      }))
      .use(bodyParser())
      .use(router.routes())
      .use(router.allowedMethods())

    chai
      .request(app.callback())
      .get('/hello-world')
      .end((err, res) => {
        if (err) return done(err)
        if (res?.error) return done(res.error)
        res.should.have.status(200)
        chai.expect(res.text).to.include(`hello world!`)

        chai.request(app.callback())
          .post("/login")
          .send({username: "Jack", password: "Sparrow"})
          .end((err, res) => {
            if (err) return done(err)
            if (res?.error) return done(res.error)
            res.should.have.status(200)
            chai.expect(res.text).to.include(`Welcome, Jack`)
            chai.expect(res.text).to.include(`Correct password? true`)
            done()
          })
      })
  })

  it("should accept 'data' option to consume on template", done => {
    const app = new Koa()
    const router = new Router()

    router.get("/the-extras", async ctx => {
      await ctx.render("the-extras.webc", {data: {bar: 'baz', xpto: "xpto"}})
    })

    app
      .use(KoaWebC({
        bundle: true,
        viewPath: path.join(process.cwd(), "test", "fixtures"),
        data: {
          foo: "foo",
          bar: "bar"
        }
      }))
      .use(router.routes())
      .use(router.allowedMethods())

    chai
      .request(app.callback())
      .get('/the-extras?baz=woof')
      .end((err, res) => {
        if (err) return done(err)
        if (res?.error) return done(res.error)
        res.should.have.status(200)
        chai.expect(res.text).to.include(`Foo: foo`)
        chai.expect(res.text).to.include(`Bar: baz`)
        chai.expect(res.text).to.include(`Baz: woof`)
        chai.expect(res.text).to.include(`Xpto: xpto`)
        done()
      })
  })

  it("should expose the 'defineComponents' api", done => {

    const app = new Koa()

    app.use(KoaWebC({
      viewPath: path.join(process.cwd(), "test", "fixtures"),
      defineComponents: path.join(process.cwd(), "test", "fixtures", "loops/*.webc")
    }))

    app.use(async ctx => {
      await ctx.render("data-parent.webc", {
        data: {
          colors: ["red", "green", "blue"]
        }
      })
    })

    chai
      .request(app.callback())
      .get('/')
      .end((err, res) => {
        if (err) return done(err)
        if (res?.error) return done(res.error)
        res.should.have.status(200)

        chai.expect(res.text).to.include(`background-color:red`)
        chai.expect(res.text).to.include(`background-color:blue`)
        chai.expect(res.text).to.include(`background-color:green`)
        done()
      })
  })
})