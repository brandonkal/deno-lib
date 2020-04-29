import { assertEquals } from 'https://deno.land/std@v0.41.0/testing/asserts.ts'
import { dedent } from './dedent.ts'
const it = Deno.test

it('handle escaped linebreak', () => {
	let text = dedent`one-\
  \u{9820}
  two`
	assertEquals(text, 'one-頠\ntwo')
})

it('should dedent simple multiline blocks', () => {
	const text = dedent`
    this
    is
    easy
    `

	assertEquals('\nthis\nis\neasy\n', text)
})

it('should dedent with the common level', () => {
	const text = dedent`
    this
      is
    a
      test
    `

	assertEquals('\nthis\n  is\na\n  test\n', text)
})

it('should dedent as expected if begins with text', () => {
	const text = dedent`testing
    multi
      lines
    `

	assertEquals('testing\nmulti\n  lines\n', text)
})

it('should not dedent with space before text on first line', () => {
	const text = dedent`  testing
  multi
    lines
`

	assertEquals('  testing\nmulti\n  lines\n', text)
})

it('should not dedent a single line', () => {
	const text = dedent`  testing`

	assertEquals('  testing', text)
})

it('should dedent no lines', () => {
	const text = dedent`  testing
skip me
  `

	assertEquals('  testing\nskip me\n  ', text)
})

it('should dedent with blank line support', () => {
	const text = dedent`
    this
    is

    blank
    `

	assertEquals('\nthis\nis\n\nblank\n', text)
})

it('should not trim trailing whitespace with content', () => {
	const text = dedent`
    trailing
    whitespace  `

	assertEquals('\ntrailing\nwhitespace  ', text)
})

it('should not dedent interpolated content', () => {
	const value = `  test\n  value`
	const text = dedent`
    interpolated
    ${value}
    `

	assertEquals('\ninterpolated\n  test\n  value\n', text)
})

it('should work as expected with nested dedent', () => {
	const value = dedent`
      test
      value
    `

	const text = dedent`
      interpolated
      ${value}
    `

	assertEquals('\ninterpolated\n\ntest\nvalue\n\n', text)
})

it('should strip indent based on smallest indent', () => {
	const text = dedent`
      indented
    here
    `

	assertEquals('\n  indented\nhere\n', text)
})

it("should do nothing when there's no indent", () => {
	const text = dedent`
no
  indent
    `

	assertEquals('\nno\n  indent\n    ', text)
})

it('should support usage as a function', () => {
	const text = dedent(`
    test
    value
    `)

	assertEquals('\ntest\nvalue\n', text)
})

it('should support strings array', () => {
	const input = ['\n', '\t\t2-two\n', '\t\t\t3-three\n']
	const text = dedent(input)

	assertEquals('\n2-two\n\t3-three\n', text)
})

it('should remove escaped tabs', () => {
	const input = '\n\t\t2-two\n\t\t\t3-three\n'
	const text = dedent(input)

	assertEquals('\n2-two\n\t3-three\n', text)
})

it('should handle expressions', () => {
	const text = dedent`
    ---
    color: green
    numbers:
      - 1
      - 2
      - ${1 + 2}
  `

	assertEquals(
		`
---
color: green
numbers:
  - 1
  - 2
  - 3
`,
		text
	)
})

it('should handle complex expressions', () => {
	const text = dedent`  ${'first-line'}

    color: green
    numbers:
      - 1->${1 + 1}->3
  `

	assertEquals(
		`  first-line

color: green
numbers:
  - 1->2->3
`,
		text
	)
})

it('should collapse escaped new line', () => {
	const text = dedent`
    line: 1
    line: 2
  `

	assertEquals('\nline: 1\nline: 2\n', text)
})

it('should do nothing for escaped newlines in template tag', () => {
	const text = dedent`${'one '}\
    two
    three
  `

	assertEquals('one two\nthree\n', text)
})

it('should handle YAML', () => {
	const text = dedent`
    ---
    a: 1
    b: 2
    c: 3
    d: 4
    `

	assertEquals(
		`
---
a: 1
b: 2
c: 3
d: 4
`,
		text
	)
})
