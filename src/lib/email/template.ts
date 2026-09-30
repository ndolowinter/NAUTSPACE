/**
 * Single branded HTML wrapper for every transactional/broadcast email NautSpace International
 * sends (careers notifications, member announcements). Keeping one template
 * means a style change happens in one place instead of per email type.
 */
export function renderEmailTemplate({
  heading,
  bodyHtml,
}: {
  heading: string;
  bodyHtml: string;
}): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#01040a;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#01040a;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#0b1120;border:1px solid #1e293b;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:24px 28px;border-bottom:1px solid #1e293b;">
                <span style="font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#22d3ee;">NautSpace International</span>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 16px;font-size:20px;color:#f1f5f9;">${heading}</h1>
                <div style="font-size:14px;line-height:1.6;color:#cbd5e1;">${bodyHtml}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px;border-top:1px solid #1e293b;font-size:12px;color:#64748b;">
                Space Exploration in Africa &middot; orbitspacesafari.co.ke
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Renders plain-text paragraphs (one per line) into safe HTML `<p>` blocks. */
export function textToParagraphs(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((para) => `<p style="margin:0 0 12px;">${escapeHtml(para).replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
