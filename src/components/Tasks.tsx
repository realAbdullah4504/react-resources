import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface Task {
  id: string
  title: string
  completed: boolean
  created_at: string
}

interface Project {
  id: string
  name: string
  description: string
  created_at: string
}

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export const Tasks: React.FC = () => {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)
  
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data as Profile
    },
    enabled: !!user
  })

  // Fetch projects
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Project[]
    },
    enabled: !!user
  })

  // Fetch tasks
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', selectedProject],
    queryFn: async () => {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (selectedProject) {
        query = query.eq('project_id', selectedProject)
      }
      
      const { data, error } = await query
      if (error) throw error
      return data as Task[]
    },
    enabled: !!user
  })

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: { name: string; description: string; user_id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setNewProjectName('')
      setNewProjectDescription('')
      setShowNewProjectForm(false)
    }
  })

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: { title: string; project_id: string }) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setNewTaskTitle('')
    }
  })

  // Toggle task completion mutation
  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({ completed: !completed })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (newProjectName.trim()) {
      createProjectMutation.mutate({
        name: newProjectName,
        user_id: user!.id,
        description: newProjectDescription
      })
    }
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskTitle.trim() && selectedProject) {
      createTaskMutation.mutate({
        title: newTaskTitle,
        project_id: selectedProject
      })
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Profile Section */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '30px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            {profile?.full_name || user.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>Welcome back, {profile?.full_name || 'User'}!</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Tasks</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/team')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Team Management
          </button>
          <button
            onClick={() => navigate('/profile')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Profile
          </button>
          <button
            onClick={handleSignOut}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Projects Section */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2>Projects</h2>
          <button
            onClick={() => setShowNewProjectForm(!showNewProjectForm)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showNewProjectForm ? 'Cancel' : 'New Project'}
          </button>
        </div>

        {showNewProjectForm && (
          <form onSubmit={handleCreateProject} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  marginBottom: '10px'
                }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <textarea
                placeholder="Project description (optional)"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  minHeight: '60px'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={createProjectMutation.isPending}
              style={{
                padding: '8px 16px',
                backgroundColor: createProjectMutation.isPending ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: createProjectMutation.isPending ? 'not-allowed' : 'pointer'
              }}
            >
              {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
            </button>
          </form>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="project-select" style={{ display: 'block', marginBottom: '5px' }}>
            Select Project:
          </label>
          <select
            id="project-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          >
            <option value="">All Projects</option>
            {projects?.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Task Section */}
      {selectedProject && (
        <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h3>Add New Task</h3>
          <form onSubmit={handleCreateTask}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
                style={{ 
                  flex: 1, 
                  padding: '8px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="submit"
                disabled={createTaskMutation.isPending}
                style={{
                  padding: '8px 16px',
                  backgroundColor: createTaskMutation.isPending ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: createTaskMutation.isPending ? 'not-allowed' : 'pointer'
                }}
              >
                {createTaskMutation.isPending ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      <div>
        <h2>Tasks</h2>
        {tasksLoading ? (
          <p>Loading tasks...</p>
        ) : tasks && tasks.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map((task) => (
              <li
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  marginBottom: '8px',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskMutation.mutate({ id: task.id, completed: task.completed })}
                    disabled={toggleTaskMutation.isPending}
                    style={{ marginRight: '12px' }}
                  />
                  <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTaskMutation.mutate(task.id)}
                  disabled={deleteTaskMutation.isPending}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: deleteTaskMutation.isPending ? 'not-allowed' : 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks found. Select a project and add your first task!</p>
        )}
      </div>
    </div>
  )
}
