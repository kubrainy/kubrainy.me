const ART = String.raw`  _  __
 | |/ / ___
 | ' / / __|
 | . \| (__
 |_|\_\\___|`

const ART_STYLE = 'color: #ec4899; font-family: monospace; font-weight: 700'
const TEXT_STYLE = 'font-family: monospace'

export function printConsoleGreeting(lines: string[]) {
  const art = ART.split('\n')
  const width = Math.max(...art.map(line => line.length)) + 3
  const rows = art.map((line, i) => [line.padEnd(width), lines[i - 1] ?? ''])
  // eslint-disable-next-line no-console
  console.log(rows.map(() => '%c%s%c%s').join('\n'), ...rows.flatMap(([art, text]) => [ART_STYLE, art, TEXT_STYLE, text]))
}
