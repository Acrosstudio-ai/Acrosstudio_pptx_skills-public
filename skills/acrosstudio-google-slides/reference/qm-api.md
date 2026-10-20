# QM の Google Slides / Drive 操作

既存の `google-drive-sheets` スキルを読み、接続ユーザー・OAuth・承認手順に従います。このスキルの org-wide インストールは Google のアクセス権を付与しません。別ユーザーの認証情報やサービスアカウントへ切り替えず、接続ユーザーが許可された資料だけを扱います。

以下の ID・本文は説明用です。実在する対象を確認して置き換え、JSON はシリアライザーで生成します。作業ファイルは非公開の一時ディレクトリに置き、認証情報や顧客資料を Git に入れません。トークンを表示・保存したり、シェルのトレースを有効にしたりしません。

## 読み取り

Drive 用は `$VAULT_TOKEN_WWW_GOOGLEAPIS_COM`、Slides 用は `$VAULT_TOKEN_SLIDES_GOOGLEAPIS_COM` を使います。未接続や 401/403 では接続アカウント・ファイル権限を確認し、403 を一律にトークン切れと扱いません。Drive / Slides API の有効化も確認します。

```bash
curl --fail-with-body -sS --get 'https://www.googleapis.com/drive/v3/files/FILE_ID' \
  -H "Authorization: Bearer $VAULT_TOKEN_WWW_GOOGLEAPIS_COM" \
  --data-urlencode 'supportsAllDrives=true' \
  --data-urlencode 'fields=id,name,mimeType,webViewLink,capabilities'
```

既存の編集対象は `application/vnd.google-apps.presentation`、保存先は `application/vnd.google-apps.folder` であることを確認します。新規作成にテンプレートは不要です。保存先の共有範囲・追加権限も確認します。Drive 検索が必要なら既存スキルの全ドライブ検索・ページネーションを使います。

```bash
curl --fail-with-body -sS 'https://slides.googleapis.com/v1/presentations/PRESENTATION_ID' \
  -H "Authorization: Bearer $VAULT_TOKEN_SLIDES_GOOGLEAPIS_COM"
```

`presentationId`、`revisionId`、`slides[].objectId` と要素のテキストを読みます。スライドと表のテキストだけでなく、テンプレート由来の発表者ノートと、Drive のコメントも確認します。コメントを残してコピーしたり、他案件の情報を納品したりしません。

## 空の Google スライドを作成する（承認後）

利用者が承認した資料名と保存先を `create.json` に用意し、Drive に Google スライド形式で作成します。テンプレートのコピーから始めません。

```json
{"name":"ご提案_v0.1","mimeType":"application/vnd.google-apps.presentation","parents":["DESTINATION_FOLDER_ID"]}
```

```bash
curl --fail-with-body -sS -X POST \
  'https://www.googleapis.com/drive/v3/files?supportsAllDrives=true&ignoreDefaultVisibility=true&fields=id,name,webViewLink' \
  -H "Authorization: Bearer $VAULT_TOKEN_WWW_GOOGLEAPIS_COM" \
  -H 'Content-Type: application/json' \
  --data-binary @create.json
```

`ignoreDefaultVisibility=true` でも保存先フォルダの権限は継承されます。返された ID の資料を Slides API で取得し、`pageSize`、`revisionId` と既存スライドの有無を確認します。`reference/design-source.md` に従って原本の座標・文字サイズを変換し、ロゴ・背景・本文を描画します。

利用者が既存資料のコピーを明示的に依頼した場合だけ、Drive の `files/FILE_ID/copy` に承認済みの名前・保存先を渡します。コピー先の ID と revision を読み直してから編集し、元ファイルは変更しません。

## 描画・内容の編集（承認後）

新規ページは `createSlide`（`slideLayoutReference.predefinedLayout: "BLANK"`）で作ります。画像は `createImage` に原本の固定画像 URL、文字領域は `createShape`（`shapeType: "TEXT_BOX"` または原本に合った形）に変換後の寸法・位置を渡します。`insertText`、`updateTextStyle`、`updateShapeProperties`、`updateParagraphStyle` で原本の文字・色・配置を再現します。表紙のテクスチャは先にページ全体へ配置し、白文字・白ロゴを後から追加します。通常ページのロゴ・コピーライトも省略しません。

`updates.json` の `requiredRevisionId` は、編集対象を直前に読んだ値です。`{{TITLE}}` と `SLIDE_OBJECT_ID` も実際のテキスト・ID に合わせます。全スライドを対象にするときだけ `pageObjectIds` を省略します。

```json
{"writeControl":{"requiredRevisionId":"CURRENT_REVISION_ID"},"requests":[{"replaceAllText":{"containsText":{"text":"{{TITLE}}","matchCase":true},"replaceText":"ご提案","pageObjectIds":["SLIDE_OBJECT_ID"]}}]}
```

```bash
curl --fail-with-body -sS -X POST \
  'https://slides.googleapis.com/v1/presentations/PRESENTATION_ID:batchUpdate' \
  -H "Authorization: Bearer $VAULT_TOKEN_SLIDES_GOOGLEAPIS_COM" \
  -H 'Content-Type: application/json' \
  --data-binary @updates.json
```

`replies[].replaceAllText.occurrencesChanged` と再取得した内容を確認します。競合で拒否された場合は再取得して変更範囲を確認し、条件を外して強制上書きしません。レイアウトの複製は `duplicateObject`、要素の編集は `deleteText` / `insertText` など、読み取った ID を使う標準リクエストで行います。スライド複製後は対象ページを限定し、他のページまで置換しません。

## 目視確認

各スライドの `objectId` ごとにサムネイルを取得します。

```bash
curl --fail-with-body -sS --get \
  'https://slides.googleapis.com/v1/presentations/PRESENTATION_ID/pages/SLIDE_OBJECT_ID/thumbnail' \
  -H "Authorization: Bearer $VAULT_TOKEN_SLIDES_GOOGLEAPIS_COM" \
  --data-urlencode 'thumbnailProperties.thumbnailSize=LARGE'
```

返された `contentUrl` の画像を非公開の一時領域に取得して画像ツールで表示するか、ブラウザーで確認します。画像取得先へ Google の OAuth ヘッダーを転送しません。この URL を知る人は画像を閲覧できるため、外部公開・納品・ログへの貼り付けは避けます。期限付きなので資料リンクの代わりに保存しません。

## PPTX 書き出し（依頼された場合のみ）

承認された書き出しを新しい非公開の一時ディレクトリに保存します。既存ファイルは上書きせず、HTTP エラー本文を `.pptx` として納品しません。

```bash
output_dir=$(mktemp -d) && \
curl --fail-with-body -sS --get \
  'https://www.googleapis.com/drive/v3/files/PRESENTATION_ID/export' \
  -H "Authorization: Bearer $VAULT_TOKEN_WWW_GOOGLEAPIS_COM" \
  --data-urlencode 'mimeType=application/vnd.openxmlformats-officedocument.presentationml.presentation' \
  -o "$output_dir/deliverable.pptx.part" && \
  mv "$output_dir/deliverable.pptx.part" "$output_dir/deliverable.pptx"
```

Drive の `files.export` は出力サイズが 10 MB までです。制限超過や失敗時は原因と Slides リンクを報告し、PPTX も必要な依頼を完了扱いにしません。書き出し後はファイル形式と PowerPoint での見た目を確認します。これは Google による書き出しなので、pptxgenjs 専用のサニタイズ処理は適用しません。

納品リンクは `https://docs.google.com/presentation/d/PRESENTATION_ID/edit` です。共有権限を自動で追加しません。
