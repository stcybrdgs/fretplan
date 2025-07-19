import React, { useRef, useEffect, useState } from 'react'
import { Plus, MoreVertical, ChevronDown, ChevronUp } from 'lucide-react'
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
  const practiceScrollRef = useRef<HTMLDivElement>(null)
  const projectScrollRef = useRef<HTMLDivElement>(null)
  const [practiceScrollState, setPracticeScrollState] = useState({
    canScrollUp: false,
    canScrollDown: false,
  })
  const [projectScrollState, setProjectScrollState] = useState({
    canScrollUp: false,
    canScrollDown: false,
  })

  // Check scroll state for visual indicators
  const checkScrollState = (
    element: HTMLDivElement | null,
    setter: (state: { canScrollUp: boolean; canScrollDown: boolean }) => void
  ) => {
    if (!element) return

    const canScrollUp = element.scrollTop > 0
    const canScrollDown =
      element.scrollTop < element.scrollHeight - element.clientHeight

    setter({ canScrollUp, canScrollDown })
  }

  useEffect(() => {
    const practiceEl = practiceScrollRef.current
    const projectEl = projectScrollRef.current

    const handlePracticeScroll = () =>
      checkScrollState(practiceEl, setPracticeScrollState)
    const handleProjectScroll = () =>
      checkScrollState(projectEl, setProjectScrollState)

    // Initial check
    handlePracticeScroll()
    handleProjectScroll()

    // Add scroll listeners
    practiceEl?.addEventListener('scroll', handlePracticeScroll)
    projectEl?.addEventListener('scroll', handleProjectScroll)

    return () => {
      practiceEl?.removeEventListener('scroll', handlePracticeScroll)
      projectEl?.removeEventListener('scroll', handleProjectScroll)
    }
  }, [practiceAreas.length, projects.length])
  return (
    <aside
      className={`w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 transform transition-transform duration-300 ease-in-out z-40 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 flex flex-col`}
    >
      {/* Practice Areas Section */}
      <div className='flex flex-col p-4' style={{ height: '35%' }}>
        <div className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between flex-shrink-0'>
          <span>Practice Areas</span>
          <button
            onClick={onAddPracticeArea}
            className='p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
          >
            <Plus className='w-4 h-4' />
          </button>
        </div>

        {/* Scroll Up Indicator */}
        {practiceScrollState.canScrollUp && (
          <div className='flex justify-center py-1 bg-gradient-to-b from-white dark:from-gray-800 to-transparent'>
            <ChevronUp className='w-4 h-4 text-gray-400 animate-bounce' />
          </div>
        )}

        {/* Scrollable Practice Areas */}
        <div
          ref={practiceScrollRef}
          className='flex-1 overflow-y-auto space-y-2 min-h-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent px-1 py-2'
        >
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
                    className='flex-1 bg-transparent border-b border-purple-500 outline-none text-gray-900 dark:text-white'
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

        {/* Scroll Down Indicator */}
        {practiceScrollState.canScrollDown && (
          <div className='flex justify-center py-1 bg-gradient-to-t from-white dark:from-gray-800 to-transparent'>
            <ChevronDown className='w-4 h-4 text-gray-400 animate-bounce' />
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div
        className='flex flex-col p-4 border-t border-gray-200 dark:border-gray-700'
        style={{ height: '35%' }}
      >
        <div className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between flex-shrink-0'>
          <span>Projects</span>
          <button
            onClick={onAddProject}
            className='p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
          >
            <Plus className='w-4 h-4' />
          </button>
        </div>

        {/* Scroll Up Indicator */}
        {projectScrollState.canScrollUp && (
          <div className='flex justify-center py-1 bg-gradient-to-b from-white dark:from-gray-800 to-transparent'>
            <ChevronUp className='w-4 h-4 text-gray-400 animate-bounce' />
          </div>
        )}

        {/* Scrollable Projects */}
        <div
          ref={projectScrollRef}
          className='flex-1 overflow-y-auto space-y-2 min-h-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent px-1 py-2'
        >
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
                    className='flex-1 bg-transparent border-b border-purple-500 outline-none text-gray-900 dark:text-white'
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

        {/* Scroll Down Indicator */}
        {projectScrollState.canScrollDown && (
          <div className='flex justify-center py-1 bg-gradient-to-t from-white dark:from-gray-800 to-transparent'>
            <ChevronDown className='w-4 h-4 text-gray-400 animate-bounce' />
          </div>
        )}
      </div>

      {/* Fixed Bottom Sections - Always Accessible */}
      <div
        className='flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 space-y-4'
        style={{ height: '30%' }}
      >
        {/* Analyze Section */}
        <div>
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
        <div>
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

