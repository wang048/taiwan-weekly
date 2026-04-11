#!/usr/bin/env node
/**
 * 走吧週報電子報發送腳本（Resend API）
 *
 * 使用方式：
 *   # 發送測試信
 *   RESEND_API_KEY=re_xxx node scripts/send-newsletter.js --test your@email.com
 *
 *   # 發送給訂閱者名單（JSON 檔案）
 *   RESEND_API_KEY=re_xxx node scripts/send-newsletter.js --list subscribers.json
 *
 *   # 指定特定週報文章
 *   RESEND_API_KEY=re_xxx node scripts/send-newsletter.js --post 2026-W15 --test your@email.com
 *
 * 環境變數：
 *   RESEND_API_KEY   必填，Resend API 金鑰
 *   FROM_EMAIL       選填，寄件地址（預設: newsletter@zoubo.tw）
 *
 * 訂閱者 JSON 格式（subscribers.json）：
 *   [
 *     { "email": "user1@example.com", "name": "姓名（選填）" },
 *     { "email": "user2@example.com" }
 *   ]
 */

import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// -- Config ------------------------------------------------------------------

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'newsletter@zoubo.tw';
const FROM_NAME = '走吧 Zou Ba 週報';
const BASE_URL = 'https://zoubo.vercel.app';

if (!RESEND_API_KEY) {
  console.error('❌ 請設定 RESEND_API_KEY 環境變數');
  console.error('   範例: RESEND_API_KEY=re_xxx node scripts/send-newsletter.js --test your@email.com');
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

// -- Argument parsing --------------------------------------------------------

const args = process.argv.slice(2);
const testIndex = args.indexOf('--test');
const listIndex = args.indexOf('--list');
const postIndex = args.indexOf('--post');

const testEmail = testIndex !== -1 ? args[testIndex + 1] : null;
const listFile = listIndex !== -1 ? args[listIndex + 1] : null;
const postSlug = postIndex !== -1 ? args[postIndex + 1] : null;

if (!testEmail && !listFile) {
  console.error('❌ 請指定收件對象：');
  console.error('   --test your@email.com    發送測試信');
  console.error('   --list subscribers.json  發送給訂閱者名單');
  process.exit(1);
}

// -- Newsletter data ---------------------------------------------------------

/**
 * W15 2026 週報
 * 主旨：2026 W15｜川普關稅引爆台股、PLG 季後賽熱開打、SEVENTEEN 13 人全員續約
 */
const NEWSLETTERS = {
  '2026-W15': {
    subject: '2026 W15｜川普關稅引爆台股、PLG 季後賽熱開打、SEVENTEEN 13 人全員續約',
    url: `${BASE_URL}/blog/2026-W15-taiwan-weekly-trends`,
    week: '2026 年第 15 週（4/07 ~ 4/13）',
    excerpt: '川普關稅引爆全球股災台灣首當其衝、PLG 季後賽開打雲豹主場熱爆、SEVENTEEN 13 人全員續約創 K-pop 奇蹟、法國公民遭中國處決外交風波——走吧帶你看懂這週台灣最燒的網路話題。',
    highlights: [
      { emoji: '📉', title: '川普關稅核彈', desc: '台股、台積電驚濤骸浪，PTT 股板爆量討論' },
      { emoji: '🏀', title: 'PLG 季後賽爆燃', desc: '中壢雲豹主場連 9 戰滿座' },
      { emoji: '🎤', title: 'SEVENTEEN 13 人全員續約', desc: 'K-pop 史上最難能可貴的集體續約' },
      { emoji: '🌐', title: '法國外交風波', desc: '法國公民遭中國處決，外交緊張升溫' },
      { emoji: '🛢️', title: 'OPEC+ 原油決策', desc: '增產有限，國際油價觀察重點' },
    ],
  },
};

// Default to latest issue
const DEFAULT_POST = '2026-W15';
const newsletter = NEWSLETTERS[postSlug || DEFAULT_POST];

if (!newsletter) {
  console.error(`❌ 找不到週報: ${postSlug}`);
  console.error('   可用: ' + Object.keys(NEWSLETTERS).join(', '));
  process.exit(1);
}

// -- HTML template -----------------------------------------------------------

function buildHtml(recipientName) {
  const greeting = recipientName ? `親愛的 ${recipientName}，` : '各位讀者，';

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${newsletter.subject}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Noto Sans TC','Microsoft JhengHei',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a2e;padding:32px 40px;text-align:center;">
              <p style="margin:0;color:#6c63ff;font-size:13px;letter-spacing:3px;text-transform:uppercase;">TAIWAN WEEKLY</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:28px;font-weight:700;">走吧 週報</h1>
              <p style="margin:8px 0 0;color:#aaaacc;font-size:13px;">${newsletter.week}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;color:#333;font-size:15px;line-height:1.6;">${greeting}</p>
              <p style="margin:0 0 24px;color:#333;font-size:15px;line-height:1.8;">${newsletter.excerpt}</p>

              <!-- Highlights -->
              <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:18px;border-left:4px solid #6c63ff;padding-left:12px;">本週精選</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${newsletter.highlights.map(h => `
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:24px;padding-right:16px;vertical-align:top;">${h.emoji}</td>
                        <td>
                          <strong style="color:#1a1a2e;font-size:15px;">${h.title}</strong><br>
                          <span style="color:#666;font-size:13px;line-height:1.5;">${h.desc}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`).join('')}
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
                <tr>
                  <td align="center">
                    <a href="${newsletter.url}"
                       style="display:inline-block;background:#6c63ff;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:6px;font-size:15px;font-weight:600;">
                      閱讀完整週報 →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f9;padding:24px 40px;text-align:center;border-top:1px solid #eeeeee;">
              <p style="margin:0 0 8px;color:#999;font-size:12px;">
                你收到這封信是因為你訂閱了「走吧 週報」。
              </p>
              <p style="margin:0;color:#999;font-size:12px;">
                <a href="${BASE_URL}" style="color:#6c63ff;text-decoration:none;">走吧官網</a>
                &nbsp;·&nbsp;
                <a href="${BASE_URL}/blog" style="color:#6c63ff;text-decoration:none;">所有文章</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildText(recipientName) {
  const greeting = recipientName ? `親愛的 ${recipientName}，` : '各位讀者，';
  return `${greeting}

${newsletter.week} 走吧週報

${newsletter.excerpt}

本週精選：
${newsletter.highlights.map(h => `${h.emoji} ${h.title} - ${h.desc}`).join('\n')}

閱讀完整週報：${newsletter.url}

---
走吧 Zou Ba 週報 | ${BASE_URL}
`;
}

// -- Sending logic -----------------------------------------------------------

async function sendEmail({ to, toName }) {
  const html = buildHtml(toName);
  const text = buildText(toName);

  const result = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: toName ? `${toName} <${to}>` : to,
    subject: newsletter.subject,
    html,
    text,
  });

  return result;
}

async function main() {
  console.log(`\n📧 走吧週報發送腳本`);
  console.log(`   週報：${newsletter.subject}`);
  console.log(`   寄件地址：${FROM_EMAIL}\n`);

  if (testEmail) {
    // Single test email
    console.log(`🧪 發送測試信至：${testEmail}`);
    try {
      const result = await sendEmail({ to: testEmail, toName: null });
      if (result.error) {
        console.error('❌ 發送失敗：', result.error);
        process.exit(1);
      }
      console.log(`✅ 測試信發送成功！ID: ${result.data?.id}`);
    } catch (err) {
      console.error('❌ 發送失敗：', err.message);
      process.exit(1);
    }
    return;
  }

  // Batch send to subscriber list
  const listPath = join(process.cwd(), listFile);
  let subscribers;
  try {
    subscribers = JSON.parse(readFileSync(listPath, 'utf-8'));
  } catch (err) {
    console.error(`❌ 無法讀取訂閱者名單：${listPath}`);
    console.error(`   ${err.message}`);
    process.exit(1);
  }

  console.log(`📋 訂閱者名單：${subscribers.length} 人`);

  let sent = 0;
  let failed = 0;

  for (const sub of subscribers) {
    const { email, name } = sub;
    process.stdout.write(`   發送至 ${email}... `);
    try {
      const result = await sendEmail({ to: email, toName: name });
      if (result.error) {
        console.log(`❌ ${result.error.message}`);
        failed++;
      } else {
        console.log(`✅`);
        sent++;
      }
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
    // Resend rate limit: ~10 req/sec on free plan — add a small delay
    await new Promise(r => setTimeout(r, 120));
  }

  console.log(`\n📊 發送結果：成功 ${sent}，失敗 ${failed}，共 ${subscribers.length} 人`);
}

main().catch(err => {
  console.error('❌ 未預期錯誤：', err);
  process.exit(1);
});
