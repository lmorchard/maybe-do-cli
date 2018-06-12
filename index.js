#!/usr/bin/env node
const fs = require("fs");
const program = require("commander");
const readline = require("readline");
const asyncMergeSort = require("async-merge-sort");
const packageData = require("./package.json");

program
  .version(packageData.version)
  .usage("[options]")
  .parse(process.argv);

const infile = program.args[0];
if (!infile) {
  throw "infile required";
}

const outfile = program.args[1];

const listItems = fs
  .readFileSync(infile)
  .toString("utf8")
  .trim()
  .split("\n");

readline.emitKeypressEvents(process.stdin);

const cmpCache = {};

asyncMergeSort(
  listItems,
  (a, b, cb) => {
    const cmpKey = `${a}|${b}`;
    if (cmpCache[cmpKey]) {
      return cb(null, cmpCache[cmpKey]);
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
    process.exit();
  }
);
