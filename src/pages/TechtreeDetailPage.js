import React, { useState } from 'react'
import MainWrapper from '../wrappers/MainWrapper'
import MarkdownEditor from '../components/MarkdownEditor'
import MarkdownRenderer from '../components/MarkdownRenderer'
import TechtreeMap from '../components/TechtreeMap'

import styled from 'styled-components'
import { techtreeDataList } from '../lib/dummyData'

export default function TechtreeDetailPage({ match }) {
  const { techtreeID } = match.params
  const [techtreeData, setTechtreeData] = useState(techtreeDataList[0])
  const [nodeList, setNodeList] = useState(techtreeDataList[0].nodeList)
  const [linkList, setLinkList] = useState(techtreeDataList[0].linkList)
  // useEffect 로 fetching 해서 서버에서 테크트리 데이터 받아옴.
  // 로컬 스테이트로 테크트리 데이터를 실시간 수정.
  // 받아온 테크트리 데이터를 하위컴포넌트 d3 에게 준다.
  // d3는 그걸 기반으로 이니셜 렌더링을 한다.
  // 그리고 d3에서 새로운 노드와 링크가 추가되면, 상위 컴포넌트로 넘긴다?
  // 셋터를 그렇게 넘겨서 호출해도 가능하나?

  const [isEditingDocument, setIsEditingDocument] = useState(false)
  const [documentTitle, setDocumentTitle] = useState('처음 초기값 Title')
  const [documentText, setDocumentText] = useState('처음 초기값 Text')

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
            <MarkdownEditor
              bindingText={documentText}
              bindingSetter={setDocumentText}
            />
          ) : (
            <MarkdownRenderer text={documentText} />
          )}
          <MarkdownRenderer text={documentText} />
          <button
            onClick={() => {
              setIsEditingDocument(!isEditingDocument)
            }}
          >
            {isEditingDocument ? '수정완료' : '내용수정'}
          </button>
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
