
const sum_to_n_a = (n) => {
    if (n <= 0) return n;
    let sum = 0;
    let i = 1;
    while (i <= n) {
        sum += i;
        i++;
    }
    return sum;
}

const sum_to_n_b = (n) => {
    if (n <= 0) return n;
    return Array.from({ length: n }, (_, i) => i + 1).reduce((acc, v) => acc + v, 0);
}

const sum_to_n_c = (n) => {
    if (n <= 0) return n;
    return n + sum_to_n_c(n - 1);
}

const sum_to_n_d = (n) => {
    return n * (n + 1) / 2;
}
module.exports = { sum_to_n_a, sum_to_n_b, sum_to_n_c, sum_to_n_d };