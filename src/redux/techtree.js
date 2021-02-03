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
      name: 'html',
      x: 150,
      y: 150,
      radius: 15,
      body: '## 이것은 마크다운.\n실험용 첫번째 노드',
      tag: '프론트엔드',
      fillColor: '#91a7ff',
    },
    {
      id: 'bbdfasdfasdfasdfasdfasdf',
      name: 'css',
      x: 300,
      y: 200,
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
      endY: 200,
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

const FINISH_TECHTREE_EDIT = 'techtree/FINISH_TECHTREE_EDIT'
const FINISH_DOCU_EDIT = 'techtree/FINISH_DOCU_EDIT'

const SELECT_NODE = 'techtree/SELECT_NODE'

const CREATE_NODE = 'techtree/CREATE_NODE'
const DELETE_NODE = 'techtree/DELETE_NODE'
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
export const deleteNode = (nodeList, linkList, node) => {
  // 해당 노드와 연관된 링크를 linkList에서 훑어가며 다 지워버리고,
  // nodeList에서 해당되는 노드를 지워버린다.

  const deletionBinaryList = linkList.map((link) => {
    if (link.startNodeID === node.id) {
      return 0
    } else if (link.endNodeID === node.id) {
      return 0
    } else {
      return 1
    }
  })
  // 이러면 linkList 랑 원소의 갯수가 같은 0101010 배열이 나올것.
  const newLinkList = linkList.filter((link, index) => {
    return deletionBinaryList[index] === 1
  })

  const deleteNodeIndex = nodeList.findIndex((ele) => {
    return ele.id === node.id
  })

  const newNodeList = nodeList.filter((ele, index) => {
    return ele.id !== node.id
  })
  // .splice 는 원본배열을 조작하는것. 반환값은 원본배열에서 잘라낸것만 반환한다.
  //nodeList.splice(deleteNodeIndex, 1)

  return { type: DELETE_NODE, newNodeList, newLinkList }
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
    case DELETE_NODE:
      return {
        ...state,
        nodeList: action.newNodeList,
        linkList: action.newLinkList,
        techtreeData: {
          ...state.techtreeData,
          nodeList: action.newNodeList,
          linkList: action.newLinkList,
        },
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
      return {
        ...state,
        techtreeData: { ...state.techtreeData, nodeList: newNodeList },
        nodeList: newNodeList,
        isEditingDocument: false,
        isEditingTechtree: false,
      }
    case SELECT_NODE:
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
