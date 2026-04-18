# Pixelssuite Cypress Automation Plan (Transliteration Excluded)

## 1) Feature List

1. Homepage and global navigation
2. Document Converter: Image to PDF, PDF to Word, Word to PDF
3. Image Tools: Resize, Crop, Compress, Convert (+ convert shortcuts)
4. Editor and utility tools: PDF Editor, Image to Text, Rotate, Flip, Meme Generator, Color Picker
5. Information pages: About, Contact, Privacy, Terms, Disclaimer
6. Negative behavior guardrails: no-result before input, invalid upload stability, unknown route handling

## 2) Automation Scope

### In scope

- UI visibility and shell rendering for each major route
- Navigation and route reachability checks
- Upload-control availability checks
- Basic assignment-friendly negative checks
- Smoke + functional + basic negative coverage

### Out of scope

- Transliteration and Chat Translator flows
- Deep conversion result accuracy checks (binary output quality)
- Performance/load benchmarking
- Cross-browser matrix beyond default Electron/Chrome run commands

## 3) Test Case Table

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| SMK-001 | Homepage renders app shell | Open / | Body, headings, and links are visible |
| SMK-002 | Primary nav labels visible | Open / and check top nav labels | Document Converter, Editor, Resize, Crop, Compress, Image Converter, More are visible |
| SMK-003 | Home metadata is meaningful | Open / and check title + links count | Title is non-empty and multiple links exist |
| SMK-004 | Major feature routes load | Visit core routes (image-to-pdf, resize-image, compress-image, convert-image, pdf-editor, image-to-text, meme-generator) | Each route loads and basic controls are visible |
| SMK-005 | Transliteration excluded in suite config | Read fixture route exclusions | /transliteration and /chat-translator are excluded |
| FUN-001 | Image to PDF page has usable UI | Visit /image-to-pdf | Tool shell and controls are present |
| FUN-002 | PDF to Word page has usable UI | Visit /pdf-to-word | Tool shell and controls are present |
| FUN-003 | Word to PDF page has usable UI | Visit /word-to-pdf | Tool shell and controls are present |
| FUN-004 | Resize page has usable UI | Visit /resize-image | Tool shell and controls are present |
| FUN-005 | Crop page has usable UI | Visit /crop-image | Tool shell and controls are present |
| FUN-006 | Compress page has usable UI | Visit /compress-image | Tool shell and controls are present |
| FUN-007 | Convert shortcut pages are reachable | Visit /convert-to-jpg, /convert-to-png, /convert-to-webp | All routes load with controls |
| FUN-008 | PDF Editor and Image to Text routes are functional at UI level | Visit /pdf-editor and /image-to-text | Routes load and controls are visible |
| FUN-009 | Rotate, Flip, Meme and Color Picker pages are reachable | Visit /rotate-image, /flip-image, /meme-generator, /color-picker | Pages load with controls |
| FUN-010 | Info and legal pages are reachable | Visit /about, /contact, /privacy, /terms, /disclaimer | Pages render and app remains stable |
| NEG-001 | No ready output before input | Visit selected tool pages without uploading | No visible ready-download action by default |
| NEG-002 | Invalid upload does not crash app | Try .txt upload on file-input tools | App remains stable and route stays loaded |
| NEG-003 | Unknown route is handled safely | Visit nonexistent route | SPA root still renders; no hard failure |

## 4) Cypress Folder Structure

```text
cypress/
  e2e/
    smoke/
      homepage.cy.ts
      navigation.cy.ts
    functional/
      document-converter.cy.ts
      image-tools.cy.ts
      editor-and-more-tools.cy.ts
      info-pages.cy.ts
    negative/
      basic-negative.cy.ts
  fixtures/
    routes.json
    testData.json
  pages/
    AppShellPage.ts
    ToolPage.ts
    HomePage.ts
  support/
    commands.ts
    e2e.ts
    index.d.ts
docs/
  pixelssuite-automation-plan.md
```

## 5) Spec Files Included

- Smoke specs:
  - cypress/e2e/smoke/homepage.cy.ts
  - cypress/e2e/smoke/navigation.cy.ts
- Functional specs:
  - cypress/e2e/functional/document-converter.cy.ts
  - cypress/e2e/functional/image-tools.cy.ts
  - cypress/e2e/functional/editor-and-more-tools.cy.ts
  - cypress/e2e/functional/info-pages.cy.ts
- Negative spec:
  - cypress/e2e/negative/basic-negative.cy.ts

## 6) Notes Where Selectors May Need Updating

1. If navigation label text changes (for example "Document Converter" renamed), update label checks in smoke homepage spec.
2. If tools move away from input[type="file"], update control detection in ToolPage.assertToolHasWorkingUiShell and tryInvalidUploadIfAvailable.
3. If policy/info pages become modal-only or route-less, convert route-based checks to in-page navigation checks.
4. If app introduces lazy content shells, add explicit waits for a stable page marker before assertions.

## Fixture Suggestions

1. Keep routes.json as single source for included/excluded routes.
2. Add sample-image.jpg and sample.pdf fixtures later if you want deep conversion assertions.
3. Add invalid-input.txt fixture if your instructor requests explicit negative file fixtures.

## Run Commands

1. npm run cypress:open
2. npm run cypress:smoke
3. npm run cypress:functional
4. npm run cypress:negative
5. npm run cypress:assignment
6. npm run cypress:run:chrome

## Best 3 Tests for Viva Demo

1. SMK-004 (Major feature route reachability) - shows broad coverage quickly.
2. FUN-007 (Convert shortcut pages) - demonstrates grouped functional assertions.
3. NEG-002 (Invalid upload stability) - demonstrates practical negative testing.
