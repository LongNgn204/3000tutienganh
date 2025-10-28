import type { CEFRLevel } from './types';

export const CEFR_LEVEL_MAP: Record<CEFRLevel, { name: string, color: string }> = {
    'A1': { name: 'A1 - Mới bắt đầu', color: 'bg-green-100 text-green-800' },
    'A2': { name: 'A2 - Sơ cấp', color: 'bg-blue-100 text-blue-800' },
    'B1': { name: 'B1 - Trung cấp', color: 'bg-yellow-100 text-yellow-800' },
    'B2': { name: 'B2 - Trung cao cấp', color: 'bg-orange-100 text-orange-800' },
    'C1': { name: 'C1 - Cao cấp', color: 'bg-red-100 text-red-800' },
    'C2': { name: 'C2 - Thành thạo', color: 'bg-purple-100 text-purple-800' },
};
