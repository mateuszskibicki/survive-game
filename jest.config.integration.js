module.exports = {
    testEnvironment: 'node',
    testPathIgnorePatterns: [
        '/node_modules',
        '/dist',
        '/src'
    ],
    globals: {
        'ts-jest': {
            tsConfig: './tsconfig.jest.json'
        }
    },
    roots: [
        'integration'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    moduleNameMapper: {
        '@app/(.*)': '<rootDir>/src/$1',
        '@infra/(.*)': '<rootDir>/lib/$1'
    }
};
