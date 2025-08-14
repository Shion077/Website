import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { mockAppointments } from '../data/mockData';
import { Appointment } from '../types';
import { Calendar, Clock, User, Phone, Mail, Edit, Trash2 } from 'lucide-react';

export const AppointmentsList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const filteredAppointments = appointments.filter(app => 
    statusFilter === 'all' || app.status === statusFilter
  );

  const updateAppointmentStatus = (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId ? { ...app, status: newStatus } : app
      )
    );
  };

  const deleteAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.filter(app => app.id !== appointmentId));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'scheduled': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'no-show': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage patient appointments</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no-show">No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment List</CardTitle>
          <CardDescription>
            {filteredAppointments.length} appointment(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Dentist</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{appointment.patientName}</div>
                      <div className="text-sm text-gray-500">{appointment.patientEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell>{appointment.dentistName}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="w-3 h-3" />
                      <span>{appointment.date}</span>
                      <Clock className="w-3 h-3 ml-2" />
                      <span>{appointment.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={appointment.isAnonymous ? 'outline' : 'secondary'}>
                      {appointment.isAnonymous ? 'Anonymous' : 'Registered'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedAppointment(appointment)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Appointment Details</DialogTitle>
                            <DialogDescription>
                              View and update appointment information
                            </DialogDescription>
                          </DialogHeader>
                          {selectedAppointment && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Patient Name</Label>
                                  <p className="text-sm font-medium">{selectedAppointment.patientName}</p>
                                </div>
                                <div>
                                  <Label>Service</Label>
                                  <p className="text-sm font-medium">{selectedAppointment.service}</p>
                                </div>
                                <div>
                                  <Label>Date & Time</Label>
                                  <p className="text-sm font-medium">{selectedAppointment.date} at {selectedAppointment.time}</p>
                                </div>
                                <div>
                                  <Label>Dentist</Label>
                                  <p className="text-sm font-medium">{selectedAppointment.dentistName}</p>
                                </div>
                              </div>
                              <div>
                                <Label>Contact Information</Label>
                                <div className="text-sm space-y-1 mt-1">
                                  <div className="flex items-center space-x-2">
                                    <Mail className="w-3 h-3" />
                                    <span>{selectedAppointment.patientEmail}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Phone className="w-3 h-3" />
                                    <span>{selectedAppointment.patientPhone}</span>
                                  </div>
                                </div>
                              </div>
                              {selectedAppointment.notes && (
                                <div>
                                  <Label>Notes</Label>
                                  <p className="text-sm mt-1">{selectedAppointment.notes}</p>
                                </div>
                              )}
                              <div>
                                <Label>Update Status</Label>
                                <Select 
                                  value={selectedAppointment.status} 
                                  onValueChange={(value: Appointment['status']) => 
                                    updateAppointmentStatus(selectedAppointment.id, value)
                                  }
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                    <SelectItem value="no-show">No Show</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteAppointment(appointment.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};