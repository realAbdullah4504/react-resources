import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface TeamMember {
  id: string
  user_id: string
  role: string
  joined_at: string
  profiles?: {
    full_name: string
  }
}

export const TeamManagement: React.FC = () => {
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('member')
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Check if current user is admin
  const isAdmin = user?.user_metadata?.role === 'admin'

  // Fetch team members (for demo, we'll assume a default team)
  const { data: teamMembers, isLoading: membersLoading } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          profiles!team_members_user_id_fkey(full_name)
        `)
        .order('joined_at', { ascending: false })
      console.log(data)
      if (error) throw error
      return data as TeamMember[]
    },
    enabled: !!user
  })

  // Add team member mutation
  const addTeamMemberMutation = useMutation({
    mutationFn: async (memberData: { name: string; role: string }) => {
      // First, find the user by email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('full_name', memberData.name)
        .single()
      
      if (profileError || !profile) {
        throw new Error('User with this name not found')
      }
      
      // Add team member
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          user_id: profile.id,
          role: memberData.role,
          invited_by: user?.id
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] })
      setNewMemberName('')
      setNewMemberRole('member')
      setShowAddMemberForm(false)
    }
  })

  // Update team member mutation
  const updateTeamMemberMutation = useMutation({
    mutationFn: async (memberData: { id: string; role: string }) => {
      const { data, error } = await supabase
        .from('team_members')
        .update({ role: memberData.role })
        .eq('id', memberData.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] })
      setEditingMember(null)
    }
  })

  // Delete team member mutation
  const deleteTeamMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] })
    }
  })

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMemberName.trim()) {
      addTeamMemberMutation.mutate({
        name: newMemberName,
        role: newMemberRole
      })
    }
  }

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member)
  }

  const handleUpdateMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingMember) {
      updateTeamMemberMutation.mutate({
        id: editingMember.id,
        role: editingMember.role
      })
    }
  }

  const handleDeleteMember = (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      deleteTeamMemberMutation.mutate(memberId)
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/tasks')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ← Back to Tasks
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
          </div>
          <h1 style={{ margin: 0 }}>Team Management</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ padding: '8px 12px', backgroundColor: '#e9ecef', borderRadius: '4px', fontSize: '14px' }}>
            Role: {user?.user_metadata?.role || 'member'}
          </span>
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

      {/* Add Member Section - Only for Admins */}
      {isAdmin && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2>Team Members</h2>
            <button
              onClick={() => setShowAddMemberForm(!showAddMemberForm)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {showAddMemberForm ? 'Cancel' : 'Add Member'}
            </button>
          </div>

          {showAddMemberForm && (
            <form onSubmit={handleAddMember} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <h3>Add New Team Member</h3>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Member name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
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
                <label htmlFor="role-select" style={{ display: 'block', marginBottom: '5px' }}>
                  Role:
                </label>
                <select
                  id="role-select"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={addTeamMemberMutation.isPending}
                style={{
                  padding: '8px 16px',
                  backgroundColor: (() => {
                    if (addTeamMemberMutation.isPending) return '#ccc'
                    return '#28a745'
                  })(),
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: addTeamMemberMutation.isPending ? 'not-allowed' : 'pointer'
                }}
              >
                {addTeamMemberMutation.isPending ? 'Adding...' : 'Add Member'}
              </button>
              {addTeamMemberMutation.error && (
                <p style={{ color: '#dc3545', marginTop: '10px', fontSize: '14px' }}>
                  {addTeamMemberMutation.error.message}
                </p>
              )}
            </form>
          )}
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            minWidth: '300px',
            maxWidth: '400px'
          }}>
            <h3 style={{ marginTop: 0 }}>Edit Team Member</h3>
            <form onSubmit={handleUpdateMember}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Member: {editingMember.profiles?.full_name || 'Unknown User'}
                </label>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="edit-role-select" style={{ display: 'block', marginBottom: '5px' }}>
                  Role:
                </label>
                <select
                  id="edit-role-select"
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({...editingMember, role: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateTeamMemberMutation.isPending}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: updateTeamMemberMutation.isPending ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: updateTeamMemberMutation.isPending ? 'not-allowed' : 'pointer'
                  }}
                >
                  {updateTeamMemberMutation.isPending ? 'Updating...' : 'Update'}
                </button>
              </div>
              {updateTeamMemberMutation.error && (
                <p style={{ color: '#dc3545', marginTop: '10px', fontSize: '14px' }}>
                  {updateTeamMemberMutation.error.message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Team Members List */}
      <div>
        {!isAdmin && <h2>Team Members</h2>}
        {membersLoading ? (
          <p>Loading team members...</p>
        ) : teamMembers && teamMembers.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {teamMembers.map((member) => (
              <li
                key={member.id}
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
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    {member.profiles?.full_name || 'Unknown User'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {(() => {
                    const getRoleColor = (role: string) => {
                      switch (role) {
                        case 'admin': return '#dc3545'
                        case 'owner': return '#ffc107'
                        default: return '#28a745'
                      }
                    }
                    return (
                      <span 
                        style={{ 
                          padding: '4px 8px', 
                          backgroundColor: getRoleColor(member.role),
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '12px',
                          textTransform: 'uppercase'
                        }}
                      >
                        {member.role}
                      </span>
                    )
                  })()}
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {new Date(member.joined_at).toLocaleDateString()}
                  </span>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => handleEditMember(member)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        disabled={deleteTeamMemberMutation.isPending}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: deleteTeamMemberMutation.isPending ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No team members found.</p>
        )}
      </div>

      {/* Non-admin message */}
      {!isAdmin && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '4px' 
        }}>
          <p style={{ margin: 0, color: '#856404' }}>
            Only admins can add new team members. Contact your team admin to add members.
          </p>
        </div>
      )}
    </div>
  )
}
