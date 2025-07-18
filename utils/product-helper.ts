import { ProductSpec } from "@/types";

export function getSpecValue(spec: ProductSpec): string {
    let value = '';

    switch (spec.field) {
        case 'multi-select':
            if (Array.isArray(spec.value))
                value = spec.value.join(',');
            break;
        default:
            value = spec.value.toString();
            break;
    }

    return value;
}

export const formatCount = (num: number): string => {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};
