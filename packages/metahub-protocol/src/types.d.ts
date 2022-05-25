export declare type RecordPath = string;
export declare type NonEmptyArray<T> = [T, ...T[]];
export declare type NonEmptyStringArray = NonEmptyArray<string>;
export interface RecordInfo {
    id: string;
    path: NonEmptyStringArray;
    storagePath: string;
    title: string;
}
export interface DataReader<T> {
    getAllRecords(): Promise<RecordInfo[]>;
    getRecordContent(): Promise<T>;
}
export interface DataWriter<T> {
    copyRecord(previous: string, next: string): Promise<void>;
    deleteRecord(path: string): Promise<void>;
    moveRecord(previous: string, next: string): Promise<void>;
    writeRecord(path: string, content: T): Promise<void>;
}
export interface DataSource<T> extends DataReader<T>, DataWriter<T> {
}
export interface DataDocument {
    info: RecordInfo;
    metadata?: any;
    content?: any;
}
export declare type DocumentDataSource = DataSource<DataDocument>;