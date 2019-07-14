import { h, render } from 'preact';


// import React, { Component } from 'react';
// import { render } from 'react-dom';
// console.log('___ zzz', React);

// const render = h => ({ active }) => <h1>ZZZZ</h1>;


console.log('___ h', h);


export function MyComponent({ prop1, prop2 }){
  // const test: number = 5;
  const test = 5;

  return (
    <div id="foo">
      <div>MyComponent! -{test}-</div>
      -- prop1: {prop1} / prop2: {prop2} --
      <button onClick={ e => alert("hi!") }>Click Me</button>
    </div>
  );
}

// render(MyComponent({ prop1: 'yo', prop2: 'ff' }), document.body);
