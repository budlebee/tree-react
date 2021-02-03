import React from 'react'
import * as d3 from 'd3'
import { uid } from 'uid'

import { colorPalette } from '../lib/styleGuide'
import styled from 'styled-components'

import { returnPreviousNodeList, returnNextNodeList } from '../lib/functions'
import {
  selectNode,
  createNode,
  createLink,
  deleteNode,
} from '../redux/techtree'
import { useDispatch, useSelector } from 'react-redux'
import { reduxStore } from '../index'

const TechtreeThumbnailBlock = styled.div`
  border-radius: 10px;
  border: 1px solid ${colorPalette.cyan4};
`

export default React.memo(function TechtreeMap({
  techtreeTitle,
  techtreeID,
  testingSetter,
}) {
  const dispatch = useDispatch()
  const containerRef = React.useRef(null)

  const selectedNode = useSelector((state) => state.techtree.selectedNode)
  const nodeList = useSelector((state) => state.techtree.nodeList)
  const linkList = useSelector((state) => state.techtree.linkList)

  React.useEffect(() => {
    if (containerRef.current) {
      console.log('컨테이너레프:', containerRef)

      initGraph(containerRef.current, nodeList, linkList, testingSetter)
      console.log('그래프 생성')
    }
  }, [])
  React.useEffect(() => {
    updateGraph(
      containerRef.current,

      testingSetter,
      dispatch
    )
    console.log('useEffect를 통한 updateGraph 가 호출됨.')
  }, [containerRef, nodeList, linkList, dispatch])

  return (
    <>
      <div>{techtreeTitle}</div>
      <TechtreeThumbnailBlock ref={containerRef} />
    </>
  )
})

function initGraph(
  container,
  originalNodeList,
  originalLinkList,
  testingSetter
) {
  // 데이터 저장 원칙 : navbar 높이때문에 Y좌표는 보정이 필요함.
  // 하지만 보정을 가한 좌표를 저장하지 않는다. 순수한 좌표를 저장해야함.
  // 그 좌표에 대해 렌더링하는 시점에만 보정을 가한다.
  // 그래야지 navbar 높이가 변해도 문제없이 렌더링 할 수 있음.

  const nodeRadius = 15
  const navbarHeight = 85
  const linkWidth = '2.5px'
  const linkColor = '#000000'

  const width = 600
  const height = 600

  let nodeList = originalNodeList
  let linkList = originalLinkList

  const svg = d3
    .select(container)
    .append('svg')
    .attr('id', 'techtreeContainer')
    .attr('width', width)
    .attr('height', height)

  // 마우스 드래그할때 나타나는 임시 라인 만들어두기.
  svg
    .append('g')
    .append('line')
    .attr('class', 'tempLine')
    .style('stroke', linkColor)
    .style('stroke-width', linkWidth)
    .attr('marker-end', 'url(#end-arrow)')
    .style('opacity', '0')
    .attr('display', 'none')

  const linkGroup = svg.append('g').attr('class', 'links')
  const nodeGroup = svg.append('g').attr('class', 'nodes')
  const labelGroup = svg.append('g').attr('class', 'labels')

  const offsetElement = document.getElementById('techtreeContainer')
  console.log(':', offsetElement)
  const clientRect = offsetElement.getBoundingClientRect()
  const relativeTop = clientRect.top
  const scrolledTopLength = window.pageYOffset
  const absoluteYPosition = scrolledTopLength + relativeTop
  console.log('절대 y좌표: ', absoluteYPosition)
}

// 그래프가 갱신될때 호출되는 함수
function updateGraph(container, testingSetter, dispatch) {
  const nodeRadius = 15
  const navbarHeight = 0
  const linkWidth = '2.5px'
  const linkColor = '#000000'

  const width = 600
  const height = 600

  const offsetElement = document.getElementById('techtreeContainer')
  const clientRect = offsetElement.getBoundingClientRect()
  const relativeTop = clientRect.top
  const relativeLeft = clientRect.left
  const scrolledTopLength = window.pageYOffset
  const absoluteYPosition = scrolledTopLength + relativeTop
  const absoluteXPostion = relativeLeft

  let nodeList = reduxStore.getState().techtree.nodeList
  let linkList = reduxStore.getState().techtree.linkList
  let tempPairingNodes = {
    startNodeID: null,
    startX: null,
    startY: null,
    endNodeID: null,
    id: null,
    endX: null,
    endY: null,
  }

  reduxStore.subscribe(updateNode)

  const svg = d3.select(container).select('svg')

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

  const linkGroup = svg.select('.links')
  const nodeGroup = svg.select('.nodes')
  const labelGroup = svg.select('.labels')

  linkGroup
    .selectAll('line')
    .data(linkList)
    .join('line')
    .attr('x1', (d) => d.startX - absoluteXPostion)
    .attr('y1', (d) => d.startY - absoluteYPosition)
    .attr('x2', (d) => d.endX - absoluteXPostion)
    .attr('y2', (d) => d.endY - absoluteYPosition)
    .attr('class', (d) => d.id)
    .style('stroke', linkColor)
    .style('stroke-width', linkWidth)
    .attr('marker-end', 'url(#end-arrow)')

  // 노드 생성
  nodeGroup
    .selectAll('circle')
    .data(nodeList)
    .join('circle')
    .attr('r', (d) => d.radius)
    .style('fill', (d) => d.fillColor)
    .attr('cx', (d) => {
      return d.x - absoluteXPostion
    })
    .attr('cy', (d) => {
      return d.y - absoluteYPosition
    })
    .attr('class', (d) => {
      return d.id
    })
    .on('click', (d) => {
      const previousNodeList = returnPreviousNodeList(linkList, nodeList, d)
      const nextNodeList = returnNextNodeList(linkList, nodeList, d)
      dispatch(selectNode(previousNodeList, nextNodeList, d))
    })
    .on('mousedown', (d) => {
      // 여기서 분기처리해야될듯.
      svg
        .select('g')
        .select('.tempLine')
        .attr('x1', d.x - absoluteXPostion)
        .attr('y1', d.y - absoluteYPosition)
        .style('opacity', '1')
        .attr('display', 'inline')
      tempPairingNodes.startNodeID = d.id
      tempPairingNodes.startX = d.x
      tempPairingNodes.startY = d.y
      console.log('노드에서 마우스 다운중:')
    })
    .on('mouseup', (d) => {
      console.log('이 노드에서 마우스 업이 수행됨:', d)

      tempPairingNodes.endNodeID = d.id
      tempPairingNodes.endX = d.x
      tempPairingNodes.endY = d.y
      // 연결된 노드를 데이터에 반영
      if (
        tempPairingNodes.startNodeID !== tempPairingNodes.endNodeID &&
        tempPairingNodes.startX !== tempPairingNodes.endX &&
        tempPairingNodes.startY !== tempPairingNodes.endY &&
        !linkList.find(
          (element) =>
            element.startNodeID === tempPairingNodes.startNodeID &&
            element.endNodeID === tempPairingNodes.endNodeID
        ) &&
        d3.select('.tempLine').attr('x1') > 0
      ) {
        tempPairingNodes.id = `link${uid(20)}`
        linkList.push({ ...tempPairingNodes })
        updateLink()
        console.log('노드끼리 연결됨:', tempPairingNodes)
      }
      // 데이터에 반영됐으면 임시 페어링을 초기화.
      tempPairingNodes = {}
    })
    .style('cursor', 'pointer')

  // 노드 삭제용 버튼 만들기
  nodeGroup
    .selectAll('rect')
    .data(nodeList)
    .join('rect')
    .attr('width', (d) => d.radius)
    .attr('height', (d) => d.radius)
    .style('fill', (d) => d.fillColor)
    .attr('x', (d) => {
      return d.x - absoluteXPostion
    })
    .attr('y', (d) => {
      return d.y - absoluteYPosition - nodeRadius * 2
    })
    .attr('class', (d) => {
      return d.id
    })
    .on('click', (d) => {
      dispatch(deleteNode(nodeList, linkList, d))
    })
    .style('cursor', 'pointer')

  labelGroup
    .selectAll('text')
    .data(nodeList)
    .join('text')
    .attr('x', (d) => {
      return d.x - absoluteXPostion
    })
    .attr('y', (d) => {
      return d.y - absoluteYPosition + nodeRadius * 2
    })
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('class', (d) => d.id)
    .text((d) => {
      return d.name
    })
    .style('user-select', 'none')
    .style(
      'text-shadow',
      '-3px 0 #F2F1F6, 0 3px #F2F1F6, 3px 0 #F2F1F6, 0 -3px #F2F1F6'
    )

  svg
    .on('dblclick', () => {
      const createdNode = {
        id: `node${uid(20)}`,
        name: '새로운 노드',
        x: d3.event.pageX,
        y: d3.event.pageY,
        radius: nodeRadius,
        body: '새로운 내용',
        tag: '프론트엔드',
        fillColor: '#00bebe',
        parentNodeID: [],
        childNodeID: [],
      }
      nodeList = [...nodeList, createdNode]
      reduxStore.dispatch(createNode(nodeList))
      updateNode()
    })
    .on('mousemove', (d) => {
      svg
        .select('g')
        .select('.tempLine')
        .attr('x2', d3.event.pageX - absoluteXPostion)
        .attr('y2', d3.event.pageY - absoluteYPosition)
      //console.log(':', svg.select('g').select('.tempLine'))
      // console.log('마우스 움직이는 중. x2,y2:', d3.event.pageX, d3.event.pageY)
    })
    .on('mouseup', (d) => {
      svg.select('.tempLine').style('opacity', '0')
    })

  function updateNode() {
    nodeGroup
      .selectAll('circle')
      .data(nodeList)
      .join('circle')
      .attr('r', (d) => {
        return d.radius
      })
      //.style('stroke', selectedNodeHighlightColor)
      .style('fill', (d) => d.fillColor)
      .attr('cx', (d) => {
        return d.x - absoluteXPostion
      })
      .attr('cy', (d) => {
        return d.y - absoluteYPosition
      })
      .attr('class', (d) => {
        return d.id
      })
      .on('click', (d) => {
        const previousNodeList = returnPreviousNodeList(linkList, nodeList, d)
        const nextNodeList = returnNextNodeList(linkList, nodeList, d)

        dispatch(selectNode(previousNodeList, nextNodeList, d))
      })
      .on('mousedown', (d) => {
        svg
          .select('g')
          .select('.tempLine')
          .attr('x1', d.x - absoluteXPostion)
          .attr('y1', d.y - absoluteYPosition)
          .style('opacity', '1')

        tempPairingNodes.startNodeID = d.id
        tempPairingNodes.startX = d.x
        tempPairingNodes.startY = d.y
        console.log('노드에서 마우스 다운중:')
      })
      .on('mouseup', (d) => {
        console.log('이 노드에서 마우스 업이 수행됨:', d)
        tempPairingNodes.endNodeID = d.id
        tempPairingNodes.endX = d.x
        tempPairingNodes.endY = d.y
        // 연결된 노드를 데이터에 반영
        if (
          tempPairingNodes.startNodeID !== tempPairingNodes.endNodeID &&
          tempPairingNodes.startX !== tempPairingNodes.endX &&
          tempPairingNodes.startY !== tempPairingNodes.endY &&
          !linkList.find(
            (element) =>
              element.startNodeID === tempPairingNodes.startNodeID &&
              element.endNodeID === tempPairingNodes.endNodeID
          ) &&
          d3.select('.tempLine').attr('x1') > 0
        ) {
          tempPairingNodes.id = `link${uid(20)}`
          linkList.push({ ...tempPairingNodes })
          updateLink()
          //setTimeout(linkList.push({ ...tempPairingNodes }), 0)
          console.log('노드끼리 연결됨:', tempPairingNodes)
        }

        // 데이터에 반영됐으면 임시 페어링을 초기화.
        tempPairingNodes = {}
        //console.log('노드 페어링 초기화:', tempPairingNodes)
        //console.log(':', linkList)
      })
      .style('cursor', 'pointer')

    labelGroup
      .selectAll('text')
      .data(nodeList)
      .join('text')
      .attr('x', (d) => {
        return d.x - absoluteXPostion
      })
      .attr('y', (d) => {
        return d.y - absoluteYPosition + nodeRadius * 2
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('class', (d) => d.id)
      .text((d) => {
        return d.name
      })
      .style(
        'text-shadow',
        '-3px 0 #F2F1F6, 0 3px #F2F1F6, 3px 0 #F2F1F6, 0 -3px #F2F1F6'
      )
      .style('user-select', 'none')
    console.log('노드가 갱신됨.')
  }
  function updateLink() {
    linkGroup
      .selectAll('line')
      .data(linkList)
      .join('line')
      .attr('x1', (d) => d.startX - absoluteXPostion)
      .attr('y1', (d) => d.startY - absoluteYPosition)
      .attr('x2', (d) => d.endX - absoluteXPostion)
      .attr('y2', (d) => d.endY - absoluteYPosition)
      .attr('class', (d) => d.id)
      .style('stroke', linkColor)
      .style('stroke-width', linkWidth)
      .attr('marker-end', 'url(#end-arrow)')
    reduxStore.dispatch(createLink(linkList))
    console.log('링크가 갱신됨')
  }

  console.log('그래프가 업데이트됨.')
}
