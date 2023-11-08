import solid from 'solid-start/vite'
import staticSolid from 'solid-start-static'
import { defineConfig } from 'vite'
import {resolve} from "path";

export default defineConfig(() => {
  return {
    base : "/solid-staggered-grid",
    plugins: [solid({ adapter: staticSolid(), ssr : true })],
    resolve: {
      alias: {
        "solid-staggered-grid": resolve(__dirname, "./lib/src")
      }
    }
  }
})
