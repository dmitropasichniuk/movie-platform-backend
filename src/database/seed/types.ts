import { DataSource } from "typeorm";

export type SeederFn = (dataSource: DataSource) => Promise<void>;
