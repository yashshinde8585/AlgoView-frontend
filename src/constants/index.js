export const STACK_CODE_TEMPLATES = {
    PUSH: {
        JAVA: `public void push(int data) {\n  if (top == MAX - 1) throw new StackOverflow();\n  stack[++top] = data;\n}`,
        PYTHON: `def push(self, data):\n  if self.is_full(): raise OverflowError()\n  self.stack.append(data)\n  self.top += 1`,
        CPP: `void push(int data) {\n  if (top == MAX - 1) return;\n  stack[++top] = data;\n}`
    },
    POP: {
        JAVA: `public int pop() {\n  if (isEmpty()) throw new StackUnderflow();\n  return stack[top--];\n}`,
        PYTHON: `def pop(self):\n  if self.is_empty(): raise UnderflowError()\n  self.top -= 1\n  return self.stack.pop()`,
        CPP: `int pop() {\n  if (top == -1) return -1;\n  return stack[top--];\n}`
    },
    SEARCH: {
        JAVA: `public int search(Object o) {\n  int i = lastIndexOf(o);\n  return (i >= 0) ? size() - i : -1;\n}`,
        PYTHON: `def search(self, val):\n  try:\n    return self.stack[::-1].index(val) + 1\n  except ValueError:\n    return -1`,
        CPP: `int search(int val) {\n  for(int i=top, d=1; i>=0; i--, d++)\n    if(stack[i] == val) return d;\n  return -1;\n}`
    },
    REVERSE: {
        JAVA: `// Using Recursion\nvoid reverse() {\n  if (!isEmpty()) {\n    int x = pop();\n    reverse();\n    insertAtBottom(x);\n  }\n}`,
        PYTHON: `def reverse(self):\n  self.stack = self.stack[::-1]`,
        CPP: `// Using Temporary Stack\nvoid reverse() {\n  stack<int> s1, s2;\n  while(!s.empty()){ s1.push(s.top()); s.pop(); }\n  while(!s1.empty()){ s2.push(s1.top()); s1.pop(); }\n  while(!s2.empty()){ s.push(s2.top()); s2.pop(); }\n}`
    },
    IS_EMPTY: {
        JAVA: `public boolean isEmpty() {\n  return top == -1;\n}`,
        PYTHON: `def is_empty(self):\n  return len(self.stack) == 0`,
        CPP: `bool isEmpty() {\n  return top == -1;\n}`
    },
    IS_FULL: {
        JAVA: `public boolean isFull() {\n  return top == MAX - 1;\n}`,
        PYTHON: `def is_full(self):\n  return len(self.stack) == MAX`,
        CPP: `bool isFull() {\n  return top == MAX - 1;\n}`
    },
    PEEK: {
        JAVA: `public int peek() {\n  return stack[top];\n}`,
        PYTHON: `def peek(self):\n  return self.stack[-1]`,
        CPP: `int peek() {\n  return stack[top];\n}`
    },
    IDLE_STRUCTURE: {
        JAVA: `class Stack {\n  int[] stack;\n  int top = -1;\n  int MAX = 10;\n}`,
        PYTHON: `class Stack:\n  def __init__(self):\n    self.stack = []\n    self.top = -1`,
        CPP: `struct Stack {\n  int stack[10];\n  int top = -1;\n};`
    }
};

export const QUEUE_CODE_TEMPLATES = {
    ENQUEUE: {
        JAVA: `public void enqueue(int data) {\n  if (isFull()) throw new QueueOverflow();\n  rear = (rear + 1) % MAX_SIZE;\n  queue[rear] = data;\n  size++;\n}`,
        PYTHON: `def enqueue(self, data):\n  if self.is_full(): raise OverflowError()\n  self.rear = (self.rear + 1) % self.max_size\n  self.queue[self.rear] = data\n  self.size += 1`,
        CPP: `void enqueue(int data) {\n  if (size == MAX_SIZE) return;\n  rear = (rear + 1) % MAX_SIZE;\n  queue[rear] = data;\n  size++;\n}`
    },
    DEQUEUE: {
        JAVA: `public int dequeue() {\n  if (isEmpty()) throw new QueueUnderflow();\n  int data = queue[front];\n  front = (front + 1) % MAX_SIZE;\n  size--;\n  return data;\n}`,
        PYTHON: `def dequeue(self):\n  if self.is_empty(): raise UnderflowError()\n  data = self.queue[self.front]\n  self.front = (self.front + 1) % self.max_size\n  self.size -= 1\n  return data`,
        CPP: `int dequeue() {\n  if (size == 0) return -1;\n  int data = queue[front];\n  front = (front + 1) % MAX_SIZE;\n  size--;\n  return data;\n}`
    },
    SEARCH: {
        JAVA: `public int search(int data) {\n  for(int i=0; i<size; i++) {\n    int idx = (front + i) % MAX_SIZE;\n    if(queue[idx] == data) return i;\n  }\n  return -1;\n}`,
        PYTHON: `def search(self, val):\n  for i in range(self.size):\n    idx = (self.front + i) % self.max_size\n    if self.queue[idx] == val: return i\n  return -1`,
        CPP: `int search(int val) {\n  for(int i=0; i<size; i++) {\n    int idx = (front + i) % MAX_SIZE;\n    if(queue[idx] == val) return i;\n  }\n  return -1;\n}`
    },
    IS_EMPTY: {
        JAVA: `public boolean isEmpty() {\n  return size == 0;\n}`,
        PYTHON: `def is_empty(self):\n  return self.size == 0`,
        CPP: `bool isEmpty() {\n  return size == 0;\n}`
    },
    IS_FULL: {
        JAVA: `public boolean isFull() {\n  return size == MAX_SIZE;\n}`,
        PYTHON: `def is_full(self):\n  return self.size == self.max_size`,
        CPP: `bool isFull() {\n  return size == MAX_SIZE;\n}`
    },
    PEEK: {
        JAVA: `public int peek() {\n  return queue[front];\n}`,
        PYTHON: `def peek(self):\n  return self.queue[self.front]`,
        CPP: `int peek() {\n  return queue[front];\n}`
    },
    IDLE_STRUCTURE: {
        JAVA: `class Queue {\n  int[] queue;\n  int front = 0, rear = -1, size = 0;\n  int MAX_SIZE = 8;\n}`,
        PYTHON: `class Queue:\n  def __init__(self):\n    self.queue = [None]*8\n    self.front = 0\n    self.rear = -1`,
        CPP: `struct Queue {\n  int queue[8];\n  int front = 0, rear = -1, size = 0;\n};`
    }
};

export const LINKED_LIST_CODE_TEMPLATES = {
    PREPEND: {
        JAVA: `Node newNode = new Node(data);\nnewNode.next = head;\nhead = newNode;`,
        PYTHON: `new_node = Node(data)\nnew_node.next = head\nhead = new_node`,
        CPP: `Node* newNode = new Node(data);\nnewNode->next = head;\nhead = newNode;`
    },
    APPEND: {
        JAVA: `Node newNode = new Node(data);\nNode temp = head;\nwhile (temp.next != null) {\n  temp = temp.next;\n}\ntemp.next = newNode;`,
        PYTHON: `new_node = Node(data)\ntemp = head\nwhile temp.next:\n  temp = temp.next\ntemp.next = new_node`,
        CPP: `Node* newNode = new Node(data);\nNode* temp = head;\nwhile (temp->next) {\n  temp = temp->next;\n}\ntemp->next = newNode;`
    },
    INSERT: {
        JAVA: `Node newNode = new Node(data);\nNode temp = head;\nfor (int i=0; i<idx-1; i++)\n  temp = temp.next;\nnewNode.next = temp.next;\ntemp.next = newNode;`,
        PYTHON: `new_node = Node(data)\ntemp = head\nfor _ in range(idx-1):\n  temp = temp.next\nnew_node.next = temp.next\ntemp.next = new_node`,
        CPP: `Node* newNode = new Node(data);\nNode* temp = head;\nfor (int i=0; i<idx-1; i++)\n  temp = temp->next;\nnewNode->next = temp->next;\ntemp->next = newNode;`
    },
    DELETE: {
        JAVA: `Node temp = head;\nwhile (temp.next.id != targetId)\n  temp = temp.next;\ntemp.next = temp.next.next;`,
        PYTHON: `temp = head\nwhile temp.next.id != target_id:\n  temp = temp.next\ntemp.next = temp.next.next`,
        CPP: `Node* temp = head;\nwhile (temp->next->id != targetId)\n  temp = temp->next;\ntemp->next = temp->next->next;`
    },
    REVERSE: {
        JAVA: `Node prev = null;\nNode curr = head;\nwhile (curr != null) {\n  Node next = curr.next;\n  curr.next = prev;\n  prev = curr;\n  curr = next;\n}\nhead = prev;`,
        PYTHON: `prev, curr = None, head\nwhile curr:\n  next = curr.next\n  curr.next = prev\n  prev = curr\n  curr = next\nhead = prev`,
        CPP: `Node* prev = nullptr;\nNode* curr = head;\nwhile (curr) {\n  Node* next = curr->next;\n  curr->next = prev;\n  prev = curr;\n  curr = next;\n}\nhead = prev;`
    },
    SEARCH: {
        JAVA: `Node temp = head;\nwhile (temp != null) {\n  if (temp.data == query) return temp;\n  temp = temp.next;\n}`,
        PYTHON: `temp = head\nwhile temp:\n  if temp.data == query: return temp\n  temp = temp.next`,
        CPP: `Node* temp = head;\nwhile (temp) {\n  if (temp->data == query) return temp;\n  temp = temp->next;\n}`
    },
    ACCESS: {
        JAVA: `Node temp = head;\nfor (int i=0; i<index; i++)\n  temp = temp.next;\nreturn temp.data;`,
        PYTHON: `temp = head\nfor _ in range(index):\n  temp = temp.next\nreturn temp.data`,
        CPP: `Node* temp = head;\nfor (int i=0; i<index; i++)\n  temp = temp->next;\nreturn temp->data;`
    },
    DETECT_CYCLE: {
        JAVA: `Node slow = head, fast = head;\nwhile (fast != null && fast.next != null) {\n  slow = slow.next;\n  fast = fast.next.next;\n  if (slow == fast) return true;\n}`,
        PYTHON: `slow, fast = head, head\nwhile fast and fast.next:\n  slow = slow.next\n  fast = fast.next.next\n  if slow == fast: return True`,
        CPP: `Node *slow = head, *fast = head;\nwhile (fast && fast->next) {\n  slow = slow->next;\n  fast = fast->next->next;\n  if (slow == fast) return true;\n}`
    },
    GARBAGE_COLLECT: {
        JAVA: `// Remove nodes without references\nSystem.gc(); // JVM handles it`,
        PYTHON: `import gc\ngc.collect() # CPython handles it`,
        CPP: `// Manual cleanup required\ndelete orphanedNodes;`
    },
    IDLE_STRUCTURE: {
        JAVA: `class Node {\n  int data;\n  Node next;\n  Node prev;\n}`,
        PYTHON: `class Node:\n  def __init__(self, val):\n    self.val = val\n    self.next = None\n    self.prev = None`,
        CPP: `struct Node {\n  int data;\n  Node* next;\n  Node* prev;\n};`
    }
};

export const BST_CODE_TEMPLATES = {
    INSERT: {
        JAVA: `public Node insert(Node root, int val) {\n  if (root == null) return new Node(val);\n  if (val < root.data) root.left = insert(root.left, val);\n  else root.right = insert(root.right, val);\n  return root;\n}`,
        PYTHON: `def insert(self, root, val):\n  if not root: return Node(val)\n  if val < root.val:\n    root.left = self.insert(root.left, val)\n  else:\n    root.right = self.insert(root.right, val)\n  return root`,
        CPP: `Node* insert(Node* root, int val) {\n  if (!root) return new Node(val);\n  if (val < root->data) root->left = insert(root->left, val);\n  else root->right = insert(root->right, val);\n  return root;\n}`
    },
    SEARCH: {
        JAVA: `public boolean search(Node root, int val) {\n  if (root == null) return false;\n  if (root.data == val) return true;\n  return val < root.data ? search(root.left, val) : search(root.right, val);\n}`,
        PYTHON: `def search(self, root, val):\n  if not root: return False\n  if root.val == val: return True\n  return self.search(root.left, val) if val < root.val else self.search(root.right, val)`,
        CPP: `bool search(Node* root, int val) {\n  if (!root) return false;\n  if (root->data == val) return true;\n  return val < root->data ? search(root->left, val) : search(root->right, val);\n}`
    },
    INORDER: {
        JAVA: `void inOrder(Node node) {\n  if (node == null) return;\n  inOrder(node.left);\n  System.out.print(node.data);\n  inOrder(node.right);\n}`,
        PYTHON: `def in_order(self, node):\n  if not node: return\n  self.in_order(node.left)\n  print(node.val)\n  self.in_order(node.right)`,
        CPP: `void inOrder(Node* node) {\n  if (!node) return;\n  inOrder(node->left);\n  cout << node->data;\n  inOrder(node->right);\n}`
    },
    PREORDER: {
        JAVA: `void preOrder(Node node) {\n  if (node == null) return;\n  System.out.print(node.data);\n  preOrder(node.left);\n  preOrder(node.right);\n}`,
        PYTHON: `def pre_order(self, node):\n  if not node: return\n  print(node.val)\n  self.pre_order(node.left)\n  self.pre_order(node.right)`,
        CPP: `void preOrder(Node* node) {\n  if (!node) return;\n  cout << node->data;\n  preOrder(node->left);\n  preOrder(node->right);\n}`
    },
    POSTORDER: {
        JAVA: `void postOrder(Node node) {\n  if (node == null) return;\n  postOrder(node.left);\n  postOrder(node.right);\n  System.out.print(node.data);\n}`,
        PYTHON: `def post_order(self, node):\n  if not node: return\n  self.post_order(node.left)\n  self.post_order(node.right)\n  print(node.val)`,
        CPP: `void postOrder(Node* node) {\n  if (!node) return;\n  postOrder(node->left);\n  postOrder(node->right);\n  cout << node->data;\n}`
    },
    LEVELORDER: {
        JAVA: `void levelOrder(Node root) {\n  Queue<Node> q = new LinkedList<>();\n  q.add(root);\n  while (!q.isEmpty()) {\n    Node curr = q.poll();\n    System.out.print(curr.data);\n    if (curr.left != null) q.add(curr.left);\n    if (curr.right != null) q.add(curr.right);\n  }\n}`,
        PYTHON: `def level_order(self, root):\n  q = collections.deque([root])\n  while q:\n    curr = q.popleft()\n    print(curr.val)\n    if curr.left: q.append(curr.left)\n    if curr.right: q.append(curr.right)`,
        CPP: `void levelOrder(Node* root) {\n  queue<Node*> q;\n  q.push(root);\n  while (!q.empty()) {\n    Node* curr = q.front(); q.pop();\n    cout << curr->data;\n    if (curr->left) q.push(curr->left);\n    if (curr->right) q.push(curr->right);\n  }\n}`
    },
    DELETE: {
        JAVA: `Node delete(Node root, int val) {\n  if (root == null) return null;\n  if (val < root.data) root.left = delete(root.left, val);\n  else if (val > root.data) root.right = delete(root.right, val);\n  else {\n    if (root.left == null) return root.right;\n    if (root.right == null) return root.left;\n    root.data = minValue(root.right);\n    root.right = delete(root.right, root.data);\n  }\n  return root;\n}`,
        PYTHON: `def delete(self, root, val):\n  if not root: return None\n  if val < root.val: root.left = self.delete(root.left, val)\n  elif val > root.val: root.right = self.delete(root.right, val)\n  else:\n    if not root.left: return root.right\n    if not root.right: return root.left\n    root.val = self.min(root.right)\n    root.right = self.delete(root.right, root.val)\n  return root`,
        CPP: `Node* deleteNode(Node* root, int val) {\n  if (!root) return nullptr;\n  if (val < root->data) root->left = deleteNode(root->left, val);\n  else if (val > root->data) root->right = deleteNode(root->right, val);\n  else {\n    if (!root->left) return root->right;\n    if (!root->right) return root->left;\n    Node* temp = minValueNode(root->right);\n    root->data = temp->data;\n    root->right = deleteNode(root->right, temp->data);\n  }\n  return root;\n}`
    },
    IDLE_STRUCTURE: {
        JAVA: `class Node {\n  int data;\n  Node left, right;\n  public Node(int data) { this.data = data; }\n}`,
        PYTHON: `class Node:\n  def __init__(self, val):\n    self.val = val\n    self.left = None\n    self.right = None`,
        CPP: `struct Node {\n  int data;\n  Node *left, *right;\n  Node(int val) : data(val), left(NULL), right(NULL) {}\n};`
    },
    ROTATE_LEFT: {
        JAVA: `Node leftRotate(Node x) {\n  Node y = x.right;\n  x.right = y.left;\n  y.left = x;\n  return y;\n}`,
        PYTHON: `def left_rotate(self, x):\n  y = x.right\n  x.right = y.left\n  y.left = x\n  return y`,
        CPP: `Node* leftRotate(Node* x) {\n  Node* y = x->right;\n  x->right = y->left;\n  y->left = x;\n  return y;\n}`
    },
    ROTATE_RIGHT: {
        JAVA: `Node rightRotate(Node y) {\n  Node x = y.left;\n  y.left = x.right;\n  x.right = y;\n  return x;\n}`,
        PYTHON: `def right_rotate(self, y):\n  x = y.left\n  y.left = x.right\n  x.right = y\n  return x`,
        CPP: `Node* rightRotate(Node* y) {\n  Node* x = y->left;\n  y->left = x->right;\n  x->right = y;\n  return x;\n}`
    }
};

export const INTEGER_CODE_TEMPLATES = {
    INCREMENT: {
        JAVA: `int data = value;\ndata++;`,
        PYTHON: `data = value\ndata += 1`,
        CPP: `int data = value;\ndata++;`
    },
    DECREMENT: {
        JAVA: `int data = value;\ndata--;`,
        PYTHON: `data = value\ndata -= 1`,
        CPP: `int data = value;\ndata--;`
    },
    SHIFT_LEFT: {
        JAVA: `int data = value;\ndata = data << 1;`,
        PYTHON: `data = value\ndata = data << 1`,
        CPP: `int data = value;\ndata = data << 1;`
    },
    SHIFT_RIGHT: {
        JAVA: `int data = value;\ndata = data >> 1; // Arithmetic shift`,
        PYTHON: `data = value\ndata = data >> 1`,
        CPP: `int data = value;\ndata = data >> 1;`
    },
    NOT: {
        JAVA: `int data = value;\ndata = ~data;`,
        PYTHON: `data = value\ndata = ~data`,
        CPP: `int data = value;\ndata = ~data;`
    },
    IDLE_STRUCTURE: {
        JAVA: `int value = 0; // Primitive 32-bit (or 8-bit visual)`,
        PYTHON: `value = 0 # Primitive Integer`,
        CPP: `int value = 0; // Primitive`
    }
};

export const FLOAT_CODE_TEMPLATES = {
    ASSIGNMENT: {
        JAVA: `float data = value;\n// IEEE 754 format`,
        PYTHON: `data = float(value)`,
        CPP: `float data = value;\n// IEEE 754 format`
    },
    ADDITION: {
        JAVA: `float data = value;\ndata += 1.5f;`,
        PYTHON: `data = value\ndata += 1.5`,
        CPP: `float data = value;\ndata += 1.5f;`
    },
    MULTIPLICATION: {
        JAVA: `float data = value;\ndata *= 2.0f;`,
        PYTHON: `data = value\ndata *= 2.0`,
        CPP: `float data = value;\ndata *= 2.0f;`
    },
    DIVISION: {
        JAVA: `float data = value;\ndata /= 2.0f;`,
        PYTHON: `data = value\ndata /= 2.0`,
        CPP: `float data = value;\ndata /= 2.0f;`
    },
    IDLE_STRUCTURE: {
        JAVA: `float value = 0.0f; // IEEE 754 Single/Half Precision`,
        PYTHON: `value = 0.0 # Primitive Float`,
        CPP: `float value = 0.0f; // IEEE 754`
    }
};

export const CHARACTER_CODE_TEMPLATES = {
    ASSIGNMENT: {
        JAVA: `char c = 'A'; // 16-bit Unicode`,
        PYTHON: `c = 'A' # String of length 1`,
        CPP: `char c = 'A'; // 8-bit ASCII`
    },
    TO_UPPER: {
        JAVA: `c = Character.toUpperCase(c);`,
        PYTHON: `c = c.upper()`,
        CPP: `c = toupper(c);`
    },
    TO_LOWER: {
        JAVA: `c = Character.toLowerCase(c);`,
        PYTHON: `c = c.lower()`,
        CPP: `c = tolower(c);`
    },
    GET_ASCII: {
        JAVA: `int ascii = (int) c;`,
        PYTHON: `ascii = ord(c)`,
        CPP: `int ascii = (int) c;`
    },
    IDLE_STRUCTURE: {
        JAVA: `char c = '\\0'; // Null character`,
        PYTHON: `c = '' # Empty string`,
        CPP: `char c = '\\0'; // Null terminator`
    }
};

export const BOOLEAN_CODE_TEMPLATES = {
    ASSIGNMENT: {
        JAVA: `boolean flag = true;`,
        PYTHON: `flag = True`,
        CPP: `bool flag = true;`
    },
    LOGICAL_NOT: {
        JAVA: `flag = !flag;`,
        PYTHON: `flag = not flag`,
        CPP: `flag = !flag;`
    },
    LOGICAL_AND: {
        JAVA: `boolean result = flag && true;`,
        PYTHON: `result = flag and True`,
        CPP: `bool result = flag && true;`
    },
    LOGICAL_OR: {
        JAVA: `boolean result = flag || false;`,
        PYTHON: `result = flag or False`,
        CPP: `bool result = flag || false;`
    },
    IDLE_STRUCTURE: {
        JAVA: `boolean value; // Default false in fields`,
        PYTHON: `value = None # Or False`,
        CPP: `bool value; // Undefined/False`
    }
};

export const GRAPH_CODE_TEMPLATES = {
    ADD_VERTEX: {
        JAVA: `void addVertex(T label) {\n    adjVertices.putIfAbsent(new Vertex(label), new ArrayList<>());\n}`,
        PYTHON: `def add_vertex(self, vertex):\n    if vertex not in self.adj_list:\n        self.adj_list[vertex] = []`,
        CPP: `void addVertex(int v) {\n    adjList[v] = {};\n}`
    },
    ADD_EDGE: {
        JAVA: `void addEdge(T v1, T v2) {\n    adjVertices.get(new Vertex(v1)).add(new Vertex(v2));\n    adjVertices.get(new Vertex(v2)).add(new Vertex(v1));\n}`,
        PYTHON: `def add_edge(self, v1, v2):\n    self.adj_list[v1].append(v2)\n    self.adj_list[v2].append(v1)`,
        CPP: `void addEdge(int v, int w) {\n    adjList[v].push_back(w);\n    adjList[w].push_back(v);\n}`
    },
    BFS: {
        JAVA: `void bfs(T start) {\n    Queue<T> q = new LinkedList<>();\n    q.add(start);\n    // logic...\n}`,
        PYTHON: `def bfs(self, start):\n    queue = [start]\n    visited = {start}\n    # logic...`,
        CPP: `void bfs(int start) {\n    queue<int> q;\n    q.push(start);\n    // logic...\n}`
    },
    DFS: {
        JAVA: `void dfs(T start) {\n    Stack<T> s = new Stack<>();\n    s.push(start);\n    // logic...\n}`,
        PYTHON: `def dfs(self, start):\n    stack = [start]\n    visited = {start}\n    # logic...`,
        CPP: `void dfs(int start) {\n    stack<int> s;\n    s.push(start);\n    // logic...\n}`
    },
    IDLE_STRUCTURE: {
        JAVA: `Map<Vertex, List<Vertex>> adjVertices;`,
        PYTHON: `self.adj_list = {}`,
        CPP: `map<int, vector<int>> adjList;`
    }
};

export const SORTING_CODE_TEMPLATES = {
    BUBBLESORT: {
        JAVA: `for (int i = 0; i < n-1; i++) {\n    for (int j = 0; j < n-i-1; j++) {\n        if (arr[j] > arr[j+1]) swap(j, j+1);\n    }\n}`,
        PYTHON: `for i in range(n):\n    for j in range(0, n-i-1):\n        if arr[j] > arr[j+1]:\n            arr[j], arr[j+1] = arr[j+1], arr[j]`,
        CPP: `for (int i = 0; i < n-1; i++) {\n    for (int j = 0; j < n-i-1; j++) {\n        if (arr[j] > arr[j+1]) swap(arr[j], arr[j+1]);\n    }\n}`
    },
    QUICKSORT: {
        JAVA: `void quickSort(int low, int high) {\n    if (low < high) {\n        int pi = partition(low, high);\n        quickSort(low, pi - 1);\n        quickSort(pi + 1, high);\n    }\n}`,
        PYTHON: `def quickSort(arr, low, high):\n    if low < high:\n        pi = partition(arr, low, high)\n        quickSort(arr, low, pi-1)\n        quickSort(arr, pi+1, high)`,
        CPP: `void quickSort(int low, int high) {\n    if (low < high) {\n        int pi = partition(low, high);\n        quickSort(low, pi - 1);\n        quickSort(pi + 1, high);\n    }\n}`
    },
    MERGESORT: {
        JAVA: `void mergeSort(int l, int r) {\n    if (l < r) {\n        int m = l + (r-l)/2;\n        mergeSort(l, m);\n        mergeSort(m+1, r);\n        merge(l, m, r);\n    }\n}`,
        PYTHON: `def mergeSort(arr, l, r):\n    if l < r:\n        m = (l+(r-1))//2\n        mergeSort(arr, l, m)\n        mergeSort(arr, m+1, r)\n        merge(arr, l, m, r)`,
        CPP: `void mergeSort(int l, int r) {\n    if (l < r) {\n        int m = l + (r-l)/2;\n        mergeSort(l, m);\n        mergeSort(m+1, r);\n        merge(l, m, r);\n    }\n}`
    },
    IDLE_STRUCTURE: {
        JAVA: `void sort(int[] arr) { // Complexity varies }`,
        PYTHON: `def sort(arr): # Sorting algorithm logic`,
        CPP: `void sort(vector<int>& arr) { /* algorithmic sorting */ }`
    }
};

export const SEARCH_CODE_TEMPLATES = {
    LINEAR_SEARCH: {
        JAVA: `for (int i = 0; i < n; i++) {\n    if (arr[i] == target) return i;\n}\nreturn -1;`,
        PYTHON: `for i in range(len(arr)):\n    if arr[i] == target:\n        return i\nreturn -1`,
        CPP: `for (int i = 0; i < n; i++) {\n    if (arr[i] == target) return i;\n}\nreturn -1;`
    },
    BINARY_SEARCH: {
        JAVA: `int l = 0, r = n - 1;\nwhile (l <= r) {\n    int m = l + (r - l) / 2;\n    if (arr[m] == target) return m;\n    if (arr[m] < target) l = m + 1;\n    else r = m - 1;\n}\nreturn -1;`,
        PYTHON: `l, r = 0, len(arr) - 1\nwhile l <= r:\n    m = l + (r - l) // 2\n    if arr[m] == target: return m\n    if arr[m] < target: l = m + 1\n    else: r = m - 1\nreturn -1`,
        CPP: `int l = 0, r = n - 1;\nwhile (l <= r) {\n    int m = l + (r - l) / 2;\n    if (arr[m] == target) return m;\n    if (arr[m] < target) l = m + 1;\n    else r = m - 1;\n}\nreturn -1;`
    },
    IDLE_STRUCTURE: {
        JAVA: `int search(int[] arr, int target) { // logic }`,
        PYTHON: `def search(arr, target): # logic`,
        CPP: `int search(vector<int>& arr, int target) { // logic }`
    }
};

export const PATTERN_CODE_TEMPLATES = {
    TWO_POINTERS: {
        JAVA: `int l = 0, r = n - 1;\nwhile (l < r) {\n    if (arr[l] + arr[r] == target) return true;\n    if (arr[l] + arr[r] < target) l++;\n    else r--;\n}`,
        PYTHON: `l, r = 0, len(arr) - 1\nwhile l < r:\n    if arr[l] + arr[r] == target: return True\n    if arr[l] + arr[r] < target: l += 1\n    else: r -= 1`,
        CPP: `int l = 0, r = n - 1;\nwhile (l < r) {\n    if (arr[l] + arr[r] == target) return true;\n    if (arr[l] + arr[r] < target) l++;\n    else r--;\n}`
    },
    SLIDING_WINDOW: {
        JAVA: `int max = 0, curr = 0;\nfor (int i = 0; i < k; i++) curr += arr[i];\nfor (int i = k; i < n; i++) {\n    curr += arr[i] - arr[i-k];\n    max = Math.max(max, curr);\n}`,
        PYTHON: `curr = sum(arr[:k])\nmax_val = curr\nfor i in range(k, len(arr)):\n    curr += arr[i] - arr[i-k]\n    max_val = max(max_val, curr)`,
        CPP: `int max_v = 0, curr = 0;\nfor (int i = 0; i < k; i++) curr += arr[i];\nfor (int i = k; i < n; i++) {\n    curr += arr[i] - arr[i-k];\n    max_v = max(max_v, curr);\n}`
    },
    PREFIX_SUM: {
        JAVA: `int[] prefix = new int[n];\nprefix[0] = arr[0];\nfor (int i = 1; i < n; i++) {\n    prefix[i] = prefix[i-1] + arr[i];\n}`,
        PYTHON: `prefix = [0] * n\nprefix[0] = arr[0]\nfor i in range(1, n):\n    prefix[i] = prefix[i-1] + arr[i]`,
        CPP: `vector<int> prefix(n);\nprefix[0] = arr[0];\nfor (int i = 1; i < n; i++) {\n    prefix[i] = prefix[i-1] + arr[i];\n}`
    },
    HASHING: {
        JAVA: `HashMap<Integer, Integer> map = new HashMap<>();\nfor (int x : arr) {\n    map.put(x, map.getOrDefault(x, 0) + 1);\n}`,
        PYTHON: `count = {}\nfor x in arr:\n    count[x] = count.get(x, 0) + 1`,
        CPP: `unordered_map<int, int> count;\nfor (int x : arr) count[x]++;`
    },
    IDLE_STRUCTURE: {
        JAVA: `// Theoretical Patterns - Problem Solving`,
        PYTHON: `# Theoretical Patterns - Problem Solving`,
        CPP: `// Theoretical Patterns - Problem Solving`
    }
};

export const SEARCH_PATTERN_CODE_TEMPLATES = {
    BINARY_SEARCH: {
        JAVA: `int l = 0, r = n - 1;\nwhile (l <= r) {\n    int m = l + (r - l) / 2;\n    if (arr[m] == target) return m;\n    if (arr[m] < target) l = m + 1;\n    else r = m - 1;\n}`,
        PYTHON: `l, r = 0, len(arr) - 1\nwhile l <= r:\n    m = l + (r - l) // 2\n    if arr[m] == target: return m\n    if arr[m] < target: l = m + 1\n    else: r = m - 1`,
        CPP: `int l = 0, r = n - 1;\nwhile (l <= r) {\n    int m = l + (r - l) / 2;\n    if (arr[m] == target) return m;\n    if (arr[m] < target) l = m + 1;\n    else r = m - 1;\n}`
    },
    BS_ON_ANSWER: {
        JAVA: `int l = minPossible, r = maxPossible, ans = -1;\nwhile (l <= r) {\n    int mid = l + (r - l) / 2;\n    if (check(mid)) {\n        ans = mid;\n        r = mid - 1; // Or l = mid + 1\n    } else l = mid + 1;\n}`,
        PYTHON: `low, high = min_val, max_val\nans = -1\nwhile low <= high:\n    mid = (low + high) // 2\n    if check(mid):\n        ans = mid\n        high = mid - 1\n    else: low = mid + 1`,
        CPP: `int l = min_v, r = max_v, ans = -1;\nwhile (l <= r) {\n    int mid = l + (r - l) / 2;\n    if (check(mid)) {\n        ans = mid;\n        high = mid - 1;\n    } else low = mid + 1;\n}`
    },
    CYCLIC_SORT: {
        JAVA: `int i = 0;\nwhile (i < n) {\n    int correct = arr[i] - 1;\n    if (arr[i] != arr[correct]) swap(arr, i, correct);\n    else i++;\n}`,
        PYTHON: `i = 0\nwhile i < len(arr):\n    correct = arr[i] - 1\n    if arr[i] != arr[correct]:\n        arr[i], arr[correct] = arr[correct], arr[i]\n    else: i += 1`,
        CPP: `int i = 0;\nwhile (i < n) {\n    int correct = arr[i] - 1;\n    if (arr[i] != arr[correct]) swap(arr[i], arr[correct]);\n    else i++;\n}`
    },
    IDLE_STRUCTURE: {
        JAVA: `// Searching Patterns Visualization`,
        PYTHON: `# Searching Patterns Visualization`,
        CPP: `// Searching Patterns Visualization`
    }
};

export const RECURSION_CODE_TEMPLATES = {
    RECURSION: {
        JAVA: `int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}`,
        PYTHON: `def factorial(n):\n    if n <= 1: return 1\n    return n * factorial(n - 1)`,
        CPP: `int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}`
    },
    BACKTRACKING: {
        JAVA: `void solve(int row) {\n    if (row == N) { count++; return; }\n    for (int col = 0; col < N; col++) {\n        if (isSafe(row, col)) {\n            board[row][col] = 1;\n            solve(row + 1);\n            board[row][col] = 0; // Backtrack\n        }\n    }\n}`,
        PYTHON: `def solve(row):\n    if row == N: self.count += 1; return\n    for col in range(N):\n        if is_safe(row, col):\n            board[row][col] = 1\n            solve(row + 1)\n            board[row][col] = 0 # Backtrack`,
        CPP: `void solve(int row) {\n    if (row == N) { count++; return; }\n    for (int col = 0; col < N; col++) {\n        if (isSafe(row, col)) {\n            board[row][col] = 1;\n            solve(row + 1);\n            board[row][col] = 0; // Backtrack\n        }\n    }\n}`
    },
    IDLE_STRUCTURE: {
        JAVA: `// Recursion & Backtracking Visualization`,
        PYTHON: `# Recursion & Backtracking Visualization`,
        CPP: `// Recursion & Backtracking Visualization`
    }
};

export const BITWISE_CODE_TEMPLATES = {
    BITWISE: {
        JAVA: `boolean isPowerOfTwo(int n) {\n    return n > 0 && (n & (n - 1)) == 0;\n}`,
        PYTHON: `def is_power_of_two(n):\n    return n > 0 and (n & (n - 1)) == 0`,
        CPP: `bool isPowerOfTwo(int n) {\n    return n > 0 && (n & (n - 1)) == 0;\n}`
    },
    IDLE_STRUCTURE: {
        JAVA: `// Bitwise Logic Visualization`,
        PYTHON: `# Bitwise Logic Visualization`,
        CPP: `// Bitwise Logic Visualization`
    }
};

export const memoryAddresses = [
    "0x10A", "0x10B", "0x10C", "0x10D", "0x10E", "0x10F", "0x110", "0x111",
    "0x112", "0x113", "0x114", "0x115", "0x116", "0x117", "0x118", "0x119",
    "0x11A", "0x11B", "0x11C", "0x11D", "0x11E", "0x11F", "0x120", "0x121"
];

export const bstMemoryAddresses = [
    "0x20A", "0x20B", "0x20C", "0x20D", "0x20E", "0x20F", "0x210", "0x211",
    "0x212", "0x213", "0x214", "0x215", "0x216", "0x217", "0x218", "0x219",
    "0x21A", "0x21B", "0x21C", "0x21D", "0x21E", "0x21F", "0x220", "0x221"
];

export const hierarchy = {
    title: "Types of Data Structures",
    children: [
        {
            title: "Complexity",
            desc: "The mathematical foundation of algorithmic efficiency and resource management.",
            modules: [
                { title: "Big-O Analysis", desc: "Understanding time and space growth rates.", id: 0, path: "/complexity-module" }
            ]
        },
        {
            title: "Primitive",
            desc: "The basic data types provided by programming languages.",
            primitiveList: ["Integer", "Float", "Character", "Boolean"]
        },
        {
            title: "Non-Primitive",
            children: [
                {
                    title: "Linear",
                    children: [
                        {
                            title: "Static",
                            modules: [
                                { title: "Static Arrays", desc: "Fixed-size contiguous memory blocks with O(1) access.", id: 21, path: "/static-array-module" }
                            ]
                        },
                        {
                            title: "Dynamic",
                            modules: [
                                { title: "Dynamic Arrays", desc: "Resizable contiguous memory that expands as needed.", id: 1, path: "/list-module" },
                                { title: "Linked List", desc: "Node-based structure with pointer chains.", id: 2, path: "/linked-list-module" },
                                { title: "Stacks", desc: "LIFO structure for process management.", id: 3, path: "/stack-module" },
                                { title: "Queues", desc: "FIFO structure for buffering systems.", id: 4, path: "/queue-module" }
                            ]
                        }
                    ]
                },
                {
                    title: "Non-Linear",
                    modules: [
                        { title: "Binary Trees", desc: "Efficient hierarchical data management.", id: 5, path: "/bst-module" },
                        { title: "Graphs", desc: "Complex relational networking logic.", id: 6, path: "/graph-module", locked: false }
                    ]
                }
            ]
        },
        {
            title: "Algorithms",
            children: [
                {
                    title: "Sorting",
                    desc: "Computational methods for arranging data elements in a specific order.",
                    modules: [
                        { title: "Bubble Sort", desc: "Comparative sorting by swapping adjacent items.", id: 7, path: "/sorting-module?algo=bubblesort" },
                        { title: "Quick Sort", desc: "Divide and conquer with recursive partitioning.", id: 8, path: "/sorting-module?algo=quicksort" },
                        { title: "Merge Sort", desc: "Stable sorting using recursive merge strategy.", id: 9, path: "/sorting-module?algo=mergesort" }
                    ]
                },
                {
                    title: "Searching",
                    desc: "Methods for finding specific elements within a data collection.",
                    modules: [
                        { title: "Linear Search", desc: "Sequential verification of every element in the set.", id: 10, path: "/searching-module?algo=linear" },
                        { title: "Binary Search", desc: "High-speed logarithmic search in sorted datasets.", id: 11, path: "/searching-module?algo=binary" }
                    ]
                }
            ]
        },
        {
            title: "Problem Solving",
            children: [
                {
                    title: "Array Patterns",
                    desc: "Strategic techniques for optimizing complexity in sequential processing.",
                    modules: [
                        { title: "Two Pointers", desc: "Dual-index traversal for symmetric evaluation.", id: 12, path: "/pattern-module?type=twopointers" },
                        { title: "Sliding Window", desc: "Localized sub-segment evaluation within fixed/variable bounds.", id: 13, path: "/pattern-module?type=slidingwindow" },
                        { title: "Prefix Sum", desc: "Pre-calculated cumulative totals for O(1) range queries.", id: 14, path: "/pattern-module?type=prefixsum" },
                        { title: "Hashing", desc: "Constant time lookup strategies using key-value mappings.", id: 15, path: "/pattern-module?type=hashing" }
                    ]
                },
                {
                    title: "Searching Patterns",
                    desc: "Used when you need to find elements efficiently. Most Important.",
                    modules: [
                        { title: "Binary Search", desc: "Standard divide-and-conquer search strategy.", id: 16, path: "/search-pattern-module?type=binary" },
                        { title: "Binary Search on Answer", desc: "Searching in a range of potential solutions.", id: 17, path: "/search-pattern-module?type=bsonanswer" },
                        { title: "Cyclic Sort", desc: "Sorting numbers in range [1, n] in linear time.", id: 18, path: "/search-pattern-module?type=cyclic" }
                    ]
                },
                {
                    title: "Recursion & Backtracking",
                    desc: "Used when exploring all possible combinations or decisions. Most Important.",
                    modules: [
                        { title: "Recursion", desc: "The art of functions calling themselves to solve sub-problems.", id: 19, path: "/recursion-module?type=recursion" },
                        { title: "Backtracking", desc: "Brute force exploration with an 'Undo' mechanism.", id: 20, path: "/recursion-module?type=backtracking" },
                        { title: "Bit Manipulation", desc: "Optimizing space and speed using binary arithmetic.", id: 21, path: "/recursion-module?type=bitwise" }
                    ]
                }
            ]
        }
    ]
};
