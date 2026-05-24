---
updated: 2026-05-22
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

## 참고 자료

- Thunderbird compose API: <https://webextension-api.thunderbird.net/en/mv3/compose.html>
- Thunderbird MailExtension guide: <https://developer.thunderbird.net/add-ons/mailextensions>
- Thunderbird supported UI elements: <https://developer.thunderbird.net/add-ons/mailextensions/supported-ui-elements>
