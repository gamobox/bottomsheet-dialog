import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@bottomsheet-dialog/element';

import type { Meta, StoryObj } from '@storybook/web-components';

const meta = {
  title: 'Components/BsDialog',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Bottom Sheet Dialog (\`<bs-dialog>\`)

ネイティブの \`<dialog>\` 要素をベースに構築された、モダンでアクセシブルな Bottom Sheet（ハーフモーダル）コンポーネントです。

## 主な仕様と特徴

### 1. 滑らかなアニメーション（CSS変数駆動）
ドラッグ操作による位置計算を単一のCSS変数（\`--snap-point\`）に変換して適用します。
位置の移動と背景（backdrop）のフェードイン・フェードアウトが完全にネイティブCSSで処理され、高いパフォーマンスを発揮します。

### 2. スナップポイント機能
\`snap-points\` 属性にカンマ区切りで割合（0〜1）を指定することで、段階的な開閉状態を作ることができます。
- **Velocity検知**: 指を離した際の速度を計算し、弾くようにスワイプするとスナップポイントを飛ばして一気に閉じることができます。
- **ラバーバンド効果**: 最大の高さ以上に引っ張り上げようとした際に、少し抵抗を持たせて伸びる効果（Rubber Banding）を搭載しています。

### 3. デバイスに最適化された操作性とアクセシビリティ
- **タッチ操作**: モバイルデバイスでは、コンテンツ領域のどこからでもスワイプしてドラッグ可能です。
- **マウス操作**: PC環境では、上部の「ドラッグハンドル」を掴んだ時のみドラッグ可能とし、コンテンツ領域でのテキスト選択を邪魔しません。
- **キーボード操作**: ドラッグハンドルはフォーカス可能（\`role="button"\`）です。\`Enter\` / \`Space\` キーでスナップポイントを順番に切り替えられるほか、\`↑\` \`↓\`（上下矢印キー）で段階的にダイアログを開閉できます。

### 4. 組み込みカスタムイベント
ReactやVueなどのフレームワークから利用しやすいよう、Shadow DOMを貫通（\`composed: true\`）するカスタムイベントを発火します。
- \`snap-change\`: スナップポイントが変更された時 (\`event.detail: { point, index }\`)
- \`open\`: ダイアログが開いた時
- \`close\`: ダイアログが閉じた時
- \`drag-start\` / \`drag-end\`: ドラッグ操作の開始と終了時
        `,
      },
    },
  },
  argTypes: {
    persistKey: { control: 'text' },
    snapPoints: { control: 'text' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="font-family: system-ui, sans-serif; padding: 20px;">
      <h2>Bottom Sheet (Half Modal)</h2>
      <p>Click the button below to open the bottom sheet.</p>
      
      <button 
        style="padding: 10px 16px; background: #0070f3; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;"
        onclick="document.getElementById('demo-bs-dialog').open()"
      >
        Open Bottom Sheet
      </button>

      <bs-dialog 
        id="demo-bs-dialog" 
        persist-key=${ifDefined(args.persistKey)}
      >
        <div style="font-family: system-ui, sans-serif; padding: 0 8px 24px;">
          <h2 style="margin-top: 0;">Bottom Sheet Content</h2>
          <p>This is a native dialog styled as a bottom sheet. Try dragging the handle at the top to close it.</p>
          <p>Because it uses the native <code>&lt;dialog&gt;</code> element, it provides:</p>
          <ul>
            <li>Automatic focus trapping</li>
            <li>Close on ESC key</li>
            <li>Top layer promotion</li>
          </ul>
          
          <p>You can also dismiss it by clicking on the background (Light dismiss).</p>

          <div style="margin-top: 24px; padding: 16px; border: 1px solid #eaeaea; border-radius: 8px; height: 150px; overflow-y: auto;">
            <h3 style="margin-top: 0;">Scrollable Area</h3>
            <p>If you scroll down here, dragging the sheet is prevented.</p>
            <p>If you scroll all the way to the top and drag down, the sheet will close.</p>
            <p>Line 1</p>
            <p>Line 2</p>
            <p>Line 3</p>
            <p>Line 4</p>
            <p>Line 5</p>
            <p>Line 6</p>
            <p>Line 7</p>
            <p>Line 8</p>
          </div>

          <button 
            style="margin-top: 24px; padding: 10px 16px; background: #e0e0e0; color: #333; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;"
            onclick="document.getElementById('demo-bs-dialog').close()"
          >
            Close Dialog Programmatically
          </button>
        </div>
      </bs-dialog>
    </div>
  `,
  args: {
    persistKey: 'demo-bs-dialog-state',
  },
};

export const WithSnapPoints: Story = {
  render: (args) => html`
    <div style="font-family: system-ui, sans-serif; padding: 20px;">
      <h2>Bottom Sheet (With Snap Points)</h2>
      <p>This drawer has snap points defined: ${args.snapPoints || 'none'}.</p>
      
      <button 
        style="padding: 10px 16px; background: #0070f3; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;"
        onclick="document.getElementById('snap-bs-dialog').open()"
      >
        Open Drawer
      </button>

      <bs-dialog 
        id="snap-bs-dialog" 
        snap-points=${ifDefined(args.snapPoints)}
      >
        <div style="font-family: system-ui, sans-serif; padding: 0 8px 24px; min-height: 80vh;">
          <h2 style="margin-top: 0;">Snap Points Demo</h2>
          <p>This drawer stops at 50% and 100% of its max height.</p>
          <p>Drag the handle at the top to move between states.</p>
          
          <div style="margin-top: 40px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
            <h3>Content Area</h3>
            <p>If you drag quickly downwards, it will close.</p>
            <p>If you drag slowly, it will snap to the nearest point (0.5 or 0).</p>
          </div>
        </div>
      </bs-dialog>
    </div>
  `,
  args: {
    snapPoints: "0.3, 0.8, 1",
  },
};
