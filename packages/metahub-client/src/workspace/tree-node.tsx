import classNames from 'classnames';
import React, { FocusEvent, KeyboardEvent } from 'react';
import { ChevronDown, ChevronRight, FileText, Folder } from 'react-feather';
import { NodeHandlers } from 'react-arborist';
import { NodeRendererProps } from 'react-arborist/dist/types'
import { NavigationProps, withNavigation } from '../navigation'
import { RecordInfo } from 'metahub-protocol'
import { TreeRow, TreeRowButton, TreeRowContents, TreeRowIcon, TreeRowInput, TreeRowSpacer } from './styles';

const size = 16
const color = '#999'

export type TreeNodeData = RecordInfo & { children: TreeNodeData[] }

function MaybeToggleButton({ toggle, isOpen, isFolder, isSelected }: any) {
  if (isFolder) {
    const Icon = isOpen ? ChevronDown : ChevronRight
    return (
      <TreeRowButton tabIndex={-1} onClick={toggle}>
        <Icon size={12} stroke={isSelected ? 'white' : color}/>
      </TreeRowButton>
    )
  } else {
    return <TreeRowSpacer/>
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
    )
  } else {
    return (
      <FileText
        className="file"
        stroke={isSelected ? 'white' : '#333'}
        strokeOpacity={isSelected ? '0.8' : '0.4'}
        fill="none"
        size={size}
      />
    )
  }
}

type Props = NodeRendererProps<TreeNodeData> & NavigationProps

export const TreeNode = withNavigation((props: Props) => {
    const {
      navigateTo,
      innerRef,
      data,
      styles,
      state,
      handlers,
      tree,
    } = props
    const folder = Array.isArray(data.children)
    const open = state.isOpen
    const name = data.title

    return (
      <TreeRow
        ref={innerRef}
        style={styles.row}
        className={classNames('row', state)}
        onClick={(e) => handlers.select(e, { selectOnClick: true })}
      >
        <TreeRowContents className="row-contents" style={styles.indent} onDoubleClick={() => {
          const { id, title } = data
          navigateTo({ id, title })
        }}>
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
    )
  }
)

type FormProps = { defaultValue: string } & NodeHandlers

function RenameForm({ defaultValue, submit, reset }: FormProps) {
  const inputProps = {
    defaultValue,
    autoFocus: true,
    onBlur: (e: FocusEvent<HTMLInputElement>) => {
      submit(e.currentTarget.value)
    },
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'Enter':
          submit(e.currentTarget.value)
          break
        case 'Escape':
          reset()
          break
      }
    },
  }

  return <TreeRowInput type="text" {...inputProps} />
}
