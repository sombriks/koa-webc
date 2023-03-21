# The KoaWebC plugin

[![build status](https://github.com/sombriks/koa-webc/actions/workflows/node.js.yml/badge.svg)](https://github.com/sombriks/koa-webc)
[![npm version](https://img.shields.io/npm/v/koa-webc?style=plastic)](https://www.npmjs.com/package/koa-webc)

This plugin enables [Koa](https://koajs.com/) to serve
[WebC](https://github.com/11ty/webc) pages.

## Installing

```bash
npm i koa-webc
```

## Basic usage

```js
import Koa from "koa"
import { KoaWebC } from "koa-webc"

const app = new Koa()
app.use(KoaWebC())

app.use(async ctx => ctx.render("hello-world.webc"))

app.listen(3000)
console.log("http://localhost:3000")
```

# Using some other middlewares

```js
const app = new Koa()
const router = new Router()

router.get("/the-extras", async ctx => {
  // override data options
  await ctx.render("the-extras.webc", {data: {bar: 'baz', xpto: "xpto"}})
})

// middleware registration order is important
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
  .listen(3000)
console.log("http://localhost:3000")
```

See more [examples](https://github.com/sombriks/koa-webc-examples)

## Roadmap

- [X] initial support
- [X] npm package publishing
- [X] dedicated example project with snippets
- [X] check interaction with other middlewares
- [ ] CI/CD to automatically publish on npm
- [ ] performance/benchmark tests
- [ ] documentation once api gets stable
