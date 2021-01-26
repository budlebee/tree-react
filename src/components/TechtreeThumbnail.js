import React from 'react'
import * as d3 from 'd3'
import { Link } from 'react-router-dom'
import { colorPalette } from '../lib/styleGuide'
import styled from 'styled-components'

const TechtreeThumbnailBlock = styled.div`
  border-radius: 10px;
  border: 1px solid ${colorPalette.cyan5};
`
const TechtreeThumbnailCard = styled.div`
  border-radius: 10px;
  border: 1px solid ${colorPalette.cyan5};
`

export default React.memo(function TechtreeThumbnail({
  nodeList,
  linkList,
  techtreeTitle,
  techtreeID,
}) {
  const containerRef = React.useRef(null)

  React.useEffect(() => {
    if (containerRef.current) {
      runForceGraph(containerRef.current, nodeList, linkList)
    }
  }, [])

  return (
    <Link to={`/techtree/${techtreeID}`}>
      <TechtreeThumbnailCard>
        <TechtreeThumbnailBlock ref={containerRef} />
        <div>{techtreeTitle}</div>
      </TechtreeThumbnailCard>
    </Link>
  )
})

function runForceGraph(container, originalNodeList, originalLinkList) {
  // 데이터 저장 원칙 : navbar 높이때문에 Y좌표는 보정이 필요함.
  // 하지만 보정을 가한 좌표를 저장하지 않는다. 순수한 좌표를 저장해야함.
  // 그 좌표에 대해 렌더링하는 시점에만 보정을 가한다.
  // 그래야지 navbar 높이가 변해도 문제없이 렌더링 할 수 있음.

  const nodeRadius = 15
  const navbarHeight = 85
  const linkWidth = '2.5px'
  const linkColor = '#000000'

  const width = `inherit`
  const height = `inherit`

  let nodeList = originalNodeList
  let linkList = originalLinkList

  const svg = d3
    .select(container)
    .append('svg')
    .attr('height', height)
    .attr('width', width)

  // 화살표 마커
  svg
    .append('svg:defs')
    .append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', nodeRadius * 1.3)
    .attr('markerWidth', 6)
    .attr('markerHeight', nodeRadius * 1.5)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#000')

  const linkGroup = svg.append('g').attr('class', 'links')
  const nodeGroup = svg.append('g').attr('class', 'nodes')
  const labelGroup = svg.append('g').attr('class', 'labels')

  linkGroup
    .selectAll('line')
    .data(linkList)
    .join('line')
    .attr('x1', (d) => d.startX)
    .attr('y1', (d) => d.startY)
    .attr('x2', (d) => d.endX)
    .attr('y2', (d) => d.endY)
    .attr('class', (d) => d.id)
    .style('stroke', linkColor)
    .style('stroke-width', linkWidth)
    .attr('marker-end', 'url(#end-arrow)')

  nodeGroup
    .selectAll('circle')
    .data(nodeList)
    .join('circle')
    .attr('r', (d) => d.radius)
    .style('fill', (d) => d.fillColor)
    .attr('cx', (d) => {
      return d.x
    })
    .attr('cy', (d) => {
      return d.y
    })
    .attr('class', (d) => {
      return d.id
    })

  labelGroup
    .selectAll('text')
    .data(nodeList)
    .join('text')
    .attr('x', (d) => {
      return d.x
    })
    .attr('y', (d) => {
      return d.y - navbarHeight + nodeRadius * 2
    })
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('class', (d) => d.id)
    .text((d) => {
      return d.name
    })
    .style('user-select', 'none')
    .style('background-color', '#ffffff')

  return {
    nodes: () => {
      return svg.node()
    },
  }
}
