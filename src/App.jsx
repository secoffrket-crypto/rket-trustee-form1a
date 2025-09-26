import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Upload, User, Phone, Mail, MapPin, Camera, CheckCircle, AlertCircle } from 'lucide-react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    initials: '',
    lastName: '',
    mobileNumber: '',
    alternateMobileNumber: '',
    emailAddress: '',
    officeAddress: '',
    residenceAddress: '',
    photograph: null
  })

  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [photographPreview, setPhotographPreview] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, photograph: 'Please upload a valid image file (JPG, PNG, GIF)' }))
        return
      }

      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, photograph: 'File size must be under 5MB' }))
        return
      }

      setFormData(prev => ({ ...prev, photograph: file }))
      setErrors(prev => ({ ...prev, photograph: '' }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => setPhotographPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required field validations
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters'
    } else if (!/^[a-zA-Z\s\-']+$/.test(formData.firstName)) {
      newErrors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes'
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required'
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.mobileNumber.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid mobile number'
    }

    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address'
    }

    // Optional field validations
    if (formData.initials && formData.initials.length > 5) {
      newErrors.initials = 'Initials must be 5 characters or less'
    }

    if (formData.alternateMobileNumber && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.alternateMobileNumber.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.alternateMobileNumber = 'Please enter a valid alternate mobile number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsSubmitted(true)
      // Here you would typically send the data to a server
      console.log('Form submitted:', formData)
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: '',
      initials: '',
      lastName: '',
      mobileNumber: '',
      alternateMobileNumber: '',
      emailAddress: '',
      officeAddress: '',
      residenceAddress: '',
      photograph: null
    })
    setErrors({})
    setIsSubmitted(false)
    setPhotographPreview(null)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                Your trustee information has been successfully submitted. We will update our records accordingly.
              </p>
              <Button onClick={resetForm} className="w-full">
                Submit Another Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">RKET Trustee Information Update</CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Please provide updated contact details for RKET records and website.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={errors.firstName ? 'border-red-500' : ''}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <div className="flex items-center gap-1 text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.firstName}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="initials" className="text-sm font-medium">Initials</Label>
                    <Input
                      id="initials"
                      type="text"
                      value={formData.initials}
                      onChange={(e) => handleInputChange('initials', e.target.value)}
                      className={errors.initials ? 'border-red-500' : ''}
                      placeholder="e.g., J.R."
                    />
                    {errors.initials && (
                      <div className="flex items-center gap-1 text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.initials}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <Separator />

              {/* Contact Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber" className="text-sm font-medium">
                      Mobile Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="mobileNumber"
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      className={errors.mobileNumber ? 'border-red-500' : ''}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.mobileNumber && (
                      <div className="flex items-center gap-1 text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.mobileNumber}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="alternateMobileNumber" className="text-sm font-medium">
                      Alternate Mobile Number
                    </Label>
                    <Input
                      id="alternateMobileNumber"
                      type="tel"
                      value={formData.alternateMobileNumber}
                      onChange={(e) => handleInputChange('alternateMobileNumber', e.target.value)}
                      className={errors.alternateMobileNumber ? 'border-red-500' : ''}
                      placeholder="+1 (555) 987-6543"
                    />
                    {errors.alternateMobileNumber && (
                      <div className="flex items-center gap-1 text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.alternateMobileNumber}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emailAddress" className="text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="emailAddress"
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                      className={`pl-10 ${errors.emailAddress ? 'border-red-500' : ''}`}
                      placeholder="trustee@example.com"
                    />
                  </div>
                  {errors.emailAddress && (
                    <div className="flex items-center gap-1 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.emailAddress}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Address Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Address Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="officeAddress" className="text-sm font-medium">Office Address</Label>
                    <Textarea
                      id="officeAddress"
                      value={formData.officeAddress}
                      onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                      rows={4}
                      placeholder="Street Address&#10;City, State ZIP Code&#10;Country"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="residenceAddress" className="text-sm font-medium">Residence Address</Label>
                    <Textarea
                      id="residenceAddress"
                      value={formData.residenceAddress}
                      onChange={(e) => handleInputChange('residenceAddress', e.target.value)}
                      rows={4}
                      placeholder="Street Address&#10;City, State ZIP Code&#10;Country"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Photograph Upload Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Camera className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Photograph Upload</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="photograph" className="text-sm font-medium">Upload Photograph</Label>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="photograph" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">JPG, PNG, GIF (MAX. 5MB)</p>
                        </div>
                        <input
                          id="photograph"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    {errors.photograph && (
                      <div className="flex items-center gap-1 text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.photograph}
                      </div>
                    )}
                    {photographPreview && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                        <img
                          src={photographPreview}
                          alt="Photograph preview"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
                  Submit Trustee Information
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
