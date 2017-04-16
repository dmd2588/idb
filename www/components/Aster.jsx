import React from 'react'
import D3Shape from 'd3-shape'
import D3Scale from 'd3-scale'
/**
 * Based off of Pie Component from React d3 library
 * https://github.com/react-d3/react-d3-shape
 */
 
const width = 960
const height = 500
const margins = {top: 0, right: 0, bottom: 0, left: 0}

const pieProps = {
  width: width,
  height: height,
  margins: margins,
  innerRadius: 0,
  categoricalColors: D3Scale.scaleCategory10(),
  pieSort: () => {},
  pieTextShow: true
}

export default class Aster extends React.Component {
  constructor (props) {
    super(props)
  }

  static defaultProps = {
    onMouseOver: (d) => {},
    onMouseOut: (d) => {},
    ...pieProps
  }

  triggerOver(data , e) {
    this.props.onMouseOver(e, data)
  }

  triggerOut(data, e) {
    this.props.onMouseOut(e, data)
  }

  mkSeries() {
    const {
      data,
      chartSeries,
      value,
      name,
      percent,
      categoricalColors
    } = this.props

    var chartSeriesData = chartSeries.map((f, i) => {
      // set a color if not set
      if(!f.color)
        f.color = categoricalColors(i)

      // set name if not set
      if(!f.name)
        f.name = f.field

      var val

      data.forEach((d) => {
        if(name(d) === f.field)
          val = d
      })
      return Object.assign(f, {value: value(val), percent: percent(val)})
    })

    return chartSeriesData
  }

  _mkPie () {
    var {
      width,
      height,
      innerRadius,
      outerRadius,
      pieSort,
      value,
      radius,
      pieTextShow
    } = this.props

    const that = this
    var radius = this.props.radius || Math.min(width - 100, height - 100) / 2
    var outerRadius = outerRadius || (radius - 10)
    var labelr = radius + 10

    var chartSeriesData = this.mkSeries()

    var arc_background = D3Shape.arc()
      .outerRadius(outerRadius + 3)
      .innerRadius(innerRadius)

    var pie = D3Shape.pie().padAngle(.0)
      .sort((a, b) => { return pieSort(a.value, b.value)})
      .value((d) => { return d.value })

    return (
      <g className="arc">
        {
          pie(chartSeriesData).map((slice, i) => {
            var arc_percent = D3Shape.arc()
              .outerRadius((outerRadius - innerRadius) * slice.data.percent + innerRadius)
              .innerRadius(innerRadius)

            var arc_percent_outer = D3Shape.arc()
              .outerRadius(outerRadius)
              .innerRadius((outerRadius - innerRadius) * slice.data.percent + innerRadius)

            var textTransform = (d) => {
              var c = arc.centroid(d),
                x = c[0],
                y = c[1],
                // pythagorean theorem for hypotenuse
                h = Math.sqrt( x * x + y * y)

              return "translate(" + (x / h * labelr) +  ',' +
                 (y / h * labelr) +  ")"
            }

            var textAnchor = (d) => {
              return (d.endAngle + d.startAngle)/2 > Math.PI ?
                "end" : "start"
            }

            return (
              <g key={i}>
                <path
                  d={arc_background(slice)}
                  style={{fill: '#000', stroke: '#000', ...slice.data.style}}
                  />
                <path
                  d={arc_percent_outer(slice)}
                  style={{fill: '#FFF', ...slice.data.style}}
                  />
                <path
                  d={arc_percent(slice)}
                  style={{fill: slice.data.color, ...slice.data.style}}
                  onMouseOut={that.triggerOut.bind(this, slice)}
                  onMouseOver={that.triggerOver.bind(this, slice)}
                  />
                {
                  pieTextShow? (
                    <text
                      transform={textTransform(slice)}
                      dy=".35em"
                      textAnchor={textAnchor(slice)}
                    >
                      {slice.data.name}
                    </text>
                  ): null
                }
              </g>
            )
          })
        }
      </g>
    )
  }

  render() {

    const{
      width,
      height,
      margins
    } = this.props

    var t = `translate(${(width - margins.left - margins.right) / 2},  ${(height - margins.top - margins.bottom) / 2})`
    var pie = this._mkPie()

    return (
      <svg
        height = {height}
        width = {width}
        ref = "svgContainer"
      >
        <g transform = {t}>
          {pie}
        </g>
      </svg>
    )
  }
}
