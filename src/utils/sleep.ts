import { SleepCycleItem } from '../types';

export const FALL_ASLEEP_BUFFER_MINUTES = 15;
export const CYCLE_DURATION_MINUTES = 90;

export function formatTimeArabic(totalMinutesFromMidnight: number): { formatted: string; time24: string } {
  let normalized = Math.floor(totalMinutesFromMidnight) % 1440;
  if (normalized < 0) normalized += 1440;

  const hours24 = Math.floor(normalized / 60);
  const minutes = normalized % 60;

  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const period = hours24 < 12 ? 'ص' : 'م';
  const minutesStr = String(minutes).padStart(2, '0');
  const hours12Str = String(hours12).padStart(2, '0');
  const hours24Str = String(hours24).padStart(2, '0');

  return {
    formatted: `${hours12Str}:${minutesStr} ${period}`,
    time24: `${hours24Str}:${minutesStr}`,
  };
}

export function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function calculateWakeUpTimes(currentTime: Date = new Date()): SleepCycleItem[] {
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const sleepStartMinutes = currentMinutes + FALL_ASLEEP_BUFFER_MINUTES;

  const cycles = [3, 4, 5, 6];

  return cycles.map((c) => {
    const totalWakeMinutes = sleepStartMinutes + c * CYCLE_DURATION_MINUTES;
    const { formatted, time24 } = formatTimeArabic(totalWakeMinutes);
    const totalSleepHours = (c * CYCLE_DURATION_MINUTES) / 60;

    let quality: 'optimal' | 'great' | 'minimum' | 'emergency' = 'great';
    let qualityLabel = '';
    let tagline = '';

    if (c === 5) {
      quality = 'optimal';
      qualityLabel = 'الأفضل للتركيز (7.5 س)';
      tagline = 'توازن عصبي كامل واستشفاء ذهني بدون خمول';
    } else if (c === 6) {
      quality = 'great';
      qualityLabel = 'تعافي عضلي وبدني كامل (9 س)';
      tagline = 'مثالي لأيام التمرين الشاق وإعادة شحن الطاقة';
    } else if (c === 4) {
      quality = 'minimum';
      qualityLabel = 'الحد الأدنى الفعال (6 س)';
      tagline = 'كافٍ ليوم منضبط دون إرهاق حاد';
    } else {
      quality = 'emergency';
      qualityLabel = 'حالة طوارئ فقط (4.5 س)';
      tagline = 'نوم سريع يمنع الاستيقاظ في مرحلة النوم العميق';
    }

    const durationHours = Math.floor(totalSleepHours);
    const durationMins = Math.round((totalSleepHours % 1) * 60);
    const durationLabel = durationMins > 0 ? `${durationHours} س و ${durationMins} د` : `${durationHours} ساعات`;

    return {
      cycles: c,
      sleepHours: durationHours,
      sleepMinutes: durationMins,
      timeFormatted: formatted,
      time24,
      durationLabel,
      quality,
      qualityLabel,
      tagline,
      isClosestTo7Point5: c === 5,
    };
  });
}

export function calculateBedtimes(targetWakeUpTimeStr: string = '05:00'): SleepCycleItem[] {
  const wakeUpMinutes = parseTimeToMinutes(targetWakeUpTimeStr);
  const cycles = [6, 5, 4, 3];

  return cycles.map((c) => {
    // Bedtime = WakeUp - (cycles * 90) - buffer 15m
    const totalDurationMinutes = c * CYCLE_DURATION_MINUTES + FALL_ASLEEP_BUFFER_MINUTES;
    const bedtimeMinutes = wakeUpMinutes - totalDurationMinutes;
    const { formatted, time24 } = formatTimeArabic(bedtimeMinutes);
    const totalSleepHours = (c * CYCLE_DURATION_MINUTES) / 60;

    let quality: 'optimal' | 'great' | 'minimum' | 'emergency' = 'great';
    let qualityLabel = '';
    let tagline = '';

    if (c === 5) {
      quality = 'optimal';
      qualityLabel = 'الموعد الموصى به (7.5 س)';
      tagline = 'الأقرب لمعدل 7.5 ساعات لنشاط ذهني وجسدي فائق';
    } else if (c === 6) {
      quality = 'great';
      qualityLabel = 'نوم عميق كامل (9 س)';
      tagline = 'أقصى بناء عضلي وتعافي هرموني';
    } else if (c === 4) {
      quality = 'minimum';
      qualityLabel = 'الحد الأدنى المقبول (6 س)';
      tagline = 'لليالي الضغط والامتحانات';
    } else {
      quality = 'emergency';
      qualityLabel = 'طوارئ استثنائية (4.5 س)';
      tagline = 'استيقاظ بنهاية الدورة لمنع الصداع';
    }

    const durationHours = Math.floor(totalSleepHours);
    const durationMins = Math.round((totalSleepHours % 1) * 60);
    const durationLabel = durationMins > 0 ? `${durationHours} س و ${durationMins} د` : `${durationHours} ساعات`;

    return {
      cycles: c,
      sleepHours: durationHours,
      sleepMinutes: durationMins,
      timeFormatted: formatted,
      time24,
      durationLabel,
      quality,
      qualityLabel,
      tagline,
      isClosestTo7Point5: c === 5,
    };
  });
}

export interface NapOption {
  type: 'power20' | 'cycle90';
  title: string;
  durationLabel: string;
  wakeFormatted: string;
  wake24: string;
  description: string;
  badge: string;
}

export function calculateNaps(currentTime: Date = new Date()): NapOption[] {
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // Choice 1: 20-minute power nap (wake up from now)
  const power20WakeMinutes = currentMinutes + 20;
  const power20Time = formatTimeArabic(power20WakeMinutes);

  // Choice 2: Full 90-minute cycle (+15 min buffer to fall asleep = 105 min)
  const cycle90WakeMinutes = currentMinutes + 90 + FALL_ASLEEP_BUFFER_MINUTES;
  const cycle90Time = formatTimeArabic(cycle90WakeMinutes);

  return [
    {
      type: 'power20',
      title: 'غفوة طاقة سريعة (20 دقيقة)',
      durationLabel: '20 دقيقة بالضبط',
      wakeFormatted: power20Time.formatted,
      wake24: power20Time.time24,
      description: 'تنشيط فوري للدماغ قبل الدخول في مرحلة النوم العميق لتجنب الخمول.',
      badge: 'تنشيط فوري',
    },
    {
      type: 'cycle90',
      title: 'دورة نوم كاملة (90 دقيقة + 15 دقيقة)',
      durationLabel: 'ساعة و 45 دقيقة (تشمل 15 دقيقة للنوم)',
      wakeFormatted: cycle90Time.formatted,
      wake24: cycle90Time.time24,
      description: 'دورة نوم متكاملة تُصلح الذاكرة وتجدد طاقة العضلات والجهاز العصبي.',
      badge: 'إصلاح عصبي عميق',
    },
  ];
}
