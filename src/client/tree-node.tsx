import classNames from 'classnames';
import React, { FocusEvent, KeyboardEvent } from 'react';
import { ChevronDown, ChevronRight, FileText, Folder } from 'react-feather';
import { NodeHandlers, NodeRendererProps } from 'react-arborist';
import styled from 'styled-components'

const size = 16;
const color = '#999';

const TreeRow = styled.div`
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

const TreeRowContents = styled.div`
  font-size: 13px;
  height: 100%;
  display: flex;
  align-items: center;
  margin: 0 12px;
  width: 100%;
  border: 2px solid transparent;
  border-radius: 4px;

`

const TreeRowIcon = styled.i`
  margin-right: 6px;
  display: flex;
  align-items: center;
`

const TreeRowButton = styled.button`
  border: none;
  background: none;
  display: flex;
  align-items: center;
  padding: 0;
  width: 14px;
`

const TreeRowInput = styled.input`
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

const TreeRowSpacer = styled.div`
  width: 14px;
`

function MaybeToggleButton({ toggle, isOpen, isFolder, isSelected }: any) {
  if (isFolder) {
    const Icon = isOpen ? ChevronDown : ChevronRight;
    return (
      <TreeRowButton tabIndex={-1} onClick={toggle}>
        <Icon size={12} stroke={isSelected ? 'white' : color}/>
      </TreeRowButton>
    );
  } else {
    return <TreeRowSpacer/>;
  }
}

function Icon({ isFolder, isSelected }: any) {
  if (isFolder) {
    return (
      <Folder
        className="folder"
        stroke={isSelected ? 'white' : 'cornflowerblue'}
        fillOpacity="0.5"
        fill={isSelected ? 'white' : 'cornflowerblue'}
        size={size}
      />
    );
  } else {
    return (
      <FileText
        className="file"
        stroke={isSelected ? 'white' : '#333'}
        strokeOpacity={isSelected ? '0.8' : '0.4'}
        fill="none"
        size={size}
      />
    );
  }
}

export const TreeNode = ({
                           innerRef,
                           data,
                           styles,
                           state,
                           handlers,
                           tree,
                         }: NodeRendererProps<any>) => {
  const folder = Array.isArray(data.children);
  const open = state.isOpen;
  const name = data.name;

  return (
    <TreeRow
      ref={innerRef}
      style={styles.row}
      className={classNames('row', state)}
      onClick={(e) => handlers.select(e)}
    >
      <TreeRowContents className="row-contents" style={styles.indent}>
        <MaybeToggleButton
          toggle={handlers.toggle}
          isOpen={open}
          isFolder={folder}
          isSelected={state.isSelected}
        />
        <TreeRowIcon>
          <Icon isFolder={folder} isSelected={state.isSelected}/>
        </TreeRowIcon>
        {state.isEditing ? (
          <RenameForm defaultValue={name} {...handlers} />
        ) : (
          <span>
            {name}{' '}
            {state.isSelected && (
              <TreeRowButton style={{ display: 'inline' }} onClick={handlers.edit}>
                ✍️
              </TreeRowButton>
            )}
          </span>
        )}
      </TreeRowContents>
    </TreeRow>
  );
};

type FormProps = { defaultValue: string } & NodeHandlers;

function RenameForm({ defaultValue, submit, reset }: FormProps) {
  const inputProps = {
    defaultValue,
    autoFocus: true,
    onBlur: (e: FocusEvent<HTMLInputElement>) => {
      submit(e.currentTarget.value);
    },
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'Enter':
          submit(e.currentTarget.value);
          break;
        case 'Escape':
          reset();
          break;
      }
    },
  };

  return <TreeRowInput type="text" {...inputProps} />;
}
