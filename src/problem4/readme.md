As a developer. When I read this test the simple solution i think as:
- Loop
- Javascript reduce() helper
- Recursion

And the final solution, I research from resource
- mathematical formula


Test

```
    npm test src/problem1/test.js
```

Summary Complexity:

| Solution       | Time Complexity | Space Complexity | Notes                      |
| -------------- | --------------- | ---------------- | -------------------------- |
| `while` loop   | O(n)            | O(1)             | Best balance of simplicity |
| formula        | O(1)            | O(1)             | Most efficient             |
| recursion      | O(n)            | O(n)             | Risk of stack overflow     |
| reduce + array | O(n)            | O(n)             | Concise but memory heavy   |
