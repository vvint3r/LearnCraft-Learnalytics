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
import { token, useTheme } from '@/lib/theme'
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

/** ECharts theme built from the design tokens in src/styles/theme.css. */
function chartTheme() {
  const ink = token('--ink')
  const hairline = token('--hairline')
  const text = { color: ink, fontFamily: 'Nunito Variable, system-ui, sans-serif', fontSize: 13 }
  const axis = {
    axisLine: { lineStyle: { color: ink } },
    axisTick: { show: false },
    axisLabel: text,
    splitLine: { lineStyle: { color: hairline } },
    nameTextStyle: { ...text, fontWeight: 800 },
  }
  return {
    color: [token('--series-1'), token('--series-2'), token('--series-3'), token('--series-4'), token('--context')],
    backgroundColor: 'transparent',
    textStyle: text,
    categoryAxis: { ...axis, splitLine: { show: false } },
    valueAxis: { ...axis, axisLine: { show: false } },
    timeAxis: axis,
    legend: { textStyle: text, icon: 'roundRect', itemWidth: 12, itemHeight: 12 },
    tooltip: {
      backgroundColor: token('--surface'),
      borderColor: hairline,
      textStyle: text,
      extraCssText: 'border-radius:8px;box-shadow:var(--elev-2)',
    },
    bar: { itemStyle: { borderRadius: 4 } },
    line: { symbolSize: 6, lineStyle: { width: 2.5 } },
  }
}

export interface ChartProps {
  /** A standard ECharts option. Colours and type come from the theme; set them only to carry meaning. */
  option: EChartsCoreOption
  /** Text alternative read by assistive technology. State the takeaway, not the chart type. */
  label: string
  height?: number
  className?: string
}

/**
 * A themed ECharts chart. It redraws on theme change, resizes with its container,
 * animates changes between options, and draws without animation under reduced motion.
 */
export function Chart({ option, label, height = 320, className }: ChartProps) {
  const el = useRef<HTMLDivElement>(null)
  const chart = useRef<echarts.ECharts | null>(null)
  const theme = useTheme()
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!el.current) return
    const instance = echarts.init(el.current, chartTheme(), { renderer: 'svg' })
    chart.current = instance
    const resize = new ResizeObserver(() => instance.resize())
    resize.observe(el.current)
    return () => {
      resize.disconnect()
      instance.dispose()
      chart.current = null
    }
  }, [theme])

  useEffect(() => {
    chart.current?.setOption({ animation: !reduced, animationDuration: 600, animationDurationUpdate: 450, ...option })
  }, [option, reduced, theme])

  return <div ref={el} role="img" aria-label={label} className={cn('w-full', className)} style={{ height }} />
}
