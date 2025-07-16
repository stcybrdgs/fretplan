import React from 'react'
import { Edit3, Trash2 } from 'lucide-react'
import { BaseContextMenu } from './BaseContextMenu'
import { ColorPickerSection } from './menu-actions/ColorPickerSection'
import { MenuAction } from './menu-actions/MenuAction'
import { MenuDivider } from './menu-actions/MenuDivider'

interface ItemContextMenuProps {
  isOpen: boolean
  position: { x: number; y: number }
  currentColor: string
  onColorSelect: (color: string) => void
  onRename: () => void
  onDelete: () => void
  onClose: () => void
}

export const ItemContextMenu: React.FC<ItemContextMenuProps> = ({
  isOpen,
  position,
  currentColor,
  onColorSelect,
  onRename,
  onDelete,
  onClose,
}) => {
  return (
    <BaseContextMenu isOpen={isOpen} position={position} onClose={onClose}>
      <ColorPickerSection
        currentColor={currentColor}
        onColorSelect={onColorSelect}
      />

      <MenuDivider />

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
      </div>
    </BaseContextMenu>
  )
}
