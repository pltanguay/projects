import { Filter } from '@app/classes/interfaces/filter';

export const FILTERS = ['Aucun', 'Sepia', 'Tons de gris', 'Saturé', 'Rotation', 'Inversé'];
export const FORMATS = ['JPEG', 'PNG'];
export const DEFAULT_INDEX_ZERO = 0;
export const DEFAULT_SLIDER_HUNDRED = 100;
export const DEFAULT_SLIDER_RATIO_ONE = 1;

export const FILTER_DATA: Filter[] = [
    {
        name: 'Aucun',
        maxValue: 100,
        unit: '',
        cssName: 'none',
    },

    {
        name: 'Sepia',
        maxValue: 100,
        unit: '%',
        cssName: 'sepia',
    },
    {
        name: 'Tons de gris',
        maxValue: 100,
        unit: '%',
        cssName: 'grayscale',
    },
    {
        name: 'Saturé',
        maxValue: 800,
        unit: '%',
        cssName: 'saturate',
    },
    {
        name: 'Rotation',
        maxValue: 360,
        unit: 'deg',
        cssName: 'hue-rotate',
    },
    {
        name: 'Inversé',
        maxValue: 100,
        unit: '%',
        cssName: 'invert',
    },
];
