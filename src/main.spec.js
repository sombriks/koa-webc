// general tests for the middleware
const chai = require("chai")
const chaiHttp = require("chai-http")
const { KoaWebC } = require("./main")

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
      await ctx.render("/hello.webc")
    })

    chai
      .request(app.callback())
      .get('/')
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        done();
      });
  })
})