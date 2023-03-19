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

See more [examples](https://github.com/sombriks/koa-webc-examples)
