import React from 'react'
import { Plus, MoreVertical } from 'lucide-react'
import { PracticeArea, ProjectArea, ViewType } from '@/types'
import ScrollableText from './ScrollableText'
import { getColorClass } from '@/utils/colorUtils'

interface SidebarProps {
  isSidebarOpen: boolean
  practiceAreas: PracticeArea[]
  projects: ProjectArea[]
  activePracticeAreaId: string | null
  activeProjectId: string | null
  activeView: ViewType
  selectedSidebarItemId: string | null
  editingAreaId: string | null
  editingName: string
  setEditingName: (name: string) => void
  onSetActivePracticeArea: (id: string) => void
  onSetActiveProject: (id: string) => void
  onSetActiveView: (view: ViewType) => void
  onAddPracticeArea: () => void
  onAddProject: () => void
  onOpenContextMenu: (
    e: React.MouseEvent,
    targetId: string,
    targetType: 'practice-area' | 'project',
    targetName: string,
    currentColor: string
  ) => void
  onFinishRename: (id: string, itemType: 'practice' | 'project') => void
  onCancelRename: () => void
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  practiceAreas,
  projects,
  activePracticeAreaId,
  activeProjectId,
  activeView,
  selectedSidebarItemId,
  editingAreaId,
  editingName,
  setEditingName,
  onSetActivePracticeArea,
  onSetActiveProject,
  onSetActiveView,
  onAddPracticeArea,
  onAddProject,
  onOpenContextMenu,
  onFinishRename,
  onCancelRename,
}) => {
  return (
    <aside
      className={`w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 transform transition-transform duration-300 ease-in-out z-40 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 flex flex-col`}
    >
      {/* Single scrollable container for all content */}
      <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent'>
        {/* Practice Areas Section */}
        <div className='p-4'>
          <div className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between'>
            <span>Practice Areas</span>
            <button
              onClick={onAddPracticeArea}
              className='p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
            >
              <Plus className='w-4 h-4' />
            </button>
          </div>

          {/* Practice Areas List */}
          <div className='space-y-2 mb-6'>
            {practiceAreas.map((area: PracticeArea) => (
              <div
                key={area.id}
                className={`flex items-center justify-between w-full transition-all duration-200 rounded-lg ${
                  selectedSidebarItemId === area.id
                    ? 'ring-1 ring-purple-500 dark:ring-purple-400 bg-purple-50 dark:bg-purple-900/30 shadow-sm'
                    : ''
                }`}
              >
                <div
                  onClick={() => onSetActivePracticeArea(area.id)}
                  className={`flex items-center space-x-3 flex-1 min-w-0 text-left p-2 rounded-lg cursor-pointer transition-colors ${
                    activePracticeAreaId === area.id
                      ? 'bg-purple-500/30 hover:bg-purple-500/30 text-gray-900 dark:text-white'
                      : selectedSidebarItemId === area.id
                      ? 'bg-transparent text-gray-900 dark:text-white'
                      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span
                    className={`w-2 h-2 ${getColorClass(
                      area.color
                    )} rounded-full flex-shrink-0`}
                  ></span>
                  {editingAreaId === area.id ? (
                    <input
                      type='text'
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => onFinishRename(area.id, 'practice')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onFinishRename(area.id, 'practice')
                        } else if (e.key === 'Escape') {
                          onCancelRename()
                        }
                      }}
                      className='flex-1 w-20 bg-transparent border-b border-purple-500 outline-none text-gray-900 dark:text-white'
                      autoFocus
                      onFocus={(e) => e.target.select()}
                    />
                  ) : (
                    <ScrollableText className='flex-1'>
                      <span>{area.name}</span>
                    </ScrollableText>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenContextMenu(
                        e,
                        area.id,
                        'practice-area',
                        area.name,
                        area.color
                      )
                    }}
                    className='group text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex-shrink-0'
                    title='More options'
                  >
                    <MoreVertical className='w-4 h-4 group-hover:scale-125 transition-all duration-300' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
          <div className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between'>
            <span>Projects</span>
            <button
              onClick={onAddProject}
              className='p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
            >
              <Plus className='w-4 h-4' />
            </button>
          </div>

          {/* Projects List */}
          <div className='space-y-2 mb-6'>
            {projects.map((project: ProjectArea) => (
              <div
                key={project.id}
                className={`flex items-center justify-between w-full transition-all duration-200 rounded-lg ${
                  selectedSidebarItemId === project.id
                    ? 'ring-1 ring-purple-500 dark:ring-purple-400 bg-purple-50 dark:bg-purple-900/30 shadow-sm'
                    : ''
                }`}
              >
                <div
                  onClick={() => onSetActiveProject(project.id)}
                  className={`flex items-center space-x-3 flex-1 min-w-0 text-left p-2 rounded-lg cursor-pointer transition-colors ${
                    activeProjectId === project.id
                      ? 'bg-purple-500/30 hover:bg-purple-500/30 text-gray-900 dark:text-white'
                      : selectedSidebarItemId === project.id
                      ? 'bg-transparent text-gray-900 dark:text-white'
                      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span
                    className={`w-2 h-2 ${getColorClass(
                      project.color
                    )} rounded-full flex-shrink-0`}
                  ></span>
                  {editingAreaId === project.id ? (
                    <input
                      type='text'
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => onFinishRename(project.id, 'project')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onFinishRename(project.id, 'project')
                        } else if (e.key === 'Escape') {
                          onCancelRename()
                        }
                      }}
                      className='flex-1 w-20 bg-transparent border-b border-purple-500 outline-none text-gray-900 dark:text-white'
                      autoFocus
                      onFocus={(e) => e.target.select()}
                    />
                  ) : (
                    <ScrollableText className='flex-1'>
                      <span>{project.name}</span>
                    </ScrollableText>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenContextMenu(
                        e,
                        project.id,
                        'project',
                        project.name,
                        project.color
                      )
                    }}
                    className='group text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
                    title='More options'
                  >
                    <MoreVertical className='w-4 h-4 group-hover:scale-125 transition-all duration-300' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analyze Section */}
        <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
          <div className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3'>
            Analyze
          </div>
          <button
            onClick={() => onSetActiveView('dashboard')}
            className={`flex items-center space-x-3 w-full text-left text-gray-900 dark:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              activeView === 'dashboard'
                ? 'bg-purple-500/20 hover:bg-purple-500/20 dark:bg-purple-500/30 dark:hover:bg-purple-500/30'
                : ''
            }`}
          >
            <span className='w-2 h-2 bg-purple-600 rounded-full'></span>
            <span>Dashboard</span>
          </button>
        </div>

        {/* Manage Section */}
        <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
          <div className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3'>
            Manage
          </div>
          <button
            onClick={() => onSetActiveView('tags')}
            className={`flex items-center space-x-3 w-full text-left text-gray-900 dark:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              activeView === 'tags'
                ? 'bg-purple-500/20 hover:bg-purple-500/20 dark:bg-purple-500/30 dark:hover:bg-purple-500/30'
                : ''
            }`}
          >
            <span className='w-2 h-2 bg-purple-600 rounded-full'></span>
            <span>Tags</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
