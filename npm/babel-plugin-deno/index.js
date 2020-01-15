/**
 * @file **babel-plugin-deno (index.js)**
 * @description A simple babel plugin that rewrites imports
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @copyright 2019 justavac (Helper Functions)
 * @license MIT
 */
//@ts-nocheck

const fs = require('fs');
const path = require('path');

module.exports = function deno(babel) {
  return {
    name: 'deno',
    visitor: {
      ImportDeclaration: {
        enter(path) {
          const source = path.node.source.value;
          path.node.source.value = convertRemoteToLocalCache(source);
        },
      },
    },
  };
};

/// Helpers ///

/**
 * gets the deno cache directory based on the current environment
 * @returns {string}
 */
function getDenoDir() {
  // ref https://deno.land/manual.html
  // On Linux/Redox: $XDG_CACHE_HOME/deno or $HOME/.cache/deno
  // On Windows: %LOCALAPPDATA%/deno (%LOCALAPPDATA% = FOLDERID_LocalAppData)
  // On macOS: $HOME/Library/Caches/deno
  // If something fails, it falls back to $HOME/.deno
  let denoDir = process.env.DENO_DIR;
  if (denoDir === undefined) {
    switch (process.platform) {
      case 'win32':
        denoDir = `${process.env.LOCALAPPDATA}\\deno`;
        break;
      case 'darwin':
        denoDir = `${process.env.HOME}/Library/Caches/deno`;
        break;
      case 'linux':
        denoDir = `${process.env.HOME}/.cache/deno`;
        break;
      default:
        denoDir = `${process.env.HOME}/.deno`;
    }
  }

  return denoDir;
}

/**
 * strip Query
 * @param {string} moduleName
 */
function getModuleWithQueryString(moduleName) {
  let name = moduleName;
  for (
    const index = name.indexOf('?');
    index !== -1;
    name = name.substring(index + 1)
  ) {
    if (name.substring(0, index).endsWith('.ts')) {
      const cutLength = moduleName.length - name.length;
      return moduleName.substring(0, index + cutLength);
    }
  }
}

/**
 * strip extension
 * @param {string} moduleName
 * @returns {string}
 */
function stripExtNameDotTs(moduleName) {
  const moduleWithQuery = getModuleWithQueryString(moduleName);
  if (moduleWithQuery) {
    return moduleWithQuery;
  }

  if (!moduleName.endsWith('.ts')) {
    return moduleName;
  }

  const name = moduleName.slice(0, -3);

  return name;
}

/** @param {string} moduleName */
function convertRemoteToLocalCache(moduleName) {
  if (!moduleName.startsWith('http://') && !moduleName.startsWith('https://')) {
    return moduleName;
  }

  const denoDir = getDenoDir();
  // "https://deno.land/x/std/log/mod" to "$DENO_DIR/deps/https/deno.land/x/std/log/mod" (no ".ts" because stripped)
  const name = path.resolve(denoDir, 'deps', moduleName.replace('://', '/'));
  const redirectedName = fallbackHeader(name);

  return redirectedName;
}

/**
 * @template {{ mime_type: string; redirect_to: string; }} IDenoModuleHeaders
 */

/**
 * If moduleName is not found, recursively search for headers and "redirect_to" property.
 * @param {string} modulePath
 * @returns {string}
 */
function fallbackHeader(modulePath) {
  const validPath = modulePath.endsWith('.ts')
    ? modulePath
    : `${modulePath}.ts`;
  if (fs.existsSync(validPath)) {
    return modulePath;
  }

  const headersPath = `${validPath}.headers.json`;
  if (fs.existsSync(headersPath)) {
    /** @type IDenoModuleHeaders */
    const headers = JSON.parse(
      fs.readFileSync(headersPath, { encoding: 'utf-8' })
    );
    // TODO: avoid Circular
    return convertRemoteToLocalCache(stripExtNameDotTs(headers.redirect_to));
  }
  return modulePath;
}
