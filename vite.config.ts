import solid from 'solid-start/vite'
import nodeStart from 'solid-start-node'
import { defineConfig } from 'vite'
import {resolve} from "path";

export default defineConfig(() => {
  return {
    plugins: [solid({ adapter: nodeStart(), ssr : true })],
    resolve: {
      alias: {
        "solid-staggered-grid": resolve(__dirname, "./lib/src")
      }
    }
  }
})
