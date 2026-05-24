---
updated: 2026-05-24
---

# Thunderbird Compose Send Pipeline PoC

## 목적

이 문서는 Markdown 원본을 Thunderbird compose window에 작성한 뒤 발송 직전에 HTML과 plain-text fallback으로 교체할 수 있는지 검증하기 위한 PoC 계획과 결과 기록 위치이다. 목표는 Markdown 렌더러 품질이 아니라 Thunderbird MailExtension compose API가 최종 발송 본문을 안정적으로 제어할 수 있는지 확인하는 것이다.

## PoC 위치

PoC extension은 `experiments/thunderbird-compose-poc/`에 둔다. 제품 코드가 아니라 Thunderbird API 동작 검증용이므로 의존성 없이 `manifest.json`과 `background.js`만 사용한다.

## 검증 질문

- `browser.compose.onBeforeSend`가 새 메일, 답장, 전달에서 호출되는가.
- HTML compose window에서 사용자가 입력한 Markdown source를 `details.body`에서 충분히 복원할 수 있는가.
- Plain-text compose window에서 `details.plainTextBody`가 제공되는가.
- `onBeforeSend` 반환값의 `details.body`가 실제 발송 HTML 본문으로 반영되는가.
- `onBeforeSend` 반환값의 `details.plainTextBody`가 실제 plain-text fallback으로 반영되는가.
- `deliveryFormat: "both"`가 실제 발송 메시지를 multipart HTML/plain-text 형태로 만드는가.
- Plain-text compose window에서 `body`, `plainTextBody`, `deliveryFormat`을 반환했을 때 Thunderbird가 HTML 발송으로 전환하는가, 아니면 `deliveryFormat`을 무시하는가.
- 반환한 HTML이 Thunderbird에 의해 sanitize되거나 구조가 변경되는가.
- listener가 `{ cancel: true }`를 반환하면 send가 취소되는가.
- listener 예외 발생 시 Thunderbird가 send를 계속하는가, 취소하는가, 또는 오류를 표시하는가.

## 수동 테스트 절차

1. Thunderbird Add-ons Manager의 debug/add-on loading 기능으로 `experiments/thunderbird-compose-poc/manifest.json`을 임시 로드한다. `Install Add-on From File...` 메뉴를 사용할 때는 `manifest.json`이 아니라 PoC 디렉터리 내용을 XPI로 압축한 파일을 선택한다.
2. HTML compose가 켜진 계정에서 새 메일을 작성하고 본문에 `# 제목`, `**bold**`, `- item`을 포함한 Markdown을 입력한다.
3. 자기 자신 또는 테스트 mailbox로 발송한다.
4. 수신된 메시지의 원문 보기에서 MIME structure, `text/html`, `text/plain`, rendered HTML, plain fallback을 확인한다.
5. 같은 절차를 plain-text compose, reply, forward, draft 재개 compose에서 반복한다.

## 기록 양식

| Case                   | Thunderbird version | Compose type | `details.isPlainText` | Source field | Send result | MIME result | Notes |
| ---------------------- | ------------------- | ------------ | --------------------- | ------------ | ----------- | ----------- | ----- |
| New HTML compose       | TBD                 | new          | TBD                   | TBD          | TBD         | TBD         | TBD   |
| New plain-text compose | TBD                 | new          | TBD                   | TBD          | TBD         | TBD         | TBD   |
| Reply HTML compose     | TBD                 | reply        | TBD                   | TBD          | TBD         | TBD         | TBD   |
| Forward HTML compose   | TBD                 | forward      | TBD                   | TBD          | TBD         | TBD         | TBD   |

## 검증 결과: 2026-05-24

### 환경

- Date: 2026-05-24
- OS: Linux
- Thunderbird: 140.10.2esr
- Distribution channel: Flathub
- Scenario: New HTML compose window에 Markdown source를 일반 WYSIWYG 본문 텍스트로 붙여넣고 발송

### 관찰 결과

최종 수신 EML은 `multipart/alternative` 구조였고 `text/plain` 파트와 `text/html` 파트를 모두 포함했다. 따라서 HTML compose에서 `onBeforeSend`가 `deliveryFormat: "both"`를 반환하면 Thunderbird 140.10.2esr Flathub/Linux 환경에서는 multipart HTML/plain-text 발송을 요청할 수 있다.

`text/html` 파트에는 PoC가 반환한 `data-md-compose-poc="true"` wrapper가 남아 있었고 Markdown source가 HTML로 변환되어 반영됐다. `# Markdown compose PoC`는 `<h1>`, `**HTML**`은 `<strong>`, `- item` 목록은 `<ul><li>` 구조로 발송됐다. Thunderbird는 반환된 fragment를 `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`가 있는 완전한 HTML document로 감쌌지만 wrapper attribute와 inline style은 제거하지 않았다.

`text/plain` 파트는 PoC가 의도한 Markdown 원문 fallback으로 보존되지 않았다. 기대값은 `#`, `**`, `-` 같은 Markdown marker를 포함한 원문이었지만, 실제 plain part는 heading marker가 제거되고 `**HTML**`이 `*HTML*`로, `- item` 목록이 `* item` 형태와 들여쓰기로 변환된 텍스트였다. 이는 `plainTextBody: source` 반환값이 최종 MIME의 `text/plain` 파트에 그대로 반영되지 않았거나, Thunderbird가 HTML body에서 plain-text part를 다시 생성했을 가능성을 시사한다.

### 판정

| Case             | Thunderbird version | Compose type | `details.isPlainText` | Source field | Send result | MIME result                               | Notes                                                                                                                                  |
| ---------------- | ------------------- | ------------ | --------------------- | ------------ | ----------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| New HTML compose | 140.10.2esr         | new          | TBD                   | TBD          | Sent        | `multipart/alternative` with plain + HTML | HTML body replacement succeeded. `deliveryFormat: "both"` succeeded. Markdown source was not preserved verbatim in the plain fallback. |

### 후속 검증 필요

- Extension console log에서 `details.isPlainText`와 source field가 무엇이었는지 확인한다.
- `plainTextBody` 반환값을 sentinel-heavy text로 바꾼 추가 PoC를 실행해 Thunderbird가 이 필드를 무시하는지, 일부만 normalize하는지 확인한다.
- Plain-text compose에서 같은 반환값을 사용했을 때 HTML 발송으로 전환되는지 별도 확인한다.

## 참고 자료

- Thunderbird compose API: <https://webextension-api.thunderbird.net/en/mv3/compose.html>
- Thunderbird MailExtension guide: <https://developer.thunderbird.net/add-ons/mailextensions>
- Thunderbird supported UI elements: <https://developer.thunderbird.net/add-ons/mailextensions/supported-ui-elements>
