import { getTranslations } from "next-intl/server";

const LEAGUES = ["LCK", "LPL", "LEC", "LCS", "PCS", "VCS", "CBLOL", "LLA", "LJL", "LDL"];

const ARCHITECTURE_DIAGRAM = `
Draft Picks
    ↓
Embeddings
    ↓
Role Encoders
    ↓
Pairwise Interactions
    ↓
Embedding Branch
                      ↘
                       Gate → Head → Prediction
                      ↗
Numeric Features
    ↓
Numeric Branch
`;

const EMBED_CODE = `self.embed = nn.Embedding(
    num_champions,
    embed_dim,
    padding_idx=0
)`;

const ROLES_CODE = `diff = t1_r - t2_r`;
const INTERACTIONS_CODE = `role_feats[i] * role_feats[j]`;
const GATE_CODE = `self.gate = nn.Sequential(
    nn.Linear(64 + 64, 2),
    nn.Softmax(dim=1),
)`;

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-slate-800 pb-14">
      <h2 className="mb-5 text-3xl font-bold text-white">{title}</h2>
      <div className="space-y-5 leading-8 text-slate-300">{children}</div>
    </section>
  );
}

export default async function DocsContent() {
  const t = await getTranslations("docs");

  return (
    <main className="flex-1 space-y-14">
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-10">
        <div className="mb-6 inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-sm text-cyan-400">
          {t("hero.badge")}
        </div>
        <h1 className="max-w-4xl text-5xl font-black leading-tight text-white">
          {t("hero.title")}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          {t("hero.description")}
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-sm uppercase tracking-wider text-slate-400">Accuracy</p>
            <h3 className="mt-2 text-4xl font-black text-cyan-400">73.59%</h3>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-sm uppercase tracking-wider text-slate-400">ROC-AUC</p>
            <h3 className="mt-2 text-4xl font-black text-violet-400">0.8128</h3>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-sm uppercase tracking-wider text-slate-400">
              {t("hero.bestBaseline")}
            </p>
            <h3 className="mt-2 text-4xl font-black text-emerald-400">64.06%</h3>
          </div>
        </div>
      </div>

      <Section id="overview" title={t("sectionsNav.overview")}>
        <p>{t("overview.p1")}</p>
        <p>{t("overview.p2")}</p>
        <p>{t("overview.p3")}</p>
      </Section>

      <Section id="objective" title={t("sectionsNav.objective")}>
        <p>{t("objective.p1")}</p>
        <ul className="list-disc space-y-3 pl-6">
          {t.raw("objective.items").map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section id="dataset" title={t("sectionsNav.dataset")}>
        <p>{t("dataset.p1")}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="mb-3 text-lg font-bold text-cyan-400">{t("dataset.leaguesTitle")}</h3>
            <ul className="space-y-2 text-slate-300">
              {LEAGUES.map((league) => (
                <li key={league}>{league}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="mb-3 text-lg font-bold text-violet-400">{t("dataset.featuresTitle")}</h3>
            <ul className="space-y-2 text-slate-300">
              {t.raw("dataset.features").map((feature: string) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="pipeline" title={t("sectionsNav.pipeline")}>
        <p>{t("pipeline.p1")}</p>
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-6 font-mono text-sm text-cyan-300">
          {t("pipeline.flow")}
        </div>
        <p>{t("pipeline.p2")}</p>
      </Section>

      <Section id="leakage" title={t("sectionsNav.leakage")}>
        <p>{t("leakage.p1")}</p>
        <p>{t("leakage.p2")}</p>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
          <h3 className="mb-3 text-lg font-bold text-emerald-400">{t("leakage.solvedTitle")}</h3>
          <ul className="grid gap-3 md:grid-cols-2">
            {t.raw("leakage.solved").map((item: string) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="features" title={t("sectionsNav.features")}>
        <p>{t("features.p1")}</p>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="mb-4 text-xl font-bold text-cyan-400">{t("features.historicalTitle")}</h3>
            <ul className="space-y-2">
              {t.raw("features.historical").map((item: string) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="mb-4 text-xl font-bold text-violet-400">{t("features.strategicTitle")}</h3>
            <ul className="space-y-2">
              {t.raw("features.strategic").map((item: string) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="architecture" title={t("sectionsNav.architecture")}>
        <p>{t("architecture.p1")}</p>
        <ul className="list-disc space-y-3 pl-6">
          {t.raw("architecture.items").map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="overflow-x-auto whitespace-pre rounded-2xl border border-slate-800 bg-slate-950 p-6 font-mono text-sm text-cyan-300">
          {ARCHITECTURE_DIAGRAM.trim()}
        </div>
      </Section>

      <Section id="embeddings" title={t("sectionsNav.embeddings")}>
        <p>{t("embeddings.p1")}</p>
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <pre className="text-sm text-cyan-300">{EMBED_CODE}</pre>
        </div>
        <p>{t("embeddings.p2")}</p>
      </Section>

      <Section id="roles" title={t("sectionsNav.roles")}>
        <p>{t("roles.p1")}</p>
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <pre className="text-sm text-cyan-300">{ROLES_CODE}</pre>
        </div>
        <p>{t("roles.p2")}</p>
      </Section>

      <Section id="interactions" title={t("sectionsNav.interactions")}>
        <p>{t("interactions.p1")}</p>
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <pre className="text-sm text-cyan-300">{INTERACTIONS_CODE}</pre>
        </div>
        <p>{t("interactions.p2")}</p>
        <ul className="list-disc pl-6">
          {t.raw("interactions.items").map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section id="numeric" title={t("sectionsNav.numeric")}>
        <p>{t("numeric.p1")}</p>
        <p>{t("numeric.p2")}</p>
      </Section>

      <Section id="gate" title={t("sectionsNav.gate")}>
        <p>{t("gate.p1")}</p>
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <pre className="text-sm text-cyan-300">{GATE_CODE}</pre>
        </div>
        <p>{t("gate.p2")}</p>
      </Section>

      <Section id="training" title={t("sectionsNav.training")}>
        <p>{t("training.p1")}</p>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="mb-3 text-lg font-bold text-cyan-400">Hyperparameters</h3>
            <ul className="space-y-2">
              <li>Learning Rate: 0.001</li>
              <li>Batch Size: 64</li>
              <li>Epochs: 100</li>
              <li>Patience: 10</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="mb-3 text-lg font-bold text-violet-400">Optimization</h3>
            <ul className="space-y-2">
              <li>Adam Optimizer</li>
              <li>ReduceLROnPlateau</li>
              <li>Early Stopping</li>
              <li>Weight Decay</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="regularization" title={t("sectionsNav.regularization")}>
        <p>{t("regularization.p1")}</p>
        <ul className="list-disc space-y-3 pl-6">
          {t.raw("regularization.items").map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section id="results" title={t("sectionsNav.results")}>
        <p>{t("results.p1")}</p>
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="w-full">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-4 text-left">{t("results.modelCol")}</th>
                <th className="px-6 py-4 text-left">{t("results.accuracyCol")}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-800">
                <td className="px-6 py-4">{t("results.baselineRow")}</td>
                <td className="px-6 py-4">64.06%</td>
              </tr>
              <tr className="border-t border-slate-800 bg-cyan-500/10">
                <td className="px-6 py-4 font-bold text-cyan-400">{t("results.nnRow")}</td>
                <td className="px-6 py-4 font-bold text-cyan-400">73.59%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="deployment" title={t("sectionsNav.deployment")}>
        <p>{t("deployment.p1")}</p>
        <ul className="list-disc space-y-3 pl-6">
          {t.raw("deployment.items").map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section id="frontend" title={t("sectionsNav.frontend")}>
        <p>{t("frontend.p1")}</p>
        <p>{t("frontend.p2")}</p>
        <ul className="list-disc space-y-3 pl-6">
          {t.raw("frontend.items").map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section id="future" title={t("sectionsNav.future")}>
        <ul className="list-disc space-y-3 pl-6">
          {t.raw("future.items").map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section id="conclusion" title={t("sectionsNav.conclusion")}>
        <p>{t("conclusion.p1")}</p>
        <p>{t("conclusion.p2")}</p>
        <p>{t("conclusion.p3")}</p>
      </Section>
    </main>
  );
}
