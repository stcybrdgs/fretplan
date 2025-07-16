import React from 'react'
import { Edit3, Trash2 } from 'lucide-react'
import { BaseContextMenu } from './BaseContextMenu'
import { MenuAction } from './menu-actions/MenuAction'

interface TodoContextMenuProps {
  isOpen: boolean
  position: { x: number; y: number }
  onRename: () => void
  onDelete: () => void
  onClose: () => void
  // Future props: onMove?, onTag?, etc.
}

export const TodoContextMenu: React.FC<TodoContextMenuProps> = ({
  isOpen,
  position,
  onRename,
  onDelete,
  onClose,
}) => {
  return (
    <BaseContextMenu isOpen={isOpen} position={position} onClose={onClose}>
      <div className='p-1'>
        <MenuAction
          icon={<Edit3 className='w-4 h-4' />}
          label='Rename'
          onClick={onRename}
        />

        <MenuAction
          icon={<Trash2 className='w-4 h-4' />}
          label='Delete'
          onClick={onDelete}
          variant='danger'
        />

        {/* Future actions can be easily added here:
        <MenuDivider />
        <MenuAction
          icon={<Move className='w-4 h-4' />}
          label='Move to...'
          onClick={onMove}
        />
        */}
      </div>
    </BaseContextMenu>
  )
}
