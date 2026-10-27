// 템플릿용 html`` 태그. 값은 기본으로 이스케이프되고, raw()로 감싼 값만 그대로 들어간다.

export type Html = { readonly __html: string }

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}

export const escape = (value: string) =>
  value.replace(/[&<>"']/g, c => ESCAPES[c])

export const raw = (value: string): Html => ({ __html: value })

const render = (value: unknown): string => {
  if (value == null || value === false) return ""
  if (Array.isArray(value)) return value.map(render).join("")
  if (typeof value === "object" && "__html" in value)
    return (value as Html).__html
  return escape(String(value))
}

export const html = (
  strings: TemplateStringsArray,
  ...values: unknown[]
): Html =>
  raw(
    strings.reduce(
      (out, s, i) => out + s + (i < values.length ? render(values[i]) : ""),
      "",
    ),
  )

export const toString = (value: Html) => value.__html
