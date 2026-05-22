# @bottomsheet-dialog/vue

`@bottomsheet-dialog/element` を Vue 3 環境で型安全かつシームレスに利用するための Vue ラッパーコンポーネントです。

### 🚀 [Live Demo](https://bottomsheet-dialog-m-7007.bolt.host/)

## インストール

```bash
npm install @bottomsheet-dialog/vue
# または
pnpm add @bottomsheet-dialog/vue
```

## 使い方

`BsDialog` コンポーネントをインポートして使用します。

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { BsDialog, BsButton } from '@bottomsheet-dialog/vue';

const dialogRef = ref<InstanceType<typeof BsDialog> | null>(null);
const isOpen = ref(false);

// ref を使ってメソッドを呼び出すパターン
const openDialog = () => {
  dialogRef.value?.open();
};

const handleSnapChange = (detail: { point: number; index: number }) => {
  console.log('Snapped to:', detail.point);
};
</script>

<template>
  <div>
    <!-- 制御用ボタン -->
    <BsButton @click="isOpen = true">
      Propsで開く
    </BsButton>
    <BsButton @click="openDialog">
      Refで開く
    </BsButton>

    <!-- ボトムシートダイアログ -->
    <BsDialog 
      ref="dialogRef"
      :open="isOpen"
      :snapPoints="[0.5, 1]"
      persistKey="my-dialog-state"
      @open="isOpen = true"
      @close="isOpen = false"
      @snap-change="handleSnapChange"
    >
      <h2>コンテンツ</h2>
      <p>ここに内容が入ります。</p>
    </BsDialog>
  </div>
</template>
```

## `BsDialog` API

### Props

| Prop名 | 型 | 説明 |
|---|---|---|
| `open` | `boolean` | ダイアログの開閉状態を制御します。 |
| `snapPoints` | `number[] \| string` | スナップポイントの配列またはカンマ区切りの文字列。例: `[0.3, 0.8, 1]` |
| `persistKey` | `string` | 状態を保存するためのキーを指定します。 |

### Emits (イベント)

| イベント名 | 引数 (`$event`) | 説明 |
|---|---|---|
| `@open` | `Event` | ダイアログが開いた時。 |
| `@close` | `Event` | ダイアログが閉じた時。 |
| `@snap-change` | `{ point: number; index: number }` | スナップポイントが変更された時。 |
| `@drag-start` | `Event` | ドラッグを開始した時。 |
| `@drag-end` | `Event` | ドラッグを終了した時。 |

### Ref (Methods)

コンポーネントの `ref` 経由で以下のメソッドにアクセス可能です。

| メソッド名 | 説明 |
|---|---|
| `open()` | ダイアログを開きます。 |
| `close()` | ダイアログを閉じます。 |

## `BsButton` API

標準の `button` 要素と同じように扱えるシンプルなボタンコンポーネントです。
