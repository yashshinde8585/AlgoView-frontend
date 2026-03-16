// Pattern Recommendation Rules
export const patternRules = [
    { keywords: ["substring", "subarray", "window", "consecutive"], pattern: "Sliding Window" },
    { keywords: ["pair", "sorted", "two numbers", "triplet", "meeting point"], pattern: "Two Pointers" },
    { keywords: ["sum of range", "prefix", "cumulative"], pattern: "Prefix Sum" },
    { keywords: ["duplicates", "missing", "1 to n", "range 0 to n"], pattern: "Cyclic Sort" },
    { keywords: ["frequency", "lookup", "mapped", "unique count"], pattern: "Hashing" },
    { keywords: ["shortest path", "network", "level order", "neighbor"], pattern: "BFS/Graphs" },
    { keywords: ["all combinations", "permutation", "subset", "path find"], pattern: "Backtracking" },
    { keywords: ["maximum", "minimum", "optimize", "overlapping"], pattern: "Dynamic Programming" },
    { keywords: ["sorted array", "search space", "rotated"], pattern: "Binary Search" }
];

// Practice Problems Data
export const practiceProblems = {
    "Two Pointers": [
        { title: "Two Sum II", difficulty: "Easy", link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
        { title: "3Sum", difficulty: "Medium", link: "https://leetcode.com/problems/3sum/" },
        { title: "Trapping Rain Water", difficulty: "Hard", link: "https://leetcode.com/problems/trapping-rain-water/" }
    ],
    "Sliding Window": [
        { title: "Maximum Subarray", difficulty: "Easy", link: "https://leetcode.com/problems/maximum-subarray/" },
        { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
        { title: "Minimum Window Substring", difficulty: "Hard", link: "https://leetcode.com/problems/minimum-window-substring/" }
    ],
    "Prefix Sum": [
        { title: "Range Sum Query", difficulty: "Easy", link: "https://leetcode.com/problems/range-sum-query-immutable/" },
        { title: "Subarray Sum Equals K", difficulty: "Medium", link: "https://leetcode.com/problems/subarray-sum-equals-k/" }
    ],
    "Backtracking": [
        { title: "Subsets", difficulty: "Medium", link: "https://leetcode.com/problems/subsets/" },
        { title: "N-Queens", difficulty: "Hard", link: "https://leetcode.com/problems/n-queens/" }
    ]
};

// Quiz Data
export const quizQuestions = [
    {
        problem: "Find the longest subarray where all elements are less than K.",
        options: ["Binary Search", "Sliding Window", "Cyclic Sort"],
        answer: "Sliding Window",
        explanation: "Since it asks for a 'contiguous subarray' with a dynamic boundary, Sliding Window is the most efficient $O(N)$ approach."
    },
    {
        problem: "Find all possible ways to arrange N items in a sequence.",
        options: ["Two Pointers", "Hashing", "Backtracking"],
        answer: "Backtracking",
        explanation: "When you need to explore 'all possible' combinations or permutations, Backtracking is the standard approach."
    },
    {
        problem: "Find the missing number in an unsorted array of size N containing numbers from 1 to N.",
        options: ["Cyclic Sort", "Two Pointers", "Prefix Sum"],
        answer: "Cyclic Sort",
        explanation: "Cyclic Sort is the optimal $O(N)$ time and $O(1)$ space algorithm for problems involving ranges from 1 to N."
    }
];
