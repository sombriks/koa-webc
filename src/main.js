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
      let { html, css, js, components } = await page.compile();
      ctx.body = html
    }
    await next()
  }
}