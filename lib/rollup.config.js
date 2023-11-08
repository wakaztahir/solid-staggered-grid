import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from '@rollup/plugin-terser';

const extensions = [".js", ".ts", ".jsx", ".tsx"]

/**
 * @type import("rollup").RollupOptions
 */
function createConfiguration(solidGenerate, format, name, extension) {
    return (
        {
            input: {
                file: "src/index.ts"
            },
            output: {
                dir: "dist",
                format : format,
                entryFileNames : name + "." + extension
            },
            plugins: [
                babel({
                    presets: [
                        "@babel/preset-typescript",
                        ["solid", { generate: solidGenerate, "hydratable": true}]
                    ],
                    extensions: extensions
                }),
                nodeResolve({extensions}),
                terser()
            ],
            external : ["solid-js", "solid-js/web", "solid-js/store", "@qinetik/emotion", "@qinetik/anique-icons"]
        }
    )
}

export default [
    createConfiguration("dom", "es", "index", "js"),
    createConfiguration("dom", "cjs", "index", "cjs"),
    createConfiguration("ssr", "es", "server","js"),
    createConfiguration("ssr", "cjs", "server","cjs"),
]