/**
 * Sorting Algorithms (Generators)
 * Each state yielded represents a visualization step.
 */

/**
 * Bubble Sort Generator
 * Yields states for comparison and swapping.
 */
export function* bubbleSort({ array }) {
  let arr = [...array];
  let n = arr.length;
  let sortedIndices = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield {
        type: "COMPARE",
        indices: [j, j + 1],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        operation: 'BUBBLESORT',
        explanation: `Comparing ${arr[j]} and ${arr[j + 1]}`,
      };

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield {
          type: "SWAP",
          indices: [j, j + 1],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          operation: 'BUBBLESORT',
          explanation: `Swapping ${arr[j+1]} and ${arr[j]} because ${arr[j+1]} > ${arr[j]}`,
        };
      }
    }
    sortedIndices.push(n - i - 1);
    yield {
      type: "SORTED_STEP",
      indices: [n - i - 1],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      operation: 'BUBBLESORT',
      explanation: `Index ${n - i - 1} is now in its final position.`,
    };
  }
}

/**
 * Quick Sort Generator
 */
export function* quickSort({ array }) {
  let arr = [...array];
  let sortedIndices = [];

  function* partition(low, high) {
    let pivot = arr[high];
    let i = low - 1;

    yield {
      type: "PIVOT",
      indices: [high],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      operation: 'QUICKSORT',
      explanation: `Selected ${pivot} (index ${high}) as pivot.`,
    };

    for (let j = low; j < high; j++) {
      yield {
        type: "COMPARE",
        indices: [j, high],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        operation: 'QUICKSORT',
        explanation: `Comparing ${arr[j]} with pivot ${pivot}`,
      };

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield {
          type: "SWAP",
          indices: [i, j],
          array: [...arr],
          sortedIndices: [...sortedIndices],
          operation: 'QUICKSORT',
          explanation: `Swapping ${arr[i]} and ${arr[j]} (element < pivot)`,
        };
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    yield {
      type: "SWAP",
      indices: [i + 1, high],
      array: [...arr],
      sortedIndices: [...sortedIndices],
      operation: 'QUICKSORT',
      explanation: `Moving pivot ${pivot} to its correct location.`,
    };

    return i + 1;
  }

  function* sort(low, high) {
    if (low <= high) {
      let pi = yield* partition(low, high);
      sortedIndices.push(pi);
      yield {
        type: "SORTED_STEP",
        indices: [pi],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        operation: 'QUICKSORT',
        explanation: `Pivot at ${pi} is sorted.`,
      };
      yield* sort(low, pi - 1);
      yield* sort(pi + 1, high);
    }
  }

  yield* sort(0, arr.length - 1);
}

/**
 * Merge Sort Generator
 */
export function* mergeSort({ array }) {
  let arr = [...array];
  let sortedIndices = [];

  function* merge(l, m, r) {
    let n1 = m - l + 1;
    let n2 = r - m;
    let L = arr.slice(l, m + 1);
    let R = arr.slice(m + 1, r + 1);

    let i = 0, j = 0, k = l;

    while (i < n1 && j < n2) {
      yield {
        type: "COMPARE",
        indices: [l + i, m + 1 + j],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        operation: 'MERGESORT',
        explanation: `Comparing elements from left and right halves.`,
      };

      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      
      yield {
        type: "SWAP",
        indices: [k],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        operation: 'MERGESORT',
        explanation: `Merged element ${arr[k]} into position ${k}`,
      };
      k++;
    }

    while (i < n1) {
      arr[k] = L[i];
      i++;
      yield {
        type: "SWAP",
        indices: [k],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        operation: 'MERGESORT',
        explanation: `Merging remaining left element.`,
      };
      k++;
    }

    while (j < n2) {
      arr[k] = R[j];
      j++;
      yield {
        type: "SWAP",
        indices: [k],
        array: [...arr],
        sortedIndices: [...sortedIndices],
        operation: 'MERGESORT',
        explanation: `Merging remaining right element.`,
      };
      k++;
    }

    // Mark as sorted for this phase
    for (let p = l; p <= r; p++) {
      if (!sortedIndices.includes(p)) sortedIndices.push(p);
    }
  }

  function* sort(l, r) {
    if (l < r) {
      let m = Math.floor(l + (r - l) / 2);
      yield* sort(l, m);
      yield* sort(m + 1, r);
      yield* merge(l, m, r);
    }
  }

  yield* sort(0, arr.length - 1);
}
