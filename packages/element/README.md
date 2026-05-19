# @bottomsheet-dialog/element

ネイティブの `<dialog>` 要素をベースに構築された、モダンでアクセシブルな Bottom Sheet（ハーフモーダル）の Web Components ライブラリです。

## インストール

\`\`\`bash
npm install @bottomsheet-dialog/element
# または
pnpm add @bottomsheet-dialog/element
\`\`\`

## 使い方

JavaScript（または TypeScript）でインポートするだけで、カスタム要素がブラウザに登録されます。

\`\`\`javascript
import '@bottomsheet-dialog/element';
\`\`\`

HTML 内でそのまま利用できます。

\`\`\`html
<!-- Bottom Sheet Dialog -->
<bs-dialog id="my-dialog" snap-points="0.5, 1" persist-key="my-dialog-state">
  <h2>コンテンツ</h2>
  <p>ここに内容が入ります。</p>
</bs-dialog>

<!-- 制御用ボタン -->
<bs-button onclick="document.getElementById('my-dialog').open()">
  開く
</bs-button>
\`\`\`

## \`<bs-dialog>\` API

### 属性 (Attributes)

| 属性名 | 型 | 説明 |
|---|---|---|
| \`open\` | \`boolean\` | 付与されている場合、ダイアログが開いた状態になります。 |
| \`snap-points\` | \`string\` | カンマ区切りの数値（0.0 〜 1.0）を指定します。例: \`"0.3, 0.8, 1"\` |
| \`persist-key\` | \`string\` | 状態を保存するためのキーを指定します（localStorageなどへの保存用）。 |

### プロパティ (Properties / Methods)

| メソッド名 | 説明 |
|---|---|
| \`open()\` | ダイアログを開きます。 |
| \`close()\` | ダイアログを閉じます。 |

### イベント (Events)

すべてのイベントは \`bubbles: true, composed: true\` で発火します。

| イベント名 | \`event.detail\` | 説明 |
|---|---|---|
| \`open\` | - | ダイアログが開いた時に発火します。 |
| \`close\` | - | ダイアログが閉じた時に発火します。 |
| \`snap-change\` | \`{ point: number, index: number }\` | スナップポイントが変更された時に発火します。 |
| \`drag-start\` | - | ユーザーがドラッグを開始した時に発火します。 |
| \`drag-end\` | - | ユーザーがドラッグを終了した時に発火します。 |

## \`<bs-button>\` API

標準の \`<button>\` 要素をラップした Web Component です。標準の属性やイベントがそのまま利用可能です。
