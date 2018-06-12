# maybe-do-cli

This is a dumb little tool I made to play with lists of things I might do.

Since I have trouble deciding what to do next, I decided to turn myself into a
sort comparator so that the computer can sort my list.

## Usage

1. Make a list of things in a text file, for example:
```
Learn Rust
Play Zelda
Cook tacos
Build a coffee table
Make music
```

1. Run the tool with an input and output file name:
```
node index.js maybe-do.txt maybe-do-sorted.txt
```

1. Rank each pair with 1, 2, or 3 keys and see a sorted list:
```
(1) Learn Rust
(2) Play Zelda
(3) same? 1

(1) Cook tacos
(2) Build a coffee table
(3) same? 1

(1) Learn Rust
(2) Cook tacos
(3) same? 2

(1) Learn Rust
(2) Build a coffee table
(3) same? 1

(1) Play Zelda
(2) Build a coffee table
(3) same? 1

(1) Cook tacos
(2) Make music
(3) same? 1

(1) Learn Rust
(2) Make music
(3) same? 2
```

1. See the sorted list:
```
$ cat maybe-do-sorted.txt
Cook tacos
Make music
Learn Rust
Play Zelda
Build a coffee table
```
