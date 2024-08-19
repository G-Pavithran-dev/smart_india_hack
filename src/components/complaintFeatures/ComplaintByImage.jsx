import React, { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleAIFileManager } from '@google/generative-ai/server'
import axios from 'axios'
import { CircularProgress } from '@mui/material'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY)
const fileManager = new GoogleAIFileManager(import.meta.env.VITE_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

const ComplaintByImage = () => {
  const [journeyType, setJourneyType] = useState('')
  const [pnrNo, setPnrNo] = useState('')
  const [utsNo, setUtsNo] = useState('')
  const [trainNo, setTrainNo] = useState('')
  const [description, setDescription] = useState('')
  const [uploadResponse, setUpload] = React.useState(null)
  const [file, setFile] = useState(null)
  const [fileview, setFileview] = useState(null)
  const [uploading, setUploading] = useState(false)


  const handleJourneyTypeChange = (event) => {
    setJourneyType(event.target.value)
    setPnrNo('')
    setUtsNo('')
    setTrainNo('')
  }

  async function getResponse(data) {
    const prompt =
      'Analyze the image and generate a complaint format for the Indian Railway Department, prioritizing the seriousness of the issue. Don\'t always set the priority to high, also use medium and low according to the problem.Include all the identified problem in only one response format as mentioned below like only one department, only one category, only one priority and only one complaint.And The departments available in Indian Railways are traction, engineering, traffic, rolling stock, signalling, materials, personnel, RPF, finance, health and safety and so more. Category might be a short description or one line description of the problem. Don\'t send any information like "please note" and "intro to the generating answer", Just give the department, category, priority and the complaint format, Highlight each heading. Also, don\'t include optional things like your_name, ticket number, etc... Keep the following as the format: **Department:** Railway Safety **Category:** Passenger Safety **Priority:** High **Complaint:** - Subject: - Description:'

    try {
      const uploadedFile = await fileManager.getFile(data.name)
      console.log('uploadedFile', uploadedFile)
      const result = await model.generateContent([
        {
          text: prompt,
        },
        {
          fileData: {
            mimeType: uploadedFile.mimeType,
            fileUri: uploadedFile.uri,
          },
        },
      ])
      console.log('result', result)
      const responseText = result.response.text()
      setDescription(responseText)
      const department = responseText.match(/\*\*Department:\*\* (.+)/)[1]
      const category = responseText.match(/\*\*Category:\*\* (.+)/)[1]
      const priority = responseText.match(/\*\*Priority:\*\* (.+)/)[1]
      const complaint = responseText.split('**Complaint:**')[1].trim()
      const id = Math.random();
      console.log(id)
      console.log(department) // Railway Safety
      console.log(category) // Passenger Safety
      console.log(priority) // High
      console.log(complaint) 
      console.log('Complaint from AI: ', responseText)
      const postComplaint = async (department, category, priority, description) => {
        try {
          const response = await axios.post('http://localhost:3001/complaints', {
            id,
            department,
            category,
            priority,
            description,
          })
          console.log('Complaint posted successfully:', response.data)
        } catch (error) {
          console.error('Error in posting complaint:', error)
        }
      }

      postComplaint(department, category, priority, complaint)
    } catch (error) {
      console.error('Error in generating content', error)
    }
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (
      selectedFile &&
      (selectedFile.type === 'image/png' || selectedFile.type === 'image/jpeg')
    ) {
      setFile(selectedFile)
      setFileview(URL.createObjectURL(selectedFile))
    } else {
      alert('Please upload a file in PNG or JPG format.')
      event.target.value = null
    }
  }

  async function handleFileUpload() {
    if (!file) {
      console.log(file)
      console.log('No file selected')
      return
    }
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)
    axios
      .post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        setUpload(res.data.data)
        getResponse(res.data.data)
        setUploading(false)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setUpload(null)
    setDescription('')
    handleFileUpload()
    setInput('')
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="font-bold text-4xl">Complaint by Image</h1>
      <h2 className="text-xl italic">Just upload the image</h2>
      <form
        className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg my-10 border border-red-600"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            htmlFor="fileUpload"
            className="block text-gray-700 font-bold mb-2 text-left"
          >
            Upload File:
          </label>
          <input
            type="file"
            id="fileUpload"
            accept=".png, .jpg, .jpeg"
            onChange={handleFileChange}
            required
            className="block w-full text-gray-700 p-2 border border-gray-300 rounded-md"
          />
        </div>

        {fileview && (
          <div className="mb-4">
            <img
              src={fileview}
              alt="File view"
              className="w-32 h-32 object-cover border border-gray-300 rounded-md"
            />
          </div>
        )}

        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="submit"
                className="bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-800 transition duration-300"
              >
                Submit
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                {uploading && description === '' && (
                  <>
                    <AlertDialogTitle>Uploading File</AlertDialogTitle>
                    <AlertDialogDescription className="flex items-center">
                      <CircularProgress />
                      The file is being uploaded to Artificial Intelligence to
                      generate complaint...
                    </AlertDialogDescription>
                  </>
                )}
                {description === '' && !uploading && (
                  <>
                    <AlertDialogTitle>Generating Complaint</AlertDialogTitle>
                    <AlertDialogDescription className="flex items-center">
                      <CircularProgress />
                      The complaint is being generated based on the image
                      uploaded...
                    </AlertDialogDescription>
                  </>
                )}
                {description !== '' && !uploading && (
                  <>
                    <AlertDialogTitle>File Uploaded</AlertDialogTitle>
                    <AlertDialogDescription>
                      The file has been uploaded successfully. The complaint has
                      been generated. And the generated complaint will be sent to your email.
                    </AlertDialogDescription>
                  </>
                )}
              </AlertDialogHeader>
              <AlertDialogFooter>
                {!(description === '') && (
                  <AlertDialogAction>Continue</AlertDialogAction>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </div>
  )
}

export default ComplaintByImage
