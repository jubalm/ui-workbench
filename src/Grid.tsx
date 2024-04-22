import type { ComponentChildren, JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";

type CSSUnit = 'px' | 'em' | 'rem' | '%' | 'fr' | 'vw' | 'vh' | 'vmin' | 'vmax' | 'cm' | 'mm' | 'in' | 'pt' | 'pc';
type CSSSize = `${string | number}${CSSUnit}`

type ColumnSize = 'fil-space' | 'hug-content' | CSSSize

const sizeTranslations = new Map([['fil-space', '1fr'], ['hug-content', 'max-content']])
const translateSizeToCSSUnit = (size: string) => sizeTranslations.get(size) || size

type DataGridProps = {
  children: ComponentChildren
  columnSizes: ColumnSize[]
  cellClass?: string
  class?: string
  style?: JSX.CSSProperties
}

export const DataGrid = ({ children, columnSizes, cellClass, class: className, style }: DataGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const baseStyles: JSX.CSSProperties = {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: columnSizes.map(translateSizeToCSSUnit).join(' ')
  }

  useEffect(() => {
    if (!gridRef.current || !cellClass) return
    const cells = gridRef.current.querySelectorAll('& > *')
    for (const cell of cells) {
      cell.classList.add(cellClass)
    }
  }, [])

  return (
    <div ref={ gridRef } class={ className || 'grid' } style={{ ...baseStyles, ...style }}>{ children }</div>
  )
}
