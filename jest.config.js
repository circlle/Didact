module.exports = {
  roots: ['<rootDir>/src'],
  transform: { "^.+\\.(ts|tsx|js|jsx)?$": "babel-jest" },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}