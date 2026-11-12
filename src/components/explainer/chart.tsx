import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import type { EChartsCoreOption } from 'echarts/core'
import { BarChart, FunnelChart, HeatmapChart, LineChart, PieChart, SankeyChart, ScatterChart } from 'echarts/charts'
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import { UniversalTransition } from 'echarts/features'
import { SVGRenderer } from 'echarts/renderers'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/theme'
import { useReducedMotion } from '@/lib/motion'

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  SankeyChart,
  HeatmapChart,
  FunnelChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  MarkLineComponent,
  VisualMapComponent,
  UniversalTransition,
  SVGRenderer,
])

export interface ChartProps {
  /** A standard ECharts option. */
  option: EChartsCoreOption
  /** An ECharts theme object for the piece's own palette and type. Without it the chart uses ECharts' stock theme. */
  theme?: object
  /** Text alternative read by assistive technology. State the takeaway, not the chart type. */
  label: string
  height?: number
  className?: string
}

/**
 * An ECharts chart. It redraws when the page switches between light and dark, resizes
 * with its container, animates changes between options, and draws without animation
 * under reduced motion. It sets no colours or type of its own.
 */
export function Chart({ option, theme: chartTheme, label, height = 320, className }: ChartProps) {
  const el = useRef<HTMLDivElement>(null)
  const chart = useRef<echarts.ECharts | null>(null)
  const theme = useTheme()
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!el.current) return
    const instance = echarts.init(el.current, chartTheme ?? (theme === 'dark' ? 'dark' : undefined), { renderer: 'svg' })
    chart.current = instance
    const resize = new ResizeObserver(() => instance.resize())
    resize.observe(el.current)
    return () => {
      resize.disconnect()
      instance.dispose()
      chart.current = null
    }
  }, [theme, chartTheme])

  useEffect(() => {
    chart.current?.setOption({ animation: !reduced, backgroundColor: 'transparent', ...option })
  }, [option, reduced, theme, chartTheme])

  return <div ref={el} role="img" aria-label={label} className={cn('w-full', className)} style={{ height }} />
}
