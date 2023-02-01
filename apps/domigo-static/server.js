import express from "express"
import { createServer as createViteServer } from "vite"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createSrever( ) {
    const app = express( )

    //* Create Vite server in middleware mode and configure the app type as
    //* 'custom', disabling Vite's own HTML serving logic so parent server
    //* can take control
    const viteServer = await createViteServer({
        server: { middlewareMode: true },
        appType: "custom"
    })

    //* use vite's connect instance as middleware
    app.use(viteServer.middlewares)

    app.use("*", async (req, res, next) => {
        const url = req.originalUrl

        try {
            //* read the index.html file
            let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8")

            //* injects the Vite HMR client, and also applies HTML transforms from Vite plugins
            template = await viteServer.transformIndexHtml(url, template)

            //* entry-server.js converts the ES6 syntax to ESM syntax which is recognized by NodeJS and prepares the HTML which will
            // renderred in the client side
            const { render } = await viteServer.ssrLoadModule("/src/entry-server.jsx")
            const appHtml = await render(url)
            const html = template.replace(`<!--ssr-outlet-->`, appHtml)

            res.status(200).set({ "Content-Type": "text/html" }).end(html)
        } catch (error) {
            viteServer.ssrFixStacktrace(error)

            next(error)
        }
    })

    app.listen(5173, ( ) => console.log("starting nodeJS express server"))
}

createSrever( )
