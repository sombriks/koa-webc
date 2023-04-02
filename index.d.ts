import {Next} from "koa";

declare namespace KoaWebC {

    /**
     * The WebC - Koa middleware installer to add a render() function in your
     * Koa app.
     *
     * @param options {@type {KoaWebCOptions}} to set up this middleware.
     *
     * @returns the call to {@type {Next}} so installed middleware participates in
     * the Koa call stack.
     */
    function KoaWebC(options: KoaWebCOptions): Next;

    /**
     * Options for the middleware installer
     */
    type KoaWebCOptions = {
        /**
         * folder containing the views relative to application execution point
         */
        viewPath: string,
        /**
         * glob or globs to pass to WebC defineComponents function
         */
        defineComponents?: string | string[]
        /**
         * the {@type {WebC}} bundleMode value
         */
        bundle: boolean,
        /**
         * the @type {WebC} data option to pass directly to page.compile call
         */
        data: any
    }

    /**
     * the render function is called whenever someone calls
     * ctx.render() inside a {@type {Koa}} use or a router method or something.
     *
     * @param viewName name of the webc template to be rendered
     *
     * @param extra extra param options {@type {KoaWebCExtraOptions}} to merge
     * with {@type {KoaWebCOptions}} when rendering a template
     *
     * @returns promise so the next middleware can be called
     */
    function RenderKoaWebC(viewName: string, extra: KoaWebCExtraOptions): Promise<void>

    type KoaWebCExtraOptions = {
        /**
         * the {@type {WebC}} bundleMode value
         */
        bundle: boolean,
        /**
         * glob or globs to pass to WebC defineComponents function
         */
        defineComponents?: string | string[]
        /**
         * the @type {WebC} data option to pass directly to page.compile call
         */
        data: any
    }
}


export = KoaWebC