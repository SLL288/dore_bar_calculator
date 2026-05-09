import { useEffect, useMemo, useState } from 'react'
import { Calculator, ClipboardCopy, Languages, Printer, RefreshCw } from 'lucide-react'
import {
  calculateGoldBarValue,
  densityKaratTable,
  fetchGoldApiSpotPrice,
} from './utils/goldCalculator'

type Language = 'zh' | 'en'

type FormState = {
  goldWeightGrams: string
  weightDifference: string
  goldSpotPricePerOz: string
  handlingFeePerGram: string
  buyerName: string
  sellerName: string
  location: string
  date: string
  notes: string
  priceMode: 'manual' | 'api'
}

type RecentRecord = {
  id: string
  date: string
  weight: number
  density: number
  karat: number
  total: number
}

const t = {
  zh: {
    title: '多利金条估价计算器',
    subtitle: '用于砂金、多利金条和杂金交易的现场密度估价工作表，可作为买卖双方或内部记录参考。',
    copy: '复制',
    print: '打印 / PDF',
    language: 'English',
    fieldInputs: '现场输入',
    fieldHelp: '输入空气中重量和水密度测试的重量差。',
    weight: '金条/杂金重量 (g)',
    difference: '水密度测试重量差 (g)',
    spot: '黄金现货价 (USD/ozt)',
    fee: '处理/精炼/佣金费用 (USD/g)',
    apiStatus: '可从 gold-api.com 获取实时 XAU/USD 金价，不需要 API 密钥。',
    apiLoading: '正在从 gold-api.com 获取实时金价...',
    apiLoaded: '实时黄金现货价已载入。',
    apiError: 'gold-api.com 获取失败，请检查网络权限或稍后重试。',
    requestTime: '请求时间',
    quoteTime: '报价更新时间',
    reportDetails: '报告信息',
    buyer: '买方名称',
    seller: '卖方名称',
    location: '地点',
    date: '日期',
    notes: '备注',
    save: '保存本次计算',
    copied: '计算摘要已复制。',
    formalReport: '正式计算报告',
    transactionSummary: '交易摘要',
    buyerShort: '买方',
    sellerShort: '卖方',
    locationShort: '地点',
    weightSummary: '重量',
    differenceSummary: '重量差',
    density: '计算密度',
    karat: '估算K金',
    spotSummary: '黄金现货价/盎司',
    price24k: '24K 每克价格',
    gross: '纯度调整后每克价格',
    feeSummary: '每克处理费',
    net: '最终每克单价',
    total: '最终总价',
    invalid: '请输入有效的测量值和价格以生成报告。',
    disclaimerShort: '密度法估算K金仅作参考。',
    preparedBy: '制表人',
    signature: '签名',
    proof: '详细计算证明',
    reference: '密度-K金参考表',
    referenceHelp: '代码中的参考表可在 src/utils/goldCalculator.ts 更新。',
    rows: '条参考数据',
    minDensity: '最低密度',
    maxDensity: '最高密度',
    section: '图表区间',
    recent: '最近计算',
    chart: '实时黄金价格图表',
    chartHelp: 'TradingView XAU/USD，4小时K线。',
    bottomDisclaimer:
      'This calculator provides an estimated value based on field density testing and market spot price. Final commercial settlement should be based on professional assay, refinery confirmation, and agreed contract terms.',
    errors: {
      weight: '黄金重量必须大于 0 克。',
      difference: '重量差必须大于 0 克。',
      spot: '黄金现货价必须大于 0。',
      fee: '处理费必须大于或等于 0。',
    },
  },
  en: {
    title: 'Doré Gold Bar Calculator',
    subtitle:
      'Field density pricing worksheet for alluvial and doré gold transactions, buyer references, seller records, and internal settlement review.',
    copy: 'Copy',
    print: 'Print / PDF',
    language: '中文',
    fieldInputs: 'Field Inputs',
    fieldHelp: 'Enter measured values from the scale and water-density test.',
    weight: 'Gold bar/scrap weight (g)',
    difference: 'Weight difference from water-density test (g)',
    spot: 'Gold spot price (USD/ozt)',
    fee: 'Handling/refining/commission fee (USD/g)',
    apiStatus: 'Fetch realtime XAU/USD pricing from gold-api.com. No API key required.',
    apiLoading: 'Fetching realtime price from gold-api.com...',
    apiLoaded: 'Live gold spot price loaded.',
    apiError: 'gold-api.com fetch failed. Check network permissions or try again later.',
    requestTime: 'Request time',
    quoteTime: 'Quote updated',
    reportDetails: 'Report Details',
    buyer: 'Buyer name',
    seller: 'Seller name',
    location: 'Location',
    date: 'Date',
    notes: 'Notes',
    save: 'Save Calculation',
    copied: 'Calculation summary copied.',
    formalReport: 'Formal Calculation Report',
    transactionSummary: 'Transaction Summary',
    buyerShort: 'Buyer',
    sellerShort: 'Seller',
    locationShort: 'Location',
    weightSummary: 'Weight',
    differenceSummary: 'Weight difference',
    density: 'Calculated density',
    karat: 'Estimated karat',
    spotSummary: 'Gold spot price per oz',
    price24k: '24K price per gram',
    gross: 'Purity-adjusted price per gram',
    feeSummary: 'Handling fee per gram',
    net: 'Final unit price per gram',
    total: 'Final total price',
    invalid: 'Enter valid measurement and price values to generate the report.',
    disclaimerShort:
      'Density-based karat is an estimate. Final commercial settlement should rely on XRF, fire assay, or refinery assay confirmation.',
    preparedBy: 'Prepared by',
    signature: 'Signature',
    proof: 'Detailed Proof',
    reference: 'Density-to-Karat Reference',
    referenceHelp: 'The code table is editable in src/utils/goldCalculator.ts.',
    rows: 'chart rows',
    minDensity: 'Min Density',
    maxDensity: 'Max Density',
    section: 'Section',
    recent: 'Recent Calculations',
    chart: 'Realtime Gold Price Chart',
    chartHelp: 'TradingView XAU/USD, 4-hour bars.',
    bottomDisclaimer:
      'This calculator provides an estimated value based on field density testing and market spot price. Final commercial settlement should be based on professional assay, refinery confirmation, and agreed contract terms.',
    errors: {
      weight: 'Gold weight must be greater than 0 grams.',
      difference: 'Weight difference must be greater than 0 grams.',
      spot: 'Gold spot price must be greater than 0.',
      fee: 'Handling fee must be 0 or greater.',
    },
  },
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const today = new Date().toISOString().slice(0, 10)

const initialForm: FormState = {
  goldWeightGrams: '1000',
  weightDifference: '53',
  goldSpotPricePerOz: '3300',
  handlingFeePerGram: '10',
  buyerName: '',
  sellerName: '',
  location: '',
  date: today,
  notes: '',
  priceMode: 'manual',
}

function parsePositiveNumber(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function formatNumber(value: number, decimals = 2) {
  return Number.isFinite(value) ? value.toFixed(decimals) : '0.00'
}

function App() {
  const [language, setLanguage] = useState<Language>('zh')
  const labels = t[language]
  const [form, setForm] = useState<FormState>(initialForm)
  const [recentRecords, setRecentRecords] = useState<RecentRecord[]>([])
  const [copyStatus, setCopyStatus] = useState('')
  const [apiStatus, setApiStatus] = useState(labels.apiStatus)

  useEffect(() => {
    const stored = localStorage.getItem('dore-gold-recent-calculations')
    if (stored) {
      setRecentRecords(JSON.parse(stored) as RecentRecord[])
    }
  }, [])

  useEffect(() => {
    setApiStatus(labels.apiStatus)
  }, [labels.apiStatus])

  useEffect(() => {
    let cancelled = false

    async function refreshOpeningSpotPrice() {
      setApiStatus(t.zh.apiLoading)
      try {
        const requestTime = new Date()
        const liveQuote = await fetchGoldApiSpotPrice()
        if (cancelled) return

        setForm((current) => ({
          ...current,
          priceMode: 'api',
          goldSpotPricePerOz: liveQuote.price.toFixed(2),
        }))
        const quoteTime = liveQuote.updatedAt
          ? ` | ${t.zh.quoteTime}: ${new Date(liveQuote.updatedAt).toLocaleString()}`
          : ''
        setApiStatus(
          `${t.zh.apiLoaded} ${t.zh.requestTime}: ${requestTime.toLocaleString()}${quoteTime}`,
        )
      } catch (error) {
        console.error(error)
        if (!cancelled) setApiStatus(t.zh.apiError)
      }
    }

    refreshOpeningSpotPrice()

    return () => {
      cancelled = true
    }
  }, [])

  const numericInputs = useMemo(
    () => ({
      goldWeightGrams: parsePositiveNumber(form.goldWeightGrams),
      weightDifference: parsePositiveNumber(form.weightDifference),
      goldSpotPricePerOz: parsePositiveNumber(form.goldSpotPricePerOz),
      handlingFeePerGram: Number(form.handlingFeePerGram),
    }),
    [form],
  )

  const validationErrors = useMemo(() => {
    const errors: string[] = []
    if (!numericInputs.goldWeightGrams) errors.push(labels.errors.weight)
    if (!numericInputs.weightDifference) errors.push(labels.errors.difference)
    if (!numericInputs.goldSpotPricePerOz) errors.push(labels.errors.spot)
    if (!Number.isFinite(numericInputs.handlingFeePerGram) || numericInputs.handlingFeePerGram < 0) {
      errors.push(labels.errors.fee)
    }
    return errors
  }, [labels.errors, numericInputs])

  const result = useMemo(() => {
    if (validationErrors.length > 0) return null
    return calculateGoldBarValue({
      goldWeightGrams: numericInputs.goldWeightGrams!,
      weightDifference: numericInputs.weightDifference!,
      goldSpotPricePerOz: numericInputs.goldSpotPricePerOz!,
      handlingFeePerGram: numericInputs.handlingFeePerGram,
    })
  }, [numericInputs, validationErrors])

  const updateForm = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleApiPrice = async () => {
    setForm((current) => ({ ...current, priceMode: 'api' }))
    setApiStatus(labels.apiLoading)

    try {
      const requestTime = new Date()
      const liveQuote = await fetchGoldApiSpotPrice()
      updateForm('goldSpotPricePerOz', liveQuote.price.toFixed(2))
      const quoteTime = liveQuote.updatedAt
        ? ` | ${labels.quoteTime}: ${new Date(liveQuote.updatedAt).toLocaleString()}`
        : ''
      setApiStatus(
        `${labels.apiLoaded} ${labels.requestTime}: ${requestTime.toLocaleString()}${quoteTime}`,
      )
    } catch (error) {
      console.error(error)
      setApiStatus(labels.apiError)
    }
  }

  const saveRecentRecord = () => {
    if (!result || !numericInputs.goldWeightGrams) return
    const nextRecords = [
      {
        id: crypto.randomUUID(),
        date: form.date || today,
        weight: numericInputs.goldWeightGrams,
        density: result.density,
        karat: result.estimatedKarat,
        total: result.finalTotalPrice,
      },
      ...recentRecords,
    ].slice(0, 5)

    setRecentRecords(nextRecords)
    localStorage.setItem('dore-gold-recent-calculations', JSON.stringify(nextRecords))
  }

  const copySummary = async () => {
    if (!result || !numericInputs.goldWeightGrams || !numericInputs.weightDifference) return

    const summary = [
      labels.title,
      `${labels.date}: ${form.date || today}`,
      `${labels.buyerShort}: ${form.buyerName || 'N/A'}`,
      `${labels.sellerShort}: ${form.sellerName || 'N/A'}`,
      `${labels.locationShort}: ${form.location || 'N/A'}`,
      `${labels.weightSummary}: ${formatNumber(numericInputs.goldWeightGrams)} g`,
      `${labels.differenceSummary}: ${formatNumber(numericInputs.weightDifference)} g`,
      `${labels.density}: ${formatNumber(result.density)} g/cm3`,
      `${labels.karat}: ${formatNumber(result.estimatedKarat)}K`,
      `${labels.spotSummary}: ${currencyFormatter.format(numericInputs.goldSpotPricePerOz ?? 0)} / ozt`,
      `${labels.price24k}: ${currencyFormatter.format(result.spotPricePerGram24k)}`,
      `${labels.gross}: ${currencyFormatter.format(result.grossPricePerGram)}`,
      `${labels.feeSummary}: ${currencyFormatter.format(numericInputs.handlingFeePerGram)}`,
      `${labels.net}: ${currencyFormatter.format(result.netUnitPricePerGram)}`,
      `${labels.total}: ${currencyFormatter.format(result.finalTotalPrice)}`,
      `${labels.notes}: ${form.notes || 'N/A'}`,
    ].join('\n')

    await navigator.clipboard.writeText(summary)
    setCopyStatus(labels.copied)
    window.setTimeout(() => setCopyStatus(''), 2400)
  }

  const summaryRows = result
    ? [
        [labels.weightSummary, `${formatNumber(numericInputs.goldWeightGrams ?? 0)} g`],
        [labels.differenceSummary, `${formatNumber(numericInputs.weightDifference ?? 0)} g`],
        [labels.density, `${formatNumber(result.density)} g/cm3`],
        [labels.karat, `${formatNumber(result.estimatedKarat)}K`],
        [labels.spotSummary, currencyFormatter.format(numericInputs.goldSpotPricePerOz ?? 0)],
        [labels.price24k, currencyFormatter.format(result.spotPricePerGram24k)],
        [labels.gross, currencyFormatter.format(result.grossPricePerGram)],
        [labels.feeSummary, currencyFormatter.format(numericInputs.handlingFeePerGram)],
        [labels.net, currencyFormatter.format(result.netUnitPricePerGram)],
        [labels.total, currencyFormatter.format(result.finalTotalPrice)],
      ]
    : []

  return (
    <main className="min-h-screen bg-[#f4f2ed] text-stone-900">
      <section className="no-print border-b border-stone-300 bg-[#17211c] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">{labels.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-200">{labels.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setLanguage((current) => (current === 'zh' ? 'en' : 'zh'))}
              className="inline-flex items-center gap-2 rounded-md border border-stone-500 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              <Languages className="h-4 w-4" />
              {labels.language}
            </button>
            <button
              type="button"
              onClick={copySummary}
              disabled={!result}
              className="inline-flex items-center gap-2 rounded-md border border-stone-500 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ClipboardCopy className="h-4 w-4" />
              {labels.copy}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              disabled={!result}
              className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Printer className="h-4 w-4" />
              {labels.print}
            </button>
          </div>
        </div>
      </section>

      <div className="print-report mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[420px_1fr] lg:px-8">
        <aside className="no-print rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
            <div className="rounded-md bg-amber-100 p-2 text-amber-800">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{labels.fieldInputs}</h2>
              <p className="text-sm text-stone-600">{labels.fieldHelp}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <Input label={labels.weight} value={form.goldWeightGrams} onChange={(value) => updateForm('goldWeightGrams', value)} />
            <Input label={labels.difference} value={form.weightDifference} onChange={(value) => updateForm('weightDifference', value)} />
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-semibold text-stone-700" htmlFor="spot-price">
                  {labels.spot}
                </label>
                <button
                  type="button"
                  onClick={handleApiPrice}
                  className="inline-flex items-center gap-1 rounded-md border border-stone-300 px-2 py-1 text-xs font-semibold text-stone-700 hover:bg-white"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  API
                </button>
              </div>
              <input
                id="spot-price"
                type="number"
                min="0"
                step="0.01"
                value={form.goldSpotPricePerOz}
                onChange={(event) => updateForm('goldSpotPricePerOz', event.target.value)}
                className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none ring-amber-500 focus:ring-2"
              />
              <p className="mt-2 text-xs text-stone-500">{apiStatus}</p>
            </div>
            <Input label={labels.fee} value={form.handlingFeePerGram} onChange={(value) => updateForm('handlingFeePerGram', value)} />
          </div>

          <div className="mt-6 border-t border-stone-200 pt-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-stone-500">
              {labels.reportDetails}
            </h3>
            <div className="mt-4 grid gap-4">
              <Input label={labels.buyer} value={form.buyerName} onChange={(value) => updateForm('buyerName', value)} text />
              <Input label={labels.seller} value={form.sellerName} onChange={(value) => updateForm('sellerName', value)} text />
              <Input label={labels.location} value={form.location} onChange={(value) => updateForm('location', value)} text />
              <Input label={labels.date} value={form.date} onChange={(value) => updateForm('date', value)} type="date" />
              <label className="grid gap-2 text-sm font-semibold text-stone-700">
                {labels.notes}
                <textarea
                  value={form.notes}
                  onChange={(event) => updateForm('notes', event.target.value)}
                  rows={4}
                  className="rounded-md border border-stone-300 px-3 py-2 text-sm font-normal outline-none ring-amber-500 focus:ring-2"
                />
              </label>
            </div>
          </div>

          {validationErrors.length > 0 && (
            <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {validationErrors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={saveRecentRecord}
            disabled={!result}
            className="mt-5 w-full rounded-md bg-[#17211c] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#26342d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {labels.save}
          </button>
          {copyStatus && <p className="mt-3 text-sm font-medium text-emerald-700">{copyStatus}</p>}
        </aside>

        <section className="grid gap-6">
          <div className="pdf-report grid gap-6 bg-white">
            <article className="report-section rounded-lg border border-stone-300 bg-white p-5 shadow-sm print-break-inside">
            <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
                  {labels.formalReport}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">{labels.transactionSummary}</h2>
              </div>
              <div className="grid gap-1 text-sm text-stone-600 sm:text-right">
                <span>{labels.buyerShort}: {form.buyerName || '________________'}</span>
                <span>{labels.sellerShort}: {form.sellerName || '________________'}</span>
                <span>{labels.locationShort}: {form.location || '________________'}</span>
                <span>{labels.date}: {form.date || today}</span>
              </div>
            </div>

            {result ? (
              <div className="summary-grid mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {summaryRows.map(([label, value]) => (
                  <div key={label} className="summary-tile rounded-md border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">{label}</p>
                    <p className="mt-2 text-xl font-semibold text-stone-950">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                {labels.invalid}
              </div>
            )}

            <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              {labels.disclaimerShort}
            </div>

            <div className="mt-8 hidden grid-cols-3 gap-8 pt-4 text-sm print:grid">
              <div className="border-t border-stone-500 pt-2">{labels.preparedBy}</div>
              <div className="border-t border-stone-500 pt-2">{labels.date}</div>
              <div className="border-t border-stone-500 pt-2">{labels.signature}</div>
            </div>
            </article>

            {result && (
              <article className="report-section rounded-lg border border-stone-300 bg-white p-5 shadow-sm print-break-inside">
                <h2 className="text-xl font-semibold">{labels.proof}</h2>
                <div className="proof-grid mt-4 grid gap-3 text-sm leading-6 text-stone-700">
                  <Formula title="1. Density formula" text={`Calculated density = weight / weight difference = ${formatNumber(numericInputs.goldWeightGrams ?? 0)} / ${formatNumber(numericInputs.weightDifference ?? 0)} = ${formatNumber(result.density)} g/cm3`} />
                  <Formula title="2. Karat lookup method" text={`Estimated karat is selected from the density-to-karat reference table. ${result.karatMethod} Estimated karat = ${formatNumber(result.estimatedKarat)}K.`} />
                  <Formula title="3. Spot price per gram formula" text={`24K price per gram = gold spot price per oz / 31.1035 = ${currencyFormatter.format(numericInputs.goldSpotPricePerOz ?? 0)} / 31.1035 = ${currencyFormatter.format(result.spotPricePerGram24k)}`} />
                  <Formula title="4. Purity adjustment formula" text={`Gross price per gram = 24K price per gram x estimated karat / 24 = ${currencyFormatter.format(result.spotPricePerGram24k)} x ${formatNumber(result.estimatedKarat)} / 24 = ${currencyFormatter.format(result.grossPricePerGram)}`} />
                  <Formula title="5. Fee deduction formula" text={`Net unit price = gross price per gram - handling fee per gram = ${currencyFormatter.format(result.grossPricePerGram)} - ${currencyFormatter.format(numericInputs.handlingFeePerGram)} = ${currencyFormatter.format(result.netUnitPricePerGram)}`} />
                  <Formula title="6. Final total formula" text={`Final total = net unit price x total weight = ${currencyFormatter.format(result.netUnitPricePerGram)} x ${formatNumber(numericInputs.goldWeightGrams ?? 0)} g = ${currencyFormatter.format(result.finalTotalPrice)}`} />
                </div>
              </article>
            )}
          </div>

          <article className="no-print rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{labels.chart}</h2>
              <p className="mt-1 text-sm text-stone-600">{labels.chartHelp}</p>
            </div>
            <TradingViewGoldChart language={language} />
          </article>

          <article className="no-print rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">{labels.reference}</h2>
                <p className="mt-1 text-sm text-stone-600">{labels.referenceHelp}</p>
              </div>
              <p className="text-sm text-stone-500">{densityKaratTable.length} {labels.rows}</p>
            </div>
            <div className="mt-4 max-h-80 overflow-auto rounded-md border border-stone-200">
              <table className="min-w-full divide-y divide-stone-200 text-left text-sm">
                <thead className="sticky top-0 bg-stone-100 text-xs uppercase tracking-[0.1em] text-stone-600">
                  <tr>
                    <th className="px-3 py-3 font-semibold">{labels.minDensity}</th>
                    <th className="px-3 py-3 font-semibold">{labels.maxDensity}</th>
                    <th className="px-3 py-3 font-semibold">{labels.karat}</th>
                    <th className="px-3 py-3 font-semibold">{labels.section}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {densityKaratTable.map((row) => (
                    <tr key={`${row.densityMin}-${row.densityMax}-${row.karat}`}>
                      <td className="px-3 py-2">{formatNumber(row.densityMin)}</td>
                      <td className="px-3 py-2">{formatNumber(row.densityMax)}</td>
                      <td className="px-3 py-2">{formatNumber(row.karat)}K</td>
                      <td className="px-3 py-2 text-stone-600">{row.chartSection}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          {recentRecords.length > 0 && (
            <article className="no-print rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold">{labels.recent}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {recentRecords.map((record) => (
                  <div key={record.id} className="rounded-md border border-stone-200 p-3 text-sm">
                    <p className="font-semibold">{record.date}</p>
                    <p className="mt-1 text-stone-600">{formatNumber(record.weight)} g</p>
                    <p className="text-stone-600">{formatNumber(record.density)} g/cm3</p>
                    <p className="text-stone-600">{formatNumber(record.karat)}K</p>
                    <p className="mt-2 font-semibold">{currencyFormatter.format(record.total)}</p>
                  </div>
                ))}
              </div>
            </article>
          )}

          <footer className="no-print rounded-lg border border-stone-300 bg-white p-5 text-sm leading-6 text-stone-700 shadow-sm">
            {labels.bottomDisclaimer}
          </footer>
        </section>
      </div>
    </main>
  )
}

function TradingViewGoldChart({ language }: { language: Language }) {
  const params = new URLSearchParams({
    autosize: '1',
    symbol: 'OANDA:XAUUSD',
    interval: '240',
    timezone: 'Etc/UTC',
    theme: 'light',
    style: '1',
    locale: language === 'zh' ? 'zh_CN' : 'en',
    enable_publishing: 'false',
    hide_top_toolbar: 'false',
    hide_legend: 'false',
    save_image: 'false',
    calendar: 'false',
    support_host: 'https://www.tradingview.com',
  })

  return (
    <iframe
      key={language}
      title="TradingView XAU/USD 4H chart"
      src={`https://s.tradingview.com/widgetembed/?${params.toString()}`}
      className="h-[420px] w-full rounded-md border border-stone-200"
      allowFullScreen
    />
  )
}

function Input({
  label,
  value,
  onChange,
  text = false,
  type,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  text?: boolean
  type?: string
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-stone-700">
      {label}
      <input
        type={type ?? (text ? 'text' : 'number')}
        min={text || type === 'date' ? undefined : '0'}
        step={text || type === 'date' ? undefined : '0.01'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-stone-300 px-3 py-2 text-sm font-normal outline-none ring-amber-500 focus:ring-2"
      />
    </label>
  )
}

function Formula({ title, text }: { title: string; text: string }) {
  return (
    <div className="formula-card rounded-md border border-stone-200 bg-stone-50 p-4">
      <p className="font-semibold text-stone-950">{title}</p>
      <p className="mt-1">{text}</p>
    </div>
  )
}

export default App
