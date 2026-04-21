import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'

export default function Notes() {
  const { user, signOut } = useAuth()
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  // FETCH notes
  const fetchNotes = async () => {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
    setNotes(data || [])
  }

  useEffect(() => { fetchNotes() }, [])

  // INSERT note
  const addNote = async (e) => {
    e.preventDefault()
    await supabase.from('notes').insert({
      title,
      content,
      user_id: user.id
    })
    setTitle('')
    setContent('')
    fetchNotes()
  }

  // DELETE note
  const deleteNote = async (id) => {
    await supabase.from('notes').delete().eq('id', id)
    fetchNotes()
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>My Notes</h2>
        <button onClick={signOut}>Sign Out</button>
      </div>

      <form onSubmit={addNote}>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={3}
        />
        <button type="submit">Add Note</button>
      </form>

      <div>
        {notes.map(note => (
          <div key={note.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '12px' }}>
            <h4>{note.title}</h4>
            <p>{note.content}</p>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}