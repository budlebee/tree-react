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
  deleteLink,
  editTechtree,
  finishTechtreeEdit,
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

  // 그래프 수정 버튼
  svg
    .append('g:graphEditButton')
    .append('rect')
    .attr('width', 10)
    .attr('height', 10)
    .attr('x', width / 2 - 10)
    .attr('y', 10)
    .style('fill', 'red')
    .attr('display', 'inline')

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
  const absoluteXPosition = relativeLeft

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

  let editMode = false

  reduxStore.subscribe(updateNode)
  //reduxStore.subscribe(updateLink)
  // 리덕스 스토어가 갱신될때마다 node랑 link 둘다 업데이트하면 무한호출로 에러발생.

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

  // 그래프 수정 토글
  svg
    .append('g')
    .append('rect')
    .attr('width', 10)
    .attr('height', 10)
    .attr('x', width - 10)
    .attr('y', 10)
    .style('fill', 'red')
    .attr('display', 'inline')
    .on('click', () => {
      if (reduxStore.getState().techtree.isEditingTechtree) {
        reduxStore.dispatch(finishTechtreeEdit())
      } else {
        reduxStore.dispatch(editTechtree())
      }
      initNode()
      initLink()
      initLabel()
    })

  const linkGroup = svg.select('.links')
  const nodeGroup = svg.select('.nodes')
  const labelGroup = svg.select('.labels')
  const deleteButtonLength = 10

  function initLink() {
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

    // 링크 삭제버튼
    linkGroup
      .selectAll('rect')
      .data(linkList)
      .join('rect')
      .attr('width', deleteButtonLength)
      .attr('height', deleteButtonLength)
      .style('fill', 'red')
      .attr('x', (link) => {
        return (link.startX + link.endX) / 2
      })
      .attr('y', (link) => {
        return (link.startY + link.endY) / 2
      })
      .attr('class', (d) => {
        return `delete${d.id}`
      })
      .attr('display', () => {
        if (reduxStore.getState().techtree.isEditingTechtree) {
          return 'inline'
        } else {
          return 'none'
        }
      })
      .on('click', (link) => {
        const deleteOK = window.confirm('정말 연결을 삭제하시나요?')
        if (deleteOK) {
          dispatch(deleteLink(linkList, link))
        } else {
          return
        }
      })
      .style('cursor', 'pointer')
  }

  // 노드 생성
  function initNode() {
    const nodes = nodeGroup.selectAll('circle').data(nodeList).join('circle')

    nodeGroup
      .selectAll('circle')
      .data(nodeList)
      .join('circle')
      .attr('r', (d) => d.radius)
      .style('fill', (d) => d.fillColor)
      .style('stroke', (d) => {
        if (d.id === reduxStore.getState().techtree.selectedNode.id) {
          return 'red'
        } else {
          return
        }
      })
      .attr('cx', (d) => {
        return d.x
      })
      .attr('cy', (d) => {
        return d.y
      })
      .attr('class', (d) => {
        return d.id
      })
      .on('click', (d) => {
        const previousNodeList = returnPreviousNodeList(linkList, nodeList, d)
        const nextNodeList = returnNextNodeList(linkList, nodeList, d)
        dispatch(selectNode(previousNodeList, nextNodeList, d))
      })
      .style('cursor', 'pointer')
      .on('mousedown', (d) => {
        svg
          .select('g')
          .select('.tempLine')
          .attr('x1', d.x)
          .attr('y1', d.y)
          .style('opacity', '1')
          .attr('display', 'inline')
        tempPairingNodes.startNodeID = d.id
        tempPairingNodes.startX = d.x
        tempPairingNodes.startY = d.y
      })
      .on('mouseup', (d) => {
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
          d3.select('.tempLine').attr('x1') > 0 &&
          d3.select('.tempLine').attr('y1') > 0
        ) {
          tempPairingNodes.id = `link${uid(20)}`
          linkList.push({ ...tempPairingNodes })
          updateLink()
          console.log('노드끼리 연결됨:', tempPairingNodes)
        }
        svg.select('g').select('.tempLine').attr('x1', 0).attr('y1', 0)
        tempPairingNodes = {}
      })

    /*
      .call(
        d3
          .drag()
          .on('start', (d) => {
            d3.select(this).raise().classed('active', true)
          })
          .on('drag', (node) => {
            const newLinkList = linkList.map((link) => {
              if (link.startNodeID === node.id) {
                return { ...link, startX: d3.event.x, startY: d3.event.y }
              } else if (link.endNodeID === node.id) {
                return { ...link, endX: d3.event.x, endY: d3.event.y }
              } else {
                return link
              }
            })
            linkList = newLinkList
            initLink()
            d3.select(this).attr('cx', d3.event.x).attr('cy', d3.event.y)
            node.x = d3.event.x
            node.y = d3.event.y
            initNode()
            initLabel()
          })
          .on('end', function (node) {
            d3.select(this).classed('active', false)
            node.x = d3.event.x
            node.y = d3.event.y
            updateNode()
            updateLink()
          })
      )
      */

    // 노드 삭제용 버튼 만들기
    nodeGroup
      .selectAll('rect')
      .data(nodeList)
      .join('rect')
      .attr('width', deleteButtonLength)
      .attr('height', deleteButtonLength)
      .style('fill', (d) => d.fillColor)
      .attr('x', (d) => {
        return d.x - d.radius * 1.5
      })
      .attr('y', (d) => {
        return d.y - d.radius * 1.5
      })
      .attr('class', (d) => {
        return d.id
      })
      .attr('display', () => {
        if (reduxStore.getState().techtree.isEditingTechtree) {
          return 'inline'
        } else {
          return 'none'
        }
      })
      .on('click', (d) => {
        const deleteOK = window.confirm(`${d.name} 노드를 삭제하시나요?`)
        if (deleteOK) {
          dispatch(deleteNode(nodeList, linkList, d))
        } else {
          return
        }
      })
      .style('cursor', 'pointer')
  }

  function initLabel() {
    labelGroup
      .selectAll('text')
      .data(nodeList)
      .join('text')
      .attr('x', (d) => {
        return d.x
      })
      .attr('y', (d) => {
        return d.y + nodeRadius * 2
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
  }

  svg
    .on('dblclick', () => {
      const createdNode = {
        id: `node${uid(20)}`,
        name: '새로운 노드',
        x: d3.event.pageX - absoluteXPosition,
        y: d3.event.pageY - absoluteYPosition,
        radius: nodeRadius,
        body: '새로운 내용',
        hashtags: [],
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
        .attr('x2', d3.event.pageX - absoluteXPosition)
        .attr('y2', d3.event.pageY - absoluteYPosition)
    })
    .on('mouseup', (d) => {
      svg.select('.tempLine').style('opacity', '0')
    })

  console.log('그래프가 업데이트됨.')

  initLink()
  initNode()
  initLabel()

  function updateNode() {
    initNode()
    initLabel()
    console.log('노드가 갱신됨.')
  }

  function updateLink() {
    initLink()
    reduxStore.dispatch(createLink(linkList))
    tempPairingNodes = {}
    console.log('링크가 갱신됨')
  }
}
