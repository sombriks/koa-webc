
const { expect } = require("chai")
const { KoaWebC } = require("./main")

describe("Basic checks", () => {

  it("should be present", done => {
    expect(KoaWebC).not.be.undefined
    expect(KoaWebC).to.be.a('function')
    done()
  })
})