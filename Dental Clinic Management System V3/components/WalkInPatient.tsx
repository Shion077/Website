import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { mockServices, mockUsers } from '../data/mockData';
import { UserPlus, CheckCircle, Clock } from 'lucide-react';

export const WalkInPatient: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    dentist: '',
    priority: 'normal' as 'urgent' | 'normal' | 'routine',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dentists = mockUsers.filter(u => u.role === 'dentist' || u.role === 'admin');
  const availableSlots = ['09:30', '10:30', '11:30', '14:30', '15:30', '16:30'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to add walk-in patient
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        service: '',
        dentist: '',
        priority: 'normal',
        notes: ''
      });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto border-green-200 bg-green-50">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-green-800">Walk-in Added!</h3>
            <p className="text-green-700">
              Patient has been added to the queue. They will be seen as soon as possible.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Walk-in Patient</h1>
          <p className="text-gray-600">Add patients who arrive without appointments</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Patient Information
                </CardTitle>
                <CardDescription>
                  Enter details for the walk-in patient
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="service">Required Service *</Label>
                      <Select value={formData.service} onValueChange={(value) => setFormData(prev => ({ ...prev, service: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service needed" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockServices.map((service) => (
                            <SelectItem key={service.id} value={service.name}>
                              {service.name} - ${service.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dentist">Assign to Dentist</Label>
                      <Select value={formData.dentist} onValueChange={(value) => setFormData(prev => ({ ...prev, dentist: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Next available" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="next-available">Next Available</SelectItem>
                          {dentists.map((dentist) => (
                            <SelectItem key={dentist.id} value={dentist.name}>
                              {dentist.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select value={formData.priority} onValueChange={(value: 'urgent' | 'normal' | 'routine') => setFormData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine - Can wait</SelectItem>
                        <SelectItem value="normal">Normal - Standard priority</SelectItem>
                        <SelectItem value="urgent">Urgent - Needs immediate attention</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special notes about the patient or their condition"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding Patient...' : 'Add to Queue'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>Available time slots</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {availableSlots.map((slot) => (
                    <div key={slot} className="flex justify-between items-center p-2 border rounded">
                      <span className="font-medium">{slot}</span>
                      <span className="text-sm text-green-600">Available</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-red-600">Urgent Priority:</p>
                  <p className="text-gray-600">Pain, swelling, trauma, bleeding</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-yellow-600">Normal Priority:</p>
                  <p className="text-gray-600">Regular treatments, check-ups</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-green-600">Routine Priority:</p>
                  <p className="text-gray-600">Cleanings, consultations</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};