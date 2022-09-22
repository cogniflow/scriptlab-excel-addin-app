import { h, Component, render } from 'preact';

import htm from 'htm';

const html = htm.bind(h);

export const Prueba = ({ children }) => {
  const clickHandler = () => {
    console.log('YES');
  };
  return html`<button onClick=${clickHandler}>${children}</buttom>`;
};
