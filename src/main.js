const path = require("path")

/**
 * The plugin implementation
 * 
 * @param {*} options 
 */
exports.KoaWebC = (options) => {

  const viewPath = options?.viewPath || path.join(process.cwd(), "views")
  return async (ctx, next) => {
    const { WebC } = await import("@11ty/webc");

    ctx.render = async (viewName, extra) => {
      const file = path.join(viewPath, viewName)
      const page = new WebC({ file })
      page.setBundlerMode(extra?.bundle || options?.bundle || false)

      let { html, css, js } = await page.compile({ data: { ctx } })

      if (!page.bundlerMode) ctx.body = html
      else ctx.body = `<style>${css}</style>${html}<script>${js}</script>`
    }
    await next()
  }
}