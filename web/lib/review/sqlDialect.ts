export const SQL_DIALECTS = [
  "unspecified",
  "oracle",
  "postgresql",
  "sqlserver",
  "mysql",
] as const;

export type SqlDialect =
  (typeof SQL_DIALECTS)[number];

export const DEFAULT_SQL_DIALECT: SqlDialect =
  "unspecified";

export const SQL_DIALECT_OPTIONS: ReadonlyArray<{
  value: SqlDialect;
  label: string;
}> = [
  {
    value: "unspecified",
    label: "Not specified",
  },
  {
    value: "oracle",
    label: "Oracle",
  },
  {
    value: "postgresql",
    label: "PostgreSQL",
  },
  {
    value: "sqlserver",
    label: "SQL Server",
  },
  {
    value: "mysql",
    label: "MySQL",
  },
];

export function isSqlDialect(
  value: unknown,
): value is SqlDialect {
  return (
    typeof value === "string" &&
    SQL_DIALECTS.some(
      (dialect) => dialect === value,
    )
  );
}

export function getSqlDialectLabel(
  dialect: SqlDialect,
): string {
  return (
    SQL_DIALECT_OPTIONS.find(
      (option) => option.value === dialect,
    )?.label ?? "Not specified"
  );
}