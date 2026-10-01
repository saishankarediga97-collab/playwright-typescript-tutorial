import { transform } from 'sucrase';

export interface ConsoleOutputItem {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error' | 'result';
  text: string;
  timestamp: string;
}

export interface RunResult {
  success: boolean;
  logs: ConsoleOutputItem[];
  result?: any;
  error?: string;
  executionTimeMs: number;
}

/**
 * Safely stringifies values for the interactive console simulator
 */
function safeStringify(arg: any, depth = 0): string {
  if (arg === null) return 'null';
  if (arg === undefined) return 'undefined';
  if (typeof arg === 'function') return `[Function: ${arg.name || 'anonymous'}]`;
  if (typeof arg === 'symbol') return arg.toString();
  if (typeof arg === 'bigint') return `${arg}n`;
  if (arg instanceof Error) return `${arg.name}: ${arg.message}\n${arg.stack || ''}`;
  if (arg instanceof Date) return arg.toISOString();
  if (arg instanceof Map) {
    const entries = Array.from(arg.entries()).map(([k, v]) => `${safeStringify(k)} => ${safeStringify(v)}`);
    return `Map(${arg.size}) { ${entries.join(', ')} }`;
  }
  if (arg instanceof Set) {
    const values = Array.from(arg.values()).map((v) => safeStringify(v));
    return `Set(${arg.size}) { ${values.join(', ')} }`;
  }

  if (typeof arg === 'object') {
    if (depth > 3) return '[Object]';
    if (Array.isArray(arg)) {
      return `[ ${arg.map((x) => safeStringify(x, depth + 1)).join(', ')} ]`;
    }
    try {
      const keys = Object.keys(arg);
      const parts = keys.map((k) => `${k}: ${safeStringify(arg[k], depth + 1)}`);
      return `{ ${parts.join(', ')} }`;
    } catch {
      return String(arg);
    }
  }

  if (typeof arg === 'string') return `"${arg}"`;
  return String(arg);
}

/**
 * Compiles and runs TypeScript code in the browser with captured console and async support
 */
export async function runTypeScriptCode(tsCode: string): Promise<RunResult> {
  const startTime = performance.now();
  const logs: ConsoleOutputItem[] = [];

  const addLog = (type: ConsoleOutputItem['type'], args: any[]) => {
    const formatted = args.map((a) => (typeof a === 'string' ? a : safeStringify(a))).join(' ');
    logs.push({
      id: Math.random().toString(36).substring(2, 9),
      type,
      text: formatted,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  try {
    // 1. Transpile TS to JS using Sucrase
    const transpiled = transform(tsCode, {
      transforms: ['typescript'],
      disableESTransforms: true,
    }).code;

    // 2. Mock console methods
    const mockConsole = {
      log: (...args: any[]) => addLog('log', args),
      info: (...args: any[]) => addLog('info', args),
      warn: (...args: any[]) => addLog('warn', args),
      error: (...args: any[]) => addLog('error', args),
    };

    // 3. Wrap in async function to support top-level await and promise chaining
    const wrappedCode = `
      return (async (console) => {
        ${transpiled}
      })(mockConsole);
    `;

    // 4. Execute safely
    const runner = new Function('mockConsole', wrappedCode);
    const result = await runner(mockConsole);

    const endTime = performance.now();
    if (result !== undefined) {
      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: 'result',
        text: `↪ Output: ${safeStringify(result)}`,
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    return {
      success: true,
      logs,
      result,
      executionTimeMs: Math.round(endTime - startTime),
    };
  } catch (err: any) {
    const endTime = performance.now();
    const errorMsg = err?.message || String(err);
    logs.push({
      id: Math.random().toString(36).substring(2, 9),
      type: 'error',
      text: `Runtime Error: ${errorMsg}`,
      timestamp: new Date().toLocaleTimeString(),
    });

    return {
      success: false,
      logs,
      error: errorMsg,
      executionTimeMs: Math.round(endTime - startTime),
    };
  }
}
