/**
 * The plugin implementation
 * 
 * @param {*} options 
 */
exports.KoaWebC = (options) => {

  return (ctx, next) => {
    ctx.render = (viewName, extra) => {
      console.log("xxx")
    }
  }
}