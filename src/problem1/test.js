// sum.test.js

const { sum_to_n_a, sum_to_n_b, sum_to_n_c, sum_to_n_d } = require('./index');

describe('sum_to_n_a', () => {
    test('sums numbers from 1 to 5', () => {
        expect(sum_to_n_a(5)).toBe(15);
    });

    test('sums numbers from 1 to 1', () => {
        expect(sum_to_n_a(1)).toBe(1);
    });

    test('sums numbers from 1 to 10', () => {
        expect(sum_to_n_a(10)).toBe(55);
    });

    test('sums numbers from 1 to 0 (edge case)', () => {
        expect(sum_to_n_a(0)).toBe(0);
    });

    test('sums large number correctly', () => {
        expect(sum_to_n_a(1000)).toBe(500500);
    });
});
describe('sum_to_n_b', () => {
    test('sums numbers from 1 to 5', () => {
        expect(sum_to_n_b(5)).toBe(15);
    });

    test('sums numbers from 1 to 1', () => {
        expect(sum_to_n_b(1)).toBe(1);
    });

    test('sums numbers from 1 to 10', () => {
        expect(sum_to_n_b(10)).toBe(55);
    });

    test('sums numbers from 1 to 0 (edge case)', () => {
        expect(sum_to_n_b(0)).toBe(0);
    });

    test('sums large number correctly', () => {
        expect(sum_to_n_b(1000)).toBe(500500);
    });
});

describe('sum_to_n_c', () => {
    test('sums numbers from 1 to 5', () => {
        expect(sum_to_n_c(5)).toBe(15);
    });

    test('sums numbers from 1 to 1', () => {
        expect(sum_to_n_c(1)).toBe(1);
    });

    test('sums numbers from 1 to 10', () => {
        expect(sum_to_n_c(10)).toBe(55);
    });

    test('sums numbers from 1 to 0 (edge case)', () => {
        expect(sum_to_n_c(0)).toBe(0);
    });

    test('sums large number correctly', () => {
        expect(sum_to_n_c(1000)).toBe(500500);
    });
});

describe('sum_to_n_d', () => {
    test('sums numbers from 1 to 5', () => {
        expect(sum_to_n_d(5)).toBe(15);
    });

    test('sums numbers from 1 to 1', () => {
        expect(sum_to_n_d(1)).toBe(1);
    });

    test('sums numbers from 1 to 10', () => {
        expect(sum_to_n_d(10)).toBe(55);
    });

    test('sums numbers from 1 to 0 (edge case)', () => {
        expect(sum_to_n_d(0)).toBe(0);
    });

    test('sums large number correctly', () => {
        expect(sum_to_n_d(1000)).toBe(500500);
    });
});