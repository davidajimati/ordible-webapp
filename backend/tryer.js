#!/usr/bin/env node
// This is where I test new functionalities before adding them to the main program

const a = 10

function calc() {
  const b = 7
  function add() {
    console.log(a + b)
  }
  function sub() {
    console.log(a - b)
  }
  return { 'add': add, 'sub': sub, 'b': b };
}

// const useIt = calc()
// // useIt.add()
// // useIt.sub()
// const addIt = useIt.add
// const subIt = useIt.sub
// // console.log(useIt.b);
// addIt()

calc().sub()
