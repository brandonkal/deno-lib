// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */

/// <reference path="../node_modules/@types/node/index.d.ts" />

import * as os from 'os'

function noop() {}

// @url js/os.d.ts

/** The current process id of the runtime. */
export const pid: number = 10
/** Reflects the NO_COLOR environment variable: https://no-color.org/ */
export const noColor: boolean = false
/** Check if running in terminal.
 *
 *       console.log(Deno.isTTY().stdout);
 */
export function isTTY(): {
	stdin: boolean
	stdout: boolean
	stderr: boolean
} {
	return {
		stdin: true,
		stdout: true,
		stderr: true,
	}
}
/** Get the hostname.
 * Requires the `--allow-env` flag.
 *
 *       console.log(Deno.hostname());
 */
export function hostname(): string {
	return os.hostname()
}
/** Exit the Deno process with optional exit code. */
export function exit(code?: number): never {
	process.exit(code)
}
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
export function env(key?: string): { [index: string]: string } {
	return process.env
}

export type DirKind =
	| 'home'
	| 'cache'
	| 'config'
	| 'executable'
	| 'data'
	| 'data_local'
	| 'audio'
	| 'desktop'
	| 'document'
	| 'download'
	| 'font'
	| 'picture'
	| 'public'
	| 'template'
	| 'video'

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
export function dir(kind: DirKind): string | null {
	return 'dummy'
}

/**
 * Returns the path to the current deno executable.
 * Requires the `--allow-env` flag.
 */
export function execPath(): string {
	return 'deno-file.ts'
}

// @url js/dir.d.ts

/**
 * `cwd()` Return a string representing the current working directory.
 * If the current directory can be reached via multiple paths
 * (due to symbolic links), `cwd()` may return
 * any one of them.
 * throws `NotFound` exception if directory not available
 */
export function cwd(): string {
	return process.cwd()
}
/**
 * `chdir()` Change the current working directory to path.
 * throws `NotFound` exception if directory not available
 */
export function chdir(directory: string): void {}

// @url js/io.d.ts

export const EOF: unique symbol = Symbol('EOF')
export type EOF = typeof EOF
export enum SeekMode {
	SEEK_START = 0,
	SEEK_CURRENT = 1,
	SEEK_END = 2,
}
export interface Reader {
	/** Reads up to p.byteLength bytes into `p`. It resolves to the number
	 * of bytes read (`0` < `n` <= `p.byteLength`) and rejects if any error encountered.
	 * Even if `read()` returns `n` < `p.byteLength`, it may use all of `p` as
	 * scratch space during the call. If some data is available but not
	 * `p.byteLength` bytes, `read()` conventionally returns what is available
	 * instead of waiting for more.
	 *
	 * When `read()` encounters end-of-file condition, it returns EOF symbol.
	 *
	 * When `read()` encounters an error, it rejects with an error.
	 *
	 * Callers should always process the `n` > `0` bytes returned before
	 * considering the EOF. Doing so correctly handles I/O errors that happen
	 * after reading some bytes and also both of the allowed EOF behaviors.
	 *
	 * Implementations must not retain `p`.
	 */
	read(p: Uint8Array): Promise<number | EOF>
}
export interface SyncReader {
	readSync(p: Uint8Array): number | EOF
}
export interface Writer {
	/** Writes `p.byteLength` bytes from `p` to the underlying data
	 * stream. It resolves to the number of bytes written from `p` (`0` <= `n` <=
	 * `p.byteLength`) and any error encountered that caused the write to stop
	 * early. `write()` must return a non-null error if it returns `n` <
	 * `p.byteLength`. write() must not modify the slice data, even temporarily.
	 *
	 * Implementations must not retain `p`.
	 */
	write(p: Uint8Array): Promise<number>
}
export interface SyncWriter {
	writeSync(p: Uint8Array): number
}
export interface Closer {
	close(): void
}
export interface Seeker {
	/** Seek sets the offset for the next `read()` or `write()` to offset,
	 * interpreted according to `whence`: `SeekStart` means relative to the start
	 * of the file, `SeekCurrent` means relative to the current offset, and
	 * `SeekEnd` means relative to the end. Seek returns the new offset relative
	 * to the start of the file and an error, if any.
	 *
	 * Seeking to an offset before the start of the file is an error. Seeking to
	 * any positive offset is legal, but the behavior of subsequent I/O operations
	 * on the underlying object is implementation-dependent.
	 */
	seek(offset: number, whence: SeekMode): Promise<void>
}
export interface SyncSeeker {
	seekSync(offset: number, whence: SeekMode): void
}
export interface ReadCloser extends Reader, Closer {}
export interface WriteCloser extends Writer, Closer {}
export interface ReadSeeker extends Reader, Seeker {}
export interface WriteSeeker extends Writer, Seeker {}
export interface ReadWriteCloser extends Reader, Writer, Closer {}
export interface ReadWriteSeeker extends Reader, Writer, Seeker {}
/** Copies from `src` to `dst` until either `EOF` is reached on `src`
 * or an error occurs. It returns the number of bytes copied and the first
 * error encountered while copying, if any.
 *
 * Because `copy()` is defined to read from `src` until `EOF`, it does not
 * treat an `EOF` from `read()` as an error to be reported.
 */
export function copy(dst: Writer, src: Reader): Promise<number> {
	return Promise.resolve(10)
}
/** Turns `r` into async iterator.
 *
 *      for await (const chunk of toAsyncIterator(reader)) {
 *          console.log(chunk)
 *      }
 */
export function toAsyncIterator(r: Reader): AsyncIterableIterator<Uint8Array> {
	return {} as any
}

// @url js/files.d.ts

/** Open a file and return an instance of the `File` object
 *  synchronously.
 *
 *       const file = Deno.openSync("/foo/bar.txt");
 */
export function openSync(filename: string, mode?: OpenMode): File {
	return new File(10)
}
/** Open a file and return an instance of the `File` object.
 *
 *       (async () => {
 *         const file = await Deno.open("/foo/bar.txt");
 *       })();
 */
export function open(filename: string, mode?: OpenMode): Promise<File> {
	return Promise.resolve(new File(11))
}
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
export function readSync(rid: number, p: Uint8Array): number | EOF {
	return 2
}
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
export function read(rid: number, p: Uint8Array): Promise<number | EOF> {
	return Promise.resolve(EOF)
}
/** Write synchronously to the file ID the contents of the array buffer.
 *
 * Resolves with the number of bytes written.
 *
 *       const encoder = new TextEncoder();
 *       const data = encoder.encode("Hello world\n");
 *       const file = Deno.openSync("/foo/bar.txt");
 *       Deno.writeSync(file.rid, data);
 */
export function writeSync(rid: number, p: Uint8Array): number {
	return 42
}
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
export function write(rid: number, p: Uint8Array): Promise<number> {
	return Promise.resolve(42)
}
/** Seek a file ID synchronously to the given offset under mode given by `whence`.
 *
 *       const file = Deno.openSync("/foo/bar.txt");
 *       Deno.seekSync(file.rid, 0, 0);
 */
export function seekSync(rid: number, offset: number, whence: SeekMode): void {}
/** Seek a file ID to the given offset under mode given by `whence`.
 *
 *      (async () => {
 *        const file = await Deno.open("/foo/bar.txt");
 *        await Deno.seek(file.rid, 0, 0);
 *      })();
 */
export function seek(
	rid: number,
	offset: number,
	whence: SeekMode
): Promise<void> {
	return Promise.resolve()
}
/** Close the file ID. */
export function close(rid: number): void {}
/** The Deno abstraction for reading and writing files. */
export class File
	implements
		Reader,
		SyncReader,
		Writer,
		SyncWriter,
		Seeker,
		SyncSeeker,
		Closer {
	readonly rid: number
	constructor(rid: number) {}
	write(p: Uint8Array): Promise<number> {
		return Promise.resolve(42)
	}
	writeSync(p: Uint8Array): number {
		return 42
	}
	read(p: Uint8Array): Promise<number | EOF> {
		return Promise.resolve(42)
	}
	readSync(p: Uint8Array): number | EOF {
		return 42
	}
	seek(offset: number, whence: SeekMode): Promise<void> {
		return Promise.resolve()
	}
	seekSync(offset: number, whence: SeekMode): void {}
	close(): void {}
}
/** An instance of `File` for stdin. */
export const stdin: File = new File(42)
/** An instance of `File` for stdout. */
export const stdout: File = new File(42)
/** An instance of `File` for stderr. */
export const stderr: File = new File(42)
export type OpenMode =
	| 'r'
	/** Read-write. Start at beginning of file. */
	| 'r+'
	/** Write-only. Opens and truncates existing file or creates new one for
	 * writing only.
	 */
	| 'w'
	/** Read-write. Opens and truncates existing file or creates new one for
	 * writing and reading.
	 */
	| 'w+'
	/** Write-only. Opens existing file or creates new one. Each write appends
	 * content to the end of file.
	 */
	| 'a'
	/** Read-write. Behaves like "a" and allows to read from file. */
	| 'a+'
	/** Write-only. Exclusive create - creates new file only if one doesn't exist
	 * already.
	 */
	| 'x'
	/** Read-write. Behaves like `x` and allows to read from file. */
	| 'x+'

// @url js/buffer.d.ts

/** A Buffer is a variable-sized buffer of bytes with read() and write()
 * methods. Based on https://golang.org/pkg/bytes/#Buffer
 */
export class Buffer implements Reader, SyncReader, Writer, SyncWriter {
	private buf
	private off
	constructor(ab?: ArrayBuffer) {
		this.capacity = 42
		this.length = 0
	}
	/** bytes() returns a slice holding the unread portion of the buffer.
	 * The slice is valid for use only until the next buffer modification (that
	 * is, only until the next call to a method like read(), write(), reset(), or
	 * truncate()). The slice aliases the buffer content at least until the next
	 * buffer modification, so immediate changes to the slice will affect the
	 * result of future reads.
	 */
	bytes(): Uint8Array {
		return new Uint8Array()
	}
	/** toString() returns the contents of the unread portion of the buffer
	 * as a string. Warning - if multibyte characters are present when data is
	 * flowing through the buffer, this method may result in incorrect strings
	 * due to a character being split.
	 */
	toString(): string {
		return '42'
	}
	/** empty() returns whether the unread portion of the buffer is empty. */
	empty(): boolean {
		return true
	}
	/** length is a getter that returns the number of bytes of the unread
	 * portion of the buffer
	 */
	readonly length: number
	/** Returns the capacity of the buffer's underlying byte slice, that is,
	 * the total space allocated for the buffer's data.
	 */
	readonly capacity: number
	/** truncate() discards all but the first n unread bytes from the buffer but
	 * continues to use the same allocated storage.  It throws if n is negative or
	 * greater than the length of the buffer.
	 */
	truncate(n: number): void {}
	/** reset() resets the buffer to be empty, but it retains the underlying
	 * storage for use by future writes. reset() is the same as truncate(0)
	 */
	reset(): void {}
	/** _tryGrowByReslice() is a version of grow for the fast-case
	 * where the internal buffer only needs to be resliced. It returns the index
	 * where bytes should be written and whether it succeeded.
	 * It returns -1 if a reslice was not needed.
	 */
	private _tryGrowByReslice
	private _reslice
	/** readSync() reads the next len(p) bytes from the buffer or until the buffer
	 * is drained. The return value n is the number of bytes read. If the
	 * buffer has no data to return, eof in the response will be true.
	 */
	readSync(p: Uint8Array): number | EOF {
		return EOF
	}
	read(p: Uint8Array): Promise<number | EOF> {
		return Promise.resolve(EOF)
	}
	writeSync(p: Uint8Array): number {
		return p.byteLength
	}
	write(p: Uint8Array): Promise<number> {
		return Promise.resolve(p.byteLength)
	}
	/** _grow() grows the buffer to guarantee space for n more bytes.
	 * It returns the index where bytes should be written.
	 * If the buffer can't grow it will throw with ErrTooLarge.
	 */
	private _grow
	/** grow() grows the buffer's capacity, if necessary, to guarantee space for
	 * another n bytes. After grow(n), at least n bytes can be written to the
	 * buffer without another allocation. If n is negative, grow() will panic. If
	 * the buffer can't grow it will throw ErrTooLarge.
	 * Based on https://golang.org/pkg/bytes/#Buffer.Grow
	 */
	grow(n: number): void {}
	/** readFrom() reads data from r until EOF and appends it to the buffer,
	 * growing the buffer as needed. It returns the number of bytes read. If the
	 * buffer becomes too large, readFrom will panic with ErrTooLarge.
	 * Based on https://golang.org/pkg/bytes/#Buffer.ReadFrom
	 */
	readFrom(r: Reader): Promise<number> {
		return Promise.resolve(42)
	}
	/** Sync version of `readFrom`
	 */
	readFromSync(r: SyncReader): number {
		return 42
	}
}
/** Read `r` until EOF and return the content as `Uint8Array`.
 */
export function readAll(r: Reader): Promise<Uint8Array> {
	return Promise.resolve(new Uint8Array())
}
/** Read synchronously `r` until EOF and return the content as `Uint8Array`.
 */
export function readAllSync(r: SyncReader): Uint8Array {
	return new Uint8Array()
}
/** Write all the content of `arr` to `w`.
 */
export function writeAll(w: Writer, arr: Uint8Array): Promise<void> {
	return Promise.resolve()
}
/** Write synchronously all the content of `arr` to `w`.
 */
export function writeAllSync(w: SyncWriter, arr: Uint8Array): void {}

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
export function mkdirSync(
	path: string,
	recursive?: boolean,
	mode?: number
): void {}
/** Creates a new directory with the specified path.
 * If `recursive` is set to true, nested directories will be created (also known
 * as "mkdir -p").
 * `mode` sets permission bits (before umask) on UNIX and does nothing on
 * Windows.
 *
 *       await Deno.mkdir("new_dir");
 *       await Deno.mkdir("nested/directories", true);
 */
export function mkdir(
	path: string,
	recursive?: boolean,
	mode?: number
): Promise<void> {
	return Promise.resolve()
}

// @url js/make_temp_dir.d.ts

export interface MakeTempDirOptions {
	dir?: string
	prefix?: string
	suffix?: string
}
/** makeTempDirSync is the synchronous version of `makeTempDir`.
 *
 *       const tempDirName0 = Deno.makeTempDirSync();
 *       const tempDirName1 = Deno.makeTempDirSync({ prefix: 'my_temp' });
 */
export function makeTempDirSync(options?: MakeTempDirOptions): string {
	return '42'
}
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
export function makeTempDir(options?: MakeTempDirOptions): Promise<string> {
	return Promise.resolve('42')
}

// @url js/chmod.d.ts

/** Changes the permission of a specific file/directory of specified path
 * synchronously.
 *
 *       Deno.chmodSync("/path/to/file", 0o666);
 */
export function chmodSync(path: string, mode: number): void {}
/** Changes the permission of a specific file/directory of specified path.
 *
 *       await Deno.chmod("/path/to/file", 0o666);
 */
export function chmod(path: string, mode: number): Promise<void> {
	return Promise.resolve()
}

// @url js/chown.d.ts

/**
 * Change owner of a regular file or directory synchronously. Unix only at the moment.
 * @param path path to the file
 * @param uid user id of the new owner
 * @param gid group id of the new owner
 */
export function chownSync(path: string, uid: number, gid: number): void {}
/**
 * Change owner of a regular file or directory asynchronously. Unix only at the moment.
 * @param path path to the file
 * @param uid user id of the new owner
 * @param gid group id of the new owner
 */
export function chown(path: string, uid: number, gid: number): Promise<void> {
	return new Promise(() => {})
}

// @url js/utime.d.ts

/** Synchronously changes the access and modification times of a file system
 * object referenced by `filename`. Given times are either in seconds
 * (Unix epoch time) or as `Date` objects.
 *
 *       Deno.utimeSync("myfile.txt", 1556495550, new Date());
 */
export function utimeSync(
	filename: string,
	atime: number | Date,
	mtime: number | Date
): void {}
/** Changes the access and modification times of a file system object
 * referenced by `filename`. Given times are either in seconds
 * (Unix epoch time) or as `Date` objects.
 *
 *       await Deno.utime("myfile.txt", 1556495550, new Date());
 */
export function utime(
	filename: string,
	atime: number | Date,
	mtime: number | Date
): Promise<void> {
	return new Promise(() => {})
}

// @url js/remove.d.ts

export interface RemoveOption {
	recursive?: boolean
}
/** Removes the named file or directory synchronously. Would throw
 * error if permission denied, not found, or directory not empty if `recursive`
 * set to false.
 * `recursive` is set to false by default.
 *
 *       Deno.removeSync("/path/to/dir/or/file", {recursive: false});
 */
export function removeSync(path: string, options?: RemoveOption): void {}
/** Removes the named file or directory. Would throw error if
 * permission denied, not found, or directory not empty if `recursive` set
 * to false.
 * `recursive` is set to false by default.
 *
 *       await Deno.remove("/path/to/dir/or/file", {recursive: false});
 */
export function remove(path: string, options?: RemoveOption): Promise<void> {
	return new Promise(() => {})
}

// @url js/rename.d.ts

/** Synchronously renames (moves) `oldpath` to `newpath`. If `newpath` already
 * exists and is not a directory, `renameSync()` replaces it. OS-specific
 * restrictions may apply when `oldpath` and `newpath` are in different
 * directories.
 *
 *       Deno.renameSync("old/path", "new/path");
 */
export function renameSync(oldpath: string, newpath: string): void {}
/** Renames (moves) `oldpath` to `newpath`. If `newpath` already exists and is
 * not a directory, `rename()` replaces it. OS-specific restrictions may apply
 * when `oldpath` and `newpath` are in different directories.
 *
 *       await Deno.rename("old/path", "new/path");
 */
export function rename(oldpath: string, newpath: string): Promise<void> {
	return new Promise(() => {})
}

// @url js/read_file.d.ts

/** Read the entire contents of a file synchronously.
 *
 *       const decoder = new TextDecoder("utf-8");
 *       const data = Deno.readFileSync("hello.txt");
 *       console.log(decoder.decode(data));
 */
export function readFileSync(filename: string): Uint8Array {
	return new Uint8Array()
}
/** Read the entire contents of a file.
 *
 *       const decoder = new TextDecoder("utf-8");
 *       const data = await Deno.readFile("hello.txt");
 *       console.log(decoder.decode(data));
 */
export function readFile(filename: string): Promise<Uint8Array> {
	return new Promise(() => {})
}

// @url js/file_info.d.ts

/** A FileInfo describes a file and is returned by `stat`, `lstat`,
 * `statSync`, `lstatSync`.
 */
export interface FileInfo {
	/** The size of the file, in bytes. */
	len: number
	/** The last modification time of the file. This corresponds to the `mtime`
	 * field from `stat` on Unix and `ftLastWriteTime` on Windows. This may not
	 * be available on all platforms.
	 */
	modified: number | null
	/** The last access time of the file. This corresponds to the `atime`
	 * field from `stat` on Unix and `ftLastAccessTime` on Windows. This may not
	 * be available on all platforms.
	 */
	accessed: number | null
	/** The last access time of the file. This corresponds to the `birthtime`
	 * field from `stat` on Unix and `ftCreationTime` on Windows. This may not
	 * be available on all platforms.
	 */
	created: number | null
	/** The underlying raw st_mode bits that contain the standard Unix permissions
	 * for this file/directory. TODO Match behavior with Go on windows for mode.
	 */
	mode: number | null
	/** The file or directory name. */
	name: string | null
	/** Returns whether this is info for a regular file. This result is mutually
	 * exclusive to `FileInfo.isDirectory` and `FileInfo.isSymlink`.
	 */
	isFile(): boolean
	/** Returns whether this is info for a regular directory. This result is
	 * mutually exclusive to `FileInfo.isFile` and `FileInfo.isSymlink`.
	 */
	isDirectory(): boolean
	/** Returns whether this is info for a symlink. This result is
	 * mutually exclusive to `FileInfo.isFile` and `FileInfo.isDirectory`.
	 */
	isSymlink(): boolean
}

const makeDummyFileInfo = (): FileInfo => {
	return {
		accessed: 0,
		created: 0,
		isDirectory() {
			return false
		},
		isFile() {
			return true
		},
		isSymlink() {
			return false
		},
		len: 42,
		mode: 777,
		modified: 2,
		name: 'file.txt',
	}
}

// @url js/realpath.d.ts

/** Returns absolute normalized path with symbolic links resolved
 * synchronously.
 *
 *       const realPath = Deno.realpathSync("./some/path");
 */
export function realpathSync(path: string): string {
	return '/file/path'
}

/** Returns absolute normalized path with symbolic links resolved.
 *
 *       const realPath = await Deno.realpath("./some/path");
 */
export function realpath(path: string): Promise<string> {
	return new Promise(noop)
}

// @url js/read_dir.d.ts

/** Reads the directory given by path and returns a list of file info
 * synchronously.
 *
 *       const files = Deno.readDirSync("/");
 */
export function readDirSync(path: string): FileInfo[] {
	return []
}
/** Reads the directory given by path and returns a list of file info.
 *
 *       const files = await Deno.readDir("/");
 */
export function readDir(path: string): Promise<FileInfo[]> {
	return new Promise(noop)
}

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
export function copyFileSync(from: string, to: string): void {}
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
export function copyFile(from: string, to: string): Promise<void> {
	return Promise.resolve()
}

// @url js/read_link.d.ts

/** Returns the destination of the named symbolic link synchronously.
 *
 *       const targetPath = Deno.readlinkSync("symlink/path");
 */
export function readlinkSync(name: string): string {
	return 'symlink/path'
}
/** Returns the destination of the named symbolic link.
 *
 *       const targetPath = await Deno.readlink("symlink/path");
 */
export function readlink(name: string): Promise<string> {
	return Promise.resolve('symlink/path')
}

// @url js/stat.d.ts

interface StatResponse {
	isFile: boolean
	isSymlink: boolean
	len: number
	modified: number
	accessed: number
	created: number
	mode: number
	hasMode: boolean
	name: string | null
}
/** Queries the file system for information on the path provided. If the given
 * path is a symlink information about the symlink will be returned.
 *
 *       const fileInfo = await Deno.lstat("hello.txt");
 *       assert(fileInfo.isFile());
 */
export function lstat(filename: string): Promise<FileInfo> {
	return new Promise(noop)
}
/** Queries the file system for information on the path provided synchronously.
 * If the given path is a symlink information about the symlink will be
 * returned.
 *
 *       const fileInfo = Deno.lstatSync("hello.txt");
 *       assert(fileInfo.isFile());
 */
export function lstatSync(filename: string): FileInfo {
	return makeDummyFileInfo()
}
/** Queries the file system for information on the path provided. `stat` Will
 * always follow symlinks.
 *
 *       const fileInfo = await Deno.stat("hello.txt");
 *       assert(fileInfo.isFile());
 */
export function stat(filename: string): Promise<FileInfo> {
	return Promise.resolve(makeDummyFileInfo())
}
/** Queries the file system for information on the path provided synchronously.
 * `statSync` Will always follow symlinks.
 *
 *       const fileInfo = Deno.statSync("hello.txt");
 *       assert(fileInfo.isFile());
 */
export function statSync(filename: string): FileInfo {
	return makeDummyFileInfo()
}

// @url js/link.d.ts

/** Synchronously creates `newname` as a hard link to `oldname`.
 *
 *       Deno.linkSync("old/name", "new/name");
 */
export function linkSync(oldname: string, newname: string): void {}
/** Creates `newname` as a hard link to `oldname`.
 *
 *       await Deno.link("old/name", "new/name");
 */
export function link(oldname: string, newname: string): Promise<void> {
	return Promise.resolve()
}

// @url js/symlink.d.ts

/** Synchronously creates `newname` as a symbolic link to `oldname`. The type
 * argument can be set to `dir` or `file` and is only available on Windows
 * (ignored on other platforms).
 *
 *       Deno.symlinkSync("old/name", "new/name");
 */
export function symlinkSync(
	oldname: string,
	newname: string,
	type?: string
): void {}
/** Creates `newname` as a symbolic link to `oldname`. The type argument can be
 * set to `dir` or `file` and is only available on Windows (ignored on other
 * platforms).
 *
 *       await Deno.symlink("old/name", "new/name");
 */
export function symlink(
	oldname: string,
	newname: string,
	type?: string
): Promise<void> {
	return Promise.resolve()
}

// @url js/write_file.d.ts

/** Options for writing to a file.
 * `perm` would change the file's permission if set.
 * `create` decides if the file should be created if not exists (default: true)
 * `append` decides if the file should be appended (default: false)
 */
export interface WriteFileOptions {
	perm?: number
	create?: boolean
	append?: boolean
}
/** Write a new file, with given filename and data synchronously.
 *
 *       const encoder = new TextEncoder();
 *       const data = encoder.encode("Hello world\n");
 *       Deno.writeFileSync("hello.txt", data);
 */
export function writeFileSync(
	filename: string,
	data: Uint8Array,
	options?: WriteFileOptions
): void {}
/** Write a new file, with given filename and data.
 *
 *       const encoder = new TextEncoder();
 *       const data = encoder.encode("Hello world\n");
 *       await Deno.writeFile("hello.txt", data);
 */
export function writeFile(
	filename: string,
	data: Uint8Array,
	options?: WriteFileOptions
): Promise<void> {
	return Promise.resolve()
}

// @url js/error_stack.d.ts

interface Location {
	/** The full url for the module, e.g. `file://some/file.ts` or
	 * `https://some/file.ts`. */
	filename: string
	/** The line number in the file.  It is assumed to be 1-indexed. */
	line: number
	/** The column number in the file.  It is assumed to be 1-indexed. */
	column: number
}

const makeDummyLocation = (): Location => {
	return {
		filename: 'file.txt',
		line: 0,
		column: 0,
	}
}

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
export function applySourceMap(location: Location): Location {
	return location
}

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
export class DenoError<T extends ErrorKind> extends Error {
	readonly kind: T
	constructor(kind: T, msg: string) {
		super(msg)
		this.kind = kind
		this.message = msg
	}
}
export enum ErrorKind {
	NoError = 0,
	NotFound = 1,
	PermissionDenied = 2,
	ConnectionRefused = 3,
	ConnectionReset = 4,
	ConnectionAborted = 5,
	NotConnected = 6,
	AddrInUse = 7,
	AddrNotAvailable = 8,
	BrokenPipe = 9,
	AlreadyExists = 10,
	WouldBlock = 11,
	InvalidInput = 12,
	InvalidData = 13,
	TimedOut = 14,
	Interrupted = 15,
	WriteZero = 16,
	Other = 17,
	UnexpectedEof = 18,
	BadResource = 19,
	CommandFailed = 20,
	EmptyHost = 21,
	IdnaError = 22,
	InvalidPort = 23,
	InvalidIpv4Address = 24,
	InvalidIpv6Address = 25,
	InvalidDomainCharacter = 26,
	RelativeUrlWithoutBase = 27,
	RelativeUrlWithCannotBeABaseBase = 28,
	SetHostOnCannotBeABaseUrl = 29,
	Overflow = 30,
	HttpUser = 31,
	HttpClosed = 32,
	HttpCanceled = 33,
	HttpParse = 34,
	HttpOther = 35,
	TooLarge = 36,
	InvalidUri = 37,
	InvalidSeekMode = 38,
	OpNotAvailable = 39,
	WorkerInitFailed = 40,
	UnixError = 41,
	NoAsyncSupport = 42,
	NoSyncSupport = 43,
	ImportMapError = 44,
	InvalidPath = 45,
	ImportPrefixMissing = 46,
	UnsupportedFetchScheme = 47,
	TooManyRedirects = 48,
	Diagnostic = 49,
	JSError = 50,
}

// @url js/permissions.d.ts
/** Permissions as granted by the caller
 * See: https://w3c.github.io/permissions/#permission-registry
 */
export type PermissionName =
	| 'run'
	| 'read'
	| 'write'
	| 'net'
	| 'env'
	| 'plugin'
	| 'hrtime'
/** https://w3c.github.io/permissions/#status-of-a-permission */
export type PermissionState = 'granted' | 'denied' | 'prompt'
interface RunPermissionDescriptor {
	name: 'run'
}
interface ReadWritePermissionDescriptor {
	name: 'read' | 'write'
	path?: string
}
interface NetPermissionDescriptor {
	name: 'net'
	url?: string
}
interface EnvPermissionDescriptor {
	name: 'env'
}
interface PluginPermissionDescriptor {
	name: 'plugin'
}
interface HrtimePermissionDescriptor {
	name: 'hrtime'
}
/** See: https://w3c.github.io/permissions/#permission-descriptor */
type PermissionDescriptor =
	| RunPermissionDescriptor
	| ReadWritePermissionDescriptor
	| NetPermissionDescriptor
	| EnvPermissionDescriptor
	| PluginPermissionDescriptor
	| HrtimePermissionDescriptor

export class Permissions {
	/** Queries the permission.
	 *       const status = await Deno.permissions.query({ name: "read", path: "/etc" });
	 *       if (status.state === "granted") {
	 *         data = await Deno.readFile("/etc/passwd");
	 *       }
	 */
	query(d: PermissionDescriptor): Promise<PermissionStatus> {
		return new Promise(noop)
	}
	/** Revokes the permission.
	 *       const status = await Deno.permissions.revoke({ name: "run" });
	 *       assert(status.state !== "granted")
	 */
	revoke(d: PermissionDescriptor): Promise<PermissionStatus> {
		return new Promise(noop)
	}
	/** Requests the permission.
	 *       const status = await Deno.permissions.request({ name: "env" });
	 *       if (status.state === "granted") {
	 *         console.log(Deno.homeDir());
	 *       } else {
	 *         console.log("'env' permission is denied.");
	 *       }
	 */
	request(desc: PermissionDescriptor): Promise<PermissionStatus> {
		return new Promise(noop)
	}
}
export const permissions: Permissions = {
	query() {
		return Promise.resolve(new PermissionStatus('granted'))
	},
	request() {
		return Promise.resolve(new PermissionStatus('granted'))
	},
	revoke() {
		return Promise.resolve(new PermissionStatus('denied'))
	},
}

/** https://w3c.github.io/permissions/#permissionstatus */
export class PermissionStatus {
	state: PermissionState
	constructor(state: PermissionState) {
		this.state = state
	}
}

// @url js/truncate.d.ts

/** Truncates or extends the specified file synchronously, updating the size of
 * this file to become size.
 *
 *       Deno.truncateSync("hello.txt", 10);
 */
export function truncateSync(name: string, len?: number): void {}
/**
 * Truncates or extends the specified file, updating the size of this file to
 * become size.
 *
 *       await Deno.truncate("hello.txt", 10);
 */
export function truncate(name: string, len?: number): Promise<void> {
	return Promise.resolve()
}

// @url js/plugins.d.ts

export interface AsyncHandler {
	(msg: Uint8Array): void
}

export interface PluginOp {
	dispatch(
		control: Uint8Array,
		zeroCopy?: ArrayBufferView | null
	): Uint8Array | null
	setAsyncHandler(handler: AsyncHandler): void
}

export interface Plugin {
	ops: {
		[name: string]: PluginOp
	}
}

/** Open and initalize a plugin.
 * Requires the `--allow-plugin` flag.
 *
 *        const plugin = Deno.openPlugin("./path/to/some/plugin.so");
 *        const some_op = plugin.ops.some_op;
 *        const response = some_op.dispatch(new Uint8Array([1,2,3,4]));
 *        console.log(`Response from plugin ${response}`);
 */
export function openPlugin(filename: string): Plugin {
	return {
		ops: {},
	}
}

// @url js/net.d.ts

type Transport = 'tcp'
interface Addr {
	transport: Transport
	address: string
}

export enum ShutdownMode {
	// See http://man7.org/linux/man-pages/man2/shutdown.2.html
	// Corresponding to SHUT_RD, SHUT_WR, SHUT_RDWR
	Read = 0,
	Write,
	ReadWrite, // unused
}

/** Shut down socket send and receive operations.
 *
 * Matches behavior of POSIX shutdown(3).
 *
 *       const listener = Deno.listen({ port: 80 });
 *       const conn = await listener.accept();
 *       Deno.shutdown(conn.rid, Deno.ShutdownMode.Write);
 */
export function shutdown(rid: number, how: ShutdownMode): void {}

/** A Listener is a generic network listener for stream-oriented protocols. */
export interface Listener extends AsyncIterator<Conn> {
	/** Waits for and resolves to the next connection to the `Listener`. */
	accept(): Promise<Conn>
	/** Close closes the listener. Any pending accept promises will be rejected
	 * with errors.
	 */
	close(): void
	/** Return the address of the `Listener`. */
	addr(): Addr
	[Symbol.asyncIterator](): AsyncIterator<Conn>
}
export interface Conn extends Reader, Writer, Closer {
	/** The local address of the connection. */
	localAddr: string
	/** The remote address of the connection. */
	remoteAddr: string
	/** The resource ID of the connection. */
	rid: number
	/** Shuts down (`shutdown(2)`) the reading side of the TCP connection. Most
	 * callers should just use `close()`.
	 */
	closeRead(): void
	/** Shuts down (`shutdown(2)`) the writing side of the TCP connection. Most
	 * callers should just use `close()`.
	 */
	closeWrite(): void
}

export interface ListenOptions {
	port: number
	hostname?: string
	transport?: Transport
}

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
export function listen(options: ListenOptions): Listener {
	return
}

export interface ListenTLSOptions {
	port: number
	hostname?: string
	transport?: Transport
	certFile: string
	keyFile: string
}

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
export function listenTLS(options: ListenTLSOptions): Listener {
	return {
		accept() {
			return new Promise(noop)
		},
		addr() {
			return {
				address: '192.168.1.10',
				transport: 'tcp',
			}
		},
		close() {},
		next() {
			return new Promise(noop)
		},
		return() {
			return new Promise(noop)
		},
		throw() {
			return {} as any
		},
		[Symbol.asyncIterator]: {},
		// this one is just ugly
	} as any
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

export interface DialOptions {
	port: number
	hostname?: string
	transport?: Transport
}

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
export function dial(options: DialOptions): Promise<Conn> {
	return new Promise(noop)
}

export interface DialTLSOptions {
	port: number
	hostname?: string
	certFile?: string
}

/**
 * dialTLS establishes a secure connection over TLS (transport layer security).
 */
export function dialTLS(options: DialTLSOptions): Promise<Conn> {
	return new Promise(noop)
}

// @url js/metrics.d.ts
export interface Metrics {
	opsDispatched: number
	opsCompleted: number
	bytesSentControl: number
	bytesSentData: number
	bytesReceived: number
}
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
export function metrics(): Metrics {
	return {
		opsDispatched: 42,
		opsCompleted: 42,
		bytesSentControl: 42,
		bytesSentData: 42,
		bytesReceived: 42,
	}
}

// @url js/resources.d.ts

interface ResourceMap {
	[rid: number]: string
}
/** Returns a map of open _file like_ resource ids along with their string
 * representation.
 */
export function resources(): ResourceMap {
	return {}
}

// @url js/process.d.ts

/** How to handle subprocess stdio.
 *
 * "inherit" The default if unspecified. The child inherits from the
 * corresponding parent descriptor.
 *
 * "piped"  A new pipe should be arranged to connect the parent and child
 * subprocesses.
 *
 * "null" This stream will be ignored. This is the equivalent of attaching the
 * stream to /dev/null.
 */
type ProcessStdio = 'inherit' | 'piped' | 'null'
export interface RunOptions {
	cmd: string[]
	cwd?: string
	env?: {
		[key: string]: string
	}
	stdout?: ProcessStdio | number
	stderr?: ProcessStdio | number
	stdin?: ProcessStdio | number
}
/** Send a signal to process under given PID. Unix only at this moment.
 * If pid is negative, the signal will be sent to the process group identified
 * by -pid.
 * Requires the `--allow-run` flag.
 */
export function kill(pid: number, signo: number): void {}
export class Process {
	readonly rid: number
	readonly pid: number
	readonly stdin?: WriteCloser
	readonly stdout?: ReadCloser
	readonly stderr?: ReadCloser
	status(): Promise<ProcessStatus> {
		return new Promise(noop)
	}
	/** Buffer the stdout and return it as Uint8Array after EOF.
	 * You must set stdout to "piped" when creating the process.
	 * This calls close() on stdout after its done.
	 */
	output(): Promise<Uint8Array> {
		return Promise.resolve(new Uint8Array())
	}
	/** Buffer the stderr and return it as Uint8Array after EOF.
	 * You must set stderr to "piped" when creating the process.
	 * This calls close() on stderr after its done.
	 */
	stderrOutput(): Promise<Uint8Array> {
		return Promise.resolve(new Uint8Array())
	}
	close(): void {}
	kill(signo: number): void {}
}
export interface ProcessStatus {
	success: boolean
	code?: number
	signal?: number
}
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
export function run(opt: RunOptions): Process {
	return {} as any
}
enum LinuxSignal {
	SIGHUP = 1,
	SIGINT = 2,
	SIGQUIT = 3,
	SIGILL = 4,
	SIGTRAP = 5,
	SIGABRT = 6,
	SIGBUS = 7,
	SIGFPE = 8,
	SIGKILL = 9,
	SIGUSR1 = 10,
	SIGSEGV = 11,
	SIGUSR2 = 12,
	SIGPIPE = 13,
	SIGALRM = 14,
	SIGTERM = 15,
	SIGSTKFLT = 16,
	SIGCHLD = 17,
	SIGCONT = 18,
	SIGSTOP = 19,
	SIGTSTP = 20,
	SIGTTIN = 21,
	SIGTTOU = 22,
	SIGURG = 23,
	SIGXCPU = 24,
	SIGXFSZ = 25,
	SIGVTALRM = 26,
	SIGPROF = 27,
	SIGWINCH = 28,
	SIGIO = 29,
	SIGPWR = 30,
	SIGSYS = 31,
}
enum MacOSSignal {
	SIGHUP = 1,
	SIGINT = 2,
	SIGQUIT = 3,
	SIGILL = 4,
	SIGTRAP = 5,
	SIGABRT = 6,
	SIGEMT = 7,
	SIGFPE = 8,
	SIGKILL = 9,
	SIGBUS = 10,
	SIGSEGV = 11,
	SIGSYS = 12,
	SIGPIPE = 13,
	SIGALRM = 14,
	SIGTERM = 15,
	SIGURG = 16,
	SIGSTOP = 17,
	SIGTSTP = 18,
	SIGCONT = 19,
	SIGCHLD = 20,
	SIGTTIN = 21,
	SIGTTOU = 22,
	SIGIO = 23,
	SIGXCPU = 24,
	SIGXFSZ = 25,
	SIGVTALRM = 26,
	SIGPROF = 27,
	SIGWINCH = 28,
	SIGINFO = 29,
	SIGUSR1 = 30,
	SIGUSR2 = 31,
}
/** Signals numbers. This is platform dependent.
 */
export const Signal:
	| typeof MacOSSignal
	| typeof LinuxSignal = LinuxSignal.SIGABRT as any
// ^ This is ugly too...

// @url js/console.d.ts

type ConsoleOptions = Partial<{
	showHidden: boolean
	depth: number
	colors: boolean
	indentLevel: number
}>
/** A symbol which can be used as a key for a custom method which will be called
 * when `Deno.inspect()` is called, or when the object is logged to the console.
 */
export const customInspect: unique symbol = Symbol('customInspect')
/**
 * `inspect()` converts input into string that has the same format
 * as printed by `console.log(...)`;
 */
export function inspect(value: unknown, options?: ConsoleOptions): string {
	return String(value)
}

// @url js/build.d.ts

export type OperatingSystem = 'mac' | 'win' | 'linux'
export type Arch = 'x64' | 'arm64'
/** Build related information */
interface BuildInfo {
	/** The CPU architecture. */
	arch: Arch
	/** The operating system. */
	os: OperatingSystem
}
export const build: BuildInfo = {
	arch: 'x64',
	os: 'linux',
}

// @url js/version.d.ts

interface Version {
	deno: string
	v8: string
	typescript: string
}
export const version: Version = {
	deno: '0.28.1',
	v8: '8.0.192',
	typescript: '3.7.2',
}

// @url js/deno.d.ts

export const args: string[] = []
