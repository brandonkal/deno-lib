/**
 * @package @brandonkal/deno-quokka
 * @description Injects Deno global with a simple implementation for Node.js
 * @author Brandon Kalinowski
 * @copyright 2020 Brandon Kalinowski
 * @license MIT
 */

'use strict';
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
exports.__esModule = true;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
var os = require('os');
function noop() {}
// @url js/os.d.ts
/** The current process id of the runtime. */
exports.pid = 10;
/** Reflects the NO_COLOR environment variable: https://no-color.org/ */
exports.noColor = false;
/** Check if running in terminal.
 *
 *       console.log(Deno.isTTY().stdout);
 */
function isTTY() {
  return {
    stdin: true,
    stdout: true,
    stderr: true,
  };
}
exports.isTTY = isTTY;
/** Get the hostname.
 * Requires the `--allow-env` flag.
 *
 *       console.log(Deno.hostname());
 */
function hostname() {
  return os.hostname();
}
exports.hostname = hostname;
/** Exit the Deno process with optional exit code. */
function exit(code) {
  process.exit(code);
}
exports.exit = exit;
/** Returns a snapshot of the environment variables at invocation. Mutating a
 * property in the object will set that variable in the environment for
 * the process. The environment object will only accept `string`s
 * as values.
 *
 *       const myEnv = Deno.env();
 *       console.log(myEnv.SHELL);
 *       myEnv.TEST_VAR = "HELLO";
 *       const newEnv = Deno.env();
 *       console.log(myEnv.TEST_VAR == newEnv.TEST_VAR);
 */
// export function env(): {
//   [index: string]: string;
// } {}
/** Returns the value of an environment variable at invocation.
 * If the variable is not present, `undefined` will be returned.
 *
 *       const myEnv = Deno.env();
 *       console.log(myEnv.SHELL);
 *       myEnv.TEST_VAR = "HELLO";
 *       const newEnv = Deno.env();
 *       console.log(myEnv.TEST_VAR == newEnv.TEST_VAR);
 */
function env(key) {
  return process.env;
}
exports.env = env;
/**
 * Returns the user and platform specific directories.
 * Requires the `--allow-env` flag.
 * Returns null if there is no applicable directory or if any other error
 * occurs.
 *
 * Argument values: "home", "cache", "config", "executable", "data",
 * "data_local", "audio", "desktop", "document", "download", "font", "picture",
 * "public", "template", "video"
 *
 * "cache"
 * |Platform | Value                               | Example                      |
 * | ------- | ----------------------------------- | ---------------------------- |
 * | Linux   | `$XDG_CACHE_HOME` or `$HOME`/.cache | /home/alice/.cache           |
 * | macOS   | `$HOME`/Library/Caches              | /Users/Alice/Library/Caches  |
 * | Windows | `{FOLDERID_LocalAppData}`           | C:\Users\Alice\AppData\Local |
 *
 * "config"
 * |Platform | Value                                 | Example                          |
 * | ------- | ------------------------------------- | -------------------------------- |
 * | Linux   | `$XDG_CONFIG_HOME` or `$HOME`/.config | /home/alice/.config              |
 * | macOS   | `$HOME`/Library/Preferences           | /Users/Alice/Library/Preferences |
 * | Windows | `{FOLDERID_RoamingAppData}`           | C:\Users\Alice\AppData\Roaming   |
 *
 * "executable"
 * |Platform | Value                                                           | Example                |
 * | ------- | --------------------------------------------------------------- | -----------------------|
 * | Linux   | `XDG_BIN_HOME` or `$XDG_DATA_HOME`/../bin or `$HOME`/.local/bin | /home/alice/.local/bin |
 * | macOS   | -                                                               | -                      |
 * | Windows | -                                                               | -                      |
 *
 * "data"
 * |Platform | Value                                    | Example                                  |
 * | ------- | ---------------------------------------- | ---------------------------------------- |
 * | Linux   | `$XDG_DATA_HOME` or `$HOME`/.local/share | /home/alice/.local/share                 |
 * | macOS   | `$HOME`/Library/Application Support      | /Users/Alice/Library/Application Support |
 * | Windows | `{FOLDERID_RoamingAppData}`              | C:\Users\Alice\AppData\Roaming           |
 *
 * "data_local"
 * |Platform | Value                                    | Example                                  |
 * | ------- | ---------------------------------------- | ---------------------------------------- |
 * | Linux   | `$XDG_DATA_HOME` or `$HOME`/.local/share | /home/alice/.local/share                 |
 * | macOS   | `$HOME`/Library/Application Support      | /Users/Alice/Library/Application Support |
 * | Windows | `{FOLDERID_LocalAppData}`                | C:\Users\Alice\AppData\Local             |
 *
 * "audio"
 * |Platform | Value              | Example              |
 * | ------- | ------------------ | -------------------- |
 * | Linux   | `XDG_MUSIC_DIR`    | /home/alice/Music    |
 * | macOS   | `$HOME`/Music      | /Users/Alice/Music   |
 * | Windows | `{FOLDERID_Music}` | C:\Users\Alice\Music |
 *
 * "desktop"
 * |Platform | Value                | Example                |
 * | ------- | -------------------- | ---------------------- |
 * | Linux   | `XDG_DESKTOP_DIR`    | /home/alice/Desktop    |
 * | macOS   | `$HOME`/Desktop      | /Users/Alice/Desktop   |
 * | Windows | `{FOLDERID_Desktop}` | C:\Users\Alice\Desktop |
 *
 * "document"
 * |Platform | Value                  | Example                  |
 * | ------- | ---------------------- | ------------------------ |
 * | Linux   | `XDG_DOCUMENTS_DIR`    | /home/alice/Documents    |
 * | macOS   | `$HOME`/Documents      | /Users/Alice/Documents   |
 * | Windows | `{FOLDERID_Documents}` | C:\Users\Alice\Documents |
 *
 * "download"
 * |Platform | Value                  | Example                  |
 * | ------- | ---------------------- | ------------------------ |
 * | Linux   | `XDG_DOWNLOAD_DIR`     | /home/alice/Downloads    |
 * | macOS   | `$HOME`/Downloads      | /Users/Alice/Downloads   |
 * | Windows | `{FOLDERID_Downloads}` | C:\Users\Alice\Downloads |
 *
 * "font"
 * |Platform | Value                                                | Example                        |
 * | ------- | ---------------------------------------------------- | ------------------------------ |
 * | Linux   | `$XDG_DATA_HOME`/fonts or `$HOME`/.local/share/fonts | /home/alice/.local/share/fonts |
 * | macOS   | `$HOME/Library/Fonts`                                | /Users/Alice/Library/Fonts     |
 * | Windows | –                                                    | –                              |
 *
 * "picture"
 * |Platform | Value                 | Example                 |
 * | ------- | --------------------- | ----------------------- |
 * | Linux   | `XDG_PICTURES_DIR`    | /home/alice/Pictures    |
 * | macOS   | `$HOME`/Pictures      | /Users/Alice/Pictures   |
 * | Windows | `{FOLDERID_Pictures}` | C:\Users\Alice\Pictures |
 *
 * "public"
 * |Platform | Value                 | Example             |
 * | ------- | --------------------- | ------------------- |
 * | Linux   | `XDG_PUBLICSHARE_DIR` | /home/alice/Public  |
 * | macOS   | `$HOME`/Public        | /Users/Alice/Public |
 * | Windows | `{FOLDERID_Public}`   | C:\Users\Public     |
 *
 * "template"
 * |Platform | Value                  | Example                                                    |
 * | ------- | ---------------------- | ---------------------------------------------------------- |
 * | Linux   | `XDG_TEMPLATES_DIR`    | /home/alice/Templates                                      |
 * | macOS   | –                      | –                                                          |
 * | Windows | `{FOLDERID_Templates}` | C:\Users\Alice\AppData\Roaming\Microsoft\Windows\Templates |
 *
 * "video"
 * |Platform | Value               | Example               |
 * | ------- | ------------------- | --------------------- |
 * | Linux   | `XDG_VIDEOS_DIR`    | /home/alice/Videos    |
 * | macOS   | `$HOME`/Movies      | /Users/Alice/Movies   |
 * | Windows | `{FOLDERID_Videos}` | C:\Users\Alice\Videos |
 */
function dir(kind) {
  return 'dummy';
}
exports.dir = dir;
/**
 * Returns the path to the current deno executable.
 * Requires the `--allow-env` flag.
 */
function execPath() {
  return 'deno-file.ts';
}
exports.execPath = execPath;
// @url js/dir.d.ts
/**
 * `cwd()` Return a string representing the current working directory.
 * If the current directory can be reached via multiple paths
 * (due to symbolic links), `cwd()` may return
 * any one of them.
 * throws `NotFound` exception if directory not available
 */
function cwd() {
  return process.cwd();
}
exports.cwd = cwd;
/**
 * `chdir()` Change the current working directory to path.
 * throws `NotFound` exception if directory not available
 */
function chdir(directory) {}
exports.chdir = chdir;
// @url js/io.d.ts
exports.EOF = Symbol('EOF');
var SeekMode;
(function(SeekMode) {
  SeekMode[(SeekMode['SEEK_START'] = 0)] = 'SEEK_START';
  SeekMode[(SeekMode['SEEK_CURRENT'] = 1)] = 'SEEK_CURRENT';
  SeekMode[(SeekMode['SEEK_END'] = 2)] = 'SEEK_END';
})((SeekMode = exports.SeekMode || (exports.SeekMode = {})));
/** Copies from `src` to `dst` until either `EOF` is reached on `src`
 * or an error occurs. It returns the number of bytes copied and the first
 * error encountered while copying, if any.
 *
 * Because `copy()` is defined to read from `src` until `EOF`, it does not
 * treat an `EOF` from `read()` as an error to be reported.
 */
function copy(dst, src) {
  return Promise.resolve(10);
}
exports.copy = copy;
/** Turns `r` into async iterator.
 *
 *      for await (const chunk of toAsyncIterator(reader)) {
 *          console.log(chunk)
 *      }
 */
function toAsyncIterator(r) {
  return {};
}
exports.toAsyncIterator = toAsyncIterator;
// @url js/files.d.ts
/** Open a file and return an instance of the `File` object
 *  synchronously.
 *
 *       const file = Deno.openSync("/foo/bar.txt");
 */
function openSync(filename, mode) {
  return new File(10);
}
exports.openSync = openSync;
/** Open a file and return an instance of the `File` object.
 *
 *       (async () => {
 *         const file = await Deno.open("/foo/bar.txt");
 *       })();
 */
function open(filename, mode) {
  return Promise.resolve(new File(11));
}
exports.open = open;
/** Read synchronously from a file ID into an array buffer.
 *
 * Return `number | EOF` for the operation.
 *
 *      const file = Deno.openSync("/foo/bar.txt");
 *      const buf = new Uint8Array(100);
 *      const nread = Deno.readSync(file.rid, buf);
 *      const text = new TextDecoder().decode(buf);
 *
 */
function readSync(rid, p) {
  return 2;
}
exports.readSync = readSync;
/** Read from a file ID into an array buffer.
 *
 * Resolves with the `number | EOF` for the operation.
 *
 *       (async () => {
 *         const file = await Deno.open("/foo/bar.txt");
 *         const buf = new Uint8Array(100);
 *         const nread = await Deno.read(file.rid, buf);
 *         const text = new TextDecoder().decode(buf);
 *       })();
 */
function read(rid, p) {
  return Promise.resolve(exports.EOF);
}
exports.read = read;
/** Write synchronously to the file ID the contents of the array buffer.
 *
 * Resolves with the number of bytes written.
 *
 *       const encoder = new TextEncoder();
 *       const data = encoder.encode("Hello world\n");
 *       const file = Deno.openSync("/foo/bar.txt");
 *       Deno.writeSync(file.rid, data);
 */
function writeSync(rid, p) {
  return 42;
}
exports.writeSync = writeSync;
/** Write to the file ID the contents of the array buffer.
 *
 * Resolves with the number of bytes written.
 *
 *      (async () => {
 *        const encoder = new TextEncoder();
 *        const data = encoder.encode("Hello world\n");
 *        const file = await Deno.open("/foo/bar.txt");
 *        await Deno.write(file.rid, data);
 *      })();
 *
 */
function write(rid, p) {
  return Promise.resolve(42);
}
exports.write = write;
/** Seek a file ID synchronously to the given offset under mode given by `whence`.
 *
 *       const file = Deno.openSync("/foo/bar.txt");
 *       Deno.seekSync(file.rid, 0, 0);
 */
function seekSync(rid, offset, whence) {}
exports.seekSync = seekSync;
/** Seek a file ID to the given offset under mode given by `whence`.
 *
 *      (async () => {
 *        const file = await Deno.open("/foo/bar.txt");
 *        await Deno.seek(file.rid, 0, 0);
 *      })();
 */
function seek(rid, offset, whence) {
  return Promise.resolve();
}
exports.seek = seek;
/** Close the file ID. */
function close(rid) {}
exports.close = close;
/** The Deno abstraction for reading and writing files. */
var File = /** @class */ (function() {
  function File(rid) {}
  File.prototype.write = function(p) {
    return Promise.resolve(42);
  };
  File.prototype.writeSync = function(p) {
    return 42;
  };
  File.prototype.read = function(p) {
    return Promise.resolve(42);
  };
  File.prototype.readSync = function(p) {
    return 42;
  };
  File.prototype.seek = function(offset, whence) {
    return Promise.resolve();
  };
  File.prototype.seekSync = function(offset, whence) {};
  File.prototype.close = function() {};
  return File;
})();
exports.File = File;
/** An instance of `File` for stdin. */
exports.stdin = new File(42);
/** An instance of `File` for stdout. */
exports.stdout = new File(42);
/** An instance of `File` for stderr. */
exports.stderr = new File(42);
// @url js/buffer.d.ts
/** A Buffer is a variable-sized buffer of bytes with read() and write()
 * methods. Based on https://golang.org/pkg/bytes/#Buffer
 */
var Buffer = /** @class */ (function() {
  function Buffer(ab) {
    this.capacity = 42;
    this.length = 0;
  }
  /** bytes() returns a slice holding the unread portion of the buffer.
   * The slice is valid for use only until the next buffer modification (that
   * is, only until the next call to a method like read(), write(), reset(), or
   * truncate()). The slice aliases the buffer content at least until the next
   * buffer modification, so immediate changes to the slice will affect the
   * result of future reads.
   */
  Buffer.prototype.bytes = function() {
    return new Uint8Array();
  };
  /** toString() returns the contents of the unread portion of the buffer
   * as a string. Warning - if multibyte characters are present when data is
   * flowing through the buffer, this method may result in incorrect strings
   * due to a character being split.
   */
  Buffer.prototype.toString = function() {
    return '42';
  };
  /** empty() returns whether the unread portion of the buffer is empty. */
  Buffer.prototype.empty = function() {
    return true;
  };
  /** truncate() discards all but the first n unread bytes from the buffer but
   * continues to use the same allocated storage.  It throws if n is negative or
   * greater than the length of the buffer.
   */
  Buffer.prototype.truncate = function(n) {};
  /** reset() resets the buffer to be empty, but it retains the underlying
   * storage for use by future writes. reset() is the same as truncate(0)
   */
  Buffer.prototype.reset = function() {};
  /** readSync() reads the next len(p) bytes from the buffer or until the buffer
   * is drained. The return value n is the number of bytes read. If the
   * buffer has no data to return, eof in the response will be true.
   */
  Buffer.prototype.readSync = function(p) {
    return exports.EOF;
  };
  Buffer.prototype.read = function(p) {
    return Promise.resolve(exports.EOF);
  };
  Buffer.prototype.writeSync = function(p) {
    return p.byteLength;
  };
  Buffer.prototype.write = function(p) {
    return Promise.resolve(p.byteLength);
  };
  /** grow() grows the buffer's capacity, if necessary, to guarantee space for
   * another n bytes. After grow(n), at least n bytes can be written to the
   * buffer without another allocation. If n is negative, grow() will panic. If
   * the buffer can't grow it will throw ErrTooLarge.
   * Based on https://golang.org/pkg/bytes/#Buffer.Grow
   */
  Buffer.prototype.grow = function(n) {};
  /** readFrom() reads data from r until EOF and appends it to the buffer,
   * growing the buffer as needed. It returns the number of bytes read. If the
   * buffer becomes too large, readFrom will panic with ErrTooLarge.
   * Based on https://golang.org/pkg/bytes/#Buffer.ReadFrom
   */
  Buffer.prototype.readFrom = function(r) {
    return Promise.resolve(42);
  };
  /** Sync version of `readFrom`
   */
  Buffer.prototype.readFromSync = function(r) {
    return 42;
  };
  return Buffer;
})();
exports.Buffer = Buffer;
/** Read `r` until EOF and return the content as `Uint8Array`.
 */
function readAll(r) {
  return Promise.resolve(new Uint8Array());
}
exports.readAll = readAll;
/** Read synchronously `r` until EOF and return the content as `Uint8Array`.
 */
function readAllSync(r) {
  return new Uint8Array();
}
exports.readAllSync = readAllSync;
/** Write all the content of `arr` to `w`.
 */
function writeAll(w, arr) {
  return Promise.resolve();
}
exports.writeAll = writeAll;
/** Write synchronously all the content of `arr` to `w`.
 */
function writeAllSync(w, arr) {}
exports.writeAllSync = writeAllSync;
// @url js/mkdir.d.ts
/** Creates a new directory with the specified path synchronously.
 * If `recursive` is set to true, nested directories will be created (also known
 * as "mkdir -p").
 * `mode` sets permission bits (before umask) on UNIX and does nothing on
 * Windows.
 *
 *       Deno.mkdirSync("new_dir");
 *       Deno.mkdirSync("nested/directories", true);
 */
function mkdirSync(path, recursive, mode) {}
exports.mkdirSync = mkdirSync;
/** Creates a new directory with the specified path.
 * If `recursive` is set to true, nested directories will be created (also known
 * as "mkdir -p").
 * `mode` sets permission bits (before umask) on UNIX and does nothing on
 * Windows.
 *
 *       await Deno.mkdir("new_dir");
 *       await Deno.mkdir("nested/directories", true);
 */
function mkdir(path, recursive, mode) {
  return Promise.resolve();
}
exports.mkdir = mkdir;
/** makeTempDirSync is the synchronous version of `makeTempDir`.
 *
 *       const tempDirName0 = Deno.makeTempDirSync();
 *       const tempDirName1 = Deno.makeTempDirSync({ prefix: 'my_temp' });
 */
function makeTempDirSync(options) {
  return '42';
}
exports.makeTempDirSync = makeTempDirSync;
/** makeTempDir creates a new temporary directory in the directory `dir`, its
 * name beginning with `prefix` and ending with `suffix`.
 * It returns the full path to the newly created directory.
 * If `dir` is unspecified, tempDir uses the default directory for temporary
 * files. Multiple programs calling tempDir simultaneously will not choose the
 * same directory. It is the caller's responsibility to remove the directory
 * when no longer needed.
 *
 *       const tempDirName0 = await Deno.makeTempDir();
 *       const tempDirName1 = await Deno.makeTempDir({ prefix: 'my_temp' });
 */
function makeTempDir(options) {
  return Promise.resolve('42');
}
exports.makeTempDir = makeTempDir;
// @url js/chmod.d.ts
/** Changes the permission of a specific file/directory of specified path
 * synchronously.
 *
 *       Deno.chmodSync("/path/to/file", 0o666);
 */
function chmodSync(path, mode) {}
exports.chmodSync = chmodSync;
/** Changes the permission of a specific file/directory of specified path.
 *
 *       await Deno.chmod("/path/to/file", 0o666);
 */
function chmod(path, mode) {
  return Promise.resolve();
}
exports.chmod = chmod;
// @url js/chown.d.ts
/**
 * Change owner of a regular file or directory synchronously. Unix only at the moment.
 * @param path path to the file
 * @param uid user id of the new owner
 * @param gid group id of the new owner
 */
function chownSync(path, uid, gid) {}
exports.chownSync = chownSync;
/**
 * Change owner of a regular file or directory asynchronously. Unix only at the moment.
 * @param path path to the file
 * @param uid user id of the new owner
 * @param gid group id of the new owner
 */
function chown(path, uid, gid) {
  return new Promise(function() {});
}
exports.chown = chown;
// @url js/utime.d.ts
/** Synchronously changes the access and modification times of a file system
 * object referenced by `filename`. Given times are either in seconds
 * (Unix epoch time) or as `Date` objects.
 *
 *       Deno.utimeSync("myfile.txt", 1556495550, new Date());
 */
function utimeSync(filename, atime, mtime) {}
exports.utimeSync = utimeSync;
/** Changes the access and modification times of a file system object
 * referenced by `filename`. Given times are either in seconds
 * (Unix epoch time) or as `Date` objects.
 *
 *       await Deno.utime("myfile.txt", 1556495550, new Date());
 */
function utime(filename, atime, mtime) {
  return new Promise(function() {});
}
exports.utime = utime;
/** Removes the named file or directory synchronously. Would throw
 * error if permission denied, not found, or directory not empty if `recursive`
 * set to false.
 * `recursive` is set to false by default.
 *
 *       Deno.removeSync("/path/to/dir/or/file", {recursive: false});
 */
function removeSync(path, options) {}
exports.removeSync = removeSync;
/** Removes the named file or directory. Would throw error if
 * permission denied, not found, or directory not empty if `recursive` set
 * to false.
 * `recursive` is set to false by default.
 *
 *       await Deno.remove("/path/to/dir/or/file", {recursive: false});
 */
function remove(path, options) {
  return new Promise(function() {});
}
exports.remove = remove;
// @url js/rename.d.ts
/** Synchronously renames (moves) `oldpath` to `newpath`. If `newpath` already
 * exists and is not a directory, `renameSync()` replaces it. OS-specific
 * restrictions may apply when `oldpath` and `newpath` are in different
 * directories.
 *
 *       Deno.renameSync("old/path", "new/path");
 */
function renameSync(oldpath, newpath) {}
exports.renameSync = renameSync;
/** Renames (moves) `oldpath` to `newpath`. If `newpath` already exists and is
 * not a directory, `rename()` replaces it. OS-specific restrictions may apply
 * when `oldpath` and `newpath` are in different directories.
 *
 *       await Deno.rename("old/path", "new/path");
 */
function rename(oldpath, newpath) {
  return new Promise(function() {});
}
exports.rename = rename;
// @url js/read_file.d.ts
/** Read the entire contents of a file synchronously.
 *
 *       const decoder = new TextDecoder("utf-8");
 *       const data = Deno.readFileSync("hello.txt");
 *       console.log(decoder.decode(data));
 */
function readFileSync(filename) {
  return new Uint8Array();
}
exports.readFileSync = readFileSync;
/** Read the entire contents of a file.
 *
 *       const decoder = new TextDecoder("utf-8");
 *       const data = await Deno.readFile("hello.txt");
 *       console.log(decoder.decode(data));
 */
function readFile(filename) {
  return new Promise(function() {});
}
exports.readFile = readFile;
var makeDummyFileInfo = function() {
  return {
    accessed: 0,
    created: 0,
    isDirectory: function() {
      return false;
    },
    isFile: function() {
      return true;
    },
    isSymlink: function() {
      return false;
    },
    len: 42,
    mode: 777,
    modified: 2,
    name: 'file.txt',
  };
};
// @url js/realpath.d.ts
/** Returns absolute normalized path with symbolic links resolved
 * synchronously.
 *
 *       const realPath = Deno.realpathSync("./some/path");
 */
function realpathSync(path) {
  return '/file/path';
}
exports.realpathSync = realpathSync;
/** Returns absolute normalized path with symbolic links resolved.
 *
 *       const realPath = await Deno.realpath("./some/path");
 */
function realpath(path) {
  return new Promise(noop);
}
exports.realpath = realpath;
// @url js/read_dir.d.ts
/** Reads the directory given by path and returns a list of file info
 * synchronously.
 *
 *       const files = Deno.readDirSync("/");
 */
function readDirSync(path) {
  return [];
}
exports.readDirSync = readDirSync;
/** Reads the directory given by path and returns a list of file info.
 *
 *       const files = await Deno.readDir("/");
 */
function readDir(path) {
  return new Promise(noop);
}
exports.readDir = readDir;
// @url js/copy_file.d.ts
/** Copies the contents of a file to another by name synchronously.
 * Creates a new file if target does not exists, and if target exists,
 * overwrites original content of the target file.
 *
 * It would also copy the permission of the original file
 * to the destination.
 *
 *       Deno.copyFileSync("from.txt", "to.txt");
 */
function copyFileSync(from, to) {}
exports.copyFileSync = copyFileSync;
/** Copies the contents of a file to another by name.
 *
 * Creates a new file if target does not exists, and if target exists,
 * overwrites original content of the target file.
 *
 * It would also copy the permission of the original file
 * to the destination.
 *
 *       await Deno.copyFile("from.txt", "to.txt");
 */
function copyFile(from, to) {
  return Promise.resolve();
}
exports.copyFile = copyFile;
// @url js/read_link.d.ts
/** Returns the destination of the named symbolic link synchronously.
 *
 *       const targetPath = Deno.readlinkSync("symlink/path");
 */
function readlinkSync(name) {
  return 'symlink/path';
}
exports.readlinkSync = readlinkSync;
/** Returns the destination of the named symbolic link.
 *
 *       const targetPath = await Deno.readlink("symlink/path");
 */
function readlink(name) {
  return Promise.resolve('symlink/path');
}
exports.readlink = readlink;
/** Queries the file system for information on the path provided. If the given
 * path is a symlink information about the symlink will be returned.
 *
 *       const fileInfo = await Deno.lstat("hello.txt");
 *       assert(fileInfo.isFile());
 */
function lstat(filename) {
  return new Promise(noop);
}
exports.lstat = lstat;
/** Queries the file system for information on the path provided synchronously.
 * If the given path is a symlink information about the symlink will be
 * returned.
 *
 *       const fileInfo = Deno.lstatSync("hello.txt");
 *       assert(fileInfo.isFile());
 */
function lstatSync(filename) {
  return makeDummyFileInfo();
}
exports.lstatSync = lstatSync;
/** Queries the file system for information on the path provided. `stat` Will
 * always follow symlinks.
 *
 *       const fileInfo = await Deno.stat("hello.txt");
 *       assert(fileInfo.isFile());
 */
function stat(filename) {
  return Promise.resolve(makeDummyFileInfo());
}
exports.stat = stat;
/** Queries the file system for information on the path provided synchronously.
 * `statSync` Will always follow symlinks.
 *
 *       const fileInfo = Deno.statSync("hello.txt");
 *       assert(fileInfo.isFile());
 */
function statSync(filename) {
  return makeDummyFileInfo();
}
exports.statSync = statSync;
// @url js/link.d.ts
/** Synchronously creates `newname` as a hard link to `oldname`.
 *
 *       Deno.linkSync("old/name", "new/name");
 */
function linkSync(oldname, newname) {}
exports.linkSync = linkSync;
/** Creates `newname` as a hard link to `oldname`.
 *
 *       await Deno.link("old/name", "new/name");
 */
function link(oldname, newname) {
  return Promise.resolve();
}
exports.link = link;
// @url js/symlink.d.ts
/** Synchronously creates `newname` as a symbolic link to `oldname`. The type
 * argument can be set to `dir` or `file` and is only available on Windows
 * (ignored on other platforms).
 *
 *       Deno.symlinkSync("old/name", "new/name");
 */
function symlinkSync(oldname, newname, type) {}
exports.symlinkSync = symlinkSync;
/** Creates `newname` as a symbolic link to `oldname`. The type argument can be
 * set to `dir` or `file` and is only available on Windows (ignored on other
 * platforms).
 *
 *       await Deno.symlink("old/name", "new/name");
 */
function symlink(oldname, newname, type) {
  return Promise.resolve();
}
exports.symlink = symlink;
/** Write a new file, with given filename and data synchronously.
 *
 *       const encoder = new TextEncoder();
 *       const data = encoder.encode("Hello world\n");
 *       Deno.writeFileSync("hello.txt", data);
 */
function writeFileSync(filename, data, options) {}
exports.writeFileSync = writeFileSync;
/** Write a new file, with given filename and data.
 *
 *       const encoder = new TextEncoder();
 *       const data = encoder.encode("Hello world\n");
 *       await Deno.writeFile("hello.txt", data);
 */
function writeFile(filename, data, options) {
  return Promise.resolve();
}
exports.writeFile = writeFile;
var makeDummyLocation = function() {
  return {
    filename: 'file.txt',
    line: 0,
    column: 0,
  };
};
/** Given a current location in a module, lookup the source location and
 * return it.
 *
 * When Deno transpiles code, it keep source maps of the transpiled code.  This
 * function can be used to lookup the original location.  This is automatically
 * done when accessing the `.stack` of an error, or when an uncaught error is
 * logged.  This function can be used to perform the lookup for creating better
 * error handling.
 *
 * **Note:** `line` and `column` are 1 indexed, which matches display
 * expectations, but is not typical of most index numbers in Deno.
 *
 * An example:
 *
 *       const orig = Deno.applySourceMap({
 *         location: "file://my/module.ts",
 *         line: 5,
 *         column: 15
 *       });
 *       console.log(`${orig.filename}:${orig.line}:${orig.column}`);
 *
 */
function applySourceMap(location) {
  return location;
}
exports.applySourceMap = applySourceMap;
// @url js/errors.d.ts
/** A Deno specific error.  The `kind` property is set to a specific error code
 * which can be used to in application logic.
 *
 *       try {
 *         somethingThatMightThrow();
 *       } catch (e) {
 *         if (
 *           e instanceof Deno.DenoError &&
 *           e.kind === Deno.ErrorKind.Overflow
 *         ) {
 *           console.error("Overflow error!");
 *         }
 *       }
 *
 */
var DenoError = /** @class */ (function(_super) {
  __extends(DenoError, _super);
  function DenoError(kind, msg) {
    var _this = _super.call(this, msg) || this;
    _this.kind = kind;
    _this.message = msg;
    return _this;
  }
  return DenoError;
})(Error);
exports.DenoError = DenoError;
var ErrorKind;
(function(ErrorKind) {
  ErrorKind[(ErrorKind['NoError'] = 0)] = 'NoError';
  ErrorKind[(ErrorKind['NotFound'] = 1)] = 'NotFound';
  ErrorKind[(ErrorKind['PermissionDenied'] = 2)] = 'PermissionDenied';
  ErrorKind[(ErrorKind['ConnectionRefused'] = 3)] = 'ConnectionRefused';
  ErrorKind[(ErrorKind['ConnectionReset'] = 4)] = 'ConnectionReset';
  ErrorKind[(ErrorKind['ConnectionAborted'] = 5)] = 'ConnectionAborted';
  ErrorKind[(ErrorKind['NotConnected'] = 6)] = 'NotConnected';
  ErrorKind[(ErrorKind['AddrInUse'] = 7)] = 'AddrInUse';
  ErrorKind[(ErrorKind['AddrNotAvailable'] = 8)] = 'AddrNotAvailable';
  ErrorKind[(ErrorKind['BrokenPipe'] = 9)] = 'BrokenPipe';
  ErrorKind[(ErrorKind['AlreadyExists'] = 10)] = 'AlreadyExists';
  ErrorKind[(ErrorKind['WouldBlock'] = 11)] = 'WouldBlock';
  ErrorKind[(ErrorKind['InvalidInput'] = 12)] = 'InvalidInput';
  ErrorKind[(ErrorKind['InvalidData'] = 13)] = 'InvalidData';
  ErrorKind[(ErrorKind['TimedOut'] = 14)] = 'TimedOut';
  ErrorKind[(ErrorKind['Interrupted'] = 15)] = 'Interrupted';
  ErrorKind[(ErrorKind['WriteZero'] = 16)] = 'WriteZero';
  ErrorKind[(ErrorKind['Other'] = 17)] = 'Other';
  ErrorKind[(ErrorKind['UnexpectedEof'] = 18)] = 'UnexpectedEof';
  ErrorKind[(ErrorKind['BadResource'] = 19)] = 'BadResource';
  ErrorKind[(ErrorKind['CommandFailed'] = 20)] = 'CommandFailed';
  ErrorKind[(ErrorKind['EmptyHost'] = 21)] = 'EmptyHost';
  ErrorKind[(ErrorKind['IdnaError'] = 22)] = 'IdnaError';
  ErrorKind[(ErrorKind['InvalidPort'] = 23)] = 'InvalidPort';
  ErrorKind[(ErrorKind['InvalidIpv4Address'] = 24)] = 'InvalidIpv4Address';
  ErrorKind[(ErrorKind['InvalidIpv6Address'] = 25)] = 'InvalidIpv6Address';
  ErrorKind[(ErrorKind['InvalidDomainCharacter'] = 26)] =
    'InvalidDomainCharacter';
  ErrorKind[(ErrorKind['RelativeUrlWithoutBase'] = 27)] =
    'RelativeUrlWithoutBase';
  ErrorKind[(ErrorKind['RelativeUrlWithCannotBeABaseBase'] = 28)] =
    'RelativeUrlWithCannotBeABaseBase';
  ErrorKind[(ErrorKind['SetHostOnCannotBeABaseUrl'] = 29)] =
    'SetHostOnCannotBeABaseUrl';
  ErrorKind[(ErrorKind['Overflow'] = 30)] = 'Overflow';
  ErrorKind[(ErrorKind['HttpUser'] = 31)] = 'HttpUser';
  ErrorKind[(ErrorKind['HttpClosed'] = 32)] = 'HttpClosed';
  ErrorKind[(ErrorKind['HttpCanceled'] = 33)] = 'HttpCanceled';
  ErrorKind[(ErrorKind['HttpParse'] = 34)] = 'HttpParse';
  ErrorKind[(ErrorKind['HttpOther'] = 35)] = 'HttpOther';
  ErrorKind[(ErrorKind['TooLarge'] = 36)] = 'TooLarge';
  ErrorKind[(ErrorKind['InvalidUri'] = 37)] = 'InvalidUri';
  ErrorKind[(ErrorKind['InvalidSeekMode'] = 38)] = 'InvalidSeekMode';
  ErrorKind[(ErrorKind['OpNotAvailable'] = 39)] = 'OpNotAvailable';
  ErrorKind[(ErrorKind['WorkerInitFailed'] = 40)] = 'WorkerInitFailed';
  ErrorKind[(ErrorKind['UnixError'] = 41)] = 'UnixError';
  ErrorKind[(ErrorKind['NoAsyncSupport'] = 42)] = 'NoAsyncSupport';
  ErrorKind[(ErrorKind['NoSyncSupport'] = 43)] = 'NoSyncSupport';
  ErrorKind[(ErrorKind['ImportMapError'] = 44)] = 'ImportMapError';
  ErrorKind[(ErrorKind['InvalidPath'] = 45)] = 'InvalidPath';
  ErrorKind[(ErrorKind['ImportPrefixMissing'] = 46)] = 'ImportPrefixMissing';
  ErrorKind[(ErrorKind['UnsupportedFetchScheme'] = 47)] =
    'UnsupportedFetchScheme';
  ErrorKind[(ErrorKind['TooManyRedirects'] = 48)] = 'TooManyRedirects';
  ErrorKind[(ErrorKind['Diagnostic'] = 49)] = 'Diagnostic';
  ErrorKind[(ErrorKind['JSError'] = 50)] = 'JSError';
})((ErrorKind = exports.ErrorKind || (exports.ErrorKind = {})));
var Permissions = /** @class */ (function() {
  function Permissions() {}
  /** Queries the permission.
   *       const status = await Deno.permissions.query({ name: "read", path: "/etc" });
   *       if (status.state === "granted") {
   *         data = await Deno.readFile("/etc/passwd");
   *       }
   */
  Permissions.prototype.query = function(d) {
    return new Promise(noop);
  };
  /** Revokes the permission.
   *       const status = await Deno.permissions.revoke({ name: "run" });
   *       assert(status.state !== "granted")
   */
  Permissions.prototype.revoke = function(d) {
    return new Promise(noop);
  };
  /** Requests the permission.
   *       const status = await Deno.permissions.request({ name: "env" });
   *       if (status.state === "granted") {
   *         console.log(Deno.homeDir());
   *       } else {
   *         console.log("'env' permission is denied.");
   *       }
   */
  Permissions.prototype.request = function(desc) {
    return new Promise(noop);
  };
  return Permissions;
})();
exports.Permissions = Permissions;
exports.permissions = {
  query: function() {
    return Promise.resolve(new PermissionStatus('granted'));
  },
  request: function() {
    return Promise.resolve(new PermissionStatus('granted'));
  },
  revoke: function() {
    return Promise.resolve(new PermissionStatus('denied'));
  },
};
/** https://w3c.github.io/permissions/#permissionstatus */
var PermissionStatus = /** @class */ (function() {
  function PermissionStatus(state) {
    this.state = state;
  }
  return PermissionStatus;
})();
exports.PermissionStatus = PermissionStatus;
// @url js/truncate.d.ts
/** Truncates or extends the specified file synchronously, updating the size of
 * this file to become size.
 *
 *       Deno.truncateSync("hello.txt", 10);
 */
function truncateSync(name, len) {}
exports.truncateSync = truncateSync;
/**
 * Truncates or extends the specified file, updating the size of this file to
 * become size.
 *
 *       await Deno.truncate("hello.txt", 10);
 */
function truncate(name, len) {
  return Promise.resolve();
}
exports.truncate = truncate;
/** Open and initalize a plugin.
 * Requires the `--allow-plugin` flag.
 *
 *        const plugin = Deno.openPlugin("./path/to/some/plugin.so");
 *        const some_op = plugin.ops.some_op;
 *        const response = some_op.dispatch(new Uint8Array([1,2,3,4]));
 *        console.log(`Response from plugin ${response}`);
 */
function openPlugin(filename) {
  return {
    ops: {},
  };
}
exports.openPlugin = openPlugin;
var ShutdownMode;
(function(ShutdownMode) {
  // See http://man7.org/linux/man-pages/man2/shutdown.2.html
  // Corresponding to SHUT_RD, SHUT_WR, SHUT_RDWR
  ShutdownMode[(ShutdownMode['Read'] = 0)] = 'Read';
  ShutdownMode[(ShutdownMode['Write'] = 1)] = 'Write';
  ShutdownMode[(ShutdownMode['ReadWrite'] = 2)] = 'ReadWrite'; // unused
})((ShutdownMode = exports.ShutdownMode || (exports.ShutdownMode = {})));
/** Shut down socket send and receive operations.
 *
 * Matches behavior of POSIX shutdown(3).
 *
 *       const listener = Deno.listen({ port: 80 });
 *       const conn = await listener.accept();
 *       Deno.shutdown(conn.rid, Deno.ShutdownMode.Write);
 */
function shutdown(rid, how) {}
exports.shutdown = shutdown;
/** Listen announces on the local transport address.
 *
 * @param options
 * @param options.port The port to connect to. (Required.)
 * @param options.hostname A literal IP address or host name that can be
 *   resolved to an IP address. If not specified, defaults to 0.0.0.0
 * @param options.transport Defaults to "tcp". Later we plan to add "tcp4",
 *   "tcp6", "udp", "udp4", "udp6", "ip", "ip4", "ip6", "unix", "unixgram" and
 *   "unixpacket".
 *
 * Examples:
 *
 *     listen({ port: 80 })
 *     listen({ hostname: "192.0.2.1", port: 80 })
 *     listen({ hostname: "[2001:db8::1]", port: 80 });
 *     listen({ hostname: "golang.org", port: 80, transport: "tcp" })
 */
function listen(options) {
  return;
}
exports.listen = listen;
/** Listen announces on the local transport address over TLS (transport layer security).
 *
 * @param options
 * @param options.port The port to connect to. (Required.)
 * @param options.hostname A literal IP address or host name that can be
 *   resolved to an IP address. If not specified, defaults to 0.0.0.0
 * @param options.certFile Server certificate file
 * @param options.keyFile Server public key file
 *
 * Examples:
 *
 *     Deno.listenTLS({ port: 443, certFile: "./my_server.crt", keyFile: "./my_server.key" })
 */
function listenTLS(options) {
  var _a;
  return (
    (_a = {
      accept: function() {
        return new Promise(noop);
      },
      addr: function() {
        return {
          address: '192.168.1.10',
          transport: 'tcp',
        };
      },
      close: function() {},
      next: function() {
        return new Promise(noop);
      },
      return: function() {
        return new Promise(noop);
      },
      throw: function() {
        return {};
      },
    }),
    (_a[Symbol.asyncIterator] = {}),
    _a
  );
  // export interface Listener extends AsyncIterator<Conn> {
  //   /** Waits for and resolves to the next connection to the `Listener`. */
  //   accept(): Promise<Conn>;
  //   /** Close closes the listener. Any pending accept promises will be rejected
  //    * with errors.
  //    */
  //   close(): void;
  //   /** Return the address of the `Listener`. */
  //   addr(): Addr;
  //   [Symbol.asyncIterator](): AsyncIterator<Conn>;
  // }
}
exports.listenTLS = listenTLS;
/** Dial connects to the address on the named transport.
 *
 * @param options
 * @param options.port The port to connect to. (Required.)
 * @param options.hostname A literal IP address or host name that can be
 *   resolved to an IP address. If not specified, defaults to 127.0.0.1
 * @param options.transport Defaults to "tcp". Later we plan to add "tcp4",
 *   "tcp6", "udp", "udp4", "udp6", "ip", "ip4", "ip6", "unix", "unixgram" and
 *   "unixpacket".
 *
 * Examples:
 *
 *     dial({ port: 80 })
 *     dial({ hostname: "192.0.2.1", port: 80 })
 *     dial({ hostname: "[2001:db8::1]", port: 80 });
 *     dial({ hostname: "golang.org", port: 80, transport: "tcp" })
 */
function dial(options) {
  return new Promise(noop);
}
exports.dial = dial;
/**
 * dialTLS establishes a secure connection over TLS (transport layer security).
 */
function dialTLS(options) {
  return new Promise(noop);
}
exports.dialTLS = dialTLS;
/** Receive metrics from the privileged side of Deno.
 *
 *      > console.table(Deno.metrics())
 *      ┌──────────────────┬────────┐
 *      │     (index)      │ Values │
 *      ├──────────────────┼────────┤
 *      │  opsDispatched   │   9    │
 *      │   opsCompleted   │   9    │
 *      │ bytesSentControl │  504   │
 *      │  bytesSentData   │   0    │
 *      │  bytesReceived   │  856   │
 *      └──────────────────┴────────┘
 */
function metrics() {
  return {
    opsDispatched: 42,
    opsCompleted: 42,
    bytesSentControl: 42,
    bytesSentData: 42,
    bytesReceived: 42,
  };
}
exports.metrics = metrics;
/** Returns a map of open _file like_ resource ids along with their string
 * representation.
 */
function resources() {
  return {};
}
exports.resources = resources;
/** Send a signal to process under given PID. Unix only at this moment.
 * If pid is negative, the signal will be sent to the process group identified
 * by -pid.
 * Requires the `--allow-run` flag.
 */
function kill(pid, signo) {}
exports.kill = kill;
var Process = /** @class */ (function() {
  function Process() {}
  Process.prototype.status = function() {
    return new Promise(noop);
  };
  /** Buffer the stdout and return it as Uint8Array after EOF.
   * You must set stdout to "piped" when creating the process.
   * This calls close() on stdout after its done.
   */
  Process.prototype.output = function() {
    return Promise.resolve(new Uint8Array());
  };
  /** Buffer the stderr and return it as Uint8Array after EOF.
   * You must set stderr to "piped" when creating the process.
   * This calls close() on stderr after its done.
   */
  Process.prototype.stderrOutput = function() {
    return Promise.resolve(new Uint8Array());
  };
  Process.prototype.close = function() {};
  Process.prototype.kill = function(signo) {};
  return Process;
})();
exports.Process = Process;
/**
 * Spawns new subprocess.
 *
 * Subprocess uses same working directory as parent process unless `opt.cwd`
 * is specified.
 *
 * Environmental variables for subprocess can be specified using `opt.env`
 * mapping.
 *
 * By default subprocess inherits stdio of parent process. To change that
 * `opt.stdout`, `opt.stderr` and `opt.stdin` can be specified independently -
 * they can be set to either `ProcessStdio` or `rid` of open file.
 */
function run(opt) {
  return {};
}
exports.run = run;
var LinuxSignal;
(function(LinuxSignal) {
  LinuxSignal[(LinuxSignal['SIGHUP'] = 1)] = 'SIGHUP';
  LinuxSignal[(LinuxSignal['SIGINT'] = 2)] = 'SIGINT';
  LinuxSignal[(LinuxSignal['SIGQUIT'] = 3)] = 'SIGQUIT';
  LinuxSignal[(LinuxSignal['SIGILL'] = 4)] = 'SIGILL';
  LinuxSignal[(LinuxSignal['SIGTRAP'] = 5)] = 'SIGTRAP';
  LinuxSignal[(LinuxSignal['SIGABRT'] = 6)] = 'SIGABRT';
  LinuxSignal[(LinuxSignal['SIGBUS'] = 7)] = 'SIGBUS';
  LinuxSignal[(LinuxSignal['SIGFPE'] = 8)] = 'SIGFPE';
  LinuxSignal[(LinuxSignal['SIGKILL'] = 9)] = 'SIGKILL';
  LinuxSignal[(LinuxSignal['SIGUSR1'] = 10)] = 'SIGUSR1';
  LinuxSignal[(LinuxSignal['SIGSEGV'] = 11)] = 'SIGSEGV';
  LinuxSignal[(LinuxSignal['SIGUSR2'] = 12)] = 'SIGUSR2';
  LinuxSignal[(LinuxSignal['SIGPIPE'] = 13)] = 'SIGPIPE';
  LinuxSignal[(LinuxSignal['SIGALRM'] = 14)] = 'SIGALRM';
  LinuxSignal[(LinuxSignal['SIGTERM'] = 15)] = 'SIGTERM';
  LinuxSignal[(LinuxSignal['SIGSTKFLT'] = 16)] = 'SIGSTKFLT';
  LinuxSignal[(LinuxSignal['SIGCHLD'] = 17)] = 'SIGCHLD';
  LinuxSignal[(LinuxSignal['SIGCONT'] = 18)] = 'SIGCONT';
  LinuxSignal[(LinuxSignal['SIGSTOP'] = 19)] = 'SIGSTOP';
  LinuxSignal[(LinuxSignal['SIGTSTP'] = 20)] = 'SIGTSTP';
  LinuxSignal[(LinuxSignal['SIGTTIN'] = 21)] = 'SIGTTIN';
  LinuxSignal[(LinuxSignal['SIGTTOU'] = 22)] = 'SIGTTOU';
  LinuxSignal[(LinuxSignal['SIGURG'] = 23)] = 'SIGURG';
  LinuxSignal[(LinuxSignal['SIGXCPU'] = 24)] = 'SIGXCPU';
  LinuxSignal[(LinuxSignal['SIGXFSZ'] = 25)] = 'SIGXFSZ';
  LinuxSignal[(LinuxSignal['SIGVTALRM'] = 26)] = 'SIGVTALRM';
  LinuxSignal[(LinuxSignal['SIGPROF'] = 27)] = 'SIGPROF';
  LinuxSignal[(LinuxSignal['SIGWINCH'] = 28)] = 'SIGWINCH';
  LinuxSignal[(LinuxSignal['SIGIO'] = 29)] = 'SIGIO';
  LinuxSignal[(LinuxSignal['SIGPWR'] = 30)] = 'SIGPWR';
  LinuxSignal[(LinuxSignal['SIGSYS'] = 31)] = 'SIGSYS';
})(LinuxSignal || (LinuxSignal = {}));
var MacOSSignal;
(function(MacOSSignal) {
  MacOSSignal[(MacOSSignal['SIGHUP'] = 1)] = 'SIGHUP';
  MacOSSignal[(MacOSSignal['SIGINT'] = 2)] = 'SIGINT';
  MacOSSignal[(MacOSSignal['SIGQUIT'] = 3)] = 'SIGQUIT';
  MacOSSignal[(MacOSSignal['SIGILL'] = 4)] = 'SIGILL';
  MacOSSignal[(MacOSSignal['SIGTRAP'] = 5)] = 'SIGTRAP';
  MacOSSignal[(MacOSSignal['SIGABRT'] = 6)] = 'SIGABRT';
  MacOSSignal[(MacOSSignal['SIGEMT'] = 7)] = 'SIGEMT';
  MacOSSignal[(MacOSSignal['SIGFPE'] = 8)] = 'SIGFPE';
  MacOSSignal[(MacOSSignal['SIGKILL'] = 9)] = 'SIGKILL';
  MacOSSignal[(MacOSSignal['SIGBUS'] = 10)] = 'SIGBUS';
  MacOSSignal[(MacOSSignal['SIGSEGV'] = 11)] = 'SIGSEGV';
  MacOSSignal[(MacOSSignal['SIGSYS'] = 12)] = 'SIGSYS';
  MacOSSignal[(MacOSSignal['SIGPIPE'] = 13)] = 'SIGPIPE';
  MacOSSignal[(MacOSSignal['SIGALRM'] = 14)] = 'SIGALRM';
  MacOSSignal[(MacOSSignal['SIGTERM'] = 15)] = 'SIGTERM';
  MacOSSignal[(MacOSSignal['SIGURG'] = 16)] = 'SIGURG';
  MacOSSignal[(MacOSSignal['SIGSTOP'] = 17)] = 'SIGSTOP';
  MacOSSignal[(MacOSSignal['SIGTSTP'] = 18)] = 'SIGTSTP';
  MacOSSignal[(MacOSSignal['SIGCONT'] = 19)] = 'SIGCONT';
  MacOSSignal[(MacOSSignal['SIGCHLD'] = 20)] = 'SIGCHLD';
  MacOSSignal[(MacOSSignal['SIGTTIN'] = 21)] = 'SIGTTIN';
  MacOSSignal[(MacOSSignal['SIGTTOU'] = 22)] = 'SIGTTOU';
  MacOSSignal[(MacOSSignal['SIGIO'] = 23)] = 'SIGIO';
  MacOSSignal[(MacOSSignal['SIGXCPU'] = 24)] = 'SIGXCPU';
  MacOSSignal[(MacOSSignal['SIGXFSZ'] = 25)] = 'SIGXFSZ';
  MacOSSignal[(MacOSSignal['SIGVTALRM'] = 26)] = 'SIGVTALRM';
  MacOSSignal[(MacOSSignal['SIGPROF'] = 27)] = 'SIGPROF';
  MacOSSignal[(MacOSSignal['SIGWINCH'] = 28)] = 'SIGWINCH';
  MacOSSignal[(MacOSSignal['SIGINFO'] = 29)] = 'SIGINFO';
  MacOSSignal[(MacOSSignal['SIGUSR1'] = 30)] = 'SIGUSR1';
  MacOSSignal[(MacOSSignal['SIGUSR2'] = 31)] = 'SIGUSR2';
})(MacOSSignal || (MacOSSignal = {}));
/** Signals numbers. This is platform dependent.
 */
exports.Signal = LinuxSignal.SIGABRT;
/** A symbol which can be used as a key for a custom method which will be called
 * when `Deno.inspect()` is called, or when the object is logged to the console.
 */
exports.customInspect = Symbol('customInspect');
/**
 * `inspect()` converts input into string that has the same format
 * as printed by `console.log(...)`;
 */
function inspect(value, options) {
  return String(value);
}
exports.inspect = inspect;
exports.build = {
  arch: 'x64',
  os: 'linux',
};
exports.version = {
  deno: '0.28.1',
  v8: '8.0.192',
  typescript: '3.7.2',
};
// @url js/deno.d.ts
exports.args = [];
