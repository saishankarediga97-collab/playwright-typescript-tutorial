import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Trash2, 
  Terminal, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  FileCode,
  Copy,
  Check
} from 'lucide-react';
import { runTypeScriptCode, ConsoleOutputItem } from '../utils/codeRunner';

interface CodePlaygroundProps {
  initialCode?: string;
}

const TEMPLATES: { name: string; category: string; code: string }[] = [
  {
    name: 'Playwright POM Method Chaining',
    category: 'Playwright',
    code: `// --- REAL-TIME PLAYWRIGHT POM WITH ASYNC METHOD CHAINING ---
abstract class BasePage {
  constructor(protected pageName: string) {}
  async ready(): Promise<this> {
    console.log(\`[\${this.pageName}] Page loaded and network idle.\`);
    return this;
  }
}

class DashboardPage extends BasePage {
  constructor() {
    super('DashboardPage');
  }

  async clickLoginButton(): Promise<this> {
    console.log('-> [Locator: button:has-text("Sign In")] Clicked successfully.');
    return this;
  }

  async enterUsername(username: string = 'qa_architect'): Promise<this> {
    console.log(\`-> [Locator: input#username] Filled: "\${username}"\`);
    return this;
  }

  async enterPassword(password: string = 'SecretKey2026!'): Promise<this> {
    console.log(\`-> [Locator: input#password] Filled: "\${'*'.repeat(password.length)}"\`);
    return this;
  }

  async submit(): Promise<this> {
    console.log('-> [Locator: button[type="submit"]] Form submitted!');
    return this;
  }

  async verifyWelcomeBanner(): Promise<this> {
    console.log('-> [Assertion] expect(welcomeBanner).toBeVisible() PASSED (5ms)');
    return this;
  }
}

// Global generic open helper
async function open<T extends BasePage>(PageClass: new () => T): Promise<T> {
  console.log('[Runner] Initializing browser context and page...');
  const page = new PageClass();
  await page.ready();
  return page;
}

// EXECUTE THE CHAINED TEST:
async function runTest() {
  console.log('=== TEST START: TC-201 User Login Chained Flow ===');
  
  let BasePage = await open(DashboardPage)
    .then((_) => _.clickLoginButton())
    .then((_) => _.enterUsername('lead_architect'))
    .then((_) => _.enterPassword('EnterpriseVault2026!'))
    .then((_) => _.submit())
    .then((_) => _.verifyWelcomeBanner());

  console.log('=== TEST SUITE PASSED (5 assertions completed) ===');
  return { status: 'PASSED', targetPage: BasePage.constructor.name };
}

runTest();`
  },
  {
    name: 'Generic Singly Linked List (DSA)',
    category: 'DSA',
    code: `// Generic Singly Linked List with In-Place Reversal in TypeScript
class Node<T> {
  next: Node<T> | null = null;
  constructor(public val: T) {}
}

class LinkedList<T> {
  head: Node<T> | null = null;
  tail: Node<T> | null = null;
  size = 0;

  append(val: T): this {
    const node = new Node(val);
    if (!this.head || !this.tail) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.size++;
    return this;
  }

  // O(n) In-place Reversal
  reverse(): this {
    let prev: Node<T> | null = null;
    let curr = this.head;
    this.tail = this.head;

    while (curr !== null) {
      const nextTemp = curr.next;
      curr.next = prev;
      prev = curr;
      curr = nextTemp;
    }
    this.head = prev;
    return this;
  }

  print(): void {
    const items: T[] = [];
    let curr = this.head;
    while (curr) {
      items.push(curr.val);
      curr = curr.next;
    }
    console.log('List Contents:', items.join(' -> '));
  }
}

const list = new LinkedList<string>();
list.append('1. Goto URL')
    .append('2. Click Sign In')
    .append('3. Enter Password')
    .append('4. Confirm Dashboard');

console.log('Original Navigation Sequence:');
list.print();

list.reverse();
console.log('Reversed Sequence:');
list.print();
`
  },
  {
    name: 'Binary Search Tree Traversals (DSA)',
    category: 'DSA',
    code: `// Binary Search Tree (BST) with In-Order & BFS Traversal
class TreeNode<T> {
  left: TreeNode<T> | null = null;
  right: TreeNode<T> | null = null;
  constructor(public val: T) {}
}

class BST<T> {
  root: TreeNode<T> | null = null;

  insert(val: T): this {
    const node = new TreeNode(val);
    if (!this.root) {
      this.root = node;
      return this;
    }
    let curr = this.root;
    while (true) {
      if (val < curr.val) {
        if (!curr.left) { curr.left = node; break; }
        curr = curr.left;
      } else {
        if (!curr.right) { curr.right = node; break; }
        curr = curr.right;
      }
    }
    return this;
  }

  inOrder(): T[] {
    const res: T[] = [];
    const traverse = (n: TreeNode<T> | null) => {
      if (!n) return;
      traverse(n.left);
      res.push(n.val);
      traverse(n.right);
    };
    traverse(this.root);
    return res;
  }
}

const tree = new BST<number>();
[45, 12, 85, 32, 60, 95, 7].forEach((n) => tree.insert(n));

console.log('BST In-Order Traversal (Sorted Ascending):');
console.log(tree.inOrder());
`
  },
  {
    name: 'Playwright API Automation Client',
    category: 'API',
    code: `// Playwright API Client Simulation
interface ApiResponse<T> {
  status: number;
  ok: boolean;
  data: T;
  latencyMs: number;
}

class MockApiClient {
  async post<TReq, TRes>(endpoint: string, payload: TReq): Promise<ApiResponse<TRes>> {
    console.log(\`[HTTP POST] \${endpoint}\`);
    console.log('Payload:', payload);

    await new Promise((r) => setTimeout(r, 60));

    const data = {
      token: 'jwt-bearer-xyz-' + Date.now(),
      expiresIn: 3600,
      user: { id: 101, username: 'senior_qa', permissions: ['ADMIN', 'EXECUTE_TESTS'] }
    } as unknown as TRes;

    return {
      status: 200,
      ok: true,
      data,
      latencyMs: 62
    };
  }
}

async function runApiTest() {
  const client = new MockApiClient();
  const resp = await client.post('/api/v1/auth/login', {
    email: 'admin@enterprise.io',
    password: 'SuperSecretPassword'
  });

  console.log('Auth Status:', resp.status, '| Latency:', resp.latencyMs + 'ms');
  console.log('Received Auth Token:', resp.data);
}

runApiTest();`
  }
];

export const CodePlayground: React.FC<CodePlaygroundProps> = ({ initialCode }) => {
  const [code, setCode] = useState<string>(initialCode || TEMPLATES[0].code);
  const [logs, setLogs] = useState<ConsoleOutputItem[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleRunCode = async () => {
    setIsRunning(true);
    setLogs([]);
    try {
      const result = await runTypeScriptCode(code);
      setLogs(result.logs);
      setExecutionTime(result.executionTimeMs);
    } catch (err: any) {
      setLogs([
        {
          id: 'err',
          type: 'error',
          text: `Execution failed: ${err?.message || String(err)}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSelectTemplate = (templateCode: string) => {
    setCode(templateCode);
    setLogs([]);
    setExecutionTime(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="h-5 w-5 text-indigo-400" />
              TypeScript & Playwright Live Sandbox
            </h1>
            <span className="rounded-full bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 text-[11px] font-semibold text-indigo-300">
              In-Browser Sucrase Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Write or edit TypeScript code, POM chains, DSA algorithms, and run them instantly with live console output.
          </p>
        </div>

        {/* Template Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Template pills */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.name}
                onClick={() => handleSelectTemplate(tmpl.code)}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  code === tmpl.code
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tmpl.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-all"
            title="Copy TypeScript Code"
          >
            {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => handleSelectTemplate(TEMPLATES[0].code)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-all"
            title="Reset to default code"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          {/* RUN BUTTON */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50"
          >
            <Play className={`h-3.5 w-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Compiling & Running...' : 'Run Code (TS)'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Console Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 min-h-0">
        {/* Left Column: Code Editor */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <FileCode className="h-4 w-4 text-blue-400" />
              <span>playground.ts</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">TypeScript ES2022</span>
          </div>

          <div className="flex-1 relative overflow-hidden flex">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full bg-[#0b0f19] p-4 text-xs font-mono text-slate-200 resize-none focus:outline-none leading-relaxed selection:bg-blue-600/30"
              placeholder="// Write your TypeScript code here..."
            />
          </div>
        </div>

        {/* Right Column: Console / Execution Output */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
          {/* Console Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span>Console Output</span>
              {executionTime !== null && (
                <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 text-[10px] text-emerald-400">
                  ⚡ {executionTime}ms
                </span>
              )}
            </div>

            <button
              onClick={() => setLogs([])}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
              title="Clear Console"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear</span>
            </button>
          </div>

          {/* Console Output Body */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 bg-[#080c14]">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center p-6 space-y-2">
                <Sparkles className="h-8 w-8 text-slate-700" />
                <p className="text-xs">Click "Run Code (TS)" to compile and execute your TypeScript in real-time.</p>
                <p className="text-[11px] text-slate-700">All console.log statements and promise chains will be rendered here.</p>
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-start gap-2.5 py-1 px-2 rounded font-mono ${
                    log.type === 'error'
                      ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      : log.type === 'warn'
                      ? 'bg-amber-500/10 text-amber-300'
                      : log.type === 'result'
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900/50'
                  }`}
                >
                  <span className="text-[10px] text-slate-600 select-none pt-0.5">
                    {log.timestamp}
                  </span>
                  {log.type === 'error' ? (
                    <AlertCircle className="h-3.5 w-3.5 text-rose-400 mt-0.5 shrink-0" />
                  ) : log.type === 'result' ? (
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  ) : (
                    <span className="text-blue-500 select-none">›</span>
                  )}
                  <pre className="whitespace-pre-wrap break-all flex-1 font-mono text-xs">
                    {log.text}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
