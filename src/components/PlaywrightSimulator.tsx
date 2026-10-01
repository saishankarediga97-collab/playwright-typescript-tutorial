import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  CheckCircle2, 
  Globe, 
  MousePointer2, 
  Sparkles, 
  Terminal, 
  ShieldCheck, 
  Lock,
  ArrowRight
} from 'lucide-react';

interface SimulationStep {
  id: number;
  codeLine: string;
  actionName: string;
  locator: string;
  domEffect: string;
  terminalLog: string;
  durationMs: number;
}

const STEPS: SimulationStep[] = [
  {
    id: 0,
    codeLine: 'let BasePage = await open(DashboardPage)',
    actionName: 'Page Navigation',
    locator: 'page.goto("/dashboard")',
    domEffect: 'Browser loads dashboard shell and initializes DOM tree',
    terminalLog: '[PW-CDP] Navigate to https://portal.enterprise.io/dashboard (200 OK, domcontentloaded: 18ms)',
    durationMs: 800,
  },
  {
    id: 1,
    codeLine: '  .then((_) => _.clickLoginButton())',
    actionName: 'Click Sign In',
    locator: "page.getByRole('button', { name: 'Sign In' })",
    domEffect: 'User clicks top-right Sign In button; opens Auth Modal',
    terminalLog: '[PW-Locator] Waiting for locator("button:has-text(\'Sign In\')") [visible, stable, enabled] -> CLICKED',
    durationMs: 900,
  },
  {
    id: 2,
    codeLine: "  .then((_) => _.enterUsername('lead_architect'))",
    actionName: 'Enter Username',
    locator: "page.getByLabel('Corporate Email')",
    domEffect: 'Focuses email input and types "lead_architect@enterprise.io"',
    terminalLog: '[PW-Action] locator("input#email").fill("lead_architect@enterprise.io") -> key events dispatched',
    durationMs: 900,
  },
  {
    id: 3,
    codeLine: "  .then((_) => _.enterPassword('VaultSecure2026!'))",
    actionName: 'Enter Password',
    locator: "page.getByLabel('Password')",
    domEffect: 'Types encrypted password into secure field',
    terminalLog: '[PW-Action] locator("input#password").fill("••••••••••••••") -> secret masked in test logs',
    durationMs: 800,
  },
  {
    id: 4,
    codeLine: '  .then((_) => _.submit())',
    actionName: 'Submit Credentials',
    locator: "page.getByRole('button', { name: 'Authenticate' })",
    domEffect: 'Clicks submit, verifies 200 OK JWT token exchange, and unlocks portal',
    terminalLog: '[PW-Network] POST /api/v1/auth/token -> 200 OK (38ms) | JWT storageState cached',
    durationMs: 1000,
  },
  {
    id: 5,
    codeLine: '  .then((_) => _.verifyDashboardLoaded());',
    actionName: 'Assert Welcome State',
    locator: "expect(page.getByTestId('welcome-heading')).toBeVisible()",
    domEffect: 'Dashboard analytics widgets and welcome banner verified',
    terminalLog: '[PW-Assertion] expect(locator).toBeVisible({ timeout: 15000 }) -> PASSED in 6ms! Test Succeeded.',
    durationMs: 700,
  },
];

export const PlaywrightSimulator: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1200);

  // Auto-play timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      if (currentStepIndex < STEPS.length - 1) {
        timer = setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, simSpeed);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, simSpeed]);

  const handleStepForward = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const activeStep = STEPS[currentStepIndex];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* Header Info & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              Interactive Playwright Method Chaining Simulator
            </h1>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
              Live DOM & CDP Visualizer
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Watch Playwright execute the chained POM test step-by-step with real-time locator resolution and DOM actions.
          </p>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-md">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-all shadow-sm"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{currentStepIndex === STEPS.length - 1 ? 'Replay' : 'Auto Play'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleStepForward}
            disabled={currentStepIndex >= STEPS.length - 1}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 transition-all"
            title="Step Forward (Next Chained Method)"
          >
            <SkipForward className="h-3.5 w-3.5" />
            <span>Step</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-all"
            title="Reset Simulator"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1" />

          {/* Step Indicator */}
          <span className="text-xs font-mono font-semibold text-slate-400 px-1">
            Step {currentStepIndex + 1} / {STEPS.length}
          </span>
        </div>
      </div>

      {/* Main Simulator Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4 min-h-0">
        {/* Left Column (5 Cols): Chained Code Panel */}
        <div className="lg:col-span-5 flex flex-col rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2">
            <span className="text-xs font-mono font-semibold text-slate-300">
              tests/e2e/dashboardChained.spec.ts
            </span>
            <span className="rounded bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-mono text-blue-400">
              Method Chaining
            </span>
          </div>

          <div className="p-4 font-mono text-xs overflow-y-auto flex-1 bg-[#0b0f19] space-y-1.5">
            <div className="text-slate-500">// Test Execution via open(Page).then(...).then(...)</div>
            <div className="text-slate-400">
              <span className="text-purple-400">test</span>(
              <span className="text-emerald-400">'TC-101: Chained Dashboard Test'</span>,{' '}
              <span className="text-purple-400">async</span> ({'{ open }'}) =&gt; {'{'}
            </div>

            {STEPS.map((s, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;

              return (
                <div
                  key={s.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all cursor-pointer border ${
                    isActive
                      ? 'border-emerald-500/50 bg-emerald-500/15 shadow-sm text-emerald-200'
                      : isPast
                      ? 'border-slate-800/40 bg-slate-900/40 text-slate-400'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span className="text-[10px] text-slate-600 select-none w-4">{idx + 1}</span>
                  {isActive ? (
                    <ArrowRight className="h-3.5 w-3.5 text-emerald-400 animate-pulse shrink-0" />
                  ) : isPast ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <div className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span className={`font-mono text-xs ${isActive ? 'font-bold' : ''}`}>
                    {s.codeLine}
                  </span>
                </div>
              );
            })}

            <div className="text-slate-400">{'}'});</div>

            {/* Step Inspection Card */}
            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/80 p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                  Active Action:
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  {activeStep.actionName}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Locator: </span>
                <code className="text-blue-300 bg-slate-950 px-1 py-0.5 rounded text-[10px]">
                  {activeStep.locator}
                </code>
              </div>
              <div className="text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Action Effect: </span>
                {activeStep.domEffect}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Simulated Browser Viewport */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
          {/* Simulated Browser Chrome Top Bar */}
          <div className="border-b border-slate-800 bg-slate-900 px-4 py-2 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>

            {/* Address Bar */}
            <div className="flex-1 flex items-center gap-2 rounded-lg bg-slate-950 border border-slate-800 px-3 py-1 text-xs text-slate-300 font-mono">
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              <span>https://portal.enterprise.io/dashboard</span>
              <span className="ml-auto text-[10px] text-emerald-400 font-semibold">SSL 256-bit</span>
            </div>
          </div>

          {/* Browser DOM Viewport Area */}
          <div className="flex-1 bg-slate-900/60 p-6 flex flex-col justify-between relative overflow-hidden">
            {/* Top Navigation Bar of the target app */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2 font-bold text-white tracking-tight">
                <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black">
                  EP
                </div>
                <span>Enterprise Portal</span>
              </div>

              {/* Login Button in simulated page */}
              {currentStepIndex === 0 && (
                <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md animate-pulse border border-blue-400">
                  <MousePointer2 className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {currentStepIndex >= 4 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-semibold text-slate-200">lead_architect</span>
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 text-white font-bold flex items-center justify-center text-xs">
                    LA
                  </div>
                </div>
              )}
            </div>

            {/* Viewport Dynamic Content */}
            <div className="flex-1 flex items-center justify-center my-6">
              {/* Step 1 to 3: Auth Modal Active */}
              {currentStepIndex >= 1 && currentStepIndex <= 3 && (
                <div className="w-full max-w-sm rounded-xl border border-blue-500/40 bg-slate-950 p-6 shadow-2xl relative transition-all">
                  <div className="flex items-center gap-2 text-blue-400 mb-4 font-bold text-sm">
                    <Lock className="h-4 w-4" />
                    <span>Authenticate Corporate Session</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        Corporate Email
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={currentStepIndex >= 2 ? 'lead_architect@enterprise.io' : ''}
                        placeholder="user@enterprise.io"
                        className={`w-full rounded-lg border bg-slate-900 px-3 py-1.5 text-xs font-mono text-slate-100 ${
                          currentStepIndex === 2 ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-800'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        readOnly
                        value={currentStepIndex >= 3 ? 'VaultSecure2026!' : ''}
                        placeholder="••••••••••••"
                        className={`w-full rounded-lg border bg-slate-900 px-3 py-1.5 text-xs font-mono text-slate-100 ${
                          currentStepIndex === 3 ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-800'
                        }`}
                      />
                    </div>

                    <button
                      className={`w-full mt-2 rounded-lg py-2 text-xs font-bold transition-all ${
                        currentStepIndex === 3
                          ? 'bg-emerald-600 text-white shadow-lg animate-bounce'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      Authenticate
                    </button>
                  </div>
                </div>
              )}

              {/* Step 0 or Step 4-5: Main Dashboard Shell */}
              {(currentStepIndex === 0 || currentStepIndex >= 4) && (
                <div className="w-full space-y-4">
                  {/* Welcome Heading Banner */}
                  <div
                    className={`rounded-xl border p-5 transition-all ${
                      currentStepIndex === 5
                        ? 'border-emerald-500/60 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                        : 'border-slate-800 bg-slate-950/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h2
                        data-testid="welcome-heading"
                        className="text-lg font-bold text-white flex items-center gap-2"
                      >
                        {currentStepIndex >= 4 ? 'Welcome back, Lead Architect!' : 'Welcome to Enterprise Portal'}
                        {currentStepIndex === 5 && (
                          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" /> expect(locator).toBeVisible() PASSED
                          </span>
                        )}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {currentStepIndex >= 4
                        ? 'Production telemetry, CI/CD builds, and test coverage metrics.'
                        : 'Please authenticate to access sensitive metrics and management portals.'}
                    </p>
                  </div>

                  {/* Analytics Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                      <span className="text-[10px] uppercase font-semibold text-slate-500 block">Tests Run</span>
                      <span className="text-lg font-black text-white">1,248</span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">100% Passed</span>
                    </div>

                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                      <span className="text-[10px] uppercase font-semibold text-slate-500 block">Avg Duration</span>
                      <span className="text-lg font-black text-white">42ms</span>
                      <span className="text-[10px] text-cyan-400 block mt-0.5">Parallel Workers</span>
                    </div>

                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                      <span className="text-[10px] uppercase font-semibold text-slate-500 block">Flakiness</span>
                      <span className="text-lg font-black text-emerald-400">0.0%</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Auto-Waiting Active</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Real-Time Playwright CDP Console */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-[11px]">
              <div className="flex items-center gap-2 text-slate-400 mb-1 border-b border-slate-800/80 pb-1">
                <Terminal className="h-3 w-3 text-emerald-400" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Playwright Runner Log</span>
                <span className="ml-auto text-[10px] text-slate-500">Duration: {activeStep.durationMs}ms</span>
              </div>
              <div className="text-emerald-300 leading-relaxed font-mono">
                {activeStep.terminalLog}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
