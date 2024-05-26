import type {
    arrLength, columnSpec, genNumbers, Tuple, leadDataWithContact
} from '@/types/types'
import type {TableColumnsType} from "ant-design-vue";
import {readonly} from "vue";

export enum columnHeadings {
    'Название',
    'Бюджет',
    'Статус',
    'Ответственный',
    'Дата создания',
}

export const propsToHeadingsMapping = {
    name: 'Название',
    price: 'Бюджет',
    status_name: 'Статус',
    responsible_name: 'Ответственный' ,
    created_at: 'Дата создания',
    description: 'Любое описание'
}

export const leadProperties = [
    'name',
    'price',
    'status_name',
    'responsible_name',
    'created_at',
] as const;

export type length = arrLength<typeof leadProperties>;
export function getEntries<T extends Readonly<object>>(object: T) {
    return Object.entries(object) as [keyof T, any][];
}

export function getKeys<T extends object>(object: T) {
    return Object.keys(object) as Tuple<keyof T, 5>;
}

export const toDateTime = (timestamp: string | number) => {
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    } as object;

    return new Date(timestamp).toLocaleString('ru', options).replace(',', ' ');
}
export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const statusColors = {
    'Первичный контакт': 'rgb(153, 204, 255)',
    'Переговоры': 'rgb(255, 255, 153)',
    'Принимают решение': 'rgb(255, 204, 102)',
    'Согласование договора' : 'rgb(255, 204, 204)'
}
export default class TableObj {
    expandedRowName: string = '';
    setExpandedRow(name: string) {
        this.expandedRowName = name
    }
    /**
     *  Для колонки startCol установить colspan, а для последующих убрать(colspan = 0)
     **/
    colspan(columns: TableColumnsType, startCol: number, colspan: genNumbers<length>) {
        const countElements = leadProperties.length
        const humanStartCount = startCol - 1
        // trim to
        const leftSpace = countElements - humanStartCount as genNumbers<length>
        // calspan не может выходить за пределы
        if(leftSpace < colspan) {
            colspan = leftSpace
        }

        let appliedColspanItem = columns[humanStartCount]
        appliedColspanItem.colSpan = colspan

        // Оставшиеся элементы
        columns.forEach((el, index) => {
            if(humanStartCount < index && humanStartCount + colspan > index) {
                el.colSpan = 0
            }
        })
    }

    sortByColumns(columns: TableColumnsType) {
        function compare(a: columnSpec, b: columnSpec) {
            if (columnHeadings[a.title] < columnHeadings[b.title]) {
                return -1;
            } else if (columnHeadings[a.title] > columnHeadings[b.title]) {
                return 1;
            }

            return 0;
        }

        return columns.sort(compare)
    }
}
