import * as minimist from "minimist";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import * as packageJson from "../package.json";

let suppressError = false;

function printInConsole(message: any) {
    if (message instanceof Error) {
        message = message.message;
    }
    // tslint:disable-next-line:no-console
    console.log(message);
}

function showToolVersion() {
    printInConsole(`Version: ${packageJson.version}`);
}

async function executeCommandLine() {
    const argv = minimist(process.argv.slice(2), { "--": true });

    const showVersion = argv.v || argv.version;
    if (showVersion) {
        showToolVersion();
        return;
    }

    suppressError = argv.suppressError;

    const exclude: string | string[] = argv.e || argv.exclude;
    const excludedDirectories: string[] = [];
    if (Array.isArray(exclude)) {
        for (const e of exclude) {
            excludedDirectories.push(e);
        }
    } else if (exclude) {
        excludedDirectories.push(exclude);
    }

    interface Node {
        name: string;
        isDirectory?: boolean;
        children?: Node[];
    }

    const statAsync = util.promisify(fs.stat);
    const readdirAsync = util.promisify(fs.readdir);
    async function readAsync(node: Node): Promise<boolean> {
        const directoryName = path.basename(node.name);
        if (excludedDirectories.some(d => directoryName === d)) {
            return false;
        }
        const stats = await statAsync(node.name);
        if (stats.isFile()) {
            node.isDirectory = false;
            return true;
        } else if (stats.isDirectory()) {
            node.isDirectory = true;
            node.children = [];
            const files = await readdirAsync(node.name);
            for (const file of files) {
                const child: Node = {
                    name: path.resolve(node.name, file),
                };
                const isValid = await readAsync(child);
                if (isValid) {
                    node.children.push(child);
                }
            }
            return true;
        }
        return false;
    }

    const result: Node[] = [];
    for (const file of argv._) {
        const basename = path.basename(file);
        if (excludedDirectories.every(d => basename !== d)) {
            const node: Node = {
                name: file,
            };
            const isValid = await readAsync(node);
            if (isValid) {
                result.push(node);
            }
        }
    }

    function print(node: Node, depth: number, isEnd: boolean) {
        const head = depth === 0 ? "" : "│  ".repeat(depth - 1) + (isEnd ? "└─ " : "├─ ");
        printInConsole(head + path.basename(node.name));
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                print(node.children[i], depth + 1, i === node.children.length - 1);
            }
        }
    }

    for (let i = 0; i < result.length; i++) {
        print(result[i], 0, i === result.length - 1);
    }
}

executeCommandLine().then(() => {
    printInConsole("files2text success.");
}, error => {
    printInConsole(error);
    if (!suppressError) {
        process.exit(1);
    }
});
