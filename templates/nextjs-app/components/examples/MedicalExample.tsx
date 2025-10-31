'use client';

import React, { useState } from 'react';
import { useEncrypt } from '@fhevm/sdk/react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { FhevmInstance } from '@fhevm/sdk';

interface MedicalExampleProps {
  fhevm: FhevmInstance | null;
}

interface HealthRecord {
  heartRate: string;
  bloodPressure: string;
  temperature: string;
  glucoseLevel: string;
}

/**
 * Medical Example Component
 * Demonstrates encrypted health data management
 */
export const MedicalExample: React.FC<MedicalExampleProps> = ({ fhevm }) => {
  const [healthData, setHealthData] = useState<HealthRecord>({
    heartRate: '',
    bloodPressure: '',
    temperature: '',
    glucoseLevel: '',
  });

  const [encryptedRecord, setEncryptedRecord] = useState<any>(null);

  const { encrypt, isEncrypting } = useEncrypt(fhevm);

  const handleInputChange = (field: keyof HealthRecord, value: string) => {
    setHealthData(prev => ({ ...prev, [field]: value }));
  };

  const encryptHealthRecord = async () => {
    if (!healthData.heartRate || !healthData.temperature) {
      alert('Please fill in at least heart rate and temperature');
      return;
    }

    try {
      const heartRate = parseInt(healthData.heartRate, 10);
      const temperature = parseFloat(healthData.temperature);
      const bloodPressure = parseInt(healthData.bloodPressure || '0', 10);
      const glucoseLevel = parseInt(healthData.glucoseLevel || '0', 10);

      if (isNaN(heartRate) || isNaN(temperature)) {
        alert('Please enter valid numeric values');
        return;
      }

      // Encrypt all health metrics
      const [encHeartRate, encTemp, encBP, encGlucose] = await Promise.all([
        encrypt(heartRate, 'euint8'),
        encrypt(Math.round(temperature * 10), 'euint16'), // Store as temp * 10
        encrypt(bloodPressure, 'euint8'),
        encrypt(glucoseLevel, 'euint8'),
      ]);

      const encrypted = {
        heartRate: Buffer.from(encHeartRate).toString('base64'),
        temperature: Buffer.from(encTemp).toString('base64'),
        bloodPressure: Buffer.from(encBP).toString('base64'),
        glucoseLevel: Buffer.from(encGlucose).toString('base64'),
        timestamp: new Date().toISOString(),
      };

      setEncryptedRecord(encrypted);
    } catch (err: any) {
      console.error('Health record encryption failed:', err);
      alert('Encryption failed: ' + err.message);
    }
  };

  const clearForm = () => {
    setHealthData({
      heartRate: '',
      bloodPressure: '',
      temperature: '',
      glucoseLevel: '',
    });
    setEncryptedRecord(null);
  };

  return (
    <Card
      title="🏥 Medical Records Example"
      subtitle="Confidential health data encryption"
      variant="gradient"
    >
      <div className="space-y-6">
        {/* Input Form */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Heart Rate (bpm)"
            type="number"
            value={healthData.heartRate}
            onChange={(e) => handleInputChange('heartRate', e.target.value)}
            placeholder="e.g., 72"
            disabled={!fhevm || isEncrypting}
            helperText="Normal: 60-100 bpm"
          />

          <Input
            label="Temperature (°C)"
            type="number"
            step="0.1"
            value={healthData.temperature}
            onChange={(e) => handleInputChange('temperature', e.target.value)}
            placeholder="e.g., 36.8"
            disabled={!fhevm || isEncrypting}
            helperText="Normal: 36.1-37.2°C"
          />

          <Input
            label="Blood Pressure (systolic)"
            type="number"
            value={healthData.bloodPressure}
            onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
            placeholder="e.g., 120"
            disabled={!fhevm || isEncrypting}
            helperText="Normal: 90-120 mmHg"
          />

          <Input
            label="Glucose Level (mg/dL)"
            type="number"
            value={healthData.glucoseLevel}
            onChange={(e) => handleInputChange('glucoseLevel', e.target.value)}
            placeholder="e.g., 95"
            disabled={!fhevm || isEncrypting}
            helperText="Normal: 70-100 mg/dL"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={encryptHealthRecord}
            disabled={!fhevm || !healthData.heartRate || !healthData.temperature || isEncrypting}
            variant="primary"
            className="flex-1"
          >
            {isEncrypting ? '🔐 Encrypting...' : '🔐 Encrypt Health Record'}
          </Button>

          <Button
            onClick={clearForm}
            disabled={isEncrypting}
            variant="secondary"
          >
            Clear
          </Button>
        </div>

        {/* Encrypted Result */}
        {encryptedRecord && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm font-semibold mb-3">
              ✓ Health Record Encrypted Successfully!
            </p>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-400">Timestamp:</span>
                <div className="bg-black/30 p-2 rounded font-mono text-gray-300 mt-1">
                  {encryptedRecord.timestamp}
                </div>
              </div>

              <div>
                <span className="text-gray-400">Encrypted Heart Rate:</span>
                <div className="bg-black/30 p-2 rounded font-mono text-gray-300 break-all mt-1">
                  {encryptedRecord.heartRate.substring(0, 60)}...
                </div>
              </div>

              <div>
                <span className="text-gray-400">Encrypted Temperature:</span>
                <div className="bg-black/30 p-2 rounded font-mono text-gray-300 break-all mt-1">
                  {encryptedRecord.temperature.substring(0, 60)}...
                </div>
              </div>

              {healthData.bloodPressure && (
                <div>
                  <span className="text-gray-400">Encrypted Blood Pressure:</span>
                  <div className="bg-black/30 p-2 rounded font-mono text-gray-300 break-all mt-1">
                    {encryptedRecord.bloodPressure.substring(0, 60)}...
                  </div>
                </div>
              )}

              {healthData.glucoseLevel && (
                <div>
                  <span className="text-gray-400">Encrypted Glucose Level:</span>
                  <div className="bg-black/30 p-2 rounded font-mono text-gray-300 break-all mt-1">
                    {encryptedRecord.glucoseLevel.substring(0, 60)}...
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-purple-300 text-sm">
            💡 In a real medical system, encrypted health records would be stored on-chain,
            allowing doctors to perform computations on encrypted data without seeing the actual values,
            ensuring patient privacy while enabling analysis.
          </p>
        </div>
      </div>
    </Card>
  );
};
