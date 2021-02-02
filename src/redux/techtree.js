import { dispatch } from 'd3'

const initialState = {
  previousNodeList: [{ name: '' }],
  nextNodeList: [{ name: '' }],
  selectedNode: {
    name: '지식트리를 꾸며보세요',
    body: '마크다운과 코드블럭, 사진첨부도 가능합니다',
  },
  isEditingDocument: false,
  isEditingTechtree: false,
  nodeList: [
    {
      id: 'asdfasdfasdfasdfasdfasdf',
      name: '첫번째 노드',
      x: 150,
      y: 150,
      radius: 15,
      body: '## 이것은 마크다운.\n실험용 첫번째 노드',
      tag: '프론트엔드',
      fillColor: '#91a7ff',
    },
    {
      id: 'bbdfasdfasdfasdfasdfasdf',
      name: '두번째 노드',
      x: 300,
      y: 300,
      radius: 15,
      body: 'x랑 y의 값은 둘다 300임. 두번째 노드임',
      tag: '백엔드',
      fillColor: '#339af0',
    },
  ],
  linkList: [
    {
      startNodeID: 'asdfasdfasdfasdfasdfasdf',
      endNodeID: 'bbdfasdfasdfasdfasdfasdf',
      startX: 150,
      startY: 150,
      endX: 300,
      endY: 300,
      id: 'ccdfasdfasdfasdfasdfasdf',
      left: false,
      right: true,
    },
  ],
  techtreeTitle: '',
  techtreeData: {
    title: 'empty',
    nodeList: [{}],
    linkList: [{}],
  },
}

// define ACTION types
const EDIT_DOCUMENT = 'techtree/EDIT_DOCUMENT'
const EDIT_TECHTREE = 'techtree/EDIT_TECHTREE'
const FINISH_DOCU_EDIT = 'techtree/FINISH_DOCU_EDIT'

const SELECT_NODE = 'techtree/SELECT_NODE'

const CREATE_NODE = 'techtree/CREATE_NODE'
const CREATE_LINK = 'techtree/CREATE_LINK'

const READ_TECHTREE_DATA_TRY = 'techtree/READ_TECHTREE_DATA_TRY'
const READ_TECHTREE_DATA_SUCCESS = 'techtree/READ_TECHTREE_DATA_SUCCESS'

// action 생성 함수
export const editTechtree = () => {
  return { type: EDIT_TECHTREE }
}
export const editDocument = () => {
  return { type: EDIT_DOCUMENT }
}
export const finishDocuEdit = (nodeID, nodeName, nodeBody) => {
  return { type: FINISH_DOCU_EDIT, nodeID, nodeName, nodeBody }
}
export const selectNode = (previousNodeList, nextNodeList, node) => {
  return { type: SELECT_NODE, previousNodeList, nextNodeList, node }
}
export const createNode = (nodeList) => {
  return { type: CREATE_NODE, nodeList: nodeList }
}
export const createLink = (linkList) => {
  return { type: CREATE_LINK, linkList: linkList }
}

// 원래는 thunk 이용해서 중간에 하나 더 있어야 하지만, 로컬 테스트용으로
export const readTechtree = (techtreeDummyData) => {
  return { type: READ_TECHTREE_DATA_SUCCESS, techtreeData: techtreeDummyData }
}

export default function techtree(state = initialState, action) {
  switch (action.type) {
    case CREATE_LINK:
      return {
        ...state,
        techtreeData: {
          ...state.techtreeData,
          linkList: action.linkList,
        },
        linkList: action.linkList,
      }
    case CREATE_NODE:
      return {
        ...state,
        techtreeData: {
          ...state.techtreeData,
          nodeList: action.nodeList,
        },
        nodeList: action.nodeList,
      }
    case EDIT_TECHTREE:
      return {
        ...state,
        isEditingTechtree: true,
      }
    case EDIT_DOCUMENT:
      return {
        ...state,
        isEditingDocument: true,
      }
    case FINISH_DOCU_EDIT:
      const changingIndex = state.nodeList.findIndex(
        (element) => action.nodeID === element.id
      )
      const changingNode = state.nodeList[changingIndex]
      const newNodeList = state.nodeList
      newNodeList[changingIndex] = {
        ...changingNode,
        id: action.nodeID,
        name: action.nodeName,
        body: action.nodeBody,
      }
      console.log('action.nodeName: ', action.nodeName)
      console.log('action.nodeBody: ', action.nodeBody)
      return {
        ...state,
        techtreeData: { ...state.techtreeData, nodeList: newNodeList },
        nodeList: newNodeList,
        isEditingDocument: false,
        isEditingTechtree: false,
      }
    case SELECT_NODE:
      console.log('이전 노드 리스트: ', action.previousNodeList)
      console.log('이후 노드 리스트: ', action.nextNodeList)
      return {
        ...state,
        selectedNode: action.node,
        previousNodeList: action.previousNodeList,
        nextNodeList: action.nextNodeList,
      }
    case READ_TECHTREE_DATA_SUCCESS:
      return {
        ...state,
        techtreeData: action.techtreeDummyData,
      }
    default:
      return { ...state }
  }
}
