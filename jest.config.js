module.exports = {
    testEnvironment: 'node',
    testPathIgnorePatterns: [
        '/node_modules',
        '/dist',
        '/integration'
    ],
    globals: {
        'ts-jest': {
            tsConfig: './tsconfig.jest.json'
        }
    },
    roots: [
        'src'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    moduleNameMapper: {
        '@app/(.*)': '<rootDir>/src/$1',
        '@infra/(.*)': '<rootDir>/lib/$1'
    }
};
