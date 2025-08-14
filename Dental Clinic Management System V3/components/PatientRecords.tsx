import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { mockPatientRecords, mockUsers, mockAppointments } from '../data/mockData';
import { PatientRecord } from '../types';
import { Search, Plus, FileText, Calendar, DollarSign } from 'lucide-react';

export const PatientRecords: React.FC = () => {
  const [records, setRecords] = useState<PatientRecord[]>(mockPatientRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    patientId: '',
    treatment: '',
    diagnosis: '',
    notes: '',
    cost: ''
  });

  const patients = mockUsers.filter(u => u.role === 'patient');
  const appointments = mockAppointments.filter(app => app.status === 'completed');

  const filteredRecords = records.filter(record => 
    record.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mockUsers.find(u => u.id === record.patientId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addRecord = () => {
    if (newRecord.patientId && newRecord.treatment && newRecord.diagnosis) {
      const patient = patients.find(p => p.id === newRecord.patientId);
      const appointment = appointments.find(a => a.patientId === newRecord.patientId);
      
      const record: PatientRecord = {
        id: Math.random().toString(36).substr(2, 9),
        patientId: newRecord.patientId,
        appointmentId: appointment?.id || '',
        date: new Date().toISOString().split('T')[0],
        treatment: newRecord.treatment,
        diagnosis: newRecord.diagnosis,
        notes: newRecord.notes,
        cost: parseFloat(newRecord.cost) || 0,
        dentistId: '2',
        dentistName: 'Dr. Michael Chen'
      };

      setRecords(prev => [record, ...prev]);
      setNewRecord({ patientId: '', treatment: '', diagnosis: '', notes: '', cost: '' });
      setIsAddingRecord(false);
    }
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.name || 'Unknown Patient';
  };

  const getPatientInfo = (patientId: string) => {
    return patients.find(p => p.id === patientId);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Patient Records</h1>
          <p className="text-gray-600">Manage patient medical history and treatment records</p>
        </div>
        <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Patient Record</DialogTitle>
              <DialogDescription>
                Create a new medical record for a patient
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="patient">Patient</Label>
                <Select value={newRecord.patientId} onValueChange={(value) => setNewRecord(prev => ({ ...prev, patientId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} - {patient.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="treatment">Treatment</Label>
                <Input
                  id="treatment"
                  placeholder="Enter treatment performed"
                  value={newRecord.treatment}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, treatment: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Textarea
                  id="diagnosis"
                  placeholder="Enter diagnosis details"
                  value={newRecord.diagnosis}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, diagnosis: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="cost">Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  placeholder="Enter treatment cost"
                  value={newRecord.cost}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, cost: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes"
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={addRecord} className="flex-1">Add Record</Button>
                <Button variant="outline" onClick={() => setIsAddingRecord(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>
                {filteredRecords.length} record(s) found
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search records or patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Treatment</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Dentist</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => {
                const patient = getPatientInfo(record.patientId);
                return (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{getPatientName(record.patientId)}</div>
                        {patient && (
                          <div className="text-sm text-gray-500">{patient.email}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        <span>{record.date}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{record.treatment}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{record.diagnosis}</div>
                    </TableCell>
                    <TableCell>{record.dentistName}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span>{record.cost.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <FileText className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Medical Record Details</DialogTitle>
                            <DialogDescription>
                              Patient: {getPatientName(record.patientId)} | Date: {record.date}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {patient && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Patient Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Name</Label>
                                      <p className="text-sm font-medium">{patient.name}</p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className="text-sm font-medium">{patient.email}</p>
                                    </div>
                                    <div>
                                      <Label>Phone</Label>
                                      <p className="text-sm font-medium">{patient.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <Label>Date of Birth</Label>
                                      <p className="text-sm font-medium">{patient.dateOfBirth || 'N/A'}</p>
                                    </div>
                                    {patient.address && (
                                      <div className="col-span-2">
                                        <Label>Address</Label>
                                        <p className="text-sm font-medium">{patient.address}</p>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                            
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Treatment Details</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <Label>Treatment</Label>
                                  <p className="text-sm font-medium mt-1">{record.treatment}</p>
                                </div>
                                <div>
                                  <Label>Diagnosis</Label>
                                  <p className="text-sm mt-1">{record.diagnosis}</p>
                                </div>
                                {record.notes && (
                                  <div>
                                    <Label>Notes</Label>
                                    <p className="text-sm mt-1">{record.notes}</p>
                                  </div>
                                )}
                                <div className="flex justify-between items-center pt-2 border-t">
                                  <div>
                                    <Label>Treating Dentist</Label>
                                    <p className="text-sm font-medium">{record.dentistName}</p>
                                  </div>
                                  <div className="text-right">
                                    <Label>Total Cost</Label>
                                    <p className="text-lg font-semibold text-green-600">
                                      ${record.cost.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};