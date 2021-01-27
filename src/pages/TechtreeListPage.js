import React from 'react'
import MainWrapper from '../wrappers/MainWrapper'
import TechtreeThumbnail from '../components/TechtreeThumbnail'
import styled from 'styled-components'
import { techtreeDataList } from '../lib/dummyData'
import techtree from '../redux/techtree'

export default function TechtreeListPage() {
  return (
    <MainWrapper>
      <GridContainer>
        {techtreeDataList.map((techtreeData) => {
          return (
            <TechtreeThumbnail
              nodeList={techtreeData.nodeList}
              linkList={techtreeData.linkList}
              techtreeTitle={techtreeData.title}
              techtreeID={techtreeData.id}
            />
          )
        })}
      </GridContainer>
    </MainWrapper>
  )
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: center; // 세로축에서 중앙정렬
  justify-items: center; // 가로축에서 중앙정렬
  width: 'auto';

  @media (max-width: 1440px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`
