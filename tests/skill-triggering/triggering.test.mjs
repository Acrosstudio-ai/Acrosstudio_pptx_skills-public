import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { listSkillDirs, readFrontmatter } from '../../scripts/lib/skills.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const skillsDir = join(here, '..', '..', 'skills')

// Trigger vocabulary that MUST appear in each skill's description. Each new
// skill (Plans 2/3) must register its triggers here, which Test A enforces.
const TRIGGERS = {
  'acrosstudio-pptx': ['提案書', '打合せ', '議事録', 'ROI', 'お見積もり', '運用費'],
  'acrosstudio-intake': ['インテーク', 'ヒアリング', '案件', 'スコープ'],
  'strat-situation-assessment': ['現状分析', '現状把握', '診断', 'アセスメント'],
  'strat-growth-barriers': ['成長', '阻害要因', 'ボトルネック', '停滞'],
  'strat-assumption-audit': ['前提', '検証', '仮説', '妥当性'],
  'strat-strategic-options': ['戦略', 'オプション', '選択肢', '意思決定'],
  'strat-business-case': ['ビジネスケース', '投資対効果', 'ROI', '採算'],
  'strat-pricing': ['価格', '価格戦略', 'プライシング', 'マージン'],
  'strat-portfolio-review': ['ポートフォリオ', '事業評価', '資源配分', '選択と集中'],
  'strat-operating-model': ['オペレーティングモデル', '組織', '業務プロセス', 'ケイパビリティ'],
  'strat-initiative-prioritizer': ['施策', '優先順位', 'インパクト', '工数'],
  'strat-transformation-roadmap': ['変革', 'ロードマップ', 'フェーズ', 'マイルストーン'],
  'strat-narrative': ['ナラティブ', 'ストーリー', 'メッセージ', '経営層'],
  'strat-decision-memo': ['意思決定', 'メモ', '提言', '決裁'],
  'strat-stakeholder-alignment': ['ステークホルダー', '合意形成', '関係者', '巻き込み'],
  'acrosstudio-engagement': ['エンゲージメント', '一気通貫', 'オーケストレーション', 'パイプライン']
}

test('every skill under skills/ registers its triggers', () => {
  for (const skill of listSkillDirs(skillsDir)) {
    assert.ok(
      Object.prototype.hasOwnProperty.call(TRIGGERS, skill.name),
      `skill '${skill.name}' has no TRIGGERS entry; add its trigger vocabulary`
    )
  }
})

test('each skill description contains its expected trigger vocabulary', () => {
  for (const skill of listSkillDirs(skillsDir)) {
    const expected = TRIGGERS[skill.name]
    if (!expected) continue
    const { description } = readFrontmatter(skill.skillMdPath)
    assert.ok(description, `skill '${skill.name}' is missing a description`)
    for (const trigger of expected) {
      assert.ok(
        description.includes(trigger),
        `skill '${skill.name}' description is missing trigger '${trigger}'`
      )
    }
  }
})
