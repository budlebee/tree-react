import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MainWrapper from '../wrappers/MainWrapper'
import MarkdownEditor from '../components/MarkdownEditor'
import MarkdownRenderer from '../components/MarkdownRenderer'
import TechtreeMap from '../components/TechtreeMap'

import styled from 'styled-components'
import { techtreeDataList } from '../lib/dummyData'

// 테스팅을 위해 임의 할당
const techtreeDummyData = techtreeDataList[0]

export default function TechtreeDetailPage({ match }) {
  const dispatch = useDispatch()
  const { selectedNode } = useSelector((state) => {
    return { selectedNode: state.techtree.selectedNode }
  })
  const { techtreeID } = match.params
  const [techtreeData, setTechtreeData] = useState({})

  const [nodeList, setNodeList] = useState([])
  const [linkList, setLinkList] = useState([])
  const [previoustNodeList, setPreviousNodeList] = useState([])
  const [nextNodeList, setNextNodeList] = useState([])

  const [isEditingDocument, setIsEditingDocument] = useState(false)

  const [documentTitle, setDocumentTitle] = useState('')
  const [documentText, setDocumentText] = useState('')

  useEffect(() => {
    // 맨 첫 로딩때 서버에서 테크트리 데이터 가져오는 용도.
  }, [])

  useEffect(() => {
    setTechtreeData(techtreeDummyData)
    setNodeList(techtreeDummyData.nodeList)
    setLinkList(techtreeDummyData.linkList)
    setDocumentTitle(selectedNode.name)
    setDocumentText(selectedNode.body)
  }, [selectedNode])

  const onChangeDocumentTitle = useCallback(
    (e) => {
      e.preventDefault()
      setDocumentTitle(e.target.value)
    },
    [documentTitle]
  )

  const onFinishEdit = useCallback(() => {
    // 여기서 dispatch 로 리덕스에서 api 통신하자.
    // 서버에다가 수정사항을 보내고, 클라이언트 쪽 상태에 저장된
    // techtree 정보를 업데이트 하자.
    // 결국은 selectedNode 랑 그런걸 전부 리덕스 스테이트로 해야하네..
    setIsEditingDocument(false)
  }, [isEditingDocument])

  return (
    <MainWrapper>
      <DoubleSideLayout>
        <div>
          <TechtreeMap
            nodeList={nodeList}
            linkList={linkList}
            techtreeTitle={techtreeData.title}
            techtreeID={techtreeID}
            testingSetter={setNodeList}
          />
        </div>
        <div>
          {isEditingDocument ? (
            <>
              <input value={documentTitle} onChange={onChangeDocumentTitle} />
              <MarkdownEditor
                bindingText={documentText}
                bindingSetter={setDocumentText}
              />
            </>
          ) : (
            <>
              <div>{documentTitle}</div>
              <MarkdownRenderer text={documentText} />
            </>
          )}
          {isEditingDocument ? (
            <button onClick={onFinishEdit}>수정완료</button>
          ) : (
            <button
              onClick={() => {
                setIsEditingDocument(true)
              }}
            >
              문서 수정
            </button>
          )}
        </div>
      </DoubleSideLayout>
    </MainWrapper>
  )
}

const DoubleSideLayout = styled.div`
  display: grid;
  justify-items: center; // 가로축에서 중앙정렬

  grid-template-columns: 1fr 1fr;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`
