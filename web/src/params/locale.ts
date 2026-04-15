import type { ParamMatcher } from '@sveltejs/kit';
import { isLocale } from '$lib/i18n/locale';

export const match: ParamMatcher = (param) => isLocale(param);
