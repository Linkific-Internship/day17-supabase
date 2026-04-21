import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'

export default function FileStorage() {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [error, setError] = useState('')

  const uploadFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    setUploadedUrl('')

    const filePath = `${user.id}/${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file)

    if (error) {
      setError(error.message)
    } else {
      const { data } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath)
      setUploadedUrl(data.publicUrl)
    }

    setUploading(false)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px' }}>
      <h2>📁 File Storage</h2>

      <input
        type="file"
        onChange={uploadFile}
        disabled={uploading}
      />

      {uploading && <p>Uploading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {uploadedUrl && (
        <div>
          <p>✅ Uploaded!</p>
          <img src={uploadedUrl} alt="uploaded" style={{ maxWidth: '300px', marginTop: '10px' }} />
          <p><a href={uploadedUrl} target="_blank">View File</a></p>
        </div>
      )}
    </div>
  )
}