const path = require("path")

/**
 * some reasonable default init values for middleware registration
 * @returns {KoaWebCOptions}
 */
const defaultOptions = () => ({
  viewPath: path.join(process.cwd(), "views"),
  bundle: false,
  data: null
})

/**
 * some defaults to extra options passed during render function
 *
 * @returns {KoaWebCExtraOptions}
 */
const defaultExtra = () => ({
  bundle: false,
  data: undefined
})

/**
 * The WebC - Koa middleware installer add a render() function in your Koa app.
 *
 * Each render has direct access to the Context (ctx) so anything available on
 * it can be used inside templates.
 *
 * @param { KoaWebCOptions } options default values
 */
exports.KoaWebC = (options = defaultOptions()) => {

  const viewPath = options?.viewPath || defaultOptions().viewPath

  return async (ctx, next) => {
    const {WebC} = await import("@11ty/webc");

    /**
     *
     * @type {RenderKoaWebC} function
     *
     * The render function compiles WebC pages and then put them in ctx.body
     *
     * @param viewName the path to the WebC page/component relative to viewPath
     * @param extra the {@type {KoaWebCExtraOptions}} containing some overrides
     * for option values
     * @returns {Promise<void>} it calls next so Koa app can continue to
     * evaluate the stack
     */
    ctx.render = async (viewName, extra = defaultExtra()) => {
      const file = path.join(viewPath, viewName)
      const page = new WebC({file})
      page.setBundlerMode(extra?.bundle || options?.bundle || false)

      if (options.defineComponents)
        page.defineComponents(options.defineComponents)
      if (extra.defineComponents)
        page.defineComponents(extra.defineComponents)

      const data = {ctx, ...options.data, ...extra.data}
      let {html, css, js} = await page.compile({data})

      if (!page.bundlerMode) ctx.body = html
      else ctx.body = `<style>${css}</style>${html}<script>${js}</script>`
    }
    await next()
  }
}