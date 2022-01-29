export type OnReviewProps = (value?: any, key?: null | string | JsonFormat | { [key: string]: any }) => void

export type FieldFormProps = {
    [key: string]: any,
    component: string,
    config: FieldConfigProps,
    name: string,
    post: JsonFormat,
    onReview: OnReviewProps
}

export type FieldFormItemProps = {
    [key: string]: any,
    component: string,
    config: JsonFormat,
    post: JsonFormat,
    onReview: OnReviewProps
    name: string
}

export type FieldViewProps = {
    [key: string]: any,
    component: string,
    config: FieldConfigProps,
    name: string,
    post: JsonFormat,
    actionLiveEdit?: (value: string | JsonFormat, key: string | JsonFormat, post: JsonFormat) => void
}

export type FieldViewItemProps = {
    [key: string]: any,
    component: string,
    config: JsonFormat,
    name: string
    post: JsonFormat,
    content: any,
    actionLiveEdit?: (value: string | JsonFormat, key: string | JsonFormat, post: JsonFormat) => void
}

export interface FieldConfigProps {
    [key: string]: any,
    title: string | boolean | null,
    view?: string,
    customViewList?: string,
    customViewForm?: string,
    inlineEdit?: boolean,
}
