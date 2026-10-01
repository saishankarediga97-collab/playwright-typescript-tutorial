export function stripTypeScript(tsCode) {
  let js = tsCode;

  // 1. Remove single-line comments during parsing or keep them
  // 2. Remove interfaces (handles nested braces safely)
  js = js.replace(/interface\s+[\w$<>]+(\s+extends\s+[\w$<>, ]+)?\s*\{[^}]*\}/g, '');
  
  // 3. Remove type aliases
  js = js.replace(/type\s+[\w$<>]+\s*=\s*[^;]+;/g, '');

  // 4. Remove class access modifiers and decorators
  js = js.replace(/\b(public|private|protected|readonly|override|abstract)\s+/g, '');

  // 5. Remove method/function generic parameters: function foo<T>( or class Bar<T>
  js = js.replace(/class\s+([\w$]+)<[^>]+>/g, 'class $1');
  js = js.replace(/function\s+([\w$]+)<[^>]+>/g, 'function $1');
  js = js.replace(/async\s+function\s+([\w$]+)<[^>]+>/g, 'async function $1');

  // 6. Remove generic invocation: parseJsonPayload<UserProfile>(...) -> parseJsonPayload(...)
  js = js.replace(/([a-zA-Z0-9_$]+)<[a-zA-Z0-9_$, ]+>\(/g, '$1(');

  // 7. Remove return type annotations: ): ReturnType { or ): Promise<this> {
  js = js.replace(/\)\s*:\s*[a-zA-Z0-9_$<>\[\]|& ]+\s*\{/g, ') {');

  // 8. Remove variable and parameter type annotations: let x: number = 5 -> let x = 5
  // Also: (username: string = 'qa') -> (username = 'qa')
  js = js.replace(/:\s*([a-zA-Z0-9_$<>\[\]|&]+(\s*\|\s*[a-zA-Z0-9_$<>\[\]|&]+)*)(?=\s*[,=);])/g, '');

  // 9. Remove type assertions: as SomeType
  js = js.replace(/\s+as\s+[a-zA-Z0-9_$<>\[\]|&]+/g, '');

  // 10. Remove new Type<...>() -> new Type()
  js = js.replace(/new\s+([\w$]+)<[^>]+>\(/g, 'new $1(');

  return js;
}

const sample = `
abstract class BasePage {
  constructor(protected pageName: string) {}
  async ready(): Promise<this> {
    console.log(this.pageName + " ready");
    return this;
  }
}

class DashboardPage extends BasePage {
  constructor() {
    super("DashboardPage");
  }

  async clickLoginButton(): Promise<this> {
    console.log("Clicked login");
    return this;
  }

  async enterUsername(username: string = "qa_lead"): Promise<this> {
    console.log("Entered " + username);
    return this;
  }
}

async function open<T extends BasePage>(PageClass: new () => T): Promise<T> {
  return new PageClass();
}

async function run() {
  let page = await open(DashboardPage)
    .then((_) => _.clickLoginButton())
    .then((_) => _.enterUsername("lead_qa"));
}

run();
`;

const stripped = stripTypeScript(sample);
console.log("--- STRIPPED JAVASCRIPT ---");
console.log(stripped);

try {
  new Function(stripped)();
  console.log("EXECUTION PASSED!");
} catch (e) {
  console.error("EXECUTION FAILED:", e);
}
