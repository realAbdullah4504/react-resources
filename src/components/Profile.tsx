import React, { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface Profile {
  id: string
  full_name: string
  avatar_url: string | null
  created_at: string
}

export const Profile: React.FC = () => {
  const { user, signOut } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  // Fetch user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!user) return null
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) throw error
      return data as Profile
    },
    enabled: !!user
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    }
  })

  // Upload avatar function
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${user?.id}/${fileName}`

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // // Get the public URL
      // const { data: { publicUrl } } = supabase.storage
      //   .from('avatars')
      //   .getPublicUrl(filePath)

      // Update the profile with the new avatar URL
      // await updateProfileMutation.mutateAsync({ avatar_url: publicUrl })
      // setAvatarUrl(publicUrl)

    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Error uploading avatar. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // Delete avatar function
  const deleteAvatar = async () => {
    try {
      if (!profile?.avatar_url) return

      // Extract file path from URL
      const urlParts = profile.avatar_url.split('/')
      const fileName = urlParts.at(-1)
      const filePath = `${user?.id}/${fileName}`

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([filePath])

      if (deleteError) throw deleteError

      // Update profile to remove avatar URL
      await updateProfileMutation.mutateAsync({ avatar_url: null })
      setAvatarUrl(null)

    } catch (error) {
      console.error('Error deleting avatar:', error)
      alert('Error deleting avatar. Please try again.')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading profile...</div>
  }

  if (!user || !profile) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Profile not found</div>
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Profile</h1>
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

      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '8px',
        border: '1px solid #ddd',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Avatar Section */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            {profile.avatar_url || avatarUrl ? (
              <img
                src={avatarUrl || profile.avatar_url}
                alt="Avatar"
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #f0f0f0'
                }}
              />
            ) : (
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                border: '4px solid #e0e0e0',
                fontSize: '48px',
                color: '#999'
              }}>
                {profile.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={uploadAvatar}
              accept="image/*"
              style={{ display: 'none' }}
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                padding: '8px 16px',
                backgroundColor: uploading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: uploading ? 'not-allowed' : 'pointer'
              }}
            >
              {uploading ? 'Uploading...' : 'Upload Avatar'}
            </button>

            {(profile.avatar_url || avatarUrl) && (
              <button
                onClick={deleteAvatar}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Remove Avatar
              </button>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Profile Information</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Email:
            </label>
            <div style={{ padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              {user.email}
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Full Name:
            </label>
            <div style={{ padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              {profile.full_name}
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Role:
            </label>
            <div style={{ 
              padding: '8px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '4px',
              textTransform: 'capitalize'
            }}>
              {user.user_metadata?.role || 'member'}
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Member Since:
            </label>
            <div style={{ padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              {new Date(profile.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Quick Links</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.href = '/tasks'}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Tasks
            </button>
            <button
              onClick={() => window.location.href = '/team'}
              style={{
                padding: '8px 16px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Team Management
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
