# @bottomsheet-dialog/react

\`@bottomsheet-dialog/element\` を React 環境で型安全かつシームレスに利用するための React ラッパーコンポーネントです。

## インストール

\`\`\`bash
npm install @bottomsheet-dialog/react
# または
pnpm add @bottomsheet-dialog/react
\`\`\`

## 使い方

\`BsDialog\` コンポーネントをインポートして使用します。

\`\`\`tsx
import React, { useRef, useState } from 'react';
import { BsDialog, BsButton } from '@bottomsheet-dialog/react';
import type { BsDialogElement } from '@bottomsheet-dialog/react';

function App() {
  const dialogRef = useRef<BsDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // ref を使ってメソッドを呼び出すパターン
  const openDialog = () => {
    dialogRef.current?.open();
  };

  return (
    <div>
      {/* 制御用ボタン */}
      <BsButton onClick={() => setIsOpen(true)}>
        Propsで開く
      </BsButton>
      <BsButton onClick={openDialog}>
        Refで開く
      </BsButton>

      {/* ボトムシートダイアログ */}
      <BsDialog 
        ref={dialogRef}
        open={isOpen}
        snapPoints={[0.5, 1]}
        persistKey="my-dialog-state"
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        onSnapChange={(e) => console.log('Snapped to:', e.detail.point)}
      >
        <h2>コンテンツ</h2>
        <p>ここに内容が入ります。</p>
      </BsDialog>
    </div>
  );
}

export default App;
\`\`\`

## \`BsDialog\` API

### Props

標準の HTMLAttributes に加え、以下の Props をサポートしています。（Reactの標準ドラッグイベントと競合を避けるため、ネイティブの \`onDragStart\` / \`onDragEnd\` は Omit されています）

| Prop名 | 型 | 説明 |
|---|---|---|
| \`open\` | \`boolean\` | ダイアログの開閉状態を制御します。 |
| \`snapPoints\` | \`number[] \| string\` | スナップポイントの配列またはカンマ区切りの文字列。例: \`[0.3, 0.8, 1]\` |
| \`persistKey\` | \`string\` | 状態を保存するためのキーを指定します。 |
| \`onOpen\` | \`(event: Event) => void\` | ダイアログが開いた時のイベントハンドラ。 |
| \`onClose\` | \`(event: Event) => void\` | ダイアログが閉じた時のイベントハンドラ。 |
| \`onSnapChange\` | \`(event: CustomEvent<{ point: number; index: number }>) => void\` | スナップポイントが変更された時のイベントハンドラ。 |
| \`onDragStart\` | \`(event: Event) => void\` | ドラッグを開始した時のイベントハンドラ。 |
| \`onDragEnd\` | \`(event: Event) => void\` | ドラッグを終了した時のイベントハンドラ。 |

### Ref (Methods)

\`useRef<BsDialogElement>\` 経由で以下のネイティブメソッドにアクセス可能です。

| メソッド名 | 説明 |
|---|---|
| \`open()\` | ダイアログを開きます。 |
| \`close()\` | ダイアログを閉じます。 |

## \`BsButton\` API

標準の \`button\` 要素と同じ Props（\`React.ButtonHTMLAttributes\`）を受け付けるシンプルなボタンコンポーネントです。
