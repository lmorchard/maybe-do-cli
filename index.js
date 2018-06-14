#!/usr/bin/env node
const fs = require("fs");
const program = require("commander");
const readline = require("readline");
const asyncMergeSort = require("async-merge-sort");
const packageData = require("./package.json");

program
  .version(packageData.version, "-v, --version")
  .usage("[options] <filename>")
  .option("-o, --output [filename]", "output to file")
  .option("-c, --cache [filename]", "cache filename")
  .option("--no-cache", "skip using cache for answers")
  .option("--reset-cache", "reset cache on run")
  .parse(process.argv);

const infile = program.args[0];
if (!infile) {
  throw "infile required";
}

let cmpCacheFn;
if (program.cache === false) {
  cmpCacheFn = false;
} else if (program.cache === true) {
  cmpCacheFn = `${infile}-cmpCache.json`;
} else {
  cmpCacheFn = program.cache;
}

const outfile = program.output;

const listItems = fs
  .readFileSync(infile)
  .toString("utf8")
  .trim()
  .split("\n");

const cmpCache = {};
if (cmpCacheFn && !program.resetCache) {
  try {
    Object.assign(
      cmpCache,
      JSON.parse(fs.readFileSync(cmpCacheFn).toString("utf8"))
    );
  } catch (e) {
    // no-op
  }
}

readline.emitKeypressEvents(process.stdin);

asyncMergeSort(
  listItems,
  (a, b, cb) => {
    const cmpKey = `${a}|${b}`;
    if (cmpCache[cmpKey]) {
      return cb(null, cmpCache[cmpKey]);
    }

    const cmpKeyRev = `${b}|${a}`;
    if (cmpCache[cmpKeyRev]) {
      return cb(null, 0 - cmpCache[cmpKeyRev]);
    }

    process.stdout.write(`(1) ${a}\n(2) ${b}\n(3) same? `);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once("keypress", (ch, key) => {
      process.stdout.write(`${ch}\n\n`);
      if (key.sequence === "\u0003") {
        process.exit(1);
      }
      let out;
      switch (ch) {
        case "1":
          out = -1;
          break;
        case "2":
          out = 1;
          break;
        default:
          out = 0;
      }
      process.stdin.setRawMode(false);
      process.stdin.pause();

      cb(null, (cmpCache[cmpKey] = out));
    });
  },
  (err, sorted) => {
    if (err) {
      console.error("ERROR", err);
      process.exit(1);
    }
    const outData = sorted.join("\n");
    console.log(outData);
    if (outfile) {
      fs.writeFileSync(outfile, outData);
    }
    if (cmpCacheFn) {
      fs.writeFileSync(cmpCacheFn, JSON.stringify(cmpCache));
    }
    process.exit();
  }
);
