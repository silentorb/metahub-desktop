import styled from 'styled-components'

export const TreeRow = styled.div`
  font-size: 14px;
  cursor: default;
  user-select: none;
  align-items: center;
  white-space: nowrap;
  position: relative;
  display: flex;

  &.isSelected .row-contents {
    background: cornflowerblue;
    color: white;
  }

  &.isSelectedStart .row-contents {
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }

  &.isSelectedEnd .row-contents {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  &.isOverFolder .row-contents {
    background: hsla(0 0% 0% / 0.05);
  }
`

export interface TreeRowContentsProps {
  isActive: boolean
}

export const TreeRowContents = styled.div<TreeRowContentsProps>`
  font-size: 13px;
  height: 100%;
  display: flex;
  align-items: center;
  margin: 0 12px;
  width: 100%;
  border: 2px solid transparent;
  border-radius: 4px;
  font-weight: ${props => props.isActive ? 'bold' : 'normal'};
`

export const TreeRowIcon = styled.i`
  margin-right: 6px;
  display: flex;
  align-items: center;
`

export const TreeRowButton = styled.button`
  border: none;
  background: none;
  display: flex;
  align-items: center;
  padding: 0;
  width: 14px;
`

export const TreeRowInput = styled.input`
  display: block;
  width: 100%;
  flex: 1;
  border: none;
  box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, 0.2);
  padding-left: 4px;
  margin: -4px 1px -4px -4px;
  height: 100%;
  outline: none;
`

export const TreeRowSpacer = styled.div`
  width: 14px;
`
