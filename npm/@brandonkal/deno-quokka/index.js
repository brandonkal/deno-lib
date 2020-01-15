/**
 * @package @brandonkal/deno-quokka
 * @description A simple babel plugin that rewrites
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @license MIT
 */

const _Deno = require('./deno-bridge');

module.exports = {
  before: (config) => {
    //@ts-ignore -- append to global
    global.Deno = _Deno;
  },
};
