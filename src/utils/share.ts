/**
 * Handles sharing with native navigator.share or copies to clipboard with fallback.
 */
export async function shareOrCopyMessage(
  text: string,
  title?: string
): Promise<{ success: boolean; sharedViaNative: boolean; feedbackText: string }> {
  if (navigator.share && navigator.canShare && navigator.canShare({ text })) {
    try {
      await navigator.share({
        title: title || 'متتبّع الانضباط',
        text: text,
      });
      return {
        success: true,
        sharedViaNative: true,
        feedbackText: 'تمت المشاركة بنجاح!',
      };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User cancelled share dialog, no error
        return {
          success: false,
          sharedViaNative: true,
          feedbackText: 'تم إلغاء المشاركة',
        };
      }
      // If native share fails, fallback to clipboard below
    }
  }

  // Clipboard fallback
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return {
        success: true,
        sharedViaNative: false,
        feedbackText: 'اننسخت — الصقها بالشات مع ملك',
      };
    }
  } catch (clipErr) {
    console.warn('Clipboard API failed, using fallback input', clipErr);
  }

  // Fallback textarea method
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) {
      return {
        success: true,
        sharedViaNative: false,
        feedbackText: 'اننسخت — الصقها بالشات مع ملك',
      };
    }
  } catch (execErr) {
    console.error('execCommand copy failed', execErr);
  }

  return {
    success: false,
    sharedViaNative: false,
    feedbackText: 'تعذر النسخ التلقائي. يرجى نسخ النص يدوياً.',
  };
}
