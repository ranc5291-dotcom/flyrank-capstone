import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import Card from './Card'
import usePrompts from '../hooks/usePrompts'
import useCollections from '../hooks/useCollections'
import NewCollectionModal from './NewCollectionModal'

export default function QuickActions() {
  const navigate = useNavigate()
  const { prompts, setPrompts } = usePrompts()
  const { addCollection } = useCollections()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showNewCollection, setShowNewCollection] = useState(false)

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result as string)
        if (Array.isArray(imported)) {
          const tagged = imported.map((p) => ({ ...p, imported: true }))
          setPrompts([...tagged, ...prompts])
        }
      } catch {
        // ignore invalid file
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleExport(format: 'json' | 'csv' | 'txt') {
    let content = ''
    let mime = 'application/json'
    let filename = 'prompts-export.json'

    if (format === 'json') {
      content = JSON.stringify(prompts, null, 2)
    } else if (format === 'csv') {
      const header = 'Title,Body,Tags,Model\n'
      const rows = prompts.map(
        (p) => `"${p.title.replace(/"/g, '""')}","${p.body.replace(/"/g, '""')}","${(p.tags ?? []).join('; ')}","${p.model ?? ''}"`
      )
      content = header + rows.join('\n')
      mime = 'text/csv'
      filename = 'prompts-export.csv'
    } else {
      content = prompts.map((p) => `${p.title}\n${'-'.repeat(p.title.length)}\n${p.body}\n`).join('\n\n')
      mime = 'text/plain'
      filename = 'prompts-export.txt'
    }

    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleExportPDF() {
    const doc = new jsPDF()
    let y = 15

    doc.setFontSize(16)
    doc.text('AI Prompt Studio — Prompts Export', 14, y)
    y += 10
    doc.setFontSize(10)

    prompts.forEach((p) => {
      if (y > 270) {
        doc.addPage()
        y = 15
      }
      doc.setFont('helvetica', 'bold')
      doc.text(p.title, 14, y)
      y += 6
      doc.setFont('helvetica', 'normal')
      const bodyLines = doc.splitTextToSize(p.body, 180)
      doc.text(bodyLines, 14, y)
      y += bodyLines.length * 5 + 4
      if (p.tags?.length) {
        doc.setFontSize(8)
        doc.text(`Tags: ${p.tags.join(', ')}`, 14, y)
        doc.setFontSize(10)
        y += 8
      }
    })

    doc.save('prompts-export.pdf')
  }

  function handleCreateCollection(name: string) {
    addCollection(name)
    setShowNewCollection(false)
    navigate('/collections')
  }

  return (
    <Card title="Quick Actions">
      <div className="flex flex-col gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => navigate('/add')}
          className="w-full text-left px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          + Add Prompt
        </button>
        <button
          onClick={handleImportClick}
          className="w-full text-left px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          Import JSON
        </button>

        <p className="text-xs text-gray-500 mt-1 mb-1">Export as</p>
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => handleExport('json')} className="px-2 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-xs">JSON</button>
          <button onClick={() => handleExport('csv')} className="px-2 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-xs">CSV</button>
          <button onClick={() => handleExport('txt')} className="px-2 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-xs">TXT</button>
          <button onClick={handleExportPDF} className="px-2 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-xs">PDF</button>
        </div>

        <button
          onClick={() => setShowNewCollection(true)}
          className="w-full text-left px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 mt-1"
        >
          New Collection
        </button>
      </div>

      <NewCollectionModal
        open={showNewCollection}
        onClose={() => setShowNewCollection(false)}
        onCreate={(name) => handleCreateCollection(name)}
      />
    </Card>
  )
}