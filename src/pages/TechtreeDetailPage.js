import React from 'react'
import MainWrapper from '../wrappers/MainWrapper'

import styled from 'styled-components'

export default function TechtreeDetailPage() {
  return (
    <MainWrapper>
      <DoubleSideLayout>
        <div>테크트리 맵이 들어갈 공간</div>
        <div>노드에 바인딩된 문서가 들어갈 공간</div>
      </DoubleSideLayout>
    </MainWrapper>
  )
}

const DoubleSideLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`
