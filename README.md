# 走吧 Zou Ba — 台灣週報趨勢

台灣第一個資料驅動的跨格式週報，追蹤 PTT、Google Trends、巴哈姆特等平台的熱門話題。

**🌐 Live:** https://zouba.vercel.app

## 技術架構

- **框架**: Next.js 16 (App Router) + TypeScript
- **樣式**: Tailwind CSS v3
- **內容**: MDX 文章（存於 `posts/` 目錄）
- **部署**: Vercel
- **電子報**: Buttondown（slug: `taiwan-weekly`）

## 本地開發

```bash
npm install
npm run dev
```

開啟 http://localhost:3000

## 新增文章

在 `posts/` 目錄建立新的 `.mdx` 檔案：

```md
---
title: "文章標題"
date: "2026-04-12"
description: "文章描述"
---

文章內容...
```

## 部署

```bash
vercel --prod
```
