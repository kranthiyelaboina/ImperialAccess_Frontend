import React, { useEffect, useRef, useState } from 'react'

const DIGIT_HEIGHT = 80

const CounterDigitColumn: React.FC<{
  values: number[]
  className: string
  targetIndex: number
  animated: boolean
}> = ({ values, className, targetIndex, animated }) => (
  <div className={className}>
    <div style={{
      transform: animated ? `translateY(${-(targetIndex * DIGIT_HEIGHT)}px)` : 'translateY(0)',
      transition: animated ? 'transform 2s ease-out' : 'none',
    }}>
      {values.map((v, i) => (
        <div className="tb-digit" key={i}>{v}</div>
      ))}
    </div>
  </div>
)

/*
  Hackathon-appropriate stats:
  128-D   → Face Embedding Dimensions
  <200 ms → Avg Recognition Time
  99.7 %  → Model Accuracy
  15      → API Endpoints
*/
interface CounterDef {
  digits: { values: number[]; className: string }[]
  targets: number[]
  prefix?: string
  suffix: string
  label: string
  separatorChar?: string
  extraDigits?: number[]
  extraTarget?: number
  noBorder?: boolean
}

const counters: CounterDef[] = [
  {
    // 128-D
    digits: [
      { values: [0, 1], className: 'counter-numbers left' },
      { values: [0, 1, 2], className: 'counter-numbers right' },
      { values: [0, 1, 2, 3, 4, 5, 6, 7, 8], className: 'counter-numbers last' },
    ],
    targets: [1, 2, 8],
    suffix: '-D',
    label: 'Embedding<br/>Dimensions',
  },
  {
    // <200 ms
    prefix: '<',
    digits: [
      { values: [0, 1, 2], className: 'counter-numbers left' },
      { values: [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], className: 'counter-numbers right' },
      { values: [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], className: 'counter-numbers last' },
    ],
    targets: [2, 0, 0],
    suffix: 'ms',
    label: 'Avg Recognition<br/>Time',
  },
  {
    // 99.7%
    digits: [
      { values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], className: 'counter-numbers left' },
      { values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], className: 'counter-numbers right' },
    ],
    targets: [9, 9],
    separatorChar: '.',
    extraDigits: [0, 1, 2, 3, 4, 5, 6, 7],
    extraTarget: 7,
    suffix: '%',
    label: 'Model<br/>Accuracy',
  },
  {
    // 15
    digits: [
      { values: [0, 1], className: 'counter-numbers left' },
      { values: [0, 1, 2, 3, 4, 5], className: 'counter-numbers right' },
    ],
    targets: [1, 5],
    suffix: '',
    label: 'API<br/>Endpoints',
    noBorder: true,
  },
]

const StatsSection: React.FC = () => {
  const [animated, setAnimated] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimated(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="content-bg content-bg-home" id="Stats">
      <div className="content-section intro" ref={sectionRef}>
        <div className="content-wrapper w-container"></div>
        <div className="numbers">
          {counters.map((c, ci) => (
            <div className="number" key={ci} style={c.noBorder ? { border: 0 } : undefined}>
              <div className="counter-1">
                {c.prefix && <div className="sign-small m">{c.prefix}</div>}
                <div className="digits">
                  {c.digits.map((col, di) => (
                    <CounterDigitColumn key={di} values={col.values} className={col.className} targetIndex={animated ? c.targets[di] : 0} animated={animated} />
                  ))}
                  {c.separatorChar && (
                    <>
                      <div className="sign-small m">{c.separatorChar}</div>
                      <CounterDigitColumn values={c.extraDigits!} className="counter-numbers last" targetIndex={animated ? c.extraTarget! : 0} animated={animated} />
                    </>
                  )}
                </div>
                {c.suffix && <div className="sign-small m">{c.suffix}</div>}
              </div>
              <h5 className="h5 medium center" dangerouslySetInnerHTML={{ __html: c.label }} />
              <div className="divider-line show-only-mobile"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatsSection
